# PREP — portfolio foundation package

**Purpose:** everything that makes the eventual portfolio defensible, before a single line of portfolio code exists.
**Status:** preparation only. No portfolio UI, no homepage, no final creative direction is approved.
**Branch:** `main` (this package was merged; see "Where this lives" below).

---

## Where this lives

- This package was merged into `main` and is part of the published repository. The isolation described when these files were first written no longer applies, and the note that said nothing had been pushed was true when written and has not been since.
- Experimental code still lives in `PREP/07-motion-lab/` and `tools/`, separate from the portfolio application in `site/`.
- Cloned source repositories used as evidence sit in `.sources/` (git-ignored, reproducible from `01-source-of-truth/reproduce.md`).
- The branch that carried the original preparation work is kept as a historical record alongside `main`.

## Reading order

| # | Folder | Answers |
|---|---|---|
| 01 | `01-source-of-truth/` | What actually exists in each project, verified against source |
| 02 | `02-claims/` | Which claims can be made publicly, with what wording and what evidence |
| 03 | `03-projects/` | What each project is for, who it is for, who built which part |
| 04 | `04-research/` | What specific design decisions elsewhere are worth learning from |
| 05 | `05-directions/` | Three genuinely different creative directions, none approved |
| 06 | `06-storyboards/` | Opening, middle, ending and interaction specifications |
| 07 | `07-motion-lab/` | Runnable experiments answering specific motion questions |
| 08 | `08-quality/` | Measurable quality criteria, checklists and scripts |
| 09 | `09-assets/` | What content exists, what must be made, what must never be published |
| 10 | `10-blueprint/` | The handoff, the roadmap, and the criteria for starting the build |

## Conventions used everywhere

**Evidence grades** (defined in `01-source-of-truth/00-method.md`):
`V` verified in source or by executed test · `P` partially verified · `U` unverified · `A` aspirational/intent only · `X` contradicted by evidence.

**Rule of the package:** a claim without a grade does not exist. If a claim cannot be checked, it is recorded as `U` with the reason, not quietly dropped.

## What this package deliberately does not contain

- No portfolio layout, hero copy, or visual identity decision.
- No invented metrics, testimonials, awards, screenshots, or user numbers.
- No generated "screenshots" of anything. Where a screen capture is needed, `09-assets/needed.md` specifies what must be captured from a real running build.
