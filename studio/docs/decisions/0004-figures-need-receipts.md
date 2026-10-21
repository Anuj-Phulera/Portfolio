# 0004 — A figure without a source throws

**Status:** accepted · **Date:** 2026-10-21

## Context

The preparation package found that every countable claim in the subject's projects
was accurate while experiential claims drifted. Animated statistics are the easiest
place to lose that discipline: a number counting up reads as measured even when it
was typed in.

## Decision

`demos/counter.ts` validates every figure at mount. It requires a finite value, a
source string and a commit sha for when it was measured. Anything else throws.

## Consequences

- "10× faster" cannot be added without inventing a commit, which is harder to do by
  accident than adding a number.
- The validation is a runtime throw, so it also protects the production page.
- It does not prove the number is correct — only that it claims a provenance. The
  claims ledger remains the authority for correctness.
