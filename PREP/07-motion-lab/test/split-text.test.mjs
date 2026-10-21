import test from 'node:test';
import assert from 'node:assert/strict';
import { splitText, reserveLines } from '../lib/split-text.mjs';

test('the full sentence exists exactly once for assistive tech', () => {
  const out = splitText('Thirty-five objects, seventy-nine edges.');
  assert.equal(out.accessible, 'Thirty-five objects, seventy-nine edges.');
  assert.match(out.html, /class="sr-only">Thirty-five objects, seventy-nine edges\./);
  assert.match(out.html, /aria-hidden="true"/);
});

test('spaces are preserved between parts', () => {
  const out = splitText('two words');
  const words = out.visible.filter((p) => !p.isSpace).map((p) => p.text);
  assert.deepEqual(words, ['two', 'words']);
});

test('markup in content is escaped', () => {
  const out = splitText('<script>alert(1)</script>');
  assert.ok(!out.html.includes('<script>'));
  assert.match(out.html, /&lt;script&gt;/);
});

test('empty text is rejected', () => {
  assert.throws(() => splitText('   '), /text is required/);
});

test('line reservation computes height', () => {
  assert.deepEqual(reserveLines(3, 28), { minHeight: '84px', lineHeight: '28px' });
  assert.throws(() => reserveLines(0, 28), /positive integer/);
});
