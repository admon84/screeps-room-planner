# AGENTS.md

Guidance for AI coding agents working in this repo. Human-facing setup docs live in `README.md`.

## Project Overview

Screeps Room Planner: a Next.js web app for planning and visualizing room layouts for the game
Screeps. Users paint structures, resource objects, and terrain onto a 50x50 room grid, import real
room terrain from the Screeps MMO API, and export the layout as JSON for use in their game script.

## Commands

| Task    | Command         |
| ------- | --------------- |
| Dev     | `npm run dev`   |
| Build   | `npm run build` |
| Lint    | `npm run lint`  |
| Prod    | `npm start`     |

There is no test suite. Verify changes with `npm run lint` and `npm run build`, plus a manual pass in
the browser for anything touching the canvas.

## Tech Stack

Next.js 14 (App Router) - React 18 - TypeScript (strict) - MUI 5 (Emotion) - Zustand - PixiJS v4 via
`@screeps/renderer` - Prettier + ESLint (`next/core-web-vitals`).

## Architecture

```
src/app/         App Router entry; api/room-terrain proxies the Screeps MMO API (avoids CORS)
src/components/  UI. canvas/ = WebGL renderer, room-grid/ = legacy DOM grid, left-drawer/ = brushes
src/hooks/       useGameRenderer - owns the GameRenderer lifecycle and PIXI stage wiring
src/stores/      Zustand stores, one per concern; no single global store
src/utils/       Pure helpers, game constants, and generated data
src/types/       Shared types + declarations.d.ts (hand-written types for untyped @screeps packages)
```

**Two rendering paths exist, and this matters.** The app is mid-migration from a DOM-based grid to
the official WebGL renderer:

- **Legacy** `room-grid/RoomGrid.tsx` - a 2500-div CSS grid driven by the tile-indexed stores
  (`TileStructures`, `TileTerrain`, `TileObjects`, `StructurePositions`). Currently commented out in
  `RoomPlanner.tsx` but still the only path wired to import/export and the brush UI.
- **Current** `canvas/` + `useGameRenderer` - `@screeps/renderer` drawing to a PIXI stage, backed by
  `useGameObjectsStore` (a flat `GameObject[]`) and `useGameAppStore`.

Renderer work happens on `feat/screeps-renderer`. Do not delete the legacy grid or its stores until
the canvas path reaches feature parity; ask before pruning either side.

## Domain Rules

- A room is 50x50 (`ROOM_SIZE`). Two position encodings are in play, both in `utils/helpers.ts`:
  **tile index** (`tile = y * ROOM_SIZE + x`) for store keys, and **short string** (`"x-y"`) for
  exported JSON. Convert with the existing helpers; never hand-roll the math.
- `CONTROLLER_STRUCTURES` in `utils/constants.ts` caps how many of each structure are allowed per RCL
  (1-8). Placement must go through `structureCanBePlaced()`.
- Structures are mutually exclusive per tile except ramparts, and road/container may coexist. That
  logic lives in `structuresToRemove()`.
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
- Components are client-side by default; `RoomPlanner` carries the `'use client'` boundary.

## Gotchas

- `@screeps/renderer` and PIXI touch `window` at module load, which breaks Next's prerender. The
  canvas must stay behind `dynamic(..., { ssr: false })` -- see `CanvasWrapper.tsx`.
- `PIXI` is an ambient global (types from `@types/pixi.js` v4), not an import. Don't add one.
- `utils/sampleTerrain.ts` is ~4500 lines of generated terrain data. Never read it in full or edit it
  by hand.
- `types/declarations.d.ts` is hand-written because the `@screeps/*` packages ship no types. Extend it
  when you touch a new renderer API rather than reaching for `any`.
- Renderer sprites are served from `public/assets/` and mapped by name in `utils/resourceMap.ts`; a
  new sprite needs an entry in both.

## Contributing

- Never commit directly to `main`; branch and open a PR.
- No secrets in the repo. The Screeps API is called unauthenticated through the local proxy route.
