# Purple Sea Project Workflow

**Status:** Canonical  
**Last updated:** 2026-07-31  
**Applies to:** planning, asset production, GitHub integration, review, testing, and project-source management

## Authority

1. The user's current instruction overrides this document.
2. The installed **Purple Sea Asset Production** skill governs asset-production standards and validation.
3. This document governs how Purple Sea work is divided between chats and tools.
4. Repository code, manifests, and committed assets are the technical truth for the current build.
5. Only the user may approve, replace, or retire an asset anchor.

## Tool-selection principle

Minimize Work-session usage.

Use normal Chat by default for:

- discussion, planning, and diagnosis
- asset and recording review
- prompt writing
- image generation or editing when normal Chat can produce and validate the required result reliably
- GitHub connector tasks, including repository reads and writes, branch updates, and pull-request work

Use Work only when:

- normal Chat cannot perform a required capability
- the **Purple Sea Asset Production** skill is needed for reliable asset production or validation
- avoiding Work would materially reduce quality or reliability
- the user explicitly requests Work

Do not preserve temporary claims about product quotas, mobile limitations, or interface behavior as project rules. Those details may change and should be checked only when they become relevant.

## Working sessions

### Coordination chat

Use for:

- understanding the current project state
- evaluating assets, screenshots, GIFs, recordings, and test results
- diagnosing visual or integration problems
- deciding the next action
- writing precise prompts for Work or the GitHub/code chat
- reviewing results before further changes
- stating explicitly when an SPCK test is needed

Do not make repository changes from the coordination chat unless the user explicitly requests them.

### Asset production

Asset-production tasks must follow the **Purple Sea Asset Production** standards, approved anchors, and locked project art rules.

Normal Chat may create or revise assets when it can do so reliably. Use Work when skill-driven production or validation is materially beneficial.

When Work is used:

- keep prompts short and task-specific
- do not repeat technical standards already contained in the skill
- commit asset changes only to the requested branch or pull request
- do not change gameplay code unless explicitly requested
- a small mixed asset-and-code task is acceptable only when doing it together is clearly simpler and the request explicitly allows it

### GitHub/code chat

This is normally a standard Chat session using the GitHub connector. Work is not required merely to change repository files.

Use it for:

- reading and changing repository code
- Phaser integration
- branch and pull-request updates
- checking diffs, commits, and tests

Do not alter PNG artwork or other source assets unless the user explicitly requests it.

### SPCK

Use SPCK on the phone to pull the relevant branch and test the real game result.

Return screenshots, recordings, errors, and observations to the coordination chat before the next major change or merge decision.

## Standard hand-off

1. The coordination chat defines or approves the task.
2. Normal Chat or Work creates or revises assets when needed, using the tool-selection principle above.
3. The GitHub/code chat integrates code when needed.
4. SPCK tests the result when runtime behavior or appearance must be verified.
5. The coordination chat reviews the evidence and decides the next step.

## Prompt rules

### Asset prompts

Include only:

- the skill name when Work is used
- the requested asset or revision
- the approved anchor or repository path
- the target repository, branch, or pull request when relevant
- the files or areas that must remain untouched
- the expected report, such as file paths and commit hash

### GitHub/code prompts

Include:

- repository
- branch or pull request
- exact intended behavior
- files or systems that must remain unchanged
- required validation

## Project records

- **Approved assets:** canonical copies in repository asset folders; Project Sources may contain convenient approved references when needed by chats.
- **Current code and manifests:** repository.
- **Current PR-specific state:** pull-request description, comments, commits, and test evidence.
- **Durable workflow and source policy:** this document.
- **Asset-production standards:** installed skill.
- **Temporary prompts and intermediate discussion:** their original chats; do not preserve them as canonical project sources.

## Project Sources policy

Project Sources are a small retrieval set, not a conversation archive.

Keep only:

- approved anchor images or references that chats must access directly
- final canonical guides not already better represented by the repository or installed skill
- binding specifications
- one current project-state summary when useful
- durable decision records that are not already documented in GitHub

Do not keep:

- saved conversational responses after their durable information has been extracted
- setup instructions for completed tasks, such as creating an already-installed skill
- temporary prompts or one-off recommendations
- repeated explanations or duplicate versions
- superseded workflow guidance
- assistant behavior feedback that belongs in user or project instructions rather than repository knowledge
- unstable product-interface or quota information

Before removing a saved response, extract any still-valid rule into its authoritative home. Then remove the response from Project Sources.

## Reference classification

Every visual reference must be classified as one of:

- Approved anchor
- Supporting reference
- Inspiration only
- Rejected

Provisional location files or concepts are not binding unless the user explicitly marks them as authoritative for the task.