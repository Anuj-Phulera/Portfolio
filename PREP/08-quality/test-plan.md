# Test plan (for the future site)

Nothing here has been executed against a portfolio, because no portfolio exists yet. This is the plan the build must satisfy.

## 1. Automated checks (run on every commit)

| Check | Tool | Pass criterion |
|---|---|---|
| Claims | `tools/claims/validate.mjs` | 0 violations |
| Docs hygiene | `tools/quality/audit.mjs` | 0 banned claims, 0 placeholders, 0 broken links |
| Colour | `tools/design/contrast.mjs` | All pairs ≥ their stated threshold |
| Motion logic | `PREP/07-motion-lab` tests | 32/32 |
| Unit tests (site) | project test runner | 100% pass, no skipped tests without a linked issue |
| Type check | `tsc --noEmit` | 0 errors |
| Build | production build | succeeds, no warnings treated as acceptable by default |
| Links (built site) | link checker | 0 internal 404s |

## 2. Manual checks (before each milestone)

| Area | Procedure | Pass criterion |
|---|---|---|
| Keyboard | Tab through every route; no mouse | Every interactive element reachable, visible focus, no traps, order logical |
| Screen reader | One pass with NVDA or VoiceOver | Headings form an outline; images have text alternatives; state changes announced |
| Reduced motion | OS setting on; walk every route | No parallax, no pinned sequences, all content present |
| Zoom | 200% and 400% | No loss of content or function; no horizontal scroll for text |
| Mobile | 360, 390, 430 px widths | First real fact within one screen; no hover-only affordances |
| Slow network | Slow 4G + 4× CPU throttle | Usable before the full experience loads; no blank screen > 1 s |
| Sound | Fresh profile, no gesture | Silence. After enabling: mute persists, tab blur pauses |
| JS disabled | Block JavaScript | Content and links readable; no layout collapse |
| Content | Read every page aloud | No claim without a ledger entry; attribution present; status visible |

## 3. What is explicitly not claimed

- No WCAG conformance level until an independent audit is performed and its scope stated.
- No performance score until measured on a real device with a documented method.
- No browser compatibility claim beyond the tested matrix.

## 4. Test data

- No production credentials in any test.
- Survey data: aggregates only, generated from the CSV by a documented script; raw file never committed to the portfolio repository.
- Screenshots: captured from real builds; any illustrative render labelled as such.

## 5. Regression policy

A bug that reaches a milestone review gets a test **or** a documented manual check that would have caught it. If neither is possible, it gets a written note explaining why — the same standard the audits applied to the source projects.
