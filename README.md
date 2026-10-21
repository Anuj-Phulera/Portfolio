# Portfolio — preparation phase

This repository is **not** the portfolio. It is the groundwork the portfolio must stand on: audits, a claims ledger, attribution, research, three creative directions, storyboards, a motion lab, quality tooling, and a blueprint.

**No portfolio UI exists here, by design.** The build begins only when the readiness gates in `PREP/10-blueprint/readiness-criteria.md` are met.

## Start here

- `PREP/00-start-here.md` — map, isolation rules, evidence conventions
- `PREP/01-source-of-truth/` — what actually exists in each project
- `PREP/02-claims/` — what may be said publicly, and why
- `PREP/05-directions/` — three genuinely different directions, none approved
- `PREP/07-motion-lab/` — runnable experiments, 32 tests
- `PREP/10-blueprint/` — feasibility, roadmap, readiness, open questions

## Run the checks

```bash
node tools/claims/validate.mjs
node tools/quality/audit.mjs
node tools/design/contrast.mjs
node --test tools/claims/test/*.test.mjs tools/design/test/*.test.mjs tools/quality/test/*.test.mjs
node --test PREP/07-motion-lab/test/*.test.mjs
```

## Status

Preparation only. No pull request, merge, push, or deployment has been performed. All work is local to the preparation branch.
