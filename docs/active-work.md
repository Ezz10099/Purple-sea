# Active Work Handoff

This file preserves the minimum project context needed when a development thread becomes too long or unstable. Keep it concise and update it only after a meaningful milestone.

## Current focus

- Project: Purple Sea.
- Immediate goal: establish the repository foundation, then build the first playable vertical slice around Kefr-Yamm.
- Current work package: design, workflow, and risk-control foundation.

## Source of truth

- Process rules: `AGENTS.md`.
- Execution and handoff workflow: `docs/codex-workflow.md`.
- Project risks, limitations, triggers, mitigations, and stop conditions: `docs/risk-register.md`.
- Final intended release: `docs/FGDD.md`.
- Current verified game state: `docs/CGDD.md`.
- Kefr-Yamm design and data supplied by the user should be committed as an authoritative project data file before implementation begins.
- Future approved product-direction or architecture documents take precedence over assumptions and generic genre conventions.

## Stable decisions

- Kefr-Yamm is the starting village on the Phoenician coast.
- The opening experience centers on village exploration, trading, sailing, tutorial interactions, and the first delivery voyage to Sidon.
- The village should feel smaller, quieter, older, and less wealthy than Tyre.
- Core early characters include Mother Ashera, Dagon, and Rib-Addi the Blind.
- The player begins with a small fishing boat, basic trade goods, and limited silver.
- The cliff cave, the player's father, and the western sea mystery provide the early exploration and emotional thread.
- Approved source data must be preserved rather than simplified or rewritten during implementation unless explicitly requested.
- The FGDD defines the approved final release target; the CGDD records only verified current implementation.
- Every meaningful work package must identify and control relevant risks and limitations.

## Recently completed

- Initialized the repository with `AGENTS.md`.
- Added `docs/codex-workflow.md`.
- Added this compact handoff file.
- Created empty `docs/FGDD.md` and `docs/CGDD.md`.
- Integrated the FGDD-to-CGDD development model into the workflow.
- Added `docs/risk-register.md` covering planning, architecture, implementation, assets, integration, testing, security, Google Play release, and post-launch risks.
- Integrated risk identification, classification, mitigation, escalation, and closure into the main workflow.

## Current repository state

- The repository contains workflow and design-document foundations only.
- No engine, framework, package manager, runtime architecture, or playable implementation has been selected or committed yet.
- No validation or preview commands exist yet.
- The FGDD and CGDD are intentionally empty.

## Highest current risks

- Final scope is undefined because the FGDD is empty.
- No runtime exists, so the CGDD cannot yet describe a playable game.
- Engine, framework, Android architecture, save strategy, and content pipeline are unresolved.
- Kefr-Yamm source data is not yet committed to the repository.
- Fun, pacing, economy, usability, performance, and device compatibility are untested.

## Recommended next bounded step

Commit the supplied Kefr-Yamm data into a stable repository path, validate its JSON structure, then begin defining the FGDD structure and architecture requirements without prematurely selecting an implementation stack.

## Next-task template

- Requested outcome:
- FGDD target:
- Current CGDD state:
- Source files or assets supplied:
- Files expected to change:
- Must preserve:
- Risks and limitations:
- Acceptance criteria:
- Verification required:
- Completed:
- Remaining:
