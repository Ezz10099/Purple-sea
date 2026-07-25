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
3. The relevant entries in `docs/risk-register.md`
4. Only the design, data, code, or asset files relevant to the current request

Before using project commands, inspect the repository's existing scripts and documentation. Do not assume a framework, package manager, or preview command that has not been established in the repository.

## 2. Task scoping

Before editing, identify:

- the single requested outcome
- the FGDD target and verified CGDD state
- the smallest relevant file set
- existing user-modified files that must be preserved
- whether the task affects data, gameplay logic, interface, assets, tooling, or multiple systems
- relevant risks, limitations, assumptions, dependencies, and stop conditions
- acceptance criteria and required verification evidence

Routine work must not trigger a full repository audit.

If a task has Critical impact risk, or both High likelihood and High impact, do not treat it as routine. Reduce it through research, prototyping, decomposition, testing, or explicit acceptance before stable implementation.

## 3. Fast edit loop

During implementation:

1. Inspect only relevant files.
2. Make the complete narrow edit.
3. Run a fast available check when an intermediate syntax or data validation is useful.
4. Run the full relevant check once at the end.
5. Record newly discovered limitations or risks before closing the task.

Do not repeatedly run full validation after every small adjustment.

## 4. Preview policy

Use the repository's documented preview method when one exists.

- Reuse an already-running preview instead of repeatedly starting new servers.
- Do not invent detached or hidden server-launch methods.
- Perform at most one final visual-verification pass unless iterative tuning is explicitly requested.
- When preview infrastructure is unavailable, complete nonvisual checks and report the unverified visual portion clearly.

A successful preview proves only the tested path and environment. It does not prove fun, broad device compatibility, absence of regressions, policy compliance, or release readiness.

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
3. Confirm provenance, ownership, license, and historical-status requirements when relevant.
4. Add or update it in one focused step.
5. Confirm the file exists and is referenced correctly.
6. Validate format, dimensions, memory or size impact, readability, and in-game behavior as applicable.
7. Record unresolved limitations.

Do not regenerate or transform an existing asset after an interruption without first checking repository state.

## 7. Source-of-truth discipline

- Approved project data governs factual game content.
- Approved design documents govern product direction.
- Runtime code governs current implemented behavior.
- Verification evidence governs whether behavior may be recorded as complete.
- `docs/risk-register.md` governs known risks, limitations, triggers, mitigations, and stop conditions.
- When these disagree, identify the conflict instead of silently choosing or combining them.
- Do not overwrite a deliberate design decision with a generic improvement.

## 8. FGDD and CGDD workflow

- `docs/FGDD.md` defines the complete intended Google Play release: the game from A to Z when finished.
- `docs/CGDD.md` records only the current verified game: implemented systems, content, assets, limitations, and validation status.
- The long-term goal is for the CGDD to contain the same approved scope as the FGDD when the release is complete.
- The FGDD is not copied directly into code. Each approved FGDD feature is decomposed into bounded technical tasks, data, assets, interfaces, acceptance criteria, tests, and risks.
- After implementation and verification, update the matching CGDD section. Do not describe planned or partially built work as complete.
- Every development task should identify its FGDD target, current CGDD state, implementation gap, changed files, risks, limitations, and verification result.
- When implementation proves an FGDD decision infeasible, weak, too costly, unsafe, or incompatible with release requirements, report the conflict and obtain approval before changing the FGDD.
- The FGDD may contain hypotheses about fun, pacing, market value, or feasibility, but these must remain labelled until supported by prototypes, player evidence, or technical validation.

## 9. Risk and limitation workflow

Use `docs/risk-register.md` throughout the project, not only before release.

For each meaningful work package:

1. Identify risks before implementation.
2. Classify likelihood and impact.
3. Choose Avoid, Reduce, Accept, or Transfer.
4. Define a trigger, mitigation, contingency, owner, and status when the risk is material.
5. Prefer the smallest reversible experiment when uncertainty is high.
6. Stop and escalate when a listed stop condition is reached.
7. Update the register when a risk changes, occurs, is controlled, or is closed.

Risk controls must exist at every phase:

- FGDD: scope, contradictions, feasibility, fun assumptions, historical boundaries
- CGDD: evidence, documentation drift, misleading completion claims
- architecture: platform, dependency, save, performance, tooling, and maintainability risks
- implementation: regressions, invalid data, temporary hacks, AI errors, lost user work
- assets and content: quality, licensing, provenance, accuracy, memory, localization
- integration: system conflicts, content cost, usability, performance, core-loop weakness
- testing: device coverage, save loss, interruptions, accessibility, biased tester evidence
- security and privacy: permissions, secrets, SDKs, dependencies, declarations
- Google Play: policy, target SDK, testing tracks, signing, listing, release quality
- post-launch: crashes, ANRs, balance, retention, migration, rollback, maintenance load

The workflow reduces uncertainty; it cannot guarantee fun, commercial success, historical truth, legal approval, platform acceptance, or absence of defects.

## 10. Handoff between threads

Use `docs/active-work.md` as the compact persistent handoff. Update it after a meaningful completed milestone or before leaving an unstable thread.

A new thread should normally need only:

1. `AGENTS.md`
2. `docs/active-work.md`
3. Relevant entries in `docs/risk-register.md`
4. `git status --short`
5. the current narrow user request

Avoid copying entire previous conversations into the repository.

## 11. Git completion

Before committing stable work:

```text
git diff --check
git status --short
```

Also run the most relevant repository checks and preview verification available for the changed system.

Before closing the work package, confirm:

- acceptance criteria were met
- verification evidence is recorded
- CGDD was updated when verified current behavior changed
- risk-register entries were updated when risk status changed
- unresolved limitations are visible rather than hidden

Commit only the intended files. Never include unrelated user work, generated output, caches, dependency folders, or broken experiments.
