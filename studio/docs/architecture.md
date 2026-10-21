# Studio architecture

## Layers

```
index.html        static markup; every stage is readable without JS
  └── src/main.ts wiring only: resolve motion, mount stages, remount on change
        ├── core/    preference · pacing · scroll · dom · registry · capability
        ├── demos/   one file per stage, each returns { destroy }
        └── styles/  tokens → base → stage composition
```

## Rules

1. **A demo never reads `matchMedia` directly.** It receives `reduced: boolean`.
   That single rule is why the reduced path can be tested at all.
2. **Every mount returns `destroy()`.** No stage may attach a listener it cannot
   remove; the motion toggle remounts everything, so leaks compound fast.
3. **Durations come from tokens, never literals.** `core/motion.ts` owns the table.
4. **Markup is readable first.** `index.html` contains the real sentences, and demos
   read their copy from the DOM, so a failed script leaves a readable page.
5. **A stage declares its question.** `core/registry.ts` refuses a stage with no
   question or no documented reduced behaviour.

## Data flow of the motion toggle

1. Click → `storeOverride()` → `applyMotion()` sets `data-motion` on `<html>`.
2. CSS token layer zeroes durations; scroll-behavior becomes `auto`.
3. `teardown()` destroys every stage and the scroll controller.
4. `mountAll()` re-creates them with `reduced = true`.
5. Demos that cannot animate render their final state immediately.

Nothing is described as reduced; it is executed as reduced.

## Testing strategy

| Layer | How |
|---|---|
| Pure logic (pacing, registry, capability, figures) | vitest unit tests |
| DOM behaviour (dial keys, split text, reveals) | jsdom |
| Whole-page wiring | integration test mounting all stages into a fixture |
| Built output | `a11y-static.mjs`, `bundle-budget.mjs` |
| Visual + real device | **not available in this environment** |
