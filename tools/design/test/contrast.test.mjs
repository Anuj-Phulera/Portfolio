import test from 'node:test';
import assert from 'node:assert/strict';
import { contrastRatio, relativeLuminance, round2, hexToRgb } from '../contrast.mjs';

test('black and white are 21:1', () => {
  assert.equal(round2(contrastRatio('#000000', '#FFFFFF')), 21);
});

test('identical colours are 1:1', () => {
  assert.equal(round2(contrastRatio('#14110F', '#14110F')), 1);
});

test('known pair matches WCAG reference (blue on white)', () => {
  // #0000FF on #FFFFFF is widely cited as 8.59:1
  assert.equal(round2(contrastRatio('#0000FF', '#FFFFFF')), 8.59);
});

test('luminance ordering is monotonic', () => {
  assert.ok(relativeLuminance('#FFFFFF') > relativeLuminance('#808080'));
  assert.ok(relativeLuminance('#808080') > relativeLuminance('#000000'));
});

test('invalid hex throws', () => {
  assert.throws(() => hexToRgb('nope'), /invalid hex/);
});
