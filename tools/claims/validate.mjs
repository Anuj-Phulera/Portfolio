#!/usr/bin/env node
/**
 * CLI: validate the claims ledger.
 *   node tools/claims/validate.mjs [path]
 * Exits 1 on any violation. Prints a summary either way.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateLedger, summarise } from './rules.mjs';

const path = resolve(process.argv[2] ?? 'PREP/02-claims/ledger.json');
let ledger;
try {
  ledger = JSON.parse(readFileSync(path, 'utf8'));
} catch (err) {
  console.error(`Cannot read ledger at ${path}: ${err.message}`);
  process.exit(1);
}

const errors = validateLedger(ledger);
const { total, counts, blockers } = summarise(ledger);

console.log(`ledger: ${path}`);
console.log(`entries: ${total}  ` + Object.entries(counts).map(([g, n]) => `${g}:${n}`).join('  '));
console.log(`do-not-publish: ${blockers.length ? blockers.join(', ') : 'none'}`);

if (errors.length) {
  console.error(`\n${errors.length} violation(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('\nOK — all entries satisfy the ledger rules.');
