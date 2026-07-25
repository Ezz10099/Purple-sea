# Workflow Decisions

## Keep now

- Use narrow, reversible tasks.
- Preserve unrelated user changes.
- Read only relevant files and documentation.
- Retry failed commands once after identifying a specific cause.
- Review the complete relevant diff before merging.
- Run appropriate checks before stable commits.
- Use `docs/active-work.md` as the compact handoff.
- Trace work as: FGDD target → bounded task → implementation → evidence → CGDD update.
- Record and control relevant risks and limitations.
- Require real-device or real-preview approval for visual work.
- Preserve original assets and validate the exact repository copies.
- Protect save data with migrations before changing persistent structures.

## Defer until architecture is selected

- Exact validation and preview commands.
- CI configuration.
- Android build and packaging workflow.
- Runtime folder structure and asset paths.
- Dependency and tool version pinning.
- Architecture guards.

## Exclude

- Arcane Academy gameplay, screens, currencies, naming, and content.
- Arcane Academy-specific folders and commands.
- Automatic adoption of its technology stack.
- Copying its FGDD structure word-for-word.

## Rule

Reuse universal development discipline only. Purple Sea product and technical decisions must be chosen from Purple Sea requirements and approved evidence.
