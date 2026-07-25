# Procedural Kefr-Yamm Diorama Test

A self-contained visual prototype for testing whether Purple Sea can achieve a polished terrain presentation without a desktop engine or imported artwork.

## What this prototype proves

- Isometric terrain can be drawn entirely through Canvas 2D.
- Buildings, cliffs, roads, dock, boat, palms, water, shadows, lighting, player and enemies require no image assets.
- Stationary Resolute Hero-style encounters can be selected by touch.
- The scene can pan by dragging and switch between day/dusk and full/reduced detail.
- The implementation has no dependencies, build step or production architecture commitment.

## Scope boundaries

This is an experiment, not production code and not a CGDD-complete feature. It does not decide the final engine, art direction, combat system, movement model, save format or Android packaging path.

## Test

Open `index.html` in a browser or SPCK Preview. Review:

1. Does the scene feel cohesive and intentional?
2. Are enemies readable and naturally grounded?
3. Is touch selection comfortable?
4. Does panning remain smooth on the target phone?
5. Does reduced detail meaningfully improve performance if needed?
6. Is this visual direction strong enough to justify a larger vertical slice?
