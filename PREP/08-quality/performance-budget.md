# Performance budget

Targets for the future portfolio, chosen for a mid-range Android phone on a congested network — the realistic worst case for a school-age visitor in India.

| Metric | Budget | Why this number |
|---|---|---|
| LCP | ≤ 2.0 s (Slow 4G, 4× CPU) | A cinematic site is judged in the first two seconds; beyond that the atmosphere is lost to frustration |
| CLS | ≤ 0.05 | Reveals that reflow the page are the most common cinematic-site defect |
| INP | ≤ 200 ms | Direct manipulation (Direction C) fails visibly above this |
| First-route JS | ≤ 180 KB gzip | Enough for a small framework and one interaction layer; not enough for a 3D engine by default |
| Total fonts | ≤ 2 families, ≤ 120 KB, `font-display: swap` | Type is identity; four weights are usually enough |
| Hero media | ≤ 300 KB, explicit dimensions | No video hero without a poster and a static fallback |
| Live canvases | 1 at a time | Multiple simultaneous canvases are the fastest route to a hot phone |
| Third-party requests | 0 by default | Analytics is a decision, not a default |

## Rules

1. **Measure on a device, not a desktop.** Chrome DevTools throttling is a proxy, not a substitute.
2. **The budget is per route.** A heavy project instrument must not slow the index.
3. **Motion is not free.** A scroll listener that reads layout every frame costs more than the animation it powers; prefer `IntersectionObserver` and transforms.
4. **No library is added without a measured reason** and a recorded decision.
5. **The reduced-motion path is also the low-power path.** It should be the fastest version of the site.

## Early-warning signals

- Any route whose JS exceeds the budget before content is written.
- A layout shift when a font loads or an image arrives without dimensions.
- A scroll handler that triggers layout (`getBoundingClientRect`) inside a `requestAnimationFrame` loop.

## What will be recorded

For each milestone: the measurement device, the tool, the throttling profile, the numbers, and the route. A number without a method is not a measurement.
