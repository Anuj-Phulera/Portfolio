# Portfolio — preparation, site, studio

Three workstreams, one repository.

**`PREP/`** is the argument: nine evidence-graded project audits, a 34-entry claims
ledger, attribution records, a research library, three creative directions,
storyboards, and the blueprint for the build.

**`site/`** is the portfolio: six entries, eight repositories, three operable
instruments, and a build that refuses to publish a claim the audit blocked.

**`studio/`** is the demonstration: a working motion studio built with Lenis,
anime.js and GSAP, where every stage answers a stated design question.

The studio is a bench for testing motion, not the portfolio. The portfolio is in
`site/`. Nothing was deleted to make room for anything else.

## Start

| If you want to… | Open |
|---|---|
| see the portfolio | `cd site && npm install && npm run build && npm run serve` |
| understand the whole repo | [`REPO-MAP.md`](REPO-MAP.md) |
| read the project audits | [`PREP/01-source-of-truth/index.md`](PREP/01-source-of-truth/index.md) |
| know what may be claimed publicly | [`PREP/02-claims/ledger-report.md`](PREP/02-claims/ledger-report.md) |
| compare the three directions | [`PREP/05-directions/comparison.md`](PREP/05-directions/comparison.md) |
| run the motion experiments | [`studio/README.md`](studio/README.md) |
| understand the site's decisions | [`site/docs/README.md`](site/docs/README.md) |
| see the build plan and gates | [`PREP/10-blueprint/roadmap.md`](PREP/10-blueprint/roadmap.md) |

## Run everything

```bash
# every check in the repository, including both builds
bash tools/verify-all.sh --build

# the portfolio site
cd site && npm install
cd site && npm run build     # 12 static pages → site/dist
cd site && npm test          # 68 tests, no browser needed
cd site && npm run verify    # typecheck, tests, build, links, a11y, budget

# the studio
cd studio && npm install && npm run dev     # http://localhost:5173
cd studio && npm test
cd studio && npm run build
```

## Status

| Area | State |
|---|---|
| Source-of-truth audits | 9 repositories audited, 11 surveyed |
| Claims ledger | 35 entries: 15 verified, 8 contradicted, 16 blocked from publication |
| Directions | 3 written; Direction C chosen, with A's receipts and B's pacing |
| Portfolio site | Built: 12 pages, 3 instruments, 68 tests |
| Motion studio | 10 stages, 49 tests, 51.4 KB gzipped |
| Deployment | Workflow ready for Pages; **not enabled**, so nothing here is live |

## The rule the site runs on

Every factual sentence that needs defending is a `receipt` with a ledger id. The
build checks each id against `PREP/02-claims/ledger.json` and stops if one is
marked *do not publish*. That is why the copy can be trusted and why the ledger
matters more than the design.
