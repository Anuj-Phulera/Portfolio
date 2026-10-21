# Known defects

Open, reproducible, and written down instead of forgotten.

| # | Where | Defect | Severity | Status |
|---|---|---|---|---|
| D1 | `demos/dial.ts` | `aria-valuenow` is set once at mount and never updated as the value changes | high — a screen reader would announce a stale value | **fixed** 2026-10-21, covered by `dial.test.ts` |
| D2 | `demos/words.ts` | Re-running the reveal on a second click restarts the animation but does not re-arm the reserved line height | low | open |
| D3 | `demos/cut.ts` | Rapid double-click on Play can leave two timelines alive for a frame | low | open |
| D4 | `demos/scrollscene.ts` | The native timeline path is untested in a real browser — only the fallback is covered | medium | blocked: no browser |
| D5 | `main.ts` | The motion toggle remounts every stage, which resets the dial to its default value | low, arguably correct | open |
| D6 | `index.html` | Fonts load from Google Fonts; a self-hosted subset would remove a third-party request | medium | open |

D1 was found while writing `docs/accessibility.md`, which is the point of writing it.
