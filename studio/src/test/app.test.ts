/**
 * Integration smoke test: mount every demo into a real jsdom document.
 * This is the closest thing to "does the page work" available without a
 * browser. It catches missing selectors, thrown constructors and bad wiring —
 * not visual quality.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountCut } from '../demos/cut';
import { mountWords } from '../demos/words';
import { mountParallax } from '../demos/parallax';
import { mountReveals } from '../demos/reveal';
import { mountViewTransition } from '../demos/viewtransition';

class StubObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];
}

function buildDocument(): void {
  document.body.innerHTML = `
    <div id="cut-root">
      <div data-stage>
        <article data-shot>one</article><article data-shot>two</article><article data-shot>three</article>
      </div>
      <span data-readout></span>
    </div>
    <div id="words-root"><p data-line data-text="One sentence that moves.">One sentence that moves.</p><button data-replay></button></div>
    <div id="depth-root"><div data-layer></div></div>
    <div id="reveal-root"><div data-reveal>a</div><div data-reveal>b</div></div>
    <div id="vt-root">
      <div data-panel><h3 data-title>A</h3><p data-body>x</p></div>
      <button data-swap></button><span data-support></span>
    </div>
  `;
}

beforeEach(() => {
  buildDocument();
  vi.stubGlobal('IntersectionObserver', StubObserver);
  window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn() }) as never;
});

describe('demo mounting', () => {
  it('mounts the cut sequence and starts on shot one', () => {
    const demo = mountCut(document.getElementById('cut-root')!, false);
    expect(document.querySelector('[data-readout]')?.textContent).toContain('ready');
    demo.play();
    demo.reset();
    demo.destroy();
  });

  it('mounts words and keeps one accessible copy', () => {
    mountWords(document.getElementById('words-root')!, false);
    const sr = document.querySelector('.sr-only');
    expect(sr?.textContent).toBe('One sentence that moves.');
  });

  it('mounts parallax without a fine pointer', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn() }) as never;
    const demo = mountParallax(document.getElementById('depth-root')!, false);
    demo.destroy();
  });

  it('reveals everything immediately under reduced motion', () => {
    mountReveals(document, true);
    const items = Array.from(document.querySelectorAll('[data-reveal]'));
    expect(items.every((i) => i.classList.contains('is-in'))).toBe(true);
  });

  it('mounts the view transition with a fallback note', () => {
    mountViewTransition(document.getElementById('vt-root')!);
    const note = document.querySelector('[data-support]')?.textContent ?? '';
    expect(note).toMatch(/supported|not supported/);
  });

  it('throws a useful error when markup is missing', () => {
    document.body.innerHTML = '<div id="cut-root"></div>';
    expect(() => mountCut(document.getElementById('cut-root')!, false)).toThrow(/markup missing/);
  });
});
