# Purple Sea Risk Register and Limitations

This file is the permanent risk-control layer for the project. It applies from FGDD planning through Google Play release and post-launch maintenance.

## 1. Risk method

For every meaningful task or milestone, record:

- **Risk:** what may go wrong
- **Cause:** why it may happen
- **Likelihood:** Low / Medium / High
- **Impact:** Low / Medium / High / Critical
- **Trigger:** observable sign that the risk is becoming real
- **Response:** Avoid / Reduce / Accept / Transfer
- **Mitigation:** action taken before the risk occurs
- **Contingency:** action taken after the risk occurs
- **Owner:** person or process responsible
- **Status:** Open / Watching / Controlled / Occurred / Closed

A High-likelihood High-impact risk, or any Critical-impact risk, blocks stable implementation or release until explicitly accepted or reduced.

## 2. Workflow-wide controls

Every task must identify:

1. The FGDD target.
2. The verified CGDD state.
3. The implementation gap.
4. Relevant risks and limitations.
5. The smallest reversible work package.
6. Acceptance criteria.
7. Verification evidence.
8. CGDD and risk-register updates after completion.

Do not mark a feature complete because code exists. Completion requires verified behavior, required assets and content, acceptable quality, and updated documentation.

## 3. Phase risks and gates

### A. Vision and FGDD

Main risks:

- The FGDD becomes too broad to build.
- Unproven ideas are treated as guaranteed fun.
- Contradictory mechanics, economy, narrative, or interface decisions accumulate.
- Historical atmosphere conflicts with accessibility, pacing, or commercial needs.
- The document becomes detailed without becoming testable.

Controls:

- Separate **approved**, **experimental**, and **unresolved** decisions.
- Give every major feature a player purpose, rules, dependencies, limits, acceptance criteria, and release priority.
- Label assumptions that require prototypes or player testing.
- Do not approve the full scope until a vertical slice proves the core loop.

Gate to proceed:

- The relevant FGDD section is internally consistent, bounded, prioritized, and testable.

### B. CGDD and traceability

Main risks:

- CGDD describes planned work as implemented.
- CGDD, code, assets, and FGDD drift apart.
- Removed or changed features remain documented as current.
- Progress percentage becomes subjective or misleading.

Controls:

- CGDD records only verified current behavior.
- Every CGDD claim links conceptually to implementation and verification evidence.
- Update CGDD in the same work package as a completed feature.
- Record limitations, placeholders, missing content, and known defects explicitly.

Gate to proceed:

- Current behavior can be reproduced and matches the CGDD description.

### C. Architecture and technical planning

Main risks:

- Choosing an engine or framework before requirements are known.
- Mobile packaging, save compatibility, performance, localization, or content pipelines are added too late.
- Architecture becomes too complex for a solo project and weak hardware or internet access.
- A prototype becomes permanent production code without review.
- Third-party dependencies become abandoned, insecure, incompatible, or legally unsuitable.

Controls:

- Record architecture decisions and rejected alternatives.
- Prefer the smallest architecture that supports the approved release scope.
- Prototype high-risk systems before committing the whole project.
- Pin dependencies and preserve reproducible builds after the stack is selected.
- Review licenses, permissions, privacy behavior, and maintenance status before adopting dependencies.

Gate to proceed:

- The selected architecture has demonstrated the core loop, target-device viability, save strategy, content workflow, and Android packaging path.

### D. Task planning

Main risks:

- Tasks are too large, vague, or dependent on hidden work.
- Parallel changes conflict.
- Scope expands during implementation.
- Work is declared complete without acceptance criteria.

Controls:

- Break FGDD features into bounded issues or equivalent tasks.
- Mark dependencies and blockers.
- Each task has one outcome, relevant files, preservation rules, acceptance criteria, and tests.
- Split design decisions, asset creation, implementation, and integration when combining them creates instability.

Gate to proceed:

- The task is small enough to implement, verify, revert, and hand off safely.

### E. Code and data implementation

Main risks:

- AI-generated or human-written code appears plausible but is wrong.
- Changes silently break unrelated systems.
- Data schemas drift or invalid content reaches runtime.
- Temporary hacks become permanent.
- Save files become incompatible.
- Unrelated user changes are overwritten.

Controls:

- Inspect existing code and data before editing.
- Preserve unrelated modifications.
- Use schema validation, static checks, automated tests, and targeted runtime checks when available.
- Mark temporary bridges and removal conditions.
- Version persistent save data and test migration before changing stored structures.
- Keep commits narrow and reversible.

Gate to proceed:

- Relevant checks pass, behavior is verified, regressions are not observed, and known limitations are documented.

### F. Assets, writing, and historical content

Main risks:

- Inconsistent visual identity or quality.
- Missing licenses or unclear ownership.
- Generated assets contain artifacts, inaccurate details, or unusable dimensions.
- Historical claims are invented or overstated.
- Text volume exceeds localization and interface capacity.
- Assets increase download size or memory use excessively.

Controls:

- Keep provenance and license information for external assets.
- Preserve originals and use final-path naming conventions.
- Validate dimensions, transparency, compression, readability, memory impact, and in-game appearance.
- Distinguish historical evidence, plausible reconstruction, and fiction.
- Test text inside real mobile layouts before approving it.

Gate to proceed:

- Assets are legally usable, technically valid, visually consistent, integrated, and verified on target layouts.

### G. Integration and vertical slices

