import test from 'node:test';
import assert from 'node:assert/strict';
import { score, decide, guard, MIN_INTERVAL_MS } from '../lib/classify.mjs';

test('scores stay within 0..1', () => {
  const s = score({ velocity: 1, dwell: 0, clicks: 1, revisits: 1, linearity: 1 });
  for (const v of Object.values(s)) assert.ok(v >= 0 && v <= 1);
});

test('fast shallow behaviour favours mosaic over codex', () => {
  const s = score({ velocity: 0.95, dwell: 0.05, clicks: 0.8 });
  assert.ok(s.mosaic > s.codex);
});

test('slow linear behaviour favours codex', () => {
  const s = score({ velocity: 0.1, dwell: 0.9, linearity: 0.9 });
  assert.ok(s.codex > s.mosaic);
});

test('decide reports eligibility from confidence and margin', () => {
  const d = decide({ constellation: 0.8, mosaic: 0.5, codex: 0.1, lattice: 0.05, console: 0.03, zen: 0.02 });
  assert.equal(d.winner, 'constellation');
  assert.equal(d.eligible, true);
});

test('guard refuses when pinned', () => {
  const s = score({ velocity: 1, dwell: 0, clicks: 0.1 });
  const g = guard({ scores: s, nowMs: 100000, lastChangeMs: 0, pinned: true, currentParadigm: 'codex' });
  assert.equal(g.apply, false);
  assert.match(g.reason, /pinned/);
});

test('guard refuses during cooldown', () => {
  const s = score({ velocity: 1, dwell: 0, clicks: 0.1 });
  const g = guard({ scores: s, nowMs: 1000, lastChangeMs: 0, pinned: false, currentParadigm: 'codex' });
  assert.equal(g.apply, false);
  assert.match(g.reason, /cooling down/);
});

test('guard refuses when the best structure is already active', () => {
  const s = score({ velocity: 1, dwell: 0, clicks: 0.1 });
  const winner = decide(s).winner;
  const g = guard({ scores: s, nowMs: MIN_INTERVAL_MS + 1, lastChangeMs: 0, pinned: false, currentParadigm: winner });
  assert.equal(g.apply, false);
  assert.match(g.reason, /already/);
});

test('guard explains a permitted change', () => {
  const s = score({ velocity: 1, dwell: 0, clicks: 0.1 });
  const g = guard({ scores: s, nowMs: MIN_INTERVAL_MS + 1, lastChangeMs: 0, pinned: false, currentParadigm: 'zen' });
  assert.equal(g.apply, true);
  assert.match(g.reason, /→/);
});

test('an ambiguous read is refused rather than guessed', () => {
  // Maximum speed AND maximum clicking produce two near-equal paradigms.
  const s = score({ velocity: 1, dwell: 0, clicks: 1 });
  const g = guard({ scores: s, nowMs: MIN_INTERVAL_MS + 1, lastChangeMs: 0, pinned: false, currentParadigm: 'zen' });
  assert.equal(g.apply, false);
  assert.match(g.reason, /not enough evidence/);
});
