# Interaction spec — the door (Direction B)

| Field | Specification |
|---|---|
| Initial state | The final room shows a closed door, 55% viewport height, light escaping at the edges. A single line below: `The next room is being built.` |
| Action | Normal scroll. No click required, no drag. |
| Resulting state | Over the last 40% of the room's height, the light at the edges intensifies and the door's perspective shifts 4% — it never opens. At 100%, a contents panel fades in. |
| Feedback | A thin progress hairline in the door frame, 1 px, amber. |
| Keyboard | `PageDown`/arrows scroll normally; the effect is tied to scroll position, so keyboard users see the same change. `Home`/`End` work. |
| Touch | Native scroll momentum; no custom easing that fights the platform. |
| Reduced motion | Static closed door, no light change; the contents panel is visible immediately. |
| Failure / fallback | Without JS, the door is a still image and the contents panel is a plain list of links. |
| Accessibility | The door is decorative (`aria-hidden`); the sentence and links carry all meaning. Contrast of the line is ≥ 4.5:1 against the darkest part of the light. |
| Performance | Light is a CSS radial gradient plus one blended noise layer; no video, no WebGL. |

## Why the door does not open

Opening it would satisfy the wrong desire. The portfolio's argument is that the next thing is being built — showing a finished room beyond the door would contradict the entire premise. The refusal is the design.
