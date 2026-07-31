# Purple Sea Project Workflow

**Status:** Canonical  
**Last updated:** 2026-07-31  
**Applies to:** planning, asset production, GitHub integration, review, and testing

## Authority

1. The user's current instruction overrides this document.
2. The installed **Purple Sea Asset Production** skill governs asset-production standards and validation.
3. This document governs how Purple Sea work is divided between chats and tools.
4. Repository code, manifests, and committed assets are the technical truth for the current build.
5. Only the user may approve, replace, or retire an asset anchor.

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

### Work

Use the installed **Purple Sea Asset Production** skill for creating or revising game assets.

Rules:

- keep prompts short and task-specific
- do not repeat technical standards already contained in the skill
- use approved anchors and locked project art rules
- commit asset changes only to the requested branch or pull request
- do not change gameplay code unless explicitly requested
- a small mixed asset-and-code task is acceptable only when doing it together is clearly simpler and the request explicitly allows it

### GitHub/code chat

Use for:

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
2. Work creates or revises assets when needed.
3. The GitHub/code chat integrates code when needed.
4. SPCK tests the result when runtime behavior or appearance must be verified.
5. The coordination chat reviews the evidence and decides the next step.

## Prompt rules

### Work prompts

Include only:

- the skill name
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

- **Approved assets:** repository asset folders and approved-anchor documentation
- **Current code and manifests:** repository
- **Current PR-specific state:** pull-request description, comments, and commits
- **Durable workflow:** this document
- **Asset-production standards:** installed skill
- **Temporary prompts and intermediate discussion:** their original chats; do not preserve them as canonical project sources

## Reference classification

Every visual reference must be classified as one of:

- Approved anchor
- Supporting reference
- Inspiration only
- Rejected

Provisional location files or concepts are not binding unless the user explicitly marks them as authoritative for the task.
