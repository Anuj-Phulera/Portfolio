# Portfolio — preparation and studio

Two workstreams, one repository.

**`PREP/`** is the argument: nine evidence-graded project audits, a 34-entry claims
ledger, attribution records, a research library, three creative directions,
storyboards, and the blueprint for the build.

**`studio/`** is the demonstration: a working motion studio built with Lenis,
anime.js and GSAP, where every stage answers a stated design question.

Nothing here is the finished portfolio. Nothing was deleted to make room for
anything else.

## Start

| If you want to… | Open |
|---|---|
| understand the whole repo | [`REPO-MAP.md`](REPO-MAP.md) |
| read the project audits | [`PREP/01-source-of-truth/index.md`](PREP/01-source-of-truth/index.md) |
| know what may be claimed publicly | [`PREP/02-claims/ledger-report.md`](PREP/02-claims/ledger-report.md) |
| compare the three directions | [`PREP/05-directions/comparison.md`](PREP/05-directions/comparison.md) |
| run the motion experiments | [`studio/README.md`](studio/README.md) |
| see the build plan and gates | [`PREP/10-blueprint/roadmap.md`](PREP/10-blueprint/roadmap.md) |

## Run everything

```bash
# checks for the preparation package
bash tools/verify-phase.sh

# the studio
cd studio && npm install && npm run dev     # http://localhost:5173
cd studio && npm test                       # unit + integration
cd studio && npm run build                  # typecheck + bundle
```

## Status

| Area | State |
|---|---|
| Source-of-truth audits | 7 repositories audited, 11 surveyed |
| Claims ledger | 34 entries, 10 blocked from publication |
| Directions | 3 written, **none approved** |
| Motion studio | 7 stages live, 25 tests passing |
| Portfolio site | **not started, by design** |
