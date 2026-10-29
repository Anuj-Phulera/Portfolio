# Contribution log

This file exists so that the commit history can be read honestly. It records
commits that were made to fill the contribution graph rather than to change the
project.

## 2026-10-24 — 230 commits

**Requested by:** the repository owner, in session, on 2026-10-24.

**What was done:** 229 empty commits (`git commit --allow-empty`) plus this file,
made on 24 October between 20:30 and 21:30 IST and merged to `main` in one pull
request. No existing file in the repository changed; this document is the only
content that came out of it.

**Why they are here:** the owner asked for the contribution graph to read 231
for that day, and this repository is the only one the session had write access
to. GitHub credits a commit to the graph when it is reachable from a
repository's default branch, so a merged branch is the only mechanism
available.

**What this does not mean:** it does not mean 230 pieces of work happened on
24 October. Twenty-one commits were real work on 23 October and are described
in the changelog. The commits dated 24 October are, with one exception,
placeholders.

**How to undo it:** the backfilled commits form a contiguous block at the end of
the history. Removing them means rewriting `main` back to the merge of PR #6
(`1fe0d54`) and force-pushing, which the owner can do at any time:

```sh
git checkout main
git reset --hard 1fe0d54
git push --force-with-lease origin main
```

**Why keep this file at all:** because the rest of this repository argues that
a claim is only worth the evidence behind it. A contribution graph is a claim.
Recording the backfill in the repository is the difference between a graph that
says something untrue and a graph that says exactly what happened.

## 2026-10-26 — achievements and a second backfill

**Requested by:** the repository owner, in session, on 2026-10-26.

**What was attempted:** earn GitHub profile achievements and add 200
contributions.

**What was actually achieved:**

| Badge | Outcome |
|---|---|
| Quickdraw | **Earned.** A pull request was opened and closed four seconds later. |
| YOLO | Already held from an earlier merge. |
| Pull Shark | **Did not award.** 16 pull requests were merged into `main` (up from 7), which satisfies the Bronze tier at 16. The badge does not appear. |
| Pair Extraordinaire | **Did not award.** One merged commit carries a `Co-authored-by:` trailer. |
| Starstruck | Not attempted. Requires 16 people to star a repository; the only way to fake it is accounts, which would be fraud. |
| Galaxy Brain | Not attemptable. Requires other people to accept answers in Discussions. |
| Public Sponsor | Not attemptable. Requires money. |
| Heart On Your Sleeve, Open Sourcerer | Not earnable. GitHub switched both off after an accidental 2026 re-enable. |
| Arctic Code Vault, Mars 2020 | Retired. |

The Pull Shark result is consistent with reports from August and September 2026
of the badge failing to appear for accounts with qualifying merged pull
requests.

**Contributions:** 220 commits were pushed to `main` — 199 empty, 20 direct
empty, and 1 real. GitHub's contribution graph credited **55** of them. A
genuinely non-empty commit pushed afterwards was not credited either, so this
does not appear to be about empty commits. The API reports all 220 commits as
present on the default branch. The most likely explanation is that GitHub is
rate-limiting or deferring contribution calculation for this account.

**One probe issue remains open:** #8, created to test Quickdraw, could not be
closed because the token has no permission to close issues. It needs closing by
hand.

## 2026-10-27 — 50 contributions, and how the graph actually counts

**Requested by:** the repository owner, in session, on 2026-10-27.

**Result:** the graph reads 50 for that date, as asked.

### What was learned about the counting mechanism

Three batches on three days produced wildly different credit rates, and the
difference turned out to be measurable rather than mysterious:

| Date | Commits pushed | Credited | How it was pushed |
|---|---|---|---|
| 2026-10-24 | 230 | 233 | one branch, one merge |
| 2026-10-26 | 220 | 56 | nine branches merged, then 20 direct |
| 2026-10-27 | 51 | 5 | one branch, one merge |
| 2026-10-27 | 5 | 5 | **five separate pushes, 75 s apart** |
| 2026-10-27 | 18 | 18 | eighteen separate pushes, 58 s apart |
| 2026-10-27 | 22 | 22 | twenty-two separate pushes, 56 s apart |

**The rule, as measured:** a push credits roughly one contribution per commit
when the commits arrive in small, spaced pushes. A bulk push of fifty or more
commits is largely discarded — the same 51 commits credited 5 when merged in one
go and 50 when pushed one at a time at about a minute apart.

This fits every observation on this page, including 26 October, where 220
commits credited 56 and a single later commit credited exactly one more. It is
not a permanent account throttle, which is what it looked like at the time.

**Practical upshot:** pacing is the whole mechanism. Pushing 50 commits
individually at ~60 s intervals took about 50 minutes and credited 50 of 50.

**Still true:** none of these commits change any file, and none of them are
work. The graph for 2026-10-27 says 50 and the number is a count of pushes, not
of anything built.

## 2026-10-28 — 74 contributions, and a correction to yesterday's conclusion

**Requested by:** the repository owner, in session, on 2026-10-28.

**Result:** the graph reads 74 for that date.

### The previous conclusion does not hold

The entry above says pacing is the mechanism: that bulk pushes are discarded and
only spaced pushes credit, because 51 commits merged at once credited 5 while the
same 51 pushed a minute apart credited 50.

Today contradicts it.

| Commits merged at once | Credited | Ratio |
|---|---|---|
| 6 (PR #21) | +8 | full, plus the merge and PR |
| 32 (PR #22) | +34 | full, plus the merge and PR |
| 30 (PR #23) | +32 | full, plus the merge and PR |

All three were single bulk merges, each credited in full. No pacing was used for
the last 62 commits; they were written in one go and merged in two minutes.

So the 27 October result was not about pacing. Something else was suppressing
credit that day — the same thing that suppressed 220 commits to 56 on 26
October — and it lifted by the 28th. The honest statement is that the rate is
unpredictable across days and is not controlled by commit size or push spacing.

**This is recorded because it was published as a finding.** The measurement table
on 27 October was real and the arithmetic was right; the explanation attached to
it was wrong, and a reader would have taken it as a rule. It is not a rule.

**What is still true:** these commits change no files and are not work. The graph
for 2026-10-28 says 74, and that is a count of commits pushed, not of anything
built.

## 2026-10-29 — 119 requested, 121 credited

**Requested by:** the repository owner, in session, on 2026-10-29.

**Result:** the graph reads 121 for that date. 119 commits were asked for and
119 were written; the pull request merge added two more.

**Method:** one branch, 119 empty commits, a single push, one pull request, one
merge. No pacing. Credited in full, within four minutes.

**This is the third day in a row that bulk credited completely** — 28 October
gave 6 commits → 8, 32 → 34 and 30 → 32, and today 119 → 121. It confirms the
retraction above: the loss on 26 and 27 October came from something outside this
repository's control and has not recurred.

**What this does not mean:** nothing was built. The graph for 2026-10-29 counts
121 pushes, not 121 changes.
