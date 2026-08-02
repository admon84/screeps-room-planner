import { GameRenderer } from '@screeps/renderer';
import { useEffect, useRef, useState } from 'react';
import type { Texture } from 'pixi.js';
import { resourceMap, rescaleResources } from '@/utils/resourceMap';
import { CELL_SIZE, worldConfigs } from '@/utils/worldConfigs';
import {
  clearTerrainSprites,
  convertGlobalToRoomPosition,
  convertRoomToWorldPosition,
  createGhostSprite,
  createHighlight,
  isPanGesture,
  parseCssColor,
} from '@/utils/canvas';
import { Brush, brushCanBePlacedAt, getBrushProps } from '@/utils/brushPreview';
import { useGameObjectStore } from '@/stores/useGameObjectsStore';
import { useGameAppStore } from '@/stores/useGameAppStore';
import { useTerrainStore } from '@/stores/useTerrainStore';
import { useSettings } from '@/stores/Settings';
import { createGameState } from '@/utils/gameState';
import { Point } from '@/types';

const TICK_DURATION = 1;
const TICK_INTERVAL_MS = 1000 * TICK_DURATION;

const HIGHLIGHT_TINT_VALID = 0xffffff;
const HIGHLIGHT_TINT_INVALID = 0xff5555;

// `release()` calls `Assets.reset()` and `destroyTextureCache()`, which tear down PIXI's *global*
// texture registry rather than anything instance-scoped. If two renderers ever overlap -- as
// StrictMode's double-invoke makes them -- the dying one destroys textures the live one already
// resolved. Serializing construction keeps that from happening; World.init() re-adds and reloads
// every asset, so the incoming renderer repopulates the cache it inherits.
let rendererHandoff: Promise<void> = Promise.resolve();

interface Props {
  gameCanvasRef: React.RefObject<HTMLDivElement | null>;
  terrain: any;
  onGameLoop?: () => void;
  onMetricsUpdate?: (metrics: any) => void;
}

