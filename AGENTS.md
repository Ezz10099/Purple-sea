# AGENTS.md

## Project identity

Purple Sea is an original historical maritime trading and exploration game set around the ancient Phoenician coast.

Preserve its core identity: coastal settlements, sailing, trade, discovery, grounded historical atmosphere, character relationships, and the player's gradual rise from a small village trader.

Treat committed project data and explicitly approved design documents as the source of truth. Do not replace approved decisions with generic genre conventions or assumptions from other games.

## Start every task

1. Work from the real Git repository root.
2. Run `git status --short` and preserve all existing user changes.
3. Read this file and `docs/active-work.md`.
4. State the single requested outcome and the smallest relevant file set before editing.
5. Inspect only the files needed for that outcome.

Do not install tools, dependencies, frameworks, or project scaffolding unless the task requires them or the existing project setup is incomplete.

## Read only relevant documentation

Do not reread the entire repository for routine edits.

- Read authoritative design or data files only when the task changes gameplay, economy, setting, story, naming, progression, or architecture.
- Read `docs/codex-workflow.md` when a command fails, preview verification is needed, or the task spans multiple systems.
- Simple copy changes, isolated data fixes, narrow code fixes, and asset insertion should inspect only directly relevant files.

## Command policy

- Prefer existing repository scripts and documented commands.
- Do not run dependency installation commands unless dependencies or lockfiles changed, setup is explicitly requested, or a required dependency is missing.
- Retry a failed command at most once after identifying one concrete cause.
- Never reset, clean, discard, overwrite, or commit unrelated user changes.
- Never inspect or commit generated output, dependency folders, caches, logs, or platform build folders unless the task explicitly targets them.

## Visual and asset work

- Preserve supplied assets exactly unless the user explicitly requests cropping, resizing, conversion, compression, recolouring, or regeneration.
- Keep historical visual identity consistent across locations and systems.
- Make the requested edit first, then verify once after the implementation.
- Do not generate and integrate a large asset set in one unstable step unless explicitly requested.

## Scope and session discipline

- Complete one coherent work package per thread.
- Prefer direct implementation over broad audits when the user requests a narrow change.
- For multi-stage work, preserve each completed code, data, or asset milestone before starting the next.
- Update `docs/active-work.md` after a meaningful milestone or before moving to a new thread.

## Completion standard

Before a stable commit or push:

1. Run the most relevant available checks.
2. Perform one preview or runtime verification when the change affects visible or interactive behavior and a preview method exists.
3. Run `git diff --check`.
4. Run `git status --short`.
5. Commit only completed, stable, relevant files with a clear message.
6. Never push broken, destructive, experimental, or half-finished work as stable progress.
