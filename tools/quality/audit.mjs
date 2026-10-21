#!/usr/bin/env node
/**
 * Run the automatable quality checks over the preparation package.
 *   node tools/quality/audit.mjs
 * Exits 1 if anything is found. This checks documents, not the future site.
 */
import { readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { readIfExists, findBannedClaims, findPlaceholders, findBrokenRelativeLinks } from './rules.mjs';

const ROOT = resolve('.');
// Only documents are audited. Tool sources necessarily contain the banned
// phrases as data, so they are not scanned.
const TARGET_DIRS = ['PREP'];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (/\.(md|html|mjs|json)$/.test(name)) out.push(p);
  }
  return out;
}

const files = TARGET_DIRS.flatMap((d) => walk(resolve(d)));
const claims = [];
const placeholders = [];
const links = [];

for (const abs of files) {
  const rel = relative(ROOT, abs);
  const text = readIfExists(abs) ?? '';
  if (rel.startsWith('PREP/07-motion-lab/demos/')) continue; // demos contain sample copy, not claims
  claims.push(...findBannedClaims(text, rel));
  if (abs.endsWith('.md')) {
    placeholders.push(...findPlaceholders(text, rel));
    links.push(...findBrokenRelativeLinks(text, rel, ROOT));
  }
}

console.log(`scanned ${files.length} files`);
console.log(`banned claims: ${claims.length}`);
for (const c of claims) console.log(`  ${c.file}:${c.line}  "${c.phrase}"`);
console.log(`placeholders: ${placeholders.length}`);
for (const p of placeholders) console.log(`  ${p.file}:${p.line}  ${p.kind}`);
console.log(`broken relative links: ${links.length}`);
for (const l of links) console.log(`  ${l.file} -> ${l.target}`);

const failures = claims.length + placeholders.length + links.length;
process.exit(failures ? 1 : 0);
