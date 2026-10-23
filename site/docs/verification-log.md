# Verification log

What has actually been run, on what, with what result. Newest first.

## 2026-10-23 — the browser suite moves to CI

The machine that builds this has no browser and cannot download one. GitHub's
runners do, so `site/tests/browser/` runs there on every push.

| Check | Scope |
|---|---|
| `routes.spec.ts` | 11 routes: status, title, one `h1`, no console errors, no failed requests |
| `layout.spec.ts` | horizontal overflow, shell containment, measure ≤ 72em, sticky header, hero above the fold on a phone |
| `a11y.spec.ts` | full axe ruleset in Chromium (colour contrast included), skip link, control names, focus ring |
| `instruments.spec.ts` | mode engine, pin, dial from the keyboard, ledger filter, cloth |
| `motion.spec.ts` | `prefers-reduced-motion: reduce` — no idle cycle, nothing hidden, all durations `0ms` |
| `print.spec.ts` | chrome hidden, content kept, background white |
| `shots.spec.ts` | 7 pages × 2 viewports + reduced motion + print, uploaded as an artifact |

## 2026-10-23 — the survey count, re-derived

| Check | Result |
|---|---|
| `python3 csv.DictReader` over the submission CSV | **255 records, 254 respondents** |
| physical lines | 264 |
| submission dates | 2026-04-04 → 2026-07-03 |
| ledger said (CLM-016) | 261 responses, "262 lines including header" |

Eight embedded newlines inside quoted free-text answers made a line count
overstate the record count. CLM-035 records the corrected figure and the method;
CLM-016 stays as written, because deleting the record of a mistake is how the
mistake becomes invisible.

## 2026-10-23 — external links

| Check | Result |
|---|---|
| `scripts/external-links.mjs` | 9 external links, **9 broken** → fixed → 0 broken |
| `scripts/axe-audit.mjs` | 12 pages, 0 violations, 376 checks passed |
| `scripts/html-audit.mjs` | found 24 inline styles + 12 lowercase doctypes → fixed → 0 errors |

The external link check found that **eight of nine repository links returned
404**: the entries pointed at the newer account, while the work is hosted on the
older one. CLM-032 in the ledger had already recorded this migration problem; the
site had not applied its own finding to itself.

## 2026-10-23 — the shaders, read against the sentence

| Check | Command | Result |
|---|---|---|
| Shader audit | `node scripts/resonate-shaders.mjs <dir>` | 6 files, 276 lines, 189 non-blank, 76 vendored |
| Shader audit tests | `node --test scripts/resonate-shaders.test.mjs` | 11 passing |
| Data guards | `node --test src/content/data/resonate-shaders.test.ts` | 8 passing |
| Site typecheck | `npx tsc --noEmit` | clean |
| Site tests | `npm test` | 102 passing |
| Site build | `node build.ts` | 12 pages, 89.2 KB |

What the audit found, and why it is in the log rather than only in the entry:

| File | Lines | Vendored | Written here |
|---|---|---|---|
| neural.vert | 132 | 74 | 24 |
| singularity.vert | 76 | 2 | 43 |
| glass.frag | 32 | 0 | 20 |
| singularity.frag | 13 | 0 | 8 |
| glass.vert | 12 | 0 | 10 |
| neural.frag | 11 | 0 | 8 |

The 76 vendored lines are Ashima Arts and Stefan Gustavson's MIT-licensed
`webgl-noise`. No file in the repository carries their notice. `neural.frag`
and `singularity.frag` are 88% identical by longest common subsequence of
non-blank lines. `singularity.vert` defines `permute` and `taylorInvSqrt` and
calls neither.

CLM-020 was graded verified on the strength of the files existing under those
names. It is now graded partial: the word "custom" was never checked.
CLM-036 records the measurements.

Two bugs in the audit script itself were found by its own tests and fixed
before the numbers were used: a one-line function containing a semicolon did not
match the definition pattern, and `main` was reported as an unused helper.

## 2026-10-22 — scripted, no browser

| Check | Command | Result |
|---|---|---|
| Site typecheck | `npx tsc --noEmit` | clean |
| Site tests | `npm test` | 68 passing |
| Site build | `node build.ts` | 12 pages |
| Internal links | `node tools/quality/htmllinks.mjs site/dist` | 12 pages, 0 broken |
| Static accessibility | `node tools/quality/a11y-tree.mjs site/dist` | 0 findings |
| Transfer budget | `node tools/quality/site-budget.mjs site/dist` | 82.9 KB total |
| Whole repository | `bash tools/verify-all.sh --build` | all checks passed |
| Subpath build | `SITE_BASE=/Portfolio/ node build.ts` | links rebased, canonical absolute |

Not run: anything in `docs/checklist.md`. There is no browser on the build
machine, so layout, focus order, reduced motion and print remain unverified.

## 2026-10-21 — studio and repository

| Check | Result |
|---|---|
| Studio typecheck, 49 tests, build | pass, 51.4 KB gzip |
| Markdown links (99 files) | 0 broken |
| Palette contrast (13 pairs) | 0 failures |
| Claims ledger (34 entries) | valid |
