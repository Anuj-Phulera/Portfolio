# Performance

## Method

`build.ts` measures the real files it just wrote: gzip for HTML, CSS and
JavaScript; raw bytes for woff2, which is already compressed. It then renders the
colophon from those measurements, so the page cannot disagree with the build.

`tools/quality/site-budget.mjs` applies the same measurement and fails when a
budget is crossed. The budgets are self-imposed and appear in both places.

| Budget | Limit | Current |
|---|---|---|
| JavaScript | 12 KB | 1.7 KB |
| CSS | 12 KB | 6.0 KB |
| Largest page | 8 KB | 4.9 KB |
| Fonts | 40 KB | 36.1 KB |
| Total, all pages | 100 KB | 81.6 KB |

## What is not in the number

- The total is the sum of 12 pages. A single visit fetches one page, the
  stylesheet, the script and two font files — about 47 KB on the home page.
- Fonts are preloaded and use `font-display: swap`. The fallback stack is system
  sans and system mono, so the first paint does not wait for either.
- No analytics, no third-party scripts, no cookies, no external requests at
  runtime. The fonts are self-hosted, latin-subset only.

## Not measured

Time to first byte, largest contentful paint, layout shift and interaction
latency were not measured, because there is no browser on this machine. Any
number quoted for those would be invented. The site states weights, not
timings, for exactly this reason.
