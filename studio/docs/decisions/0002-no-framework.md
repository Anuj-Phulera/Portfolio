# 0002 — No UI framework in the studio

**Status:** accepted · **Date:** 2026-10-21

## Context

The subject's existing projects use Next.js and React. The studio could have used
either. It is a set of ten self-contained stages with no shared state beyond the
motion preference.

## Decision

Plain TypeScript with a small element builder (`core/dom.ts`), Vite for bundling,
and one `mount` function per stage returning `destroy()`.

## Consequences

- Production bundle is 44 KB gzipped **including** Lenis, anime.js and GSAP.
- Every stage can be mounted in jsdom for tests without a renderer.
- No component model: if the studio grows past ~15 stages, this decision should be
  revisited, because manual DOM composition stops scaling before a framework does.
- The eventual portfolio is **not** bound by this decision. It is a different
  artefact with different constraints.
