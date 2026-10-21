# 0001 — Pacing is computed before the animation exists

**Status:** accepted · **Date:** 2026-10-21

## Context

The first version of the cut demo set durations inline in a GSAP timeline. Reviewing
it meant watching the animation and adjusting numbers by feel, and two shots could
quietly be given a 600 ms "cut" that read as lag.

## Decision

Shots are declared as data (`{ hold, transition }`), validated by `core/pacing.ts`,
and only then executed by GSAP. A transition above 200 ms is classified as a dissolve;
above 1200 ms it throws.

## Consequences

- Wrong timing fails at construction, not in review.
- The same schedule drives the reduced-motion path, so the two cannot drift.
- Adding a shot means editing data, not animation code.
- The model does not know about easing or easing curves; that stays GSAP's job.
