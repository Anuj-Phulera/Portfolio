import test from 'node:test';
import assert from 'node:assert/strict';
import { checkFile, headings, links, slugify } from '../linkcheck.mjs';

const read = (map) => (p) => {
  if (!(p in map)) throw new Error(`unexpected read: ${p}`);
  return map[p];
};

test('slugify matches common heading anchors', () => {
  assert.equal(slugify('Hello, World!'), 'hello-world');
  assert.equal(slugify('   Spaces   '), 'spaces');
});

test('headings extracts levels and slugs', () => {
  assert.deepEqual(headings('# One\n## Two Words\n'), ['one', 'two-words']);
});

test('links extracts targets and ignores images without links', () => {
  assert.deepEqual(links('[a](x.md) [b](https://y.z)'), ['x.md', 'https://y.z']);
});

test('missing relative file is reported', () => {
  const findings = checkFile('/root/doc.md', '/root', (p) => p === '/root/doc.md', read({ '/root/doc.md': '[a](missing.md)' }));
  assert.equal(findings.length, 1);
  assert.equal(findings[0].reason, 'missing file');
});

test('missing anchor is reported', () => {
  const files = { '/root/doc.md': '[a](other.md#nope)', '/root/other.md': '# Present\n' };
  const findings = checkFile('/root/doc.md', '/root', (p) => p in files, read(files));
  assert.equal(findings[0].reason, 'missing anchor');
});

test('valid anchor passes', () => {
  const files = { '/root/doc.md': '[a](other.md#present)', '/root/other.md': '# Present\n' };
  const findings = checkFile('/root/doc.md', '/root', (p) => p in files, read(files));
  assert.deepEqual(findings, []);
});

test('external links are not checked', () => {
  const findings = checkFile('/root/doc.md', '/root', () => true, read({ '/root/doc.md': '[a](https://example.com/x)' }));
  assert.deepEqual(findings, []);
});
