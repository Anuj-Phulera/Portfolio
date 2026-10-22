# Repository map

Four folders, four jobs. Nothing is removed when something new is added — older
material stays readable and linked.

```
Portfolio/
├── PREP/      preparation package — audits, claims, research, directions, blueprint
├── site/      the portfolio itself — six entries, three operable instruments
├── studio/    motion studio — runnable experiments with Lenis, anime.js, GSAP
├── tools/     checks shared by everything: claims, contrast, links, budgets
└── docs/      the living creative brief
```

## What lives where

| Folder | Ask it about | Entry point |
|---|---|---|
| `PREP/` | "Is this claim true? What exists? Which direction?" | `PREP/00-start-here.md` |
| `site/` | "What does the portfolio say, and can I check it?" | `site/README.md` → `site/docs/` |
| `studio/` | "How does this technique actually behave?" | `studio/README.md` → `studio/docs/` |
| `tools/` | "How is quality measured?" | `tools/verify-all.sh` |
| `docs/` | "What did we decide, and why?" | `docs/creative-brief.md` |

## The rule

`PREP/` argues. `site/` publishes, under the ledger's rules. `studio/`
demonstrates. `tools/` verifies. A file belongs in the first folder that would be
damaged if it disappeared.

## Adding something

1. Put the artefact in the folder whose question it answers.
2. Add one line to that folder's README.
3. Run `bash tools/verify-all.sh --build` before committing.

## Site documentation

The site keeps its own records because its decisions are not the studio's:
`site/docs/decisions/0001-instrument-as-spine.md` (why this direction),
`0002-claims-gate-at-build.md` (why a blocked claim breaks the build),
`0003-no-framework-static-html.md` (why there is no framework), plus
`content-policy.md`, `accessibility.md` and `performance.md`.

## Studio documentation

The studio keeps its own docs so architecture decisions do not mix with portfolio
decisions: `studio/docs/architecture.md`, `stages.md`, `performance.md`,
`accessibility.md`, `defects.md`, and five ADRs in `studio/docs/decisions/`.
