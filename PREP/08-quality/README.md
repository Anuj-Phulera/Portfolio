# Quality and verification

The rule for this folder: **measure what can be measured, and describe honestly what cannot.**

| File | Purpose |
|---|---|
| `test-plan.md` | What will be tested, at which stage, with which method |
| `a11y-checklist.md` | Manual accessibility procedure — scope, not a compliance badge |
| `performance-budget.md` | Numeric budgets, with the reason for each number |
| `release-gate.md` | What must be true before anything is published |
| `audit-run-2026-10-21.md` | Output of the checks that actually ran |

## Tools

```bash
node tools/claims/validate.mjs      # ledger rules
node tools/claims/report.mjs        # human-readable ledger
node tools/design/contrast.mjs      # WCAG contrast for palettes
node tools/quality/audit.mjs        # banned claims, placeholders, broken links
node --test PREP/07-motion-lab/test/*.test.mjs
node --test tools/claims/test/*.test.mjs
node --test tools/design/test/*.test.mjs
node --test tools/quality/test/*.test.mjs
```

These cover documents and logic. They cannot tell you whether the future site feels right, loads fast on a real phone, or is usable with a screen reader. That requires the manual procedures in this folder and a real browser.
