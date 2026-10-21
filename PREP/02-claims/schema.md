# Claims ledger — schema

The ledger is the single source of truth for **what may be said publicly** about each project. Every factual sentence in the eventual portfolio must trace to an entry here.

## File

`ledger.json` — machine-validated by `node tools/claims/validate.mjs`, reported by `node tools/claims/report.mjs`.

## Entry

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | `CLM-NNN`, unique, stable forever (never renumber) |
| `project` | yes | slug from the list below |
| `claim` | yes | the claim as it would appear, verbatim, in the worst case |
| `source` | yes | where the claim came from (README line, UI label, resume, conversation) |
| `grade` | yes | `V` verified · `P` partial · `U` unverifiable · `A` aspirational · `X` contradicted |
| `evidence` | yes | array of file paths, commands, or observed facts; may not be empty |
| `safe_wording` | yes | the sentence actually permitted in public, at the current grade |
| `public_use` | yes | `publish` · `publish-with-caveat` · `do-not-publish` · `internal-only` |
| `attribution` | when team work | who did what, or `n/a` |
| `reviewed` | yes | ISO date of last verification |

## Grades

- **V** — confirmed by source, test, or executed command. `publish` allowed.
- **P** — partly true or partly exercised. `publish-with-caveat`, and the caveat must be visible to the reader, not only in the ledger.
- **U** — cannot be checked here. `internal-only` until lifted.
- **A** — intent only. `internal-only`. May appear as *"planned"* or *"in progress"*, never as an achievement.
- **X** — contradicted. `do-not-publish` until corrected. Fix the claim, not the code.

## Enforcement

`validate.mjs` fails the build on:

1. Missing or malformed fields, duplicate ids, unknown project slug.
2. Empty evidence.
3. `X` with anything other than `do-not-publish`.
4. `U` or `A` with `publish`.
5. A `safe_wording` containing a prohibited absolute (`live`, `real-time`, `real time`, `first`, `award-winning`, `WCAG AA compliant`, `production-ready`, `fully tested`) when the grade is not `V`.
6. Team projects without `attribution`.

These are guardrails against the exact failure mode found in the audits: documentation describing a feeling as if it were a measurement.
