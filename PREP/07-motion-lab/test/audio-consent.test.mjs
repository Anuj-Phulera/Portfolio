import test from 'node:test';
import assert from 'node:assert/strict';
import { createAudioGate } from '../lib/audio-consent.mjs';

test('sound is impossible before any gesture', () => {
  const g = createAudioGate();
  assert.equal(g.allowed, false);
  assert.equal(g.state, 'awaiting-gesture');
  assert.equal(g.enable().changed, false);
});

test('after a gesture, enabling works', () => {
  const g = createAudioGate();
  g.gesture();
  assert.equal(g.enable().changed, true);
  assert.equal(g.allowed, true);
});

test('a remembered preference still requires a gesture', () => {
  const g = createAudioGate({ remembered: true });
  assert.equal(g.allowed, false);
  g.gesture();
  assert.equal(g.allowed, true);
});

test('a remembered mute stays muted after a gesture', () => {
  const g = createAudioGate({ remembered: false });
  g.gesture();
  assert.equal(g.allowed, false);
});

test('blur reports pause without changing the preference', () => {
  const g = createAudioGate();
  g.gesture();
  g.enable();
  assert.deepEqual(g.blur(), { shouldPause: true });
  assert.equal(g.allowed, true);
});
