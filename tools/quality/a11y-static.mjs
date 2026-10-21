#!/usr/bin/env node
/**
 * Static accessibility checks for built HTML.
 *
 * This is deliberately NOT a conformance test. It catches the cheap failures
 * that are embarrassing to ship: missing lang, skipped heading levels, images
 * without alt, buttons without accessible names, empty links.
 *
 * Usage: node tools/quality/a11y-static.mjs studio/dist/index.html
 */
import { readFileSync } from 'node:fs';

export function stripTags(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function checkHtml(html) {
  const findings = [];
  const push = (rule, message) => findings.push({ rule, message });

  if (!/<html[^>]*\slang=["'][^"']+["']/i.test(html)) push('html-lang', 'html element needs a lang attribute');

  if (!/<title>[^<]{3,}<\/title>/i.test(html)) push('title', 'document needs a meaningful title');

  const h1 = (html.match(/<h1[\s>]/gi) ?? []).length;
  if (h1 !== 1) push('h1-count', `expected exactly one h1, found ${h1}`);

  const levels = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) => Number(m[1]));
  for (let i = 1; i < levels.length; i += 1) {
    if (levels[i] - levels[i - 1] > 1) push('heading-order', `heading jumped from h${levels[i - 1]} to h${levels[i]}`);
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\salt\s*=/i.test(match[0])) push('img-alt', `image without alt: ${match[0].slice(0, 60)}`);
  }

  for (const match of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const attrs = match[1] ?? '';
    const inner = stripTags(match[2] ?? '');
    const named = /aria-label=|aria-labelledby=/.test(attrs) || inner.length > 0;
    if (!named) push('button-name', `button without accessible name: ${match[0].slice(0, 60)}`);
  }

  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const attrs = match[1] ?? '';
    const inner = stripTags(match[2] ?? '');
    const named = /aria-label=|aria-labelledby=/.test(attrs) || inner.length > 0;
    if (!named) push('link-name', `link without accessible text: ${match[0].slice(0, 60)}`);
  }

  if (/tabindex=["']([1-9]\d*)["']/i.test(html)) push('tabindex-positive', 'positive tabindex breaks natural order');

  if (/<div[^>]*onclick=/i.test(html)) push('div-click', 'click handler on a div; use a button');

  return findings;
}

const isCli = process.argv[1]?.endsWith('a11y-static.mjs');
if (isCli) {
  const file = process.argv[2];
  if (!file) {
    console.error('usage: node tools/quality/a11y-static.mjs <file.html>');
    process.exit(2);
  }
  const findings = checkHtml(readFileSync(file, 'utf8'));
  for (const f of findings) console.log(`  ${f.rule}: ${f.message}`);
  console.log(`\n${findings.length} static accessibility finding(s) in ${file}`);
  console.log('This is not a conformance audit. See PREP/08-quality/a11y-checklist.md.');
  process.exit(findings.length ? 1 : 0);
}
