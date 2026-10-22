# 0003 — No framework, and JavaScript only where it is operated

**Status:** accepted · **Date:** 2026-10-22

## Context

`PREP/10-blueprint/tech-assessment.md` recommends Astro, with Next.js static
export as the fallback, on the grounds that the site is 80% reading. It also
warns that whichever stack is chosen must still be maintainable by one person in
a year.

Astro is the better tool for a content site. It is also a second toolchain, a
second set of conventions, and a dependency whose upgrade path has to be tracked
for a site with twelve pages.

## Decision

A Node build script renders typed content to static HTML. Vite is used for one
job: bundling the island entry and the stylesheet. No framework, no router, no
hydration.

## Why this is not just stubbornness

- Every page is complete HTML before any script runs. The index is in the
  footer, the receipts are `<details>`, the cloth is `<details>`. Nothing needs
  JavaScript to be read.
- The total JavaScript is 1.7 KB gzipped, for three instruments. A framework
  runtime would be larger than the entire remaining site.
- The build knows the claims ledger, so it can refuse to publish. A framework
  would have made that a plugin.

## Consequences

- Copy lives in TypeScript modules rather than MDX. Editing is a code change,
  which is acceptable for one author and would not be for a team.
- There is no hot reload. `npm run build` takes about a second, which is faster
  than configuring HMR for a generator that writes files directly.
- If the site grows past ~30 pages or gains a second author, this decision
  should be revisited. It is recorded here so that revisiting it is a choice
  rather than a drift.
