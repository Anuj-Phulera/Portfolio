import test from 'node:test';
import assert from 'node:assert/strict';
import { createReveal, initialVisibility } from '../lib/reveal.mjs';

test('a reveal happens once and stays', () => {
  const r = createReveal({ holdMs: 600 });
  assert.equal(r.state, 'hidden');
  const first = r.enter(100);
  assert.equal(first.changed, true);
  assert.equal(first.delay, 600);
  assert.equal(r.state, 'revealing');
  r.complete();
  assert.equal(r.state, 'visible');
  const second = r.enter(5000);
  assert.equal(second.changed, false);
});

test('leaving does not hide content', () => {
  const r = createReveal();
  r.enter(0);
  r.complete();
  assert.equal(r.leave(), 'visible');
});

test('reduced motion reveals immediately with no delay', () => {
  const r = createReveal({ reducedMotion: true });
  const e = r.enter(0);
  assert.equal(e.delay, 0);
  assert.equal(r.state, 'visible');
  assert.equal(initialVisibility(true), 'visible');
});

test('reset returns to hidden only when explicitly requested', () => {
  const r = createReveal();
  r.enter(0);
  r.complete();
  r.reset();
  assert.equal(r.state, 'hidden');
});
