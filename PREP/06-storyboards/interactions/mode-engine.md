# Interaction spec — the mode engine (STRATA miniature)

**Applies to:** Direction C, instrument 1.

| Field | Specification |
|---|---|
| Purpose | Demonstrate the adaptation thesis without requiring a full STRATA install: three sample objects, three layouts, a visible read, and a pin. |
| Initial state | One layout active (Constellation). A read-out shows `READ: — · MODE: CONSTELLATION · GEN 1`. Three objects visible. |
| Inputs | Pointer travel speed, click count, dwell time per object, return visits. All computed locally; nothing leaves the page. |
| Decision rule | Change mode only when confidence ≥ 0.65 **and** margin over runner-up ≥ 0.15, and no more than once every 9 s. Otherwise stay and say so. |
| Action | Any of the above; no explicit "change layout" button. A visible `Why?` explains the current read. |
| Resulting state | Layout changes with a 600 ms crossfade + position interpolation. Read-out updates to `GEN 2`. A one-line explanation appears for 4 s. |
| Feedback | The read-out is always visible. A small dot pulses once when a change is permitted. |
| Keyboard | The three objects are buttons in a roving tabindex list; `1/2/3` opens an object; `P` pins the current mode; `R` resets the read. |
| Touch | Tap to open; horizontal drag to signal "skimming" (velocity sampled); long-press for the explanation. |
| Reduced motion | Layout swaps instantly; no interpolation; the explanation becomes a static line. |
| Failure / fallback | If `prefers-reduced-motion` or low-power mode, the engine starts pinned and offers `Auto-arrange` as an explicit button. |
| Accessibility | Mode changes announced via `aria-live="polite"`. Focus is never lost. Reading order follows the active layout's DOM order. |
| Honesty | The engine is a **reduced model**. The lab note states this and links to the real repository. |

## The rule that must survive simplification

The five constraints from STRATA: evidence threshold, margin over runner-up, rate limit, explanation, pin. A version that only "changes layout when you click fast" is a gimmick and must not ship.
