import { afterEach, describe, expect, it, vi } from 'vitest';
import { createScroll } from '../core/scroll';

describe('scroll controller', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns a disabled controller under reduced motion', () => {
    const controller = createScroll(true);
    expect(controller.enabled).toBe(false);
    controller.destroy();
  });

  it('falls back to native scrollIntoView when disabled', () => {
    const target = document.createElement('div');
    target.id = 'target';
    target.scrollIntoView = vi.fn();
    document.body.appendChild(target);

    const controller = createScroll(true);
    controller.scrollTo('#target');
    expect(target.scrollIntoView).toHaveBeenCalledOnce();
  });

  it('reports progress monotonically through the fallback listener', () => {
    const controller = createScroll(true);
    const values: number[] = [];
    controller.onProgress((p) => values.push(p));
    expect(values.length).toBeGreaterThan(0);
    expect(values[0]).toBeGreaterThanOrEqual(0);
    expect(values[0]).toBeLessThanOrEqual(1);
  });
});
