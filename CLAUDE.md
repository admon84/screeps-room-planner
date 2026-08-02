@AGENTS.md

## Claude Code

`AGENTS.md` above is the single source of truth for this repo. Add project rules there, not here --
this file exists only because Claude Code reads `CLAUDE.md` and not `AGENTS.md`. Keep anything below
limited to Claude-specific workflow.

- Prefer `Grep`/`Glob` over reading whole files in `src/utils/` -- `sampleTerrain.ts` (~4500 lines)
  and `gameObjects.ts` (~850 lines) will otherwise flood the context window.
- Use plan mode before changes to the renderer lifecycle (`src/hooks/useGameRenderer.ts` plus
  `src/components/canvas/`); teardown and StrictMode behaviour there are design questions, not
  mechanical edits.
- There is no test suite. After edits, run `npm run lint`, and `npm run build` for anything touching
  the renderer, the lazy canvas chunk, or `vite.config.ts`. For renderer changes also run
  `npm run preview` -- tree-shaking bugs cannot reproduce under `npm run dev`.
