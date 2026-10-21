# Interaction spec — index and navigation

Applies to all directions. Navigation is where experimental portfolios most often fail the boring-path test.

| Field | Specification |
|---|---|
| Initial state | A visible `Contents` / `Index` affordance in the same position on every screen. In A it is the page itself; in B a side ruler plus a contents link; in C the tool rail. |
| Action | Click / `Enter` opens the index; `Esc` closes; `M` toggles where it does not conflict with assistive tech. |
| Resulting state | A full list of destinations with status labels (`BUILT`, `PARTIAL`, `UNBUILT`, `WITHDRAWN`) and one-line descriptions. Never icon-only. |
| Feedback | Current location marked with text, not colour alone. |
| Keyboard | Roving focus; `Home`/`End`; focus returns to the trigger on close. |
| Touch | Full-width rows, 48 px minimum. |
| Reduced motion | Index opens instantly; no staggered items. |
| Failure / fallback | The index exists as static HTML in the footer of every page, so it is reachable with JS disabled. |
| Accessibility | Landmark `nav` with `aria-label="Contents"`; skip link first in DOM; current page via `aria-current`. |

## Rules

1. **Never hide the way out.** Immersive chapters still expose the index.
2. **No mystery-meat icons.** Every control has a text label or an accessible name visible on focus.
3. **Three actions maximum to reach any project** from any page.
4. **The browser back button must work.** Every state that matters is a URL.
5. **No scroll-jacking that breaks `Ctrl+F`.** If the content is in the DOM, find must be able to reach it.

## The 90-second test

From arrival, a first-time visitor on a phone must be able to reach a named project and read one true sentence about it within 90 seconds, without discovering any hidden interaction. Run this test at every milestone.
