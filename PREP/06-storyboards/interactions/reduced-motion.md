# Interaction spec — the reduced-motion path

Not a global switch. A designed version of the experience with the same content, the same hierarchy, and no travel.

## What must be removed

| Pattern | Reduced-motion replacement |
|---|---|
| Parallax layers | Static layered composition |
| Pinned scroll sequences | Normal document flow with the same sections |
| Scene crossfades > 200 ms | Instant cut or 120 ms opacity |
| Spring/overshoot feedback | Linear 120 ms state change |
| Autoplaying idles (Direction C) | A static still with a `Run` button |
| Rotating/flipping objects | Crossfade content swap |
| Cursor-following effects | Removed entirely |
| Scroll-linked scrubbing | Threshold-triggered show/hide |

## What must never be removed

- Content and its order.
- Status stamps, receipts, lab notes.
- The escape hatches.
- Focus indicators.
- The ability to reach any project in one or two actions.

## Implementation rules

1. Read the query once, at the root, and expose it as a data attribute — but also respond to live changes (`matchMedia().addEventListener`).
2. Never use `animation: none !important` globally; it breaks state styles and leaves components visually stuck.
3. Motion durations live in tokens (`--dur-fast`, `--dur-scene`), so the reduced path can zero them without touching component CSS.
4. Test by enabling the OS setting and walking every interaction; a screenshot is not a test.

## Copy rule

The reduced-motion version must not apologise or announce itself. It is simply the experience, for that visitor, with no second-class language.
