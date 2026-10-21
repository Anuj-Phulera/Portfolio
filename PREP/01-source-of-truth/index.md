# Source of truth — index

One row per project. Detailed audits are in the sibling files. Grade key: **V** verified · **P** partial · **U** unverifiable here · **A** aspirational · **X** contradicted.

| Project | File | Strongest verified fact | Weakest claim | Presentation state |
|---|---|---|---|---|
| VERDE compendium | `verde-compendium.md` | 40+ components, `npm run verify` exists | "Three.js" — there is no three.js | Needs copy correction |
| VERDE OS app | `verde-app.md` | Server-side key proxy, 5 routes | Every runtime behaviour | Needs a recorded session |
| NIRMAAN app | `nirmaan-app.md` | 18 routes, three role trees | "India's first" superlative | Needs a seeded demo |
| NIRMAAN site | `nirmaan-portfolio.md` | Real R3F hero, strong content acts | 18-second loader (never existed) | Withdraw until corrected |
| SKILLVERSE | `skillverse.md` | 262 real survey responses, 34 routes | "WCAG AA compliant" | Needs a11y audit |
| RESONATE | `resonate.md` | 3 real GLSL shader pairs, 52 pages | A live experience that never deployed | Needs a public face |
| RAKSHABANDHAN | `rakshabandhan.md` | 245-line Web Audio engine; de-fabrication commit | Consent + 121 MB repo | Blocked on consent |
| STRATA | `strata.md` | 35 nodes, 79 edges, jsdom smoke test | Live URL unreachable here | Strongest, needs a README |
| VERDE previous | `verde-previous.md` | Iteration history | Superseded | Do not feature |

## What the audits collectively show

1. **Countable claims are exact.** 34 routes. 35 nodes. 79 edges. 262 responses. Every number checked was right.
2. **Experiential claims drift.** "Three.js." "Live telemetry." "18 seconds." "WCAG AA." These describe intended feeling, not shipped state.
3. **The three strongest artefacts are the ones with verification built in**: STRATA (smoke + live-check), VERDE compendium (`verify` script + final cleanup commit), SKILLVERSE (raw data preserved).
4. **The weakest public artefacts are the marketing sites**, because nobody ever tested them against their own copy.

That is the whole thesis of the eventual portfolio, and it came from reading files rather than from a conversation.
