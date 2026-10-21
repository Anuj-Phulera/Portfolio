import { beforeEach, describe, expect, it } from 'vitest';
import { FIGURES, mountCounter, validateFigure } from '../demos/counter';

beforeEach(() => {
  document.body.innerHTML = '<div id="counter"><div data-figures></div></div>';
});

describe('figures', () => {
  it('accepts figures that carry provenance', () => {
    expect(() =>
      validateFigure({ value: 34, label: 'routes', source: 'app/', measuredAt: '05f2383' }),
    ).not.toThrow();
  });

  it('rejects a figure with no source', () => {
    expect(() => validateFigure({ value: 10, label: 'speed', source: '  ', measuredAt: '05f2383' })).toThrow(
      /without a source/,
    );
  });

  it('rejects a made-up measurement date', () => {
    expect(() => validateFigure({ value: 1, label: 'x', source: 'a', measuredAt: 'yesterday' })).toThrow(/commit sha/);
  });

  it('rejects non-finite values', () => {
    expect(() => validateFigure({ value: Number.NaN, label: 'x', source: 'a', measuredAt: '05f2383' })).toThrow(
      /finite/,
    );
  });

  it('renders one card per figure with its source shown', () => {
    mountCounter(document.getElementById('counter')!, true);
    const cards = document.querySelectorAll('.figure');
    expect(cards.length).toBe(FIGURES.length);
    expect(document.querySelector('.figure__source')?.textContent).toContain('source:');
  });

  it('shows final values immediately under reduced motion', () => {
    mountCounter(document.getElementById('counter')!, true);
    const first = document.querySelector<HTMLElement>('[data-value]');
    expect(first?.textContent).toBe('34');
  });
});
