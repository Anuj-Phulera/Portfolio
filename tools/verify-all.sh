#!/usr/bin/env bash
# One command for every check in the repository.
# Usage: bash tools/verify-all.sh [--build]
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

fail=0
step() {
  local name="$1"; shift
  printf '%-34s' "$name"
  if output=$("$@" 2>&1); then
    echo "pass"
  else
    echo "fail"
    echo "$output" | tail -12 | sed 's/^/    /'
    fail=1
  fi
}

echo "== preparation package =="
step "claims ledger"      node tools/claims/validate.mjs
step "documentation audit" node tools/quality/audit.mjs
step "palette contrast"   node tools/design/contrast.mjs
step "claims tests"       node --test tools/claims/test/rules.test.mjs
step "design tests"       node --test tools/design/test/contrast.test.mjs
step "quality tests"      node --test tools/quality/test/rules.test.mjs
step "a11y-static tests"  node --test tools/quality/test/a11y-static.test.mjs
step "budget tests"       node --test tools/quality/test/bundle-budget.test.mjs
step "linkcheck tests"    node --test tools/quality/test/linkcheck.test.mjs
step "site tool tests"    node --test tools/quality/test/site-tools.test.mjs
step "markdown links"     node tools/quality/linkcheck.mjs
step "motion lab tests"   node --test PREP/07-motion-lab/test/*.test.mjs

echo
echo "== motion studio =="
if [ -d studio/node_modules ]; then
  step "studio typecheck" bash -c 'cd studio && npx tsc --noEmit'
  step "studio tests"     bash -c 'cd studio && npx vitest run --reporter=dot'
  if [ "${1:-}" = "--build" ]; then
    step "studio build"   bash -c 'cd studio && npm run build'
    step "static a11y"    node tools/quality/a11y-static.mjs studio/dist/index.html
    step "bundle budget"  node tools/quality/bundle-budget.mjs studio/dist
  fi
else
  echo "studio/node_modules missing — run npm install in studio/ (skipped)"
fi

echo
echo "== portfolio site =="
if [ -d site/node_modules ]; then
  step "site typecheck"   bash -c 'cd site && npx tsc --noEmit'
  step "site tests"       bash -c 'cd site && npm test --silent'
  if [ "${1:-}" = "--build" ]; then
    step "site build"     bash -c 'cd site && node build.ts'
    step "site axe"       bash -c 'cd site && node scripts/axe-audit.mjs dist'
    step "site html"      bash -c 'cd site && node scripts/html-audit.mjs dist'
    step "site links"     node tools/quality/htmllinks.mjs site/dist
    step "site a11y"      node tools/quality/a11y-tree.mjs site/dist
    step "site budget"    node tools/quality/site-budget.mjs site/dist
  fi
else
  echo "site/node_modules missing — run npm install in site/ (skipped)"
fi

echo
if [ "$fail" -eq 0 ]; then
  echo "ALL CHECKS PASSED"
else
  echo "SOME CHECKS FAILED"
fi
exit "$fail"
