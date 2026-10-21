import { describe, expect, it } from 'vitest';
import { el, splitWords } from '../core/dom';

describe('dom helpers', () => {
  it('builds elements with attributes, text and children', () => {
    const node = el('p', { class: 'note', 'data-kind': 'x' }, ['hello']);
    expect(node.tagName).toBe('P');
    expect(node.className).toBe('note');
    expect(node.dataset.kind).toBe('x');
    expect(node.textContent).toBe('hello');
  });

  it('skips undefined and false attributes', () => {
    const node = el('div', { hidden: false, title: undefined, id: 'kept' });
    expect(node.hasAttribute('hidden')).toBe(false);
    expect(node.hasAttribute('title')).toBe(false);
    expect(node.id).toBe('kept');
  });

  it('splits words while keeping one accessible copy', () => {
    const { root, words } = splitWords('thirty-five objects');
    expect(words).toHaveLength(2);
    expect(root.querySelector('.sr-only')?.textContent).toBe('thirty-five objects');
    expect(root.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('preserves single spaces between words', () => {
    const { root } = splitWords('a b');
    const visible = root.querySelector('[aria-hidden="true"]');
    expect(visible?.textContent).toBe('a b');
  });
});
