# Canvas Pan/Zoom Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the broken sidebar-slider zoom with maps-style wheel zoom at the cursor, on-canvas overlay controls (zoom in / zoom out / fit room), pan clamping, smooth zoom animation, and keyboard shortcuts.

**Architecture:** A new `useCameraControls` hook owns all camera behavior (native wheel listener, rAF zoom easing, position clamping, keyboard shortcuts) and exposes `{ zoomIn, zoomOut, fitRoom, panBy }`. A new `CanvasControls` component renders the overlay buttons. The renderer's `zoomLevel` becomes the single source of truth: `zoom` is removed from the Settings store and the sidebar slider is deleted.

**Tech Stack:** React 19, TypeScript 5.9 strict, MUI 9 (namespaced imports), Zustand 5, `@screeps/renderer` (prebuilt PIXI 7 bundle).

**Spec:** `docs/superpowers/specs/2026-08-01-canvas-pan-zoom-design.md`

**Testing note:** This repo has no test suite (per `AGENTS.md`), so TDD does not apply. The gates for every task are `npm run lint` and `npm run build` (`tsc -b` is the type gate), plus `npm run preview` with the dist greps and a manual browser pass at the end because this touches the renderer path.

**Background you need:**

- `GameRenderer.zoomTo(value, x, y)` anchors zoom at `(x, y)` in **canvas-local pixels** (it
  compares against `stage.position`). The current code wrongly passes viewport coordinates --
  that is the bug being fixed. Every anchor must be `clientX - rect.left`, `clientY - rect.top`.
- The world draws tile `(x, y)` centered on `(x * CELL_SIZE, y * CELL_SIZE)` (see
  `src/utils/canvas.ts`), so the room rect spans world coordinates `[-CELL_SIZE / 2,
  ROOM_SIZE * CELL_SIZE - CELL_SIZE / 2]` = `[-50, 4950]`, width 5000.
- Screen position of a world point: `screen = stage.position + world * zoomLevel` (stage scale is
  the zoom).
- React 17+ registers `onWheel` as a passive listener, so `preventDefault()` in a React handler
  cannot block ctrl+wheel browser page-zoom. The wheel listener must be a native
  `addEventListener('wheel', handler, { passive: false })`.
- `useGameRenderer` recreates `gameApp` under StrictMode double-invoke; every effect in the new
  hook keys on `gameApp` and must clean up listeners, observers, and rAF on teardown.

---

### Task 1: Create the `useCameraControls` hook

**Files:**
- Create: `src/hooks/useCameraControls.ts`

- [ ] **Step 1: Write the hook**

Create `src/hooks/useCameraControls.ts` with exactly this content:

```ts
import { GameRenderer } from '@screeps/renderer';
import { useCallback, useEffect, useRef } from 'react';
import { ROOM_SIZE } from '@/utils/constants';
import { CELL_SIZE } from '@/utils/worldConfigs';

const ZOOM_MIN = 0.1;
const ZOOM_MAX = 1.0;
const WHEEL_SENSITIVITY = 0.0015;
const PINCH_SENSITIVITY = 0.005;
const BUTTON_ZOOM_FACTOR = 1.5;
const ZOOM_EASE_TIME_CONSTANT_MS = 40;
const ZOOM_SETTLE_EPSILON = 0.0005;
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
    const fit = Math.min((width - FIT_PADDING_PX * 2) / ROOM_WORLD_SIZE, (height - FIT_PADDING_PX * 2) / ROOM_WORLD_SIZE);
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

      switch (e.key) {
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
          panBy(0, KEY_PAN_STEP_PX);
          break;
        case 'ArrowDown':
          panBy(0, -KEY_PAN_STEP_PX);
          break;
        case 'ArrowLeft':
          panBy(KEY_PAN_STEP_PX, 0);
          break;
        case 'ArrowRight':
          panBy(-KEY_PAN_STEP_PX, 0);
          break;
        default:
          return;
      }
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameApp, zoomIn, zoomOut, fitRoom, panBy]);

  useEffect(() => {
    const container = containerRef.current;
    if (!gameApp || !container) return;
    const observer = new ResizeObserver(() => clampPosition());
    observer.observe(container);
    return () => observer.disconnect();
  }, [gameApp, containerRef, clampPosition]);

  return { zoomIn, zoomOut, fitRoom, panBy };
};
```

Notes on non-obvious choices (do not re-derive these):

- Zoom is multiplicative (`* Math.exp(-deltaY * k)`) so one wheel notch feels identical at every
  level; negative deltaY (scroll up) zooms in.
- `fitRoom` is intentionally instant (it retargets both zoom and position); only wheel/button
  zoom animates. Animating fit would need a parallel position tween -- YAGNI.
- The easing is frame-rate independent: `1 - exp(-dt / tau)` converges the same regardless of
  display refresh rate.
