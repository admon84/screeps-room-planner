# AGENTS.md

Guidance for AI coding agents working in this repo. Human-facing setup docs live in `README.md`.

## Project Overview

Screeps Room Planner: a Vite + React web app for planning and visualizing room layouts for the game
Screeps. Users paint structures, resource objects, and terrain onto a 50x50 room grid, import real
room terrain from the Screeps MMO API, and export the layout as JSON for use in their game script.

## Commands

| Task           | Command                |
| -------------- | ---------------------- |
| Dev            | `npm run dev`          |
| Build          | `npm run build`        |
| Preview (prod) | `npm run preview`      |
| Lint           | `npm run lint`         |
| Format         | `npm run format`       |
| Format check   | `npm run format:check` |

There is no test suite. Verify changes with `npm run lint` and `npm run build`, plus a manual pass in
the browser for anything touching the canvas. `npm run build` is `tsc -b && vite build` -- `vite build`
does not type-check on its own, so the `tsc -b` half is the type gate and must not be dropped.

Lint is a separate gate: `eslint .` driven by `eslint.config.mjs` (flat config). Nothing in the build
runs ESLint.

## Tech Stack

Vite 8 (rolldown) - React 19 - TypeScript 5.9 (strict) - MUI 9 (Emotion) - Zustand 5 -
PixiJS v7 via `@screeps/renderer` - Prettier + ESLint 9 (flat config).

The output is a fully static SPA with no server-side code; it deploys to Vercel via `vercel.json`,
which pins the Vite preset rather than relying on framework auto-detection.

TypeScript is pinned to 5.9.3 and ESLint to 9.x. Both pins were originally forced by Next and can now
be lifted -- do it as its own change, not folded into unrelated work.

## Architecture

```
index.html       SPA shell; title/description/viewport live here, not in a metadata export
src/main.tsx     Entry point: createRoot, StrictMode, ThemeProvider, font + global CSS imports
src/components/  UI. canvas/ = the WebGL renderer and its overlays, left-drawer/ = brushes
src/hooks/       useGameRenderer - owns the GameRenderer lifecycle and PIXI stage wiring
src/stores/      Zustand stores, one per concern; no single global store
src/utils/       Pure helpers, game constants, and generated data
src/types/       Shared types + declarations.d.ts (hand-written types for untyped @screeps packages)
```

**There is one rendering path.** The legacy 2500-div DOM grid (`room-grid/`) and its tile-indexed
stores (`TileStructures`, `TileTerrain`, `TileObjects`, `StructurePositions`, `HoverTile`) were
deleted once the canvas reached parity. Do not reintroduce a second path.

State behind the canvas:

- `useGameObjectsStore` - a flat `GameObject[]`; the single source of truth for everything placed.
  `addObject` applies the stacking rules, so callers do not pre-clear a tile.
- `useTerrainStore` - sparse `{ room, x, y, type }[]` in the shape `setTerrain()` wants; a missing
  entry means plain.
- `useGameAppStore` - the hovered room position, published by the canvas for `HoverTilePanel`.
- `Settings` - brush, brush type, RCL, and room/shard. Camera state is deliberately not here: the
  renderer's own `zoomLevel` and `stage.position` are the single source of truth, and
  `useCameraControls` owns every write to them.

## Domain Rules

- A room is 50x50 (`ROOM_SIZE`). Position encodings, all converted in `utils/helpers.ts`: `{x, y}`
  points (what the stores and renderer use), **short string** (`"x-y"`, the exported JSON encoding),
  and **tile index** (`tile = y * ROOM_SIZE + x`, now only a conversion waypoint). Use the helpers;
  never hand-roll the math. Export and import must agree on the short string.
- `CONTROLLER_STRUCTURES` in `utils/constants.ts` caps how many of each structure are allowed per RCL
  (1-8). Placement must go through `structureCanBePlaced()`.
- Structures are mutually exclusive per tile except ramparts, and road/container may coexist. That
  logic lives in `structuresToRemove()`, wrapped by `typesToRemoveForType()`, which adds the
  source/mineral rules (an extractor is the one structure that coexists with a mineral).
