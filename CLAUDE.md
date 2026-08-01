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

## Maintaining These Instructions

Rules load into context on every session and dilute each other as they grow -- adherence drops well
before 200 lines. Keep `AGENTS.md` plus this file under ~150 lines combined. Add a rule only when
Claude has made the same mistake twice or a reviewer caught something Claude could not have known
from the code. Delete rules that go stale; a wrong rule costs more than a missing one.
