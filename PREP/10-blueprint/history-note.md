# Note on the commit history

## What happened

The preparation phase was first recorded as 129 commits on `arena/e10e90bc-portfolio`. At the start of the next working session the environment re-cloned the repository: `git reflog` shows a single entry, `clone: from https://github.com/Anuj-Phulera/Portfolio.git`, and HEAD at the base commit `16fe5c9`.

**All files survived. The commit objects did not.**

## What was done

The preserved working tree was re-committed in coherent units, one per deliverable, in workstream order. The new history is real: every commit contains a file that exists, every message describes what that file does.

## What is different from the first history

| | First history | Rebuilt history |
|---|---|---|
| Commits | 129 | 111 (see `git rev-list --count 16fe5c9..HEAD`) |
| Hashes | gone | new |
| Content | same | same |
| Author | `Arena <agent@arena.ai>` | repository identity (`Anuj-Phulera`), with a `Co-authored-by: Arena Agent` trailer |
| Granularity | one commit per document or fix, including small corrections | one commit per deliverable; the intermediate fix commits no longer exist |

The earlier commits that recorded corrections found by tests — the ledger rule fix, the classifier normalisation fix, the audit false positives — are **not** recoverable as separate commits. Their content survives in the documents that describe them (`../02-claims/verification-runs.md`, `../08-quality/audit-run-2026-10-21.md`, `../07-motion-lab/findings.md`), and the fixes themselves are in the current files.

## Why this note exists

The brief required that the history be verifiable and that no count be reported without checking it. Reporting "129" after the reset would have been false. The honest number is the one you can count yourself:

```bash
git rev-list --count 16fe5c9..HEAD
git log --oneline 16fe5c9..HEAD | wc -l
```

## Consequence for GitHub

None of this has ever been pushed, so it does not appear on GitHub at all. A contribution graph counts commits pushed to a GitHub repository that are attributed to an account email and that reach the default branch or a pull request. See the phase report for the options.
