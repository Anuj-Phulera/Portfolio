#!/usr/bin/env node
/**
 * Transfer budget for the generated site. gzip for text, raw for woff2, which
 * is already compressed. The budgets are self-imposed and stated on the
 * colophon page, so they have to be the same numbers in both places.
 *
 * Usage: node tools/quality/site-budget.mjs site/dist
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { gzipSync } from "node:zlib";

export const BUDGETS = {
  js: 12 * 1024,
  css: 12 * 1024,
  page: 8 * 1024,
  fonts: 40 * 1024,
  total: 100 * 1024,
};

const size = (file) => {
  const bytes = readFileSync(file);
  return extname(file) === ".woff2" ? bytes.length : gzipSync(bytes).length;
};

export function measure(root) {
  const assets = readdirSync(join(root, "assets"));
  const files = (wanted) => assets.filter((f) => extname(f) === wanted).map((f) => join(root, "assets", f));

  const js = files(".js").reduce((sum, f) => sum + size(f), 0);
  const css = files(".css").reduce((sum, f) => sum + size(f), 0);
  const fonts = files(".woff2").reduce((sum, f) => sum + size(f), 0);

  const html = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        if (name !== "assets") walk(full);
      } else if (extname(full) === ".html") html.push({ file: full, bytes: size(full) });
    }
  };
  walk(root);

  const page = Math.max(...html.map((p) => p.bytes));
  const htmlTotal = html.reduce((sum, p) => sum + p.bytes, 0);
  return { js, css, fonts, page, htmlTotal, pages: html.length, total: js + css + fonts + htmlTotal };
}

export function judge(m) {
  const checks = [
    ["js", m.js, BUDGETS.js],
    ["css", m.css, BUDGETS.css],
    ["page", m.page, BUDGETS.page],
    ["fonts", m.fonts, BUDGETS.fonts],
    ["total", m.total, BUDGETS.total],
  ];
  return checks
    .filter(([, value, budget]) => value > budget)
    .map(([name, value, budget]) => `${name}: ${(value / 1024).toFixed(1)} KB over ${(budget / 1024).toFixed(0)} KB`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = process.argv[2] ?? "site/dist";
  const m = measure(root);
  const over = judge(m);
  for (const line of over) console.error(`  ${line}`);
  console.log(
    `${m.pages} pages · js ${(m.js / 1024).toFixed(1)} · css ${(m.css / 1024).toFixed(1)} · largest page ${(
      m.page / 1024
    ).toFixed(1)} · fonts ${(m.fonts / 1024).toFixed(1)} · total ${(m.total / 1024).toFixed(1)} KB`,
  );
  process.exit(over.length === 0 ? 0 : 1);
}
