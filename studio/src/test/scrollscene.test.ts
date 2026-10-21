import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountScrollScene } from '../demos/scrollscene';

class StubObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

beforeEach(() => {
  document.body.innerHTML = `
    <div id="scene">
      <div data-scene-track>
        <div data-scene-panel>a</div>
        <div data-scene-panel>b</div>
      </div>
      <span data-scene-path></span>
    </div>`;
  vi.stubGlobal('IntersectionObserver', StubObserver);
});

describe('scroll scene', () => {
  it('shows every panel under reduced motion', () => {
    mountScrollScene(document.getElementById('scene')!, true);
    const panels = Array.from(document.querySelectorAll('[data-scene-panel]'));
    expect(panels.every((p) => p.classList.contains('is-in'))).toBe(true);
  });

  it('labels which rendering path was chosen', () => {
    mountScrollScene(document.getElementById('scene')!, false);
    const badge = document.querySelector('[data-scene-path]')?.textContent ?? '';
    expect(badge).toMatch(/native|fallback/);
  });

  it('does not throw when the timeline API is missing', () => {
    expect(() => mountScrollScene(document.getElementById('scene')!, false)).not.toThrow();
  });
});
