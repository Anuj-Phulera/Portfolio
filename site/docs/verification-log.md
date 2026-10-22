# Verification log

What has actually been run, on what, with what result. Newest first.

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
