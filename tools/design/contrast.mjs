#!/usr/bin/env node
/**
 * WCAG 2.1 contrast utility.
 *   node tools/design/contrast.mjs            -> check PREP/05-directions/palettes.json
 *   node tools/design/contrast.mjs --json     -> machine-readable output
 * Exits 1 if any pair fails its stated threshold.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function hexToRgb(hex) {
  const h = hex.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`invalid hex: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}

export function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Round to two decimals without floating-point noise. */
export const round2 = (n) => Math.round(n * 100) / 100;

const isCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCli) {
  const path = resolve('PREP/05-directions/palettes.json');
  const data = JSON.parse(readFileSync(path, 'utf8'));
  const results = [];
  let failures = 0;

  for (const [name, palette] of Object.entries(data.palettes)) {
    for (const pair of palette.pairs) {
      const ratio = round2(contrastRatio(pair.fg, pair.bg));
      const pass = ratio >= pair.min;
      if (!pass) failures++;
      results.push({ palette: name, ...pair, ratio, pass });
    }
  }

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ results, failures }, null, 2));
  } else {
    for (const r of results) {
      const mark = r.pass ? 'PASS' : 'FAIL';
      console.log(`${mark}  ${r.palette.padEnd(10)} ${r.fg} on ${r.bg}  ${String(r.ratio).padStart(5)}:1  (min ${r.min})  ${r.role}`);
    }
    console.log(`\n${results.length} pairs, ${failures} failure(s).`);
  }
  process.exit(failures ? 1 : 0);
}
