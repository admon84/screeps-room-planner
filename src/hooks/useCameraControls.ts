import { GameRenderer } from '@screeps/renderer';
import { useCallback, useEffect, useRef } from 'react';
import { ROOM_SIZE } from '@/utils/constants';
import { CELL_SIZE } from '@/utils/worldConfigs';
import { useGameAppStore } from '@/stores/useGameAppStore';
import { useGameObjectStore } from '@/stores/useGameObjectsStore';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { useSettings } from '@/stores/Settings';
import { useUiStore } from '@/stores/useUiStore';

const ZOOM_MIN = 0.1;
const ZOOM_MAX = 1.0;
const WHEEL_SENSITIVITY = 0.0015;
const PINCH_SENSITIVITY = 0.005;
const BUTTON_ZOOM_FACTOR = 1.5;
const ZOOM_EASE_TIME_CONSTANT_MS = 40;
const ZOOM_SETTLE_EPSILON = 0.0005;
const PAN_EASE_TIME_CONSTANT_MS = 55;
const PAN_SETTLE_EPSILON = 0.05;
const CLAMP_MARGIN_PX = 100;
const FIT_PADDING_PX = 48;
const KEY_PAN_STEP_PX = 80;

// Tiles are drawn centered on (x * CELL_SIZE, y * CELL_SIZE), so the room rect starts half a cell
// before the world origin.
const ROOM_WORLD_MIN = -CELL_SIZE / 2;
const ROOM_WORLD_SIZE = ROOM_SIZE * CELL_SIZE;

interface Props {
  gameApp: GameRenderer | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const useCameraControls = ({ gameApp, containerRef }: Props) => {
  const targetZoomRef = useRef(ZOOM_MIN);
  const anchorRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);
  const pendingPanRef = useRef({ x: 0, y: 0 });
  const panRafRef = useRef(0);
  const panLastFrameRef = useRef(0);

  const clampPosition = useCallback(() => {
    const container = containerRef.current;
    if (!gameApp || !container) return;
    const { position } = gameApp.app.stage;
    const zoom = gameApp.zoomLevel;
    const roomPx = ROOM_WORLD_SIZE * zoom;
    const originOffset = ROOM_WORLD_MIN * zoom;
    const clamp = (value: number, viewPx: number) =>
      Math.min(Math.max(value, CLAMP_MARGIN_PX - roomPx - originOffset), viewPx - CLAMP_MARGIN_PX - originOffset);
    position.x = clamp(position.x, container.clientWidth);
    position.y = clamp(position.y, container.clientHeight);
  }, [gameApp, containerRef]);

