# Canvas Pan/Zoom Redesign

Date: 2026-08-01
Status: Approved

## Problem

Zooming today is awkward and half-broken:

- `GameRenderer.zoomTo(value, x, y)` expects its anchor in canvas-local pixels (it compares
  `x`/`y` against `stage.position`), but `Canvas.tsx` passes viewport coordinates
  (`e.clientX`/`e.clientY`, and `left + width / 2` for the slider path). The anchor is therefore
  offset by the 300px drawer and 48px AppBar, so zoom drifts toward a wrong, seemingly random
  tile.
- Wheel zoom only fires with Shift held and reads `deltaX` (a shift+wheel remapping quirk that is
  inconsistent across browsers and trackpads). Plain scrolling does nothing.
- The only visible zoom control is a slider in the left sidebar, far from the canvas it affects,
  and hidden on mobile (`xs: 'none'`) -- touch users have no zoom control at all.
- Zoom state round-trips through the Settings store, forcing equality-check hacks in `Canvas.tsx`
  to break feedback loops between the wheel handler, the store, and the slider.

## Goals

- Plain mouse wheel zooms toward the cursor; trackpad pinch works.
- Drag panning stays as-is (middle-drag or shift+left-drag); left paint and right erase are
  untouched.
- On-canvas overlay buttons: zoom in, zoom out, fit room. No slider anywhere.
- The room can never be panned or zoomed fully off-screen.
- Zoom eases smoothly instead of snapping.
- Keyboard shortcuts for zoom, pan, and fit.

Out of scope: right-drag panning (conflicts with right-click erase), touch pinch on the canvas
(overlay buttons cover mobile), zoom momentum/inertia.

## Interaction Model

- **Wheel**: plain wheel zooms toward the cursor, no modifier. Zoom is multiplicative
  (`target *= exp(-deltaY * k)`) so one wheel notch feels the same at every level. Range stays
  0.1-1.0. Trackpad pinch arrives as ctrl+wheel and zooms with higher sensitivity;
  `preventDefault()` stops the browser page-zoom.
- **Pan**: unchanged -- middle-drag or shift+left-drag, routed through the clamp.
- **Overlay**: a compact vertical cluster of MUI icon buttons in the canvas's top-right corner
  (top-right is free; the debug panel owns bottom-left, the hover chip top-center). Styling
  matches the debug panel's translucent look. Buttons: zoom in, zoom out, fit room.
- **Fit room**: computes the zoom that fits the 50x50 room (5000 world units, `50 * CELL_SIZE`)
  in the container with padding, clamped to 0.1-1.0, and centers it. Used by the fit button, the
  `0` key, and the initial view, replacing the hardcoded `zoomLevel = 0.2`.
- **Keyboard**: `+`/`=`/`-` zoom anchored at canvas center, arrow keys pan by a fixed step, `0`
  fits. Listeners ignore events when focus is in an input, textarea, or contentEditable element.
- **Clamp**: after every pan, zoom, and resize, `stage.position` is clamped so the room rect
  keeps at least ~100px visible on each axis.
- **Smooth zoom**: a requestAnimationFrame loop eases the live zoom level toward the target with
  an exponential ease (~120ms), anchored at the last cursor point (canvas center for
  buttons/keys). New input retargets the running animation; teardown cancels it.

## Architecture

The renderer's `zoomLevel` becomes the single source of truth for zoom. `zoom` leaves the
Settings store entirely, which deletes the store-feedback-loop workarounds in `Canvas.tsx`.

| File | Change |
| --- | --- |
| `src/hooks/useCameraControls.ts` | New. Owns wheel handling, zoom animation, clamping, keyboard shortcuts, and exposes `{ zoomIn, zoomOut, fitRoom }` plus a clamped pan helper. |
| `src/components/canvas/CanvasControls.tsx` | New. Overlay button cluster; calls the hook's API. |
| `src/components/canvas/Canvas.tsx` | Remove the zoom-sync effect, `handleWheel`, and zoom store wiring; consume the hook; route drag-pan through the clamped pan helper; render `CanvasControls`. |
| `src/stores/Settings.tsx` | Remove `zoom` and `setZoom`. |
| `src/components/left-drawer/LeftDrawer.tsx` | Remove the Map Zoom slider block and its store wiring. |
| `src/hooks/useGameRenderer.ts` | Remove `created.zoomLevel = 0.2`; the initial fit comes from the camera hook once the renderer is ready. |

Implementation constraints:

- The wheel listener must be a native `addEventListener('wheel', handler, { passive: false })` on
  the container, not React's `onWheel` -- React 17+ registers wheel listeners passively, so
  `preventDefault()` for ctrl+wheel silently fails through the synthetic event.
- All `zoomTo` anchors convert to canvas-local coordinates:
  `(clientX - rect.left, clientY - rect.top)` from the container's bounding rect.
- The renderer init/teardown path is otherwise untouched. The hook's effect depends on `gameApp`,
  and its cleanup removes listeners and cancels the rAF loop, keeping StrictMode double-invoke
  safe.

## Rejected Alternatives

- **Patch in place**: fix coordinates and add buttons inside `Canvas.tsx`, keep `zoom` in the
  store. Keeps the sync hack and grows an already busy component.
- **pixi-viewport**: mature pinch/momentum, but it wants to own the PIXI stage that
  `@screeps/renderer` (a prebuilt bundle) already owns. Integration risk plus a new dependency.

## Verification

No test suite. Gates: `npm run lint`, `npm run build`, and `npm run preview` (renderer touched).
Manual pass: wheel-zoom at cursor over several distinct tiles, trackpad pinch, drag-pan to every
edge (clamp holds), overlay buttons, keyboard shortcuts, window resize, and the mobile drawer
open/close.
