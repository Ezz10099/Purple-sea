# Active Work Handoff

This file preserves the minimum project context needed when a development thread becomes too long or unstable. Keep it concise and update it only after a meaningful milestone.

## Current focus

- Project: Purple Sea.
- Immediate goal: establish the repository foundation, then build the first playable vertical slice around Kefr-Yamm.
- Current work package: integrate the approved provisional jackal enemy into Weakwood Grove.

## Source of truth

- Process rules: `AGENTS.md`.
- Execution and handoff workflow: `docs/codex-workflow.md`.
- Approved universal, deferred, and excluded workflow rules: `docs/workflow-decisions.md`.
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
- Purple Sea keeps Arcane Academy's universal development discipline, defers architecture-dependent rules, and excludes Arcane-specific product details.

## Recently completed

- Initialized the repository with `AGENTS.md`.
- Added `docs/codex-workflow.md`.
- Added this compact handoff file.
- Created empty `docs/FGDD.md` and `docs/CGDD.md`.
- Integrated the FGDD-to-CGDD development model into the workflow.
- Added `docs/risk-register.md` covering planning, architecture, implementation, assets, integration, testing, security, Google Play release, and post-launch risks.
- Integrated risk identification, classification, mitigation, escalation, and closure into the main workflow.
- Added `docs/workflow-decisions.md` to preserve the agreed keep/defer/exclude split.
- Added a playable Phaser 3.60 prototype with Kefr-Yamm, location travel, trade, and Weakwood Grove.
- Replaced Weakwood Grove's temporary procedural jackal with the approved provisional Direction A seven-frame pixel-art set.
- Added Phaser idle, alert, attack, hurt, defeated, and respawn presentation for both Weakwood jackals.
- Added the validated minimal jackal package under `assets/enemies/jackal/`.

## Current repository state

- The repository contains a browser-hosted Phaser 3.60 playable prototype.
- Weakwood Grove contains two jackal encounters using the approved provisional asset set.
- Asset validation, JavaScript syntax checks, and a focused Phaser-state harness pass.
- Cloud localhost preview was blocked, so final jackal appearance and timing still require SPCK or real-browser/device verification.
- The FGDD is still empty; the CGDD records the verified jackal integration and its remaining limitation.

## Highest current risks

- Final scope is undefined because the FGDD is empty.
- The current browser prototype has not yet established the final Android architecture or content pipeline.
- Authoritative location source data and the current runtime files have not yet received a full alignment audit.
- Jackal readability, timing, performance, and interaction feel remain unverified on the user's target phone.
- Fun, pacing, economy, usability, performance, and broader device compatibility remain insufficiently tested.

## Recommended next bounded step

Pull the jackal integration into SPCK, enter Weakwood Grove, and verify idle, selection alert, retaliation impact, hurt, defeat, respawn, scale, UI overlap, and crisp nearest-neighbour rendering on the target phone.

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