Main risks:

- Individual systems work alone but fail together.
- The core loop is technically functional but boring, confusing, or too slow.
- Content production cost is discovered too late.
- Performance degrades as systems and assets accumulate.

Controls:

- Build playable end-to-end slices early.
- Measure onboarding clarity, session flow, failure recovery, performance, and content-production effort.
- Replace assumptions about fun with prototype evidence and player observation.
- Test low-end target hardware before expanding content.

Gate to proceed:

- A representative player journey works end-to-end at acceptable usability, stability, and performance.

### H. Testing and quality

Main risks:

- Testing covers only the developer's device and ideal path.
- Crashes, freezes, save loss, inaccessible controls, and layout failures remain undiscovered.
- Automated tests create false confidence about visual quality or fun.
- Human testers are unavailable or feedback is too small and biased.

Controls:

- Combine automated checks, device testing, exploratory testing, regression testing, and real-player testing.
- Test installation, update, first launch, interruption, background/foreground, offline behavior, low storage, unusual aspect ratios, and save recovery.
- Keep a defect list with severity and reproducible steps.
- Do not treat "works on my device" as release evidence.

Gate to proceed:

- No unresolved release-blocking defects; core journeys pass on representative devices and test tracks.

### I. Security, privacy, and safety

Main risks:

- Unnecessary permissions or data collection.
- Secrets or signing material enter the repository.
- Vulnerable dependencies or unsafe content loading.
- Privacy disclosures do not match actual behavior.
- Analytics, advertising, or SDK behavior violates policy.

Controls:

- Minimize permissions and collected data.
- Never commit secrets, credentials, signing keys, or private user data.
- Review dependencies and SDK behavior.
- Maintain accurate privacy and data-safety declarations.
- Add security review before release and after major dependency or backend changes.

Gate to proceed:

- Actual app behavior, permissions, SDKs, security controls, and declarations agree.

### J. Google Play release

Main risks:

- Policy or target-SDK requirements change.
- Store listing overpromises or misrepresents gameplay.
- App is unstable, low-value, incomplete, or rejected.
- Testing-track requirements are discovered too late.
- Signing, package name, versioning, backups, or release artifacts are mishandled.

Controls:

- Recheck current Google Play requirements before every release candidate.
- Use internal, closed, and open testing tracks as appropriate.
- Keep store screenshots and descriptions consistent with actual gameplay.
- Preserve signing ownership, release records, version codes, and rollback artifacts.
- Treat policy compliance as a continuing requirement, not a one-time checklist.

Gate to proceed:

- Release candidate passes technical, content, policy, privacy, listing, signing, and testing-track checks.

### K. Post-launch

Main risks:

- Crashes, ANRs, poor retention, balance problems, or device-specific defects emerge after release.
- Updates corrupt saves or remove paid/earned value.
- Feedback drives uncontrolled redesign.
- Maintenance burden exceeds available time and resources.

Controls:

- Monitor release health, reviews, crash and ANR reports, performance, and support issues.
- Prioritize by player harm, frequency, severity, and strategic value.
- Test updates and save migrations before rollout.
- Use staged releases and rollback plans where available.
- Change FGDD only through explicit approved product decisions; update CGDD after verified releases.

Gate to continue rollout:

- Release health remains within accepted thresholds and no critical regression is active.

## 4. Fundamental limitations

The workflow reduces risk; it cannot eliminate it.

- A design document cannot prove that a game is fun.
- Code completion cannot prove commercial quality.
- Automated tests cannot replace real-device and human testing.
- AI cannot reliably infer user enjoyment, historical truth, legal compliance, or policy acceptance without evidence and review.
- The FGDD cannot predict every technical constraint discovered during implementation.
- The CGDD can become stale unless updated with each verified milestone.
- A solo project has hard limits in time, asset production, testing coverage, content volume, and maintenance.
- Google Play policies, Android requirements, devices, dependencies, and market conditions can change.
- Historical settings require deliberate separation between documented history, plausible interpretation, and fiction.

## 5. Stop and escalate conditions

Stop the current work package and report before continuing when:

- A requested change contradicts an approved FGDD decision.
- The implementation would require an unapproved architecture change.
- A critical dependency, legal, licensing, privacy, security, or Google Play risk is unresolved.
- Existing user work may be overwritten or lost.
- Verification cannot establish whether the task succeeded.
- A feature cannot meet its acceptance criteria within the approved scope.
- A risk changes the cost, schedule, commercial direction, or core player experience materially.

## 6. Initial open risks

| Risk | Likelihood | Impact | Current response |
|---|---|---|---|
| FGDD is empty, so final scope is undefined | High | Critical | Define and approve it incrementally before broad implementation |
| CGDD is empty and no runtime exists | High | High | Add only verified repository state and future proven milestones |
| Engine, framework, and Android architecture are unselected | High | Critical | Compare requirements and prototype before committing |
| Kefr-Yamm source data is not yet committed to the repository | High | High | Preserve and validate it as authoritative data |
| No automated checks, preview workflow, or device evidence exists | High | High | Establish validation with the first technical foundation |
| Fun, pacing, economy, and usability are untested | High | Critical | Build and test a representative vertical slice before scaling content |
| Historical accuracy boundaries are undefined | Medium | High | Define evidence, reconstruction, and fiction labels in the FGDD |
| Google Play account and testing-track constraints are unverified | Medium | High | Check current requirements before release planning |