- Terrain brushes are routed by `BrushType`, never by the brush string: `TERRAIN_WALL` is `'wall'`
  but `STRUCTURE_WALL` is `'constructedWall'`, and the two read alike at a glance.
- `utils/gameObjects.ts` builds the object shapes `@screeps/renderer` expects. A missing or wrong
  field there surfaces as a render crash, not a type error -- add new structure types via
  `createObjectFromType`.

## Conventions

- Import via the `@/*` alias, not deep relative paths.
- MUI is imported namespaced: `import * as Mui from '@mui/material'` / `* as Icons`. Same for
  `* as Constants` and `* as Helpers`.
- Prettier owns formatting: single quotes (JSX too), 120 cols, semicolons, 2-space indent,
  `es5` trailing commas. Do not hand-format around it.
- One Zustand store per concern, colocated in `src/stores/`. Subscribe with a selector
  (`useSettings((s) => s.settings.brush)`) so components don't re-render on unrelated state.

## Gotchas

- `Canvas` is behind `React.lazy` in `CanvasWrapper.tsx`. The reason is bundle size, not SSR --
  `@screeps/renderer` is a ~2 MB prebuilt bundle, and splitting it lets the AppBar and brush drawer
  paint first. It needs its `Suspense` boundary; `next/dynamic` did not.
- The two `@screeps/*` packages are prebuilt CommonJS/UMD webpack bundles that set their globals
  (`window.PIXI`, `window.RENDERER_METADATA`) as a module-load side effect. `worldConfigs.ts` relies
  on this with a bare `import '@screeps/renderer-metadata'`. Do not "clean up" that import, and after
  any bundler change confirm the side effects survived the production build -- dev never tree-shakes,
  so this can only fail under `npm run build` + `npm run preview`:

  ```
  grep -l "RENDERER_METADATA" dist/bundle/*.js
  grep -l "window.PIXI"       dist/bundle/*.js
  ```

- `PIXI` is an ambient global (`@screeps/renderer` assigns `window.PIXI`), not an import. Types come
  from the `pixi.js` devDependency, which is never imported at runtime -- it only backs the
  `declare const PIXI` in `declarations.d.ts`. Don't add a runtime import.
- The renderer is on PixiJS 7. `renderer.plugins.interaction` is a deprecation shim returning the
  `EventSystem`, so cursor changes go through `app.renderer.events.setCursor()`, stage interaction is
  `eventMode = 'static'`, and federated events expose `shiftKey`/`buttons`/`global` directly rather
  than under `event.data.originalEvent`.
- `useGameRenderer` must stay teardown-clean: React 19 StrictMode double-invokes its effect, so every
  path releases the renderer and clears its timers. Terrain has its own effect on purpose -- putting
  it back in the init effect rebuilds the WebGL context on every terrain change.
- `types/declarations.d.ts` is hand-written because the `@screeps/*` packages ship no types. Extend it
  when you touch a new renderer API rather than reaching for `any`.
- Renderer sprites are served from `public/assets/` and mapped by name in `utils/resourceMap.ts`; a
  new sprite needs an entry in both. Bundled output goes to `dist/bundle/` (`build.assetsDir`) so it
  never shares a directory with the copied sprites.
- Sprite and icon URLs are document-relative (`assets/...` in `resourceMap.ts`, `./images/...` in
  `helpers.ts`). They only resolve because the app is served from `/`. Keep Vite's `base` at `/`, and
  do not add an SPA catch-all rewrite -- there is no client-side router, so a deep path should 404
  rather than serve a shell whose relative asset URLs are all wrong.

## Contributing

- Never commit directly to `main`; branch and open a PR.
- No secrets in the repo. The Screeps API is called unauthenticated, but not directly from the
  browser: `screeps.com` does not send CORS headers, so requests go through the same-origin
  `/screeps-api` prefix -- a `vercel.json` rewrite in production, the Vite server/preview proxy
  locally. The prefix must stay aligned across `vercel.json`, `vite.config.ts`, and
  `src/utils/screepsApi.ts`.
