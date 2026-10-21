# 0003 — Lenis is opt-in, and the fallback is the default

**Status:** accepted · **Date:** 2026-10-21

## Context

Smooth scrolling changes the feel of the entire document. It also interferes with
keyboard paging, find-in-page and reduced-motion expectations if applied blindly.

## Decision

`core/scroll.ts` returns a real Lenis controller only when motion is allowed. Under
reduced motion it returns a no-op controller that uses native scrolling. Anchor links
are intercepted only in the Lenis path; without it, the browser handles them.

## Consequences

- Reduced motion gets native scroll velocity, which is what those readers asked for.
- The progress readout reports which controller is active, so the claim is checkable.
- The exit condition is trivial: delete one import.
