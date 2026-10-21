import test from 'node:test';
import assert from 'node:assert/strict';
import { findBannedClaims, findPlaceholders, findBrokenRelativeLinks, stripQuoted } from '../rules.mjs';

test('banned claim is found in normal copy', () => {
  const hits = findBannedClaims('The dashboard shows live telemetry from the farm.', 'PREP/x.md');
  assert.equal(hits.length, 1);
  assert.equal(hits[0].phrase, 'live telemetry');
});

test('allowed files may discuss the phrases', () => {
  const hits = findBannedClaims('live telemetry', 'PREP/02-claims/contradictions.md');
  assert.deepEqual(hits, []);
});

test('placeholder markers are found', () => {
  const hits = findPlaceholders('TODO: write this\nLorem ipsum dolor', 'a.md');
  assert.equal(hits.length, 2);
});

test('relative links are resolved', () => {
  const exists = (p) => p.endsWith('exists.md');
  const hits = findBrokenRelativeLinks('[a](exists.md) [b](missing.md) [c](https://x.dev)', 'PREP/doc.md', '/repo', exists);
  assert.deepEqual(hits.map((h) => h.target), ['missing.md']);
});

test('anchor-only links are ignored', () => {
  const hits = findBrokenRelativeLinks('[a](#section) [b](mailto:x@y.z)', 'a.md', '/repo', () => false);
  assert.deepEqual(hits, []);
});

test('quoted claims are treated as quotations, not assertions', () => {
  assert.deepEqual(findBannedClaims('The README says "live telemetry".', 'PREP/notes.md'), []);
  assert.deepEqual(findBannedClaims('The README says `live telemetry`.', 'PREP/notes.md'), []);
  assert.equal(findBannedClaims('We show live telemetry.', 'PREP/notes.md').length, 1);
});

test('stripQuoted removes code and quotes', () => {
  assert.equal(stripQuoted('a `b live telemetry` c "d" e').includes('live telemetry'), false);
});
