# Phase report — preparation

**Date:** 2026-10-21
**Base commit:** `16fe5c9bef773ef6e1c1898bc9948857c83efc59`
**Head and commit count:** deliberately not hard-coded here. Each edit to this file changes them, so any pinned number would be stale the moment it is committed. The authoritative values are:

```bash
git rev-parse HEAD
git rev-list --count 16fe5c9..HEAD
git log --oneline 16fe5c9..HEAD | wc -l
```

Recorded verification output at the time of the last run is in `phase-verification.txt`, with its own head hash.

```bash
git rev-list --count 16fe5c9..HEAD
git log --oneline 16fe5c9..HEAD | head
bash tools/verify-phase.sh 16fe5c9
```

## Scope

Preparation only. No portfolio page, hero, layout, or design system was built. The repository contains documents, tooling, tests, three browser demos and a handoff.

## Deliverables by workstream

| WS | Delivered | Count |
|---|---|---|
| 1 Source of truth | Method, reproduction file, nine project audits, repository survey, identity bleed, corrections, limitations, index | 14 docs |
| 2 Claims | Schema, 34-entry ledger, validator, report generator, wording guide, contradictions register, verification log | 6 files + 2 tools |
| 3 Identity & attribution | Eight fact sheets, attribution policy, contributors and consent gaps | 10 docs |
| 4 Research | Method, eight studies, unavailable-references record, tooling measurement, 11 principles, anti-pattern catalog | 13 docs |
| 5 Directions | Frame, three full directions, comparison, typography, measured palettes, risk register, index | 8 docs |
| 6 Storyboards | Editing grammar, three openings, the middle, three endings, six interaction specs | 10 docs |
| 7 Motion lab | Six dependency-free modules, 32 tests, three runnable demos, findings | 6 modules, 6 suites, 3 demos |
| 8 Quality | Test plan, accessibility procedure, performance budget, release gate, audit run, four tools | 6 docs + 4 tools |
| 9 Assets & privacy | Inventory, licensing, needed content, dataset privacy rules | 4 docs |
| 10 Blueprint | Feasibility, roadmap, readiness, open questions, decision log, handoff, this report | 7 docs |

## Verification (executed, not asserted)

```
claims ledger        34 entries, V:14 P:4 U:7 A:1 X:8, 0 violations
documentation audit  98 files, 0 banned claims, 0 placeholders, 0 broken links
palette contrast     13 pairs, 0 failures
claims tests         10/10
design tests          5/5
quality tests         7/7
motion lab tests     32/32
merge commits         0
pushes                0
```

Full output: `phase-verification.txt`.

## Discoveries that changed the direction of the work

1. **Countable claims are exact; experiential claims are aspirational.** 34 routes, 35 nodes, 79 edges, 262 rows, 245 lines — all correct. "Three.js", "live telemetry", "18 seconds", "WCAG AA" — all unsupported. The pattern is editorial, not moral.
2. **The de-fabrication commit already exists.** On 27 August 2026, RAKSHABANDHAN replaced invented dates with `DATE: NOT RECORDED` and changed its status line from `LIVE` to `PARTIAL RECOVERY`. The portfolio's central principle is not an imposed idea; it is a documented prior decision.
3. **VERDE is two people.** `TeamSection.tsx` credits Aarav Choudhary with schematic, PCB layout, power delivery and physical build.
4. **NIRMAN's six "screenshots" are SVG illustrations** rendered to PNG by `generate-screenshots.js`, presented publicly as working interfaces.
5. **STRATA is the only artefact with verification built in** — a jsdom smoke test, a two-visitor live check, and commit messages about behaviour rather than vibes.

## Problems found by the tooling

- The claims validator initially rejected legitimate internal findings (`X` + `internal-only`); rule corrected, test added.
- The classifier's normalised scores made its own confidence threshold unreachable; rewritten to raw comparable strengths.
- Extreme dual signals produce near-ties, and the guard correctly refuses — now a permanent test.
- The document audit first reported 28 and then 19 false positives, scanning its own rule definitions and quoted claims; fixed by stripping quotations and auditing documents only.

Each of these is recorded because a check that has never failed is usually a check that does nothing.

## Blockers

| # | Blocker | Owner |
|---|---|---|
| 1 | Direction A / B / C not chosen | Subject |
| 2 | Stage/age, audience, first reader unanswered | Subject |
| 3 | Consent for RAKSHANDHAN | Subject + sister |
| 4 | Individual contributions for SKILLVERSE | Subject + teammates |
| 5 | No browser in this environment: no live site, no visual verification, no real-device performance | Environment |
| 6 | NIRMAN mockups and unlicensed avatars must be replaced or removed before any use | Subject |

## Prohibited actions — confirmed not taken

- **No PR, merge, squash, rebase, cherry-pick or integration into any branch.**
- **No push.** `origin/main` remains at `16fe5c9`; every commit is local.
- **No deployment, no remote settings changed, no history rewritten.**
- No portfolio UI was built.

## Note on the commit history

The first recording of this phase was 129 commits. At the start of the following session the environment re-cloned the repository (`git reflog`: `clone: from https://github.com/Anuj-Phulera/Portfolio.git`), discarding the commit objects while preserving every file. The history was rebuilt from the preserved working tree, one commit per deliverable. The current count is the one printed above and is verifiable with `git rev-list --count 16fe5c9..HEAD`. Details: `history-note.md`.

Consequences: the old hashes are gone, the intermediate fix commits no longer exist as commits, and the author identity is now the repository's own (`Anuj-Phulera`) with a `Co-authored-by: Arena Agent` trailer on every commit.

## Note on the working branch

The brief asked for a dedicated branch such as `prep/portfolio-foundation`. This session's branch, `arena/e10e90bc-portfolio`, is fixed by the environment and cannot be renamed or replaced. The isolation intent is met: all work is local to that branch and nothing has been pushed or merged.

## What remains unverified

- Deployment state of every project (network restriction).
- Runtime behaviour of every API-dependent project (no credentials).
- Perceived motion quality, performance on a real device, and screen-reader behaviour (no browser, no assistive tech).
- Whether any direction can be built to standard in the available time.

## Next step

The subject answers Q1–Q4 in `open-questions.md`, records the answers in `decision-log.md`, and checks `readiness-criteria.md`. Only then does Stage 1 of the roadmap begin.