  const stopAnimation = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    cancelAnimationFrame(panRafRef.current);
    panRafRef.current = 0;
    pendingPanRef.current = { x: 0, y: 0 };
  }, []);

  const animate = useCallback(
    (now: number) => {
      if (!gameApp) return;
      const dt = now - lastFrameRef.current;
      lastFrameRef.current = now;
      const current = gameApp.zoomLevel;
      const target = targetZoomRef.current;
      const eased = current + (target - current) * (1 - Math.exp(-dt / ZOOM_EASE_TIME_CONSTANT_MS));
      const next = Math.abs(target - eased) < ZOOM_SETTLE_EPSILON ? target : eased;
      gameApp.zoomTo(next, anchorRef.current.x, anchorRef.current.y);
      clampPosition();
      rafRef.current = next === target ? 0 : requestAnimationFrame(animate);
    },
    [gameApp, clampPosition]
  );

  const zoomToward = useCallback(
    (level: number, anchor: { x: number; y: number }) => {
      targetZoomRef.current = Math.min(Math.max(level, ZOOM_MIN), ZOOM_MAX);
      anchorRef.current = anchor;
      if (!rafRef.current) {
        lastFrameRef.current = performance.now();
        rafRef.current = requestAnimationFrame(animate);
      }
    },
    [animate]
  );

  const zoomStep = useCallback(
    (factor: number) => {
      const container = containerRef.current;
      if (!container) return;
      zoomToward(targetZoomRef.current * factor, {
        x: container.clientWidth / 2,
        y: container.clientHeight / 2,
      });
    },
    [containerRef, zoomToward]
  );

  const zoomIn = useCallback(() => zoomStep(BUTTON_ZOOM_FACTOR), [zoomStep]);
  const zoomOut = useCallback(() => zoomStep(1 / BUTTON_ZOOM_FACTOR), [zoomStep]);

  const fitRoom = useCallback(() => {
    const container = containerRef.current;
    if (!gameApp || !container) return;
    stopAnimation();
    const width = container.clientWidth;
    const height = container.clientHeight;
    const fit = Math.min(
      (width - FIT_PADDING_PX * 2) / ROOM_WORLD_SIZE,
      (height - FIT_PADDING_PX * 2) / ROOM_WORLD_SIZE
    );
    const zoom = Math.min(Math.max(fit, ZOOM_MIN), ZOOM_MAX);
    gameApp.zoomLevel = zoom;
    targetZoomRef.current = zoom;
    const { position } = gameApp.app.stage;
    position.x = (width - ROOM_WORLD_SIZE * zoom) / 2 - ROOM_WORLD_MIN * zoom;
    position.y = (height - ROOM_WORLD_SIZE * zoom) / 2 - ROOM_WORLD_MIN * zoom;
  }, [gameApp, containerRef, stopAnimation]);

  const panBy = useCallback(
    (dx: number, dy: number) => {
      if (!gameApp) return;
      gameApp.pan(dx, dy);
      clampPosition();
    },
    [gameApp, clampPosition]
  );

  // Drag deltas accumulate into a pending offset that this loop drains with the same exponential
  // curve the zoom uses, so pan speed follows frame time rather than mouse event frequency.
  const animatePan = useCallback(
    (now: number) => {
      if (!gameApp) return;
      const dt = now - panLastFrameRef.current;
      panLastFrameRef.current = now;
      const pending = pendingPanRef.current;
      const ratio = 1 - Math.exp(-dt / PAN_EASE_TIME_CONSTANT_MS);
      const settling = Math.abs(pending.x) < PAN_SETTLE_EPSILON && Math.abs(pending.y) < PAN_SETTLE_EPSILON;
      const step = settling ? pending : { x: pending.x * ratio, y: pending.y * ratio };

      pendingPanRef.current = settling ? { x: 0, y: 0 } : { x: pending.x - step.x, y: pending.y - step.y };
      gameApp.pan(step.x, step.y);
      clampPosition();
      panRafRef.current = settling ? 0 : requestAnimationFrame(animatePan);
    },
    [gameApp, clampPosition]
  );

  const panSmoothBy = useCallback(
    (dx: number, dy: number) => {
      if (!gameApp) return;
      pendingPanRef.current = { x: pendingPanRef.current.x + dx, y: pendingPanRef.current.y + dy };
      if (!panRafRef.current) {
        panLastFrameRef.current = performance.now();
        panRafRef.current = requestAnimationFrame(animatePan);
      }
    },
    [gameApp, animatePan]
  );

  useEffect(() => {
    if (!gameApp) return;
    fitRoom();
    return stopAnimation;
  }, [gameApp, fitRoom, stopAnimation]);

  useEffect(() => {
    const container = containerRef.current;
    if (!gameApp || !container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const sensitivity = e.ctrlKey ? PINCH_SENSITIVITY : WHEEL_SENSITIVITY;
      const rect = container.getBoundingClientRect();
      zoomToward(targetZoomRef.current * Math.exp(-e.deltaY * sensitivity), {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    // React 17+ registers onWheel passively, which silently drops the preventDefault needed to
    // stop ctrl+wheel browser page-zoom -- so this listener must be native and non-passive.
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [gameApp, containerRef, zoomToward]);

  useEffect(() => {
    if (!gameApp) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;

      // MUI traps focus onto a plain focusable div, so an open dialog does not look like a text
      // field to the check above -- without this, arrows pan and Delete erases behind the dialog.
      // Escape never reaches here while one is open: MUI stops its propagation to close the dialog.
      // Closed-but-keepMounted modals (mobile drawer, action dialogs) stay in the DOM with the
      // `MuiModal-hidden` class, so only a visible modal root may swallow the key.
      if (document.querySelector('.MuiModal-root:not(.MuiModal-hidden)')) return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z': {
            const { undo, redo } = useHistoryStore.getState();
            if (e.shiftKey) redo();
            else undo();
            e.preventDefault();
            return;
          }
          case 'y':
            useHistoryStore.getState().redo();
            e.preventDefault();
            return;
        }
      }

      switch (e.key) {
        case '?':
          useUiStore.getState().setShortcutsOpen(true);
          break;
        case 'Escape':
          useSettings.getState().resetBrush();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
        case '_':
          zoomOut();
          break;
        case '0':
          fitRoom();
          break;
        case 'ArrowUp':
          panSmoothBy(0, KEY_PAN_STEP_PX);
          break;
        case 'ArrowDown':
          panSmoothBy(0, -KEY_PAN_STEP_PX);
          break;
        case 'ArrowLeft':
          panSmoothBy(KEY_PAN_STEP_PX, 0);
          break;
        case 'ArrowRight':
          panSmoothBy(-KEY_PAN_STEP_PX, 0);
          break;
        case 'Delete':
        case 'Backspace': {
          const hovered = useGameAppStore.getState().hoverRoomPos;
          if (!hovered) return;
          const { objects, removeStructuresAt } = useGameObjectStore.getState();
          // Committing before a tile that holds nothing would push an undo entry that restores an
          // identical state, so the next Ctrl+Z would appear to do nothing.
          if (!objects.some((o) => o.x === hovered.x && o.y === hovered.y)) return;
          useHistoryStore.getState().commit();
          removeStructuresAt(hovered.x, hovered.y);
          break;
        }
        default:
          return;
      }
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameApp, zoomIn, zoomOut, fitRoom, panSmoothBy]);

  useEffect(() => {
    const container = containerRef.current;
    if (!gameApp || !container) return;
    const observer = new ResizeObserver(() => clampPosition());
    observer.observe(container);
    return () => observer.disconnect();
  }, [gameApp, containerRef, clampPosition]);

  return { zoomIn, zoomOut, fitRoom, panBy, panSmoothBy };
};
