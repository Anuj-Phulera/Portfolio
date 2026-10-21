# Accessibility in the studio

Scope: the ten stages in `studio/`. This is **not** a WCAG conformance claim.

## Implemented

| Area | Implementation | Verified by |
|---|---|---|
| Reduced motion | One resolver, token layer, real remount | `motion.test.ts`, integration test |
| Keyboard | Dial arrows/Home/End, buttons are buttons, visible focus | `dial.test.ts` |
| Names | Every control has text or `aria-label` | `a11y-static.mjs` (0 findings) |
| Text animation | One accessible copy, visible split is aria-hidden | `app.test.ts` |
| Sound | Cannot start without a gesture; stops on blur | manual + architecture |
| Skip link | First focusable element | `a11y-static.mjs` |

## Not implemented, deliberately

- The scroll-driven demo relies on CSS; under reduced motion it uses a reveal.
- There is no screen-reader pass. None is possible here: no browser, no AT.
- Focus management inside the dial is basic; it does not implement `aria-valuenow`
  updates on the underlying input beyond value mirroring.

## Known gaps

1. `aria-valuenow` is set on the track as a static attribute at mount; it should be
   updated on every change. Filed as a real defect, not a styling note.
2. The parallax stage has no equivalent for keyboard users beyond being static —
   acceptable because it conveys no information.
3. Colour contrast is checked for palette pairs, not for every rendered element.

## The rule

A checklist with unchecked boxes is honest. A badge without a procedure is not.
