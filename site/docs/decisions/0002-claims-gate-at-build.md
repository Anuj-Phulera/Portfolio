# 0002 — A blocked claim should break the build

**Status:** accepted · **Date:** 2026-10-22

## Context

`PREP/02-claims/ledger.json` grades 34 claims and marks 16 of them as not
publishable. A judgement recorded in a JSON file is easy to ignore six weeks
later, and the audit's central finding was exactly that: good intentions,
written down, did not survive contact with a deadline.

## Decision

Content does not contain prose facts. It contains `receipt` blocks with claim
ids, and the build enforces three rules:

1. the id exists;
2. its `public_use` is `publish` or `publish-with-caveat`;
3. no blocked claim's text appears anywhere in the output.

Failures stop the build with the offending ids. The check runs before anything
is written to `dist/`.

## Consequences

- Writing copy requires looking up a claim, which is slower and better.
- Some sentences cannot be published at all, which is the point. The NIRMAAN
  entry describes *that the claim was false* without repeating it as a claim.
- The ledger instrument had to change: it now prints `safe_wording` for blocked
  entries and labels them "not published as written". The first build failed on
  this, which is the check doing its job on its own author.

## Known limit

The gate checks citations, not prose. A sentence with no receipt can still be
wrong. The mitigation is structural rather than automatic: every entry is
written from `PREP/03-projects/fact-sheets/`, and the audit in
`tools/quality/audit.mjs` catches banned vocabulary, not falsehood.
