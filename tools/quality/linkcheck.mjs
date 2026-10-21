#!/usr/bin/env node
/**
 * Markdown link check across the repository.
 *
 * Two failure modes it catches:
 *  1. a relative link to a file that does not exist (renames break docs silently)
 *  2. an anchor to a heading that no longer exists
 *
 * External URLs are not fetched: this environment cannot reach most of them, and
 * a link checker that lies about reachability is worse than none.
 *
 * Usage: node tools/quality/linkcheck.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'coverage', '.arena']);

export function slugify(heading) {
  return heading
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function headings(text) {
  return [...text.matchAll(/^#{1,6}\s+(.+)$/gm)].map((m) => slugify(m[1].replace(/`/g, '')));
}

export function links(text) {
  return [...text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)].map((m) => m[1]);
}

export function checkFile(absPath, root, exists = existsSync, read = (p) => readFileSync(p, 'utf8')) {
  const text = read(absPath);
  const findings = [];
  for (const target of links(text)) {
    if (/^(https?:|mailto:|tel:)/.test(target)) continue;
    const [pathPart, anchor] = target.split('#');
    const base = pathPart ? resolve(dirname(absPath), pathPart) : absPath;
    if (pathPart && !exists(base)) {
      findings.push({ file: relative(root, absPath), target, reason: 'missing file' });
      continue;
    }
    if (anchor) {
      if (!exists(base)) continue;
      const targetText = base.endsWith('.md') ? read(base) : '';
      if (targetText && !headings(targetText).includes(anchor.toLowerCase())) {
        findings.push({ file: relative(root, absPath), target, reason: 'missing anchor' });
      }
    }
  }
  return findings;
}

export function walk(dir, root = dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full, root));
    else if (name.endsWith('.md')) out.push(full);
  }
  return out;
}

if (process.argv[1]?.endsWith('linkcheck.mjs')) {
  const root = resolve('.');
  const files = walk(root);
  const findings = files.flatMap((file) => checkFile(file, root));
  for (const f of findings) console.log(`  ${f.file} -> ${f.target} (${f.reason})`);
  console.log(`\n${files.length} markdown files · ${findings.length} broken link(s)`);
  process.exit(findings.length ? 1 : 0);
}