- Arrow-key pan direction: pressing ArrowRight moves the viewport right, which moves the stage
  content left, hence `panBy(-step, 0)`.

- [ ] **Step 2: Verify lint and types**

Run: `npm run lint && npm run build`
Expected: both pass. The hook is not yet imported anywhere; that is fine (it is exported, not dead-flagged).

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useCameraControls.ts
git commit -m "Add camera controls hook for canvas pan/zoom

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Create the `CanvasControls` overlay component

**Files:**
- Create: `src/components/canvas/CanvasControls.tsx`

- [ ] **Step 1: Write the component**

Create `src/components/canvas/CanvasControls.tsx` with exactly this content. Styling matches
`CanvasDebugPanel`'s translucent black look; `zIndex: 1` matches the debug panel so the overlay
sits above the canvas. It is absolutely positioned against the `position: relative` Box wrapping
`CanvasWrapper` in `RoomPlanner.tsx`.

```tsx
import * as Mui from '@mui/material';
import * as Icons from '@mui/icons-material';

const buttonSx = {
  background: 'rgba(0,0,0,0.3)',
  color: 'white',
  ':hover': { background: 'rgba(0,0,0,0.5)' },
};

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitRoom: () => void;
}

export default function CanvasControls({ onZoomIn, onZoomOut, onFitRoom }: Props) {
  return (
    <Mui.Stack spacing={0.5} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
      <Mui.Tooltip title='Zoom in' placement='left'>
        <Mui.IconButton size='small' onClick={onZoomIn} sx={buttonSx}>
          <Icons.Add fontSize='small' />
        </Mui.IconButton>
      </Mui.Tooltip>
      <Mui.Tooltip title='Zoom out' placement='left'>
        <Mui.IconButton size='small' onClick={onZoomOut} sx={buttonSx}>
          <Icons.Remove fontSize='small' />
        </Mui.IconButton>
      </Mui.Tooltip>
      <Mui.Tooltip title='Fit room' placement='left'>
        <Mui.IconButton size='small' onClick={onFitRoom} sx={buttonSx}>
          <Icons.FitScreen fontSize='small' />
        </Mui.IconButton>
      </Mui.Tooltip>
    </Mui.Stack>
  );
}
```

- [ ] **Step 2: Verify lint and types**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/canvas/CanvasControls.tsx
git commit -m "Add canvas overlay zoom controls component

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Wire the hook and overlay into the canvas; delete the broken zoom paths

**Files:**
- Modify: `src/components/canvas/Canvas.tsx`
- Modify: `src/hooks/useGameRenderer.ts:68`

- [ ] **Step 1: Rewire `Canvas.tsx`**

Apply all of the following edits to `src/components/canvas/Canvas.tsx` (line numbers refer to the
current file):

1. Replace the import block at lines 1-9 (drop `WheelEvent`, add the two new imports):

```tsx
import React, { useEffect, useRef, useState } from 'react';
import * as Constants from '@/utils/constants';
import * as Helpers from '@/utils/helpers';
import { useGameRenderer } from '@/hooks/useGameRenderer';
import { useCameraControls } from '@/hooks/useCameraControls';
import { Point } from '@/types';
import { countPlacedByType, useGameObjectStore } from '@/stores/useGameObjectsStore';
import { useTerrainStore } from '@/stores/useTerrainStore';
import { createObjectFromType } from '@/utils/gameObjects';
import { useSettings } from '@/stores/Settings';
import CanvasControls from './CanvasControls';
```

2. Delete the constants at lines 11-13 (`ZOOM_MIN`, `ZOOM_MAX`, `ZOOM_STEP`) -- they now live in
   the hook.

3. Delete the two zoom store selectors at lines 34-35:

```tsx
  const zoom = useSettings((state) => state.settings.zoom);
  const setZoom = useSettings((state) => state.setZoom);
```

4. Below the `useGameRenderer` call, add the camera hook:

```tsx
  const { zoomIn, zoomOut, fitRoom, panBy } = useCameraControls({ gameApp, containerRef: gameCanvasRef });
```

