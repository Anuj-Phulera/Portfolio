# Adding a stage

A stage is a question with a demonstration attached. Follow this or the studio turns
into a demo reel.

## Checklist

1. **Write the question first.** One sentence, ending in a question mark. If you
   cannot write it, the stage is decoration.
2. **Decide the reduced path before the animation.** Write it in the registry entry.
3. **Create `src/demos/<id>.ts`** exporting `mountX(root, reduced)` returning
   `{ destroy() }` or `{ play() }`.
4. **Never read `matchMedia` inside the demo.** Take `reduced` as a parameter.
5. **Take durations from `core/motion.ts`.** No literals.
6. **Add markup to `index.html`** that reads correctly with JavaScript disabled.
7. **Register it** in `core/registry.ts` with a contiguous index.
8. **Write a test** in `src/test/<id>.test.ts` covering the keyboard path and the
   reduced path.
9. **Run** `bash tools/verify-all.sh --build`.
10. **Log any defect** you chose not to fix in `docs/defects.md`.

## What will be rejected in review

- A stage without a reduced path.
- A stage whose only input is a mouse.
- A stage that animates a number with no source.
- A stage that exists because a library shipped a feature.

## Naming

`demos/<id>.ts` · test `test/<id>.test.ts` · registry id `<id>` · section id `<id>`.
One name, four places, so a grep finds everything.
