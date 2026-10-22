#!/usr/bin/env node
/**
 * Run the existing static accessibility checks over every HTML file in a
 * built directory. The rules live in a11y-static.mjs; this only walks.
 *
 * Usage: node tools/quality/a11y-tree.mjs site/dist
 */
import { readFileSync } from "node:fs";
import { relative } from "node:path";
import { checkHtml } from "./a11y-static.mjs";
import { listHtml } from "./htmllinks.mjs";

export function checkTreeA11y(root) {
  const findings = [];
  for (const file of listHtml(root)) {
    const html = readFileSync(file, "utf8");
    for (const finding of checkHtml(html)) {
      findings.push({ file: relative(root, file), ...finding });
    }
  }
  return findings;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = process.argv[2] ?? "site/dist";
  const findings = checkTreeA11y(root);
  for (const finding of findings) {
    console.error(`  ${finding.file}: [${finding.rule}] ${finding.message}`);
  }
  console.log(`${findings.length} findings`);
  process.exit(findings.length === 0 ? 0 : 1);
}