5. Delete the zoom-sync effect at lines 54-62 (the one commented "Applies the zoom slider to the
   renderer") entirely. The renderer's `zoomLevel` is now the single source of truth, so there is
   no store round-trip to break.

6. In `handleMouseMove`, replace the direct pan call:

```tsx
      gameApp?.pan(e.movementX, e.movementY);
```

with the clamped helper:

```tsx
      panBy(e.movementX, e.movementY);
```

7. Delete the whole `handleWheel` function (lines 165-175) and the `onWheel={handleWheel}` prop
   from the JSX. The hook's native non-passive listener replaces it.

8. Replace the return statement so the overlay renders alongside the canvas div (both position
   against the `position: relative` Box in `RoomPlanner.tsx`):

```tsx
  return (
    <>
      <div
        className='screeps-renderer'
        ref={gameCanvasRef}
        style={{ width: 'calc(100vw - 300px)', height: 'calc(100vh - 48px)' }}
        onContextMenu={(e) => e.preventDefault()}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <CanvasControls onZoomIn={zoomIn} onZoomOut={zoomOut} onFitRoom={fitRoom} />
    </>
  );
```

- [ ] **Step 2: Remove the hardcoded initial zoom**

In `src/hooks/useGameRenderer.ts`, delete line 68:

```ts
      created.zoomLevel = 0.2;
```

The camera hook's init effect calls `fitRoom()` as soon as `gameApp` is set, which now owns the
initial view.

- [ ] **Step 3: Verify lint and types**

Run: `npm run lint && npm run build`
Expected: both pass. In particular there must be no unused-variable errors left from the removed
zoom wiring (`WheelEvent` import and `setZoom` are the ones to watch).

- [ ] **Step 4: Smoke-test in dev**

Run: `npm run dev`, open the app, and check:
- Room appears centered and fitted on load (not tiny in a corner at 20%).
- Plain wheel zooms toward the tile under the cursor -- test near all four room corners.
- Trackpad pinch zooms (no browser page-zoom).
- Middle-drag and shift+left-drag still pan; the room cannot be pushed fully off-screen.
- Overlay buttons zoom smoothly around the canvas center; fit recenters.
- `+`/`-`/`0`/arrows work; typing in the Import Room text field does not trigger them.
- Left-click paint and right-click erase still work, including drag-painting.

- [ ] **Step 5: Commit**

```bash
git add src/components/canvas/Canvas.tsx src/hooks/useGameRenderer.ts
git commit -m "Wire camera controls into canvas, fix zoom anchor bug

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Remove the sidebar slider and the zoom setting

**Files:**
- Modify: `src/components/left-drawer/LeftDrawer.tsx:71,78,103,127-165`
- Modify: `src/stores/Settings.tsx`

- [ ] **Step 1: Remove the slider from `LeftDrawer.tsx`**

Apply these edits (line numbers refer to the current file):

1. Delete the `zoom` selector (line 71) and `setZoom` (line 78):

```tsx
  const zoom = useSettings((state) => state.settings.zoom);
  const setZoom = useSettings((state) => state.setZoom);
```

2. Delete the `updateZoom` handler (line 103):

```tsx
  const updateZoom = (_: any, value: number | number[]) => setZoom(Array.isArray(value) ? value[0] : value);
```

3. Inside the Settings accordion, delete the entire "Map Zoom" stack -- the
   `<Mui.Stack direction='column' spacing={1} sx={{ display: { xs: 'none', md: 'block' } }}>`
   element spanning lines 128-165 (the Box with the "Map Zoom" label and percentage, and the
   Paper-wrapped `<Mui.Slider>`). Keep its sibling, the "Room Controller Level" stack, and keep
   the outer `<Mui.Stack direction='column' spacing={{ xs: 0, md: 2 }} sx={{ m: 2 }}>` wrapper.

- [ ] **Step 2: Remove `zoom` from the Settings store**

In `src/stores/Settings.tsx`:

1. Delete `zoom: number;` from the `settings` interface and `setZoom: (zoom: number) => void;`
   from `State`.
2. Delete `zoom: 0.2,` from `initialSettings`.
3. Delete the `setZoom` implementation line:

```tsx
  setZoom: (zoom) => set((state) => ({ settings: { ...state.settings, zoom } })),
```

- [ ] **Step 3: Verify no zoom-store references remain**

Run: `grep -rn "setZoom\|settings.zoom" src`
Expected: no matches.

- [ ] **Step 4: Verify lint and types**

Run: `npm run lint && npm run build`
Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/left-drawer/LeftDrawer.tsx src/stores/Settings.tsx
git commit -m "Remove sidebar zoom slider and zoom setting

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Production build verification

The renderer path changed, and per `AGENTS.md` tree-shaking regressions only reproduce under a
production build.

- [ ] **Step 1: Build and check side-effect survival**

```bash
npm run build
grep -l "RENDERER_METADATA" dist/bundle/*.js
grep -l "window.PIXI" dist/bundle/*.js
```

Expected: `npm run build` passes; each grep prints at least one file. If either grep is empty, the
`@screeps/*` side-effect imports were tree-shaken and the change must not ship -- see the Gotchas
section of `AGENTS.md`.

- [ ] **Step 2: Manual pass against the production build**

Run: `npm run preview`, open the served URL, and repeat the Task 3 Step 4 checklist. Additionally:
- Resize the window: the canvas resizes and the room stays clamped into view.
- Open the mobile drawer (narrow viewport): overlay buttons remain reachable and usable -- this is
  the first zoom control mobile users have ever had.

- [ ] **Step 3: Report results**

No commit here unless fixes were needed. Report the checklist outcomes (pass/fail per item)
honestly in the final summary.
