#!/usr/bin/env node
/**
 * Structural validation of the generated HTML.
 *
 * The static a11y checker in tools/quality asks about accessibility; this asks
 * whether the document is well-formed at all — duplicate ids, elements in the
 * wrong place, attributes that do not exist. Different question, different tool.
 *
 * Usage: node scripts/html-audit.mjs [dist]
 */
import { readFileSync } from "node:fs";
import { relative } from "node:path";
import { HtmlValidate } from "html-validate";
import { listHtml } from "./axe-audit.mjs";

const validator = new HtmlValidate({
  extends: ["html-validate:recommended"],
  rules: {
    "no-inline-style": "error",
    "no-dup-id": "error",
    "unique-landmark": "error",
    "wcag/h63": "error",
    // Cosmetic rules off: the build controls formatting, not the author.
    "attribute-boolean-style": "off",
    "void-style": "off",
    "no-trailing-whitespace": "off",
    "long-title": "off",
  },
});

export async function audit(root) {
  const results = [];
  for (const file of listHtml(root)) {
    const report = await validator.validateString(readFileSync(file, "utf8"));
    if (!report.valid) {
      results.push({
        file: relative(root, file),
        messages: report.results.flatMap((r) => r.messages.map((m) => `${m.ruleId} (${m.line}:${m.column}) ${m.message}`)),
      });
    }
  }
  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const bad = await audit(process.argv[2] ?? "dist");
  for (const page of bad) {
    console.log(`${page.file}:`);
    for (const message of page.messages) console.log(`  ${message}`);
  }
  console.log(`${bad.length} page(s) with structural errors`);
  process.exit(bad.length === 0 ? 0 : 1);
}
