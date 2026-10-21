import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveDuration, resolveAll, auditTokens, TOKENS } from '../lib/motion-tokens.mjs';

test('normal durations resolve to their tokens', () => {
  assert.equal(resolveDuration('dur-scene', false), TOKENS['dur-scene']);
});

test('reduced motion zeroes every duration but keeps easing definitions', () => {
  const all = resolveAll(true);
  for (const [k, v] of Object.entries(all)) {
    if (typeof TOKENS[k] === 'number') assert.equal(v, 0, `${k} should be 0`);
  }
  assert.equal(all['ease-out'], TOKENS['ease-out']);
});

test('unknown tokens fail loudly', () => {
  assert.throws(() => resolveDuration('dur-nope'), /unknown motion token/);
});

test('audit finds undeclared tokens', () => {
  const { ok, missing } = auditTokens(['dur-fast', 'dur-invented']);
  assert.equal(ok, false);
  assert.deepEqual(missing, ['dur-invented']);
});
