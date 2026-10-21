import test from 'node:test';
import assert from 'node:assert/strict';
import { validateEntry, validateLedger, summarise } from '../rules.mjs';

const base = {
  id: 'CLM-001',
  project: 'strata',
  claim: 'The corpus contains 35 nodes and 79 typed edges.',
  source: 'README.md',
  grade: 'V',
  evidence: ['src/content/graph.ts: counted 35 nodes, 79 edges'],
  safe_wording: 'The corpus contains 35 nodes and 79 typed edges.',
  public_use: 'publish',
  reviewed: '2026-10-21',
};

test('a well-formed verified entry passes', () => {
  assert.deepEqual(validateEntry(base), []);
});

test('unknown project is rejected', () => {
  const errors = validateEntry({ ...base, project: 'something-else' });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /unknown project/);
});

test('empty evidence is rejected', () => {
  const errors = validateEntry({ ...base, evidence: [] });
  assert.match(errors.join(' '), /evidence/);
});

test('contradicted claim cannot be published', () => {
  const errors = validateEntry({ ...base, grade: 'X' });
  assert.match(errors.join(' '), /contradicted claims may only be do-not-publish or internal-only/);
});

test('contradicted claim may be retained as an internal finding', () => {
  const errors = validateEntry({ ...base, grade: 'X', public_use: 'internal-only' });
  assert.deepEqual(errors, []);
});

test('unverified claim cannot be published as fact', () => {
  const errors = validateEntry({ ...base, grade: 'U', safe_wording: 'Live telemetry dashboard.' });
  assert.ok(errors.some((e) => /may not be published as fact/.test(e)));
});

test('prohibited absolute in a partial claim is rejected', () => {
  const errors = validateEntry({ ...base, grade: 'P', safe_wording: 'A live sensor feed.' });
  assert.ok(errors.some((e) => /requires grade V/.test(e)));
});

test('team project requires attribution', () => {
  const errors = validateEntry({ ...base, project: 'verde-compendium' });
  assert.ok(errors.some((e) => /requires attribution/.test(e)));
  const ok = validateEntry({ ...base, project: 'verde-compendium', attribution: 'Anuj: software; Aarav: hardware' });
  assert.deepEqual(ok, []);
});

test('duplicate ids are reported by the ledger validator', () => {
  const errors = validateLedger({ entries: [base, { ...base }] });
  assert.ok(errors.some((e) => /duplicate id/.test(e)));
});

test('summary counts grades and blockers', () => {
  const s = summarise({ entries: [base, { ...base, id: 'CLM-002', grade: 'X', public_use: 'do-not-publish' }] });
  assert.equal(s.total, 2);
  assert.equal(s.counts.V, 1);
  assert.deepEqual(s.blockers, ['CLM-002']);
});
