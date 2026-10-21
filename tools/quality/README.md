# Quality tools

| Tool | Checks | Tests |
|---|---|---|
| `audit.mjs` | banned claims, placeholders, broken relative links in docs | `test/rules.test.mjs` |
| `a11y-static.mjs` | lang, title, single h1, heading order, img alt, control names, tabindex | `test/a11y-static.test.mjs` |
| `bundle-budget.mjs` | gzip sizes against documented budgets | `test/bundle-budget.test.mjs` |
| `linkcheck.mjs` | markdown links and heading anchors across the repo | `test/linkcheck.test.mjs` |

Run everything with `bash tools/verify-all.sh --build`.

## What these are not

- Not a WCAG audit. `a11y-static` catches cheap structural failures only.
- Not Lighthouse. Budgets measure transfer size, not runtime cost.
- Not a claim that the docs are true. They check consistency, not correctness.

## Adding a tool

1. Pure functions exported, CLI guarded by `process.argv[1]`.
2. A test file that covers the failing case first.
3. One row in the table above.
