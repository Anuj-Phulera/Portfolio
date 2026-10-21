import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSequence, shotAt, isCutPoint, MIN_HOLD_MS } from '../lib/pacing.mjs';

test('computes absolute shot starts', () => {
  const seq = buildSequence([
    { name: 'a', hold: 800, transition: 160 },
    { name: 'b', hold: 1200, transition: 900 },
    { name: 'c', hold: 600 },
  ]);
  assert.deepEqual(seq.shots.map((s) => s.startsAt), [0, 800, 2900]);
  assert.equal(seq.shots[1].kind, 'dissolve');
  assert.equal(seq.shots[0].kind, 'cut');
});

test('rejects a hold shorter than the minimum', () => {
  assert.throws(() => buildSequence([{ hold: MIN_HOLD_MS - 1 }]), /below/);
});

test('rejects a transition that is neither cut nor dissolve', () => {
  assert.throws(() => buildSequence([{ hold: 800, transition: 2000 }]), /exceeds/);
});

test('shotAt returns the active shot', () => {
  const seq = buildSequence([{ name: 'a', hold: 800 }, { name: 'b', hold: 800 }]);
  assert.equal(shotAt(seq, 0).name, 'a');
  assert.equal(shotAt(seq, 900).name, 'b');
  assert.equal(shotAt(seq, -1), null);
});

test('cut points are identifiable', () => {
  const seq = buildSequence([{ name: 'a', hold: 800, transition: 160 }, { name: 'b', hold: 800 }]);
  assert.equal(isCutPoint(seq, 0), true);
  assert.equal(isCutPoint(seq, 500), false);
});
