import test from 'node:test';
import assert from 'node:assert/strict';
import { checkHtml, stripTags } from '../a11y-static.mjs';

const good = `<!doctype html><html lang="en"><head><title>Motion Studio</title></head>
<body><h1>Title</h1><h2>Section</h2>
<img src="a.png" alt="A disc" />
<button>Play</button><a href="/x">Read</a>
<button aria-label="Close"></button></body></html>`;

test('a well-formed document has no findings', () => {
  assert.deepEqual(checkHtml(good), []);
});

test('missing lang is reported', () => {
  const findings = checkHtml(good.replace(' lang="en"', ''));
  assert.ok(findings.some((f) => f.rule === 'html-lang'));
});

test('missing alt is reported', () => {
  const findings = checkHtml(good.replace(' alt="A disc"', ''));
  assert.ok(findings.some((f) => f.rule === 'img-alt'));
});

test('skipped heading level is reported', () => {
  const findings = checkHtml(good.replace('<h2>Section</h2>', '<h4>Deep</h4>'));
  assert.ok(findings.some((f) => f.rule === 'heading-order'));
});

test('unnamed button is reported', () => {
  const findings = checkHtml(good.replace('<button>Play</button>', '<button><span></span></button>'));
  assert.ok(findings.some((f) => f.rule === 'button-name'));
});

test('positive tabindex is reported', () => {
  const findings = checkHtml(good.replace('<body>', '<body><div tabindex="3">x</div>'));
  assert.ok(findings.some((f) => f.rule === 'tabindex-positive'));
});

test('two h1s are reported', () => {
  const findings = checkHtml(good.replace('<h2>Section</h2>', '<h1>Another</h1>'));
  assert.ok(findings.some((f) => f.rule === 'h1-count'));
});

test('stripTags collapses markup to text', () => {
  assert.equal(stripTags('<b>hi</b>  <i>there</i>'), 'hi there');
});
