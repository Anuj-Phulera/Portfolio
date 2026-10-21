# Verification runs

A log of commands actually executed in this workspace, with their results. If a command is not listed here, its result is not claimed anywhere in this package.

## 2026-10-21 — ledger toolchain

```console
$ node --test tools/claims/test/rules.test.mjs
# tests 10
# pass 10
# fail 0

$ node tools/claims/validate.mjs
entries: 32  V:14  P:4  U:6  A:1  X:7
do-not-publish: CLM-002, CLM-003, CLM-010, CLM-011, CLM-012, CLM-017, CLM-021, CLM-032
OK — all entries satisfy the ledger rules.
```

Note: `node --test tools/claims/test/` (directory form) failed under Node 22.22.3 with an `ERR_TEST_FAILURE` wrapper; running the file path directly passes 10/10. Recorded rather than hidden.

## 2026-10-21 — repository checks

```console
$ git ls-tree -r --name-only HEAD | grep -c 'app/.*page\.tsx$'   # S2S → 34
$ grep -cE "^\s+id: '" <NODES range of graph.ts>                  # WEBE → 35
$ grep -cE "from: '" graph.ts                                     # WEBE → 79
$ git show HEAD:SUBMISSION_PACK/...csv | wc -l                    # S2S → 263 lines (262 data + header)
$ git show HEAD:app/audio.js | wc -l                              # Rakshbandhan → 245
$ git log -p -- GenesisLoader.tsx | grep 'duration ='             # 5000 once, 4500 twelve times
```

## 2026-10-21 — what was *not* run

- No `npm install` or build in any source repository. No test suite from any project was executed.
- No browser, no screenshot, no live URL fetch. All runtime claims remain **U**.

## Standing instruction

Every future claim upgrade (U → V) must add a line here with the command and the output that justifies it.
