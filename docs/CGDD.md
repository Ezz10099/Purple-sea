# Current Game Design Document

## Weakwood Grove — provisional jackal enemy

Status: implemented with partial runtime verification.

- Weakwood Grove uses the approved provisional Direction A jackal as its creature/enemy-family anchor.
- Both the Young Jackal and Rune Jackal use the same seven-frame, right-facing 96×96 pixel-art set.
- Runtime states are idle A, idle B, alert, attack anticipation, attack impact, hurt, and defeated.
- Phaser uses a uniform 672×96 spritesheet with nearest-neighbour filtering and a baseline-aligned origin.
- Motion adds a two-frame breathing idle, proximity/selection alert, pre-impact lunge, synchronized impact dust and camera shake, hurt recoil/flash, defeated hold/fade, and idle restoration on respawn.
- Encounter positions, health, rewards, attack cadence, and damage ranges are unchanged.

Verification:

- All seven frame PNGs and the spritesheet pass dimensions, transparency, palette, edge, naming, and frame-grid checks.
- The saved asset package round-trips byte-for-byte and passes validation after unpacking.
- JavaScript syntax, whitespace, and a Phaser 3.60-compatible state harness pass for load, spawn, idle, alert, attack, hurt, defeat, and respawn.
- The cloud preview browser could not open the local workspace URL. Final visual and interaction verification in SPCK or another real browser/device remains required.
