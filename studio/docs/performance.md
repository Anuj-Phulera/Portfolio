# Measured performance

All numbers below were produced by `tools/quality/bundle-budget.mjs` against
`studio/dist` in this workspace. They are gzip sizes, not Lighthouse scores.

| Asset | gzip |
|---|---|
| `index.html` | 4.1 KB |
| `assets/index-*.css` | 2.8 KB |
| `assets/index-*.js` | 44.5 KB |
| **Total** | **51.4 KB** |

Budget: js 60 KB · css 12 KB · html 16 KB · total 90 KB. Current state: within.

## What is inside the 44.5 KB

Lenis, anime.js, GSAP and roughly 1,400 lines of first-party TypeScript. That is a
deliberate trade: three animation libraries for one studio page, disclosed rather
than hidden behind “vanilla JS”.

## What this does not tell you

- **Runtime performance.** No profiling was possible; there is no browser here.
- **Device reality.** 51 KB is small, but ten mounted stages with observers is a
  different cost on a low-end Android than on a laptop.
- **INP.** Drag and dial latency are unmeasured.

The performance budget in `PREP/08-quality/performance-budget.md` is stricter for the
eventual portfolio (180 KB first-route JS) because that site will carry more content.
