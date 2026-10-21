#!/usr/bin/env bash
# Verify the preparation phase. Prints results; exits non-zero if a check fails.
set -uo pipefail
fail=0
run() {
  local name="$1"; shift
  echo "### $name"
  if "$@"; then echo "RESULT: pass"; else echo "RESULT: fail"; fail=1; fi
  echo
}

BASE="${1:-16fe5c9}"
echo "base commit: $(git rev-parse "$BASE")"
echo "head commit: $(git rev-parse HEAD)"
echo "commits in phase: $(git rev-list --count "$BASE"..HEAD)"
echo "working tree: $(git status --porcelain | wc -l) modified file(s)"
echo

run "claims ledger" node tools/claims/validate.mjs
run "documentation audit" node tools/quality/audit.mjs
run "palette contrast" node tools/design/contrast.mjs
run "claims tests" node --test tools/claims/test/rules.test.mjs
run "design tests" node --test tools/design/test/contrast.test.mjs
run "quality tests" node --test tools/quality/test/rules.test.mjs
run "motion lab tests" node --test PREP/07-motion-lab/test/pacing.test.mjs PREP/07-motion-lab/test/classify.test.mjs PREP/07-motion-lab/test/reveal.test.mjs PREP/07-motion-lab/test/motion-tokens.test.mjs PREP/07-motion-lab/test/audio-consent.test.mjs PREP/07-motion-lab/test/split-text.test.mjs

echo "### prohibited actions"
if git log "$BASE"..HEAD --oneline | grep -qiE "merge|pull request"; then
  echo "RESULT: fail — history mentions a merge or PR"
  fail=1
else
  echo "RESULT: pass — no merge commits or PR references in phase history"
fi
echo
echo "### remote state"
echo "origin/main: $(git rev-parse origin/main 2>/dev/null || echo 'unavailable')"
echo "local head:  $(git rev-parse HEAD)"
echo "ahead of origin/main by $(git rev-list --count origin/main..HEAD 2>/dev/null || echo '?') local-only commit(s)"
exit $fail
