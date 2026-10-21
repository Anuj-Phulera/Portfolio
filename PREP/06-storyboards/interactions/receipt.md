# Interaction spec — the receipt

**Applies to:** Direction A, and any hybrid that borrows the evidence layer.

| Field | Specification |
|---|---|
| Initial state | A superscript mark (`¹`) after a claim. 12 px, colour = accent, `aria-describedby` pointing at the evidence container. |
| Action | Click, `Enter`/`Space` when focused, or a tap on the mark. |
| Resulting state | The evidence panel expands beneath the paragraph, pushing content down (no overlay). The mark changes to `²` or a minus sign. |
| Visual feedback | Height animates 0 → auto in 220 ms, ease-out; a 1 px rule draws left-to-right in the same duration. Text fades in at 80 ms delay. |
| Keyboard | `Tab` reaches the mark; `Enter` toggles; `Esc` collapses and returns focus to the mark. |
| Touch | 44 × 44 px minimum hit area, using padding rather than enlarging the glyph. |
| Reduced motion | No height animation; panel appears instantly. No focus change. |
| Failure / fallback | If JavaScript fails, all evidence is visible inline by default (`<details>` element), styled as static notes. |
| Accessibility | Panel is a `region` with an accessible name; state exposed via `aria-expanded`; content is in the DOM before expansion for screen readers. |
| Content rules | Evidence shows: file path, commit hash, measured number, or the literal word `UNVERIFIED`. Never a paraphrase. |

## Why expansion, not a modal

A modal interrupts the reading position and hides the sentence being verified. Inline expansion keeps the claim and its evidence on screen together, which is the entire point.

## Failure mode to avoid

If every sentence has a receipt, none of them feel important. **Maximum two receipts per screen**, reserved for claims a sceptic would challenge.
