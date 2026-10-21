import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { BUDGET, collect, evaluate, measure } from '../bundle-budget.mjs';

test('measure reports raw and gzip sizes', () => {
  const dir = mkdtempSync(join(tmpdir(), 'budget-'));
  const file = join(dir, 'a.js');
  writeFileSync(file, 'console.log("x");'.repeat(50));
  const { raw, gzip } = measure(file);
  assert.ok(raw > gzip);
  assert.ok(gzip > 0);
});

test('collect finds nested js, css and html', () => {
  const dir = mkdtempSync(join(tmpdir(), 'budget-'));
  mkdirSync(join(dir, 'assets'));
  writeFileSync(join(dir, 'index.html'), '<!doctype html><title>x</title>');
  writeFileSync(join(dir, 'assets', 'app.js'), 'const a=1;');
  writeFileSync(join(dir, 'assets', 'app.css'), 'body{margin:0}');
  const entries = collect(dir);
  assert.deepEqual(entries.map((e) => e.kind).sort(), ['css', 'html', 'js']);
});

test('evaluate passes within budget', () => {
  const { violations } = evaluate([
    { kind: 'js', gzip: 1000 },
    { kind: 'css', gzip: 500 },
    { kind: 'html', gzip: 500 },
  ]);
  assert.deepEqual(violations, []);
});

test('evaluate fails an oversized bundle', () => {
  const { violations } = evaluate([{ kind: 'js', gzip: BUDGET.js + 1 }]);
  assert.equal(violations.length, 1);
  assert.match(violations[0], /js:/);
});

test('evaluate catches a total that exceeds even when parts pass', () => {
  const budget = { js: 100, css: 100, html: 100, total: 150 };
  const { violations } = evaluate(
    [
      { kind: 'js', gzip: 90 },
      { kind: 'css', gzip: 90 },
    ],
    budget,
  );
  assert.ok(violations.some((v) => v.startsWith('total')));
});
