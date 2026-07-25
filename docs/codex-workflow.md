# Codex Workflow

This workflow keeps Purple Sea development focused, recoverable, and resistant to unnecessary setup work, broad refactors, and unstable preview loops.

## 1. Session start

From the real repository root:

```text
git status --short
```

Then read:

1. `AGENTS.md`
2. `docs/active-work.md`
3. Only the design, data, code, or asset files relevant to the current request

Before using project commands, inspect the repository's existing scripts and documentation. Do not assume a framework, package manager, or preview command that has not been established in the repository.

## 2. Task scoping

Before editing, identify:

- the single requested outcome
- the smallest relevant file set
- existing user-modified files that must be preserved
- whether the task affects data, gameplay logic, interface, assets, tooling, or multiple systems

Routine work must not trigger a full repository audit.

## 3. Fast edit loop

During implementation:

1. Inspect only relevant files.
2. Make the complete narrow edit.
3. Run a fast available check when an intermediate syntax or data validation is useful.
4. Run the full relevant check once at the end.

Do not repeatedly run full validation after every small adjustment.

## 4. Preview policy

Use the repository's documented preview method when one exists.

- Reuse an already-running preview instead of repeatedly starting new servers.
- Do not invent detached or hidden server-launch methods.
- Perform at most one final visual-verification pass unless iterative tuning is explicitly requested.
- When preview infrastructure is unavailable, complete nonvisual checks and report the unverified visual portion clearly.

## 5. Command failure policy

When a command fails:

1. Read the exact exit code and error output.
2. Identify one concrete cause.
3. Apply one targeted correction.
4. Retry once.
5. If it still fails, stop that command path and preserve completed work.

Do not cycle through speculative command variants or reinstall the environment without evidence that installation is the problem.

## 6. Data and asset workflow

For supplied or generated data and assets:

1. Confirm the intended final repository path.
2. Preserve the original unless transformation is explicitly requested.
3. Add or update it in one focused step.
4. Confirm the file exists and is referenced correctly.
5. Validate once.

Do not regenerate or transform an existing asset after an interruption without first checking repository state.

## 7. Source-of-truth discipline

- Approved project data governs factual game content.
- Approved design documents govern product direction.
- Runtime code governs current implemented behavior.
- When these disagree, identify the conflict instead of silently choosing or combining them.
- Do not overwrite a deliberate design decision with a generic improvement.

## 8. FGDD and CGDD workflow

- `docs/FGDD.md` defines the complete intended Google Play release: the game from A to Z when finished.
- `docs/CGDD.md` records only the current verified game: implemented systems, content, assets, limitations, and validation status.
- The long-term goal is for the CGDD to contain the same approved scope as the FGDD when the release is complete.
- The FGDD is not copied directly into code. Each approved FGDD feature is decomposed into bounded technical tasks, data, assets, interfaces, acceptance criteria, and tests.
- After implementation and verification, update the matching CGDD section. Do not describe planned or partially built work as complete.
- Every development task should identify its FGDD target, current CGDD state, implementation gap, changed files, and verification result.
- When implementation proves an FGDD decision infeasible or weak, report the conflict and obtain approval before changing the FGDD.

## 9. Handoff between threads

Use `docs/active-work.md` as the compact persistent handoff. Update it after a meaningful completed milestone or before leaving an unstable thread.

A new thread should normally need only:

1. `AGENTS.md`
2. `docs/active-work.md`
3. `git status --short`
4. the current narrow user request

Avoid copying entire previous conversations into the repository.

## 10. Git completion

Before committing stable work:

```text
git diff --check
git status --short
```

Also run the most relevant repository checks and preview verification available for the changed system.

Commit only the intended files. Never include unrelated user work, generated output, caches, dependency folders, or broken experiments.
