@AGENTS.md

## Claude Code

`AGENTS.md` above is the single source of truth for this repo. Add project rules there, not here --
this file exists only because Claude Code reads `CLAUDE.md` and not `AGENTS.md`. Keep anything below
limited to Claude-specific workflow.

- Prefer `Grep`/`Glob` over reading whole files in `src/utils/` -- `sampleTerrain.ts` (~4500 lines)
  and `gameObjects.ts` (~850 lines) will otherwise flood the context window.
- Use plan mode before changes that span both rendering paths (`src/components/canvas/` and
  `src/components/room-grid/`); parity between them is a live design question, not a mechanical edit.
- There is no test suite. After edits, run `npm run lint`, and `npm run build` for anything touching
  the renderer, `dynamic` imports, or App Router files.
