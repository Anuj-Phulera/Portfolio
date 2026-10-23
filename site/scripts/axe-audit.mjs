#!/usr/bin/env node
/**
 * axe-core over every built page, in jsdom.
 *
 * This is a real accessibility engine rather than a set of regular expressions,
 * which is why it replaces guesswork with findings. It is still not a substitute
 * for a browser: rules that need layout (colour contrast above all) come back as
 * "incomplete" here, and those are exactly the rules most likely to fail. The
 * browser workflow runs the same audit where they can actually be evaluated.
 *
 * Usage: node scripts/axe-audit.mjs [dist]
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { JSDOM } from "jsdom";
import axe from "axe-core";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"];

export function listHtml(root) {
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        if (name !== "assets") walk(full);
      } else if (extname(full) === ".html") out.push(full);
    }
  };
  walk(root);
  return out.sort();
}

/** Run axe against one HTML string. Returns the raw result. */
export async function auditHtml(html) {
  const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true });
  // jsdom has no canvas; axe probes for it while matching colour-contrast.
  dom.window.HTMLCanvasElement.prototype.getContext = () => null;
  dom.window.eval(readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8"));
  const result = await dom.window.axe.run(dom.window.document, {
    runOnly: { type: "tag", values: TAGS },
  });
  dom.window.close();
  return result;
}

/** Reduce axe's output to what a person has to look at. */
export function summarise(result) {
  return {
    violations: result.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.map((n) => n.target.join(" ") + (n.failureSummary ? ` — ${n.failureSummary.split("\n")[1] ?? ""}` : "")),
    })),
    incomplete: result.incomplete.map((v) => v.id),
    passes: result.passes.length,
  };
}

export async function auditTree(root) {
  const pages = [];
  for (const file of listHtml(root)) {
    const summary = summarise(await auditHtml(readFileSync(file, "utf8")));
    pages.push({ file: relative(root, file), ...summary });
  }
  return pages;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = process.argv[2] ?? "dist";
  const pages = await auditTree(root);
  let bad = 0;
  for (const page of pages) {
    if (page.violations.length === 0) continue;
    bad += 1;
    console.log(`${page.file}: ${page.violations.length} violation(s)`);
    for (const violation of page.violations) {
      console.log(`  [${violation.impact}] ${violation.id} — ${violation.help}`);
      for (const node of violation.nodes.slice(0, 4)) console.log(`      ${node}`);
    }
  }
  const totalPasses = pages.reduce((sum, page) => sum + page.passes, 0);
  console.log(`${pages.length} pages · ${bad} with violations · ${totalPasses} checks passed`);
  process.exit(bad === 0 ? 0 : 1);
}
