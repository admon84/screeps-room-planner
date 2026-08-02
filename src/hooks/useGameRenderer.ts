import { GameRenderer } from '@screeps/renderer';
import { useEffect, useRef, useState } from 'react';
import { resourceMap, rescaleResources } from '@/utils/resourceMap';
import { worldConfigs } from '@/utils/worldConfigs';
import {
  clearTerrainSprites,
  convertGlobalToRoomPosition,
  convertRoomToWorldPosition,
  createHighlight,
  isPanGesture,
} from '@/utils/canvas';
import { useGameObjectStore } from '@/stores/useGameObjectsStore';
import { useGameAppStore } from '@/stores/useGameAppStore';
import { createGameState } from '@/utils/gameState';
import { Point } from '@/types';

const TICK_DURATION = 1;
const TICK_INTERVAL_MS = 1000 * TICK_DURATION;

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

  // Held in a ref so a new callback identity re-points the renderer's hooks instead of tearing down
  // and rebuilding the WebGL context.
  const callbacksRef = useRef({ onGameLoop, onMetricsUpdate });
  useEffect(() => {
    callbacksRef.current = { onGameLoop, onMetricsUpdate };
  }, [onGameLoop, onMetricsUpdate]);

  // Create, initialize and tear down the renderer. Under React 19 StrictMode this effect is invoked
  // twice on mount, so every path out of here has to leave no renderer behind.
  useEffect(() => {
    const container = gameCanvasRef.current;
    if (!container) return;

    let renderer: GameRenderer | null = null;
    let metricsTimer: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;
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
        stage.addChild(highlight);
        // PIXI 7 name for what used to be `interactive = true`; the old property is a deprecation
        // shim that logs a warning on every assignment.
        stage.eventMode = 'static';

        stage
          // Modifier and button state are read straight off the federated event. In PIXI 7
          // `event.data` is a deprecated self-reference and `event.data.originalEvent` is the root
          // federated event rather than the native DOM event, so the old path only worked by
          // accident and can be null.
          .on('mousemove', (event: any) => {
            if (isPanGesture(event)) {
              highlight.visible = false;
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
            }
          })
          // Hidden rather than clear()ed -- clear() drops the geometry, so the highlight would never
          // come back after the first mouse-out.
          .on('mouseout', () => {
            highlight.visible = false;
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

  // The renderer interpolates between ticks, so it needs a steady heartbeat as well as an immediate
  // apply whenever the object list changes.
  useEffect(() => {
    if (!gameApp || !isGameAppInitialized) return;

    const applyLatestState = () => {
      gameApp.applyState(createGameState(useGameObjectStore.getState().objects) as any, TICK_DURATION);
    };

    applyLatestState();
    const stateTimer = setInterval(applyLatestState, TICK_INTERVAL_MS);

    return () => clearInterval(stateTimer);
  }, [gameApp, isGameAppInitialized, objects]);

  return { gameApp, hoverPos };
};
