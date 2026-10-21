#!/usr/bin/env node
/**
 * Generate a human-readable report from the claims ledger.
 *   node tools/claims/report.mjs > PREP/02-claims/ledger-report.md
 * Deterministic: same ledger in, same markdown out.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { summarise } from './rules.mjs';

const path = resolve(process.argv[2] ?? 'PREP/02-claims/ledger.json');
const ledger = JSON.parse(readFileSync(path, 'utf8'));
const { total, counts, blockers } = summarise(ledger);

const byProject = new Map();
for (const e of ledger.entries) {
  if (!byProject.has(e.project)) byProject.set(e.project, []);
  byProject.get(e.project).push(e);
}

const out = [];
out.push('# Claims ledger — generated report');
out.push('');
out.push(`Generated from \`${path}\`. Do not edit by hand; run \`node tools/claims/report.mjs\`.`);
out.push('');
out.push(`**Entries:** ${total} · **V** ${counts.V} · **P** ${counts.P} · **U** ${counts.U} · **A** ${counts.A} · **X** ${counts.X}`);
out.push('');
out.push(`**Blocked from publication:** ${blockers.length ? blockers.join(', ') : 'none'}`);
out.push('');

for (const [project, entries] of [...byProject.entries()].sort()) {
  out.push(`## ${project}`);
  out.push('');
  out.push('| ID | Grade | Public use | Safe wording |');
  out.push('|---|---|---|---|');
  for (const e of entries.sort((a, b) => a.id.localeCompare(b.id))) {
    const w = e.safe_wording.replace(/\|/g, '\\|');
    out.push(`| ${e.id} | ${e.grade} | ${e.public_use} | ${w} |`);
  }
  out.push('');
  const xs = entries.filter((e) => e.grade === 'X');
  if (xs.length) {
    out.push('**Contradicted:**');
    for (const e of xs) out.push(`- ${e.id}: ${e.claim}`);
    out.push('');
  }
}

out.push('## Reading this report');
out.push('');
out.push('- A **V** entry may be published as written.');
out.push('- A **P** entry may be published only with its caveat visible to the reader.');
out.push('- **U** and **A** entries may not appear as fact.');
out.push('- **X** means the source material is wrong. Fix the claim, not the code.');
console.log(out.join('\n'));
