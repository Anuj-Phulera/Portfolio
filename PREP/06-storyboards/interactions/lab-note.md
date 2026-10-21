# Interaction spec — the lab note (the back of the object)

**Applies to:** Direction C; adaptable to A as a footnote panel.

| Field | Specification |
|---|---|
| Initial state | A tab on the instrument's edge, labelled `LAB NOTE`, always visible (never hover-only). |
| Action | Click / tap / `Enter` on the tab, or the `?` key while the instrument has focus. |
| Resulting state | The instrument rotates 12° on Y and a panel slides 16 px into view beside it; the instrument's controls become inert (`aria-hidden` off, pointer-events none). |
| Content | 3 lines: **what is real**, **what is simplified**, **what is mocked**, plus file path and commit. |
| Feedback | The tab stays anchored; a hairline connects tab to panel. Closing returns focus to the tab. |
| Keyboard | `Esc` closes; focus trap inside the panel while open; `Tab` cycles the three lines and the repository link. |
| Touch | 44 px tab; panel becomes a bottom sheet on < 640 px, occupying max 60vh. |
| Reduced motion | No rotation; panel crossfades in 120 ms. |
| Failure / fallback | Without JS, the lab note is rendered beneath the instrument as visible text. |
| Accessibility | Panel is a `dialog` with `aria-labelledby`; the rotation is decorative and hidden from AT. |
| Tone | Plain, specific, unembarrassed. "The pump is simulated from a recorded fixture; the board is not connected." |

## Why this is the most important interaction in Direction C

It converts a toy into an artefact. A visitor who flips the instrument learns that the author is not pretending — and that single moment does more for credibility than any amount of copy.
