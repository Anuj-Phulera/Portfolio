# 0005 — Reduced motion is a path, not a switch

**Status:** accepted · **Date:** 2026-10-21

## Context

The common implementation is one global rule:

```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

It is fast to add and it breaks things: state styles that depend on transitions
freeze mid-way, scroll-linked sections lose their content, and components that were
only visible because an animation finished never appear.

## Decision

Reduced motion is a **second design of the same page**:

- durations collapse to zero through tokens, not through `!important`
- scroll-linked behaviour becomes threshold behaviour
- scrubbing becomes static content
- anything whose meaning depends on motion gets a non-motion equivalent

## Consequences

- Two paths must be maintained, and both must be tested. That cost is the point.
- The motion toggle in the header exists so the second path can be checked in one
  click rather than by changing OS settings.
- A stage that cannot describe its reduced behaviour is rejected by
  `assertRegistryIntegrity`.
