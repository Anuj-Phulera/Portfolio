# Repository map

Three folders, three jobs. Nothing is removed when something new is added — older
material stays readable and linked.

```
Portfolio/
├── PREP/      preparation package — audits, claims, research, directions, blueprint
├── studio/    motion studio — runnable experiments with Lenis, anime.js, GSAP
├── tools/     checks shared by both: claims ledger, contrast, doc audit
└── docs/      the living creative brief
```

## What lives where

| Folder | Ask it about | Entry point |
|---|---|---|
| `PREP/` | "Is this claim true? What exists? Which direction?" | `PREP/00-start-here.md` |
| `studio/` | "How does this technique actually behave?" | `studio/README.md` → `studio/docs/` |
| `tools/` | "How is quality measured?" | `tools/verify-phase.sh` |
| `docs/` | "What did we decide, and why?" | `docs/creative-brief.md` |

## The rule

`PREP/` argues. `studio/` demonstrates. `tools/` verifies. A file belongs in the
first folder that would be damaged if it disappeared.

## Adding something

1. Put the artefact in the folder whose question it answers.
2. Add one line to that folder's README.
3. Run `bash tools/verify-all.sh` before committing.

## Studio documentation

The studio keeps its own docs so architecture decisions do not mix with portfolio
decisions: `studio/docs/architecture.md`, `stages.md`, `performance.md`,
`accessibility.md`, `defects.md`, and five ADRs in `studio/docs/decisions/`.
