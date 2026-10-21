#!/usr/bin/env node
/**
 * Bundle budget — a number with a reason, checked after every build.
 *
 * Budgets are taken from PREP/08-quality/performance-budget.md. The first
 * route budget there is 180 KB gzip of JavaScript; the studio has a stricter
 * self-imposed target because it ships three animation libraries.
 *
 * Usage: node tools/quality/bundle-budget.mjs studio/dist
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

export const BUDGET = {
  js: 60 * 1024,
  css: 12 * 1024,
  html: 16 * 1024,
  total: 90 * 1024,
};

export function measure(path) {
  const raw = readFileSync(path);
  return { raw: raw.length, gzip: gzipSync(raw).length };
}

export function collect(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      entries.push(...collect(full));
    } else if (/\.(js|css|html)$/.test(name)) {
      const kind = name.endsWith('.js') ? 'js' : name.endsWith('.css') ? 'css' : 'html';
      entries.push({ name: full.slice(dir.length + 1), kind, ...measure(full) });
    }
  }
  return entries;
}

export function evaluate(entries, budget = BUDGET) {
  const totals = { js: 0, css: 0, html: 0, total: 0 };
  for (const entry of entries) {
    const key = entry.kind;
    totals[key] += entry.gzip;
    totals.total += entry.gzip;
  }
  const violations = [];
  for (const key of ['js', 'css', 'html', 'total']) {
    if (totals[key] > budget[key]) {
      violations.push(`${key}: ${(totals[key] / 1024).toFixed(1)} KB exceeds ${(budget[key] / 1024).toFixed(0)} KB`);
    }
  }
  return { totals, violations };
}

if (process.argv[1]?.endsWith('bundle-budget.mjs')) {
  const dir = process.argv[2] ?? 'studio/dist';
  const entries = collect(dir);
  const { totals, violations } = evaluate(entries);
  for (const entry of entries) {
    console.log(`  ${entry.kind.padEnd(4)} ${entry.name.padEnd(34)} ${(entry.gzip / 1024).toFixed(1)} KB gzip`);
  }
  console.log(`\n  total ${(totals.total / 1024).toFixed(1)} KB gzip · js ${(totals.js / 1024).toFixed(1)} · css ${(totals.css / 1024).toFixed(1)} · html ${(totals.html / 1024).toFixed(1)}`);
  if (violations.length) {
    for (const v of violations) console.log(`  FAIL ${v}`);
    process.exit(1);
  }
  console.log('  within budget');
}
