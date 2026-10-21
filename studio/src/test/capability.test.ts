import { describe, expect, it, vi } from 'vitest';
import { probeFinePointer, probeScrollTimeline, probeViewTransitions, summarise } from '../core/capability';

describe('capability probes', () => {
  it('reports a view-transition verdict with a reason', () => {
    const probe = probeViewTransitions();
    expect(typeof probe.supported).toBe('boolean');
    expect(probe.note.length).toBeGreaterThan(5);
  });

  it('detects missing scroll timelines without throwing', () => {
    const probe = probeScrollTimeline();
    expect(probe.note).toMatch(/native|fallback/);
  });

  it('reports coarse pointers', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn() }) as never;
    expect(probeFinePointer().supported).toBe(false);
  });

  it('summarises probes compactly', () => {
    const text = summarise({
      a: { supported: true, note: '' },
      b: { supported: false, note: '' },
    });
    expect(text).toBe('a:yes b:no');
  });
});