export const useGameRenderer = ({ gameCanvasRef, terrain, onGameLoop, onMetricsUpdate }: Props) => {
  const [gameApp, setGameApp] = useState<GameRenderer | null>(null);
  const [hoverPos, setHoverPos] = useState<Point | null>(null);
  const [isGameAppInitialized, setGameAppInitialized] = useState(false);
  const objects = useGameObjectStore((state) => state.objects);
  const playerName = useSettings((state) => state.settings.playerName);

  // Held in a ref so a new callback identity re-points the renderer's hooks instead of tearing down
  // and rebuilding the WebGL context.
  const callbacksRef = useRef({ onGameLoop, onMetricsUpdate });
  useEffect(() => {
    callbacksRef.current = { onGameLoop, onMetricsUpdate };
  }, [onGameLoop, onMetricsUpdate]);

  // Same reason as callbacksRef: the ghost preview needs the live brush inside the stage's mousemove
  // handler, and listing the brush in the init effect's deps would rebuild the WebGL context on every
  // brush change.
  const brushRef = useRef<Brush | null>(null);
  const brushKey = useSettings((state) => state.settings.brush);
  const brushType = useSettings((state) => state.settings.brushType);
  useEffect(() => {
    brushRef.current = brushKey ? { key: brushKey, type: brushType } : null;
  }, [brushKey, brushType]);

  // Create, initialize and tear down the renderer. Under React 19 StrictMode this effect is invoked
  // twice on mount, so every path out of here has to leave no renderer behind.
  useEffect(() => {
    const container = gameCanvasRef.current;
    if (!container) return;

    let renderer: GameRenderer | null = null;
    let metricsTimer: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;
    const ghostTextures = new Map<string, Texture>();
    let releaseDone: () => void;
    const released = new Promise<void>((resolve) => {
      releaseDone = resolve;
    });

    const createGameApp = async () => {
      // Wait for any previous renderer to finish releasing before touching the shared asset cache.
      await rendererHandoff;
      if (cancelled) return;

      await GameRenderer.compileMetadata(worldConfigs.metadata);
      if (cancelled) return;

      // The renderer builds its PIXI Application without passing `resolution`, so the device pixel
      // ratio only reaches it through the global default, which is read in the constructor.
      PIXI.settings.RESOLUTION = window.devicePixelRatio;

      const created = new GameRenderer({
        size: { width: container.clientWidth, height: container.clientHeight },
        resourceMap,
        worldConfigs,
        onGameLoop: () => callbacksRef.current.onGameLoop?.(),
        rescaleResources,
        countMetrics: true,
        backgroundColor: 0x050505,
      });
      renderer = created;

      await created.init(container);

      // init() yields, so the effect may have been cleaned up while it was in flight.
      if (cancelled) {
        created.release();
        renderer = null;
        return;
      }

      // The renderer builds its Application without `autoDensity`, so on a retina display the canvas
      // element would keep its backing-buffer size as its CSS size and overflow the container. PIXI 7
      // exposes autoDensity as a read-only getter over the view system, so the flag has to be set on
      // `_view` itself; resize() then writes the corrected CSS size back onto the element.
      (created.app.renderer as unknown as { _view: { autoDensity: boolean } })._view.autoDensity = true;
      created.app.renderer.resize(container.clientWidth, container.clientHeight);

      metricsTimer = setInterval(() => callbacksRef.current.onMetricsUpdate?.(created.metrics), TICK_INTERVAL_MS);

      const stage = created.app.stage;
      if (stage) {
        const highlight = createHighlight();
        const ghost = createGhostSprite();
        stage.addChild(highlight, ghost);
        // PIXI 7 name for what used to be `interactive = true`; the old property is a deprecation
        // shim that logs a warning on every assignment.
        stage.eventMode = 'static';

        // Textures are keyed by brush icon URL rather than rebuilt per mousemove: `Texture.from()`
        // starts a fresh image load on a cache miss, which would restart on every pointer move.
        const applyGhostTexture = (url: string) => {
          let texture = ghostTextures.get(url);
          if (!texture) {
            texture = PIXI.Texture.from(url);
            ghostTextures.set(url, texture);
          }
          ghost.texture = texture;
          // Re-applied after every swap, not just at construction: Sprite stores width/height as a
          // scale factor over the current frame, and brush icons ship at assorted pixel sizes.
          ghost.width = CELL_SIZE;
          ghost.height = CELL_SIZE;
          ghost.visible = true;
        };

        const updatePreview = (roomPos: Point) => {
          const brush = brushRef.current;
          if (!brush) {
            ghost.visible = false;
            highlight.tint = HIGHLIGHT_TINT_VALID;
            return;
          }

          const { image, swatch } = getBrushProps(brush);
          if (swatch) {
            ghost.visible = false;
            highlight.tint = parseCssColor(swatch);
            return;
          }

          if (image) applyGhostTexture(image);
          const canPlace = brushCanBePlacedAt(brush, roomPos, {
            // Read live: a drag paints many tiles between renders, so values captured at render time
            // would show the preview as valid past the RCL cap.
            objects: useGameObjectStore.getState().objects,
            terrain: useTerrainStore.getState().terrain,
            rcl: useSettings.getState().settings.rcl,
          });
          highlight.tint = canPlace ? HIGHLIGHT_TINT_VALID : HIGHLIGHT_TINT_INVALID;
        };

        stage
          // Modifier and button state are read straight off the federated event. In PIXI 7
          // `event.data` is a deprecated self-reference and `event.data.originalEvent` is the root
          // federated event rather than the native DOM event, so the old path only worked by
          // accident and can be null.
          .on('mousemove', (event: any) => {
            if (isPanGesture(event)) {
              highlight.visible = false;
              ghost.visible = false;
              return;
            }

            highlight.visible = true;

            const roomPos = convertGlobalToRoomPosition(event.global, stage);
            setHoverPos(roomPos);
            useGameAppStore.getState().setHoverRoomPos(roomPos);

            if (highlight.worldVisible) {
              const worldPos = convertRoomToWorldPosition(roomPos);
              highlight.x = worldPos.x;
              highlight.y = worldPos.y;
              ghost.x = worldPos.x;
              ghost.y = worldPos.y;
            }

            updatePreview(roomPos);
          })
          // Hidden rather than clear()ed -- clear() drops the geometry, so the highlight would never
          // come back after the first mouse-out. The ghost follows the same rule: destroying it would
          // leave nothing to re-show.
          .on('mouseout', () => {
            highlight.visible = false;
            ghost.visible = false;
            setHoverPos(null);
            useGameAppStore.getState().setHoverRoomPos(null);
          });
      }

      setGameApp(created);
      setGameAppInitialized(true);
    };

    const started = createGameApp();
    // The next renderer waits on this build finishing *and* this teardown running, so the two never
    // race over the global texture cache.
    rendererHandoff = started.then(() => released);

    return () => {
      cancelled = true;
      clearInterval(metricsTimer);
      // release() is internally guarded and a no-op before init(), so this is safe on every path.
      renderer?.release();
      renderer = null;
      // `Texture.from()` registers under the shared TextureCache, which release() above already
      // destroyed -- destroying again would throw on the freed base texture. Dropping the map is
      // enough to leave nothing of this renderer's behind.
      ghostTextures.clear();
      setGameApp(null);
      setGameAppInitialized(false);
      setHoverPos(null);
      useGameAppStore.getState().setHoverRoomPos(null);
      releaseDone();
    };
  }, [gameCanvasRef]);

  // Terrain gets its own effect: folding it into the init effect would re-run init() -- and rebuild
  // the WebGL context -- on every terrain change.
  useEffect(() => {
    if (!gameApp || !isGameAppInitialized) return;
    gameApp.setTerrain(terrain);
    // An empty set leaves the previous walls and swamps drawn -- the processor has no "clear" path
    // for them -- so they have to be hidden here.
    if (!terrain.length) clearTerrainSprites(gameApp.app.stage);
  }, [gameApp, isGameAppInitialized, terrain]);

  // The renderer's userBadge processor resolves the owner's badge only when a sprite is built or the
  // object's `user` prop changes (metadata props: ["user", "level"]) -- a player rename changes
  // neither, so sprites already on stage would keep the old badge. Tracked in a ref so the effect
  // below can clear the scene once per rename, forcing every sprite to rebuild against the new badge.
  const lastPlayerNameRef = useRef(playerName);

  // The renderer interpolates between ticks, so it needs a steady heartbeat as well as an immediate
  // apply whenever the object list changes.
  useEffect(() => {
    if (!gameApp || !isGameAppInitialized) return;

    if (lastPlayerNameRef.current !== playerName) {
      lastPlayerNameRef.current = playerName;
      gameApp.applyState(createGameState([], playerName) as any, 0);
    }

    const applyLatestState = () => {
      gameApp.applyState(createGameState(useGameObjectStore.getState().objects, playerName) as any, TICK_DURATION);
    };

    applyLatestState();
    const stateTimer = setInterval(applyLatestState, TICK_INTERVAL_MS);

    return () => clearInterval(stateTimer);
  }, [gameApp, isGameAppInitialized, objects, playerName]);

  return { gameApp, hoverPos };
};
