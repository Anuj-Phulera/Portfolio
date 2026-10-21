import { describe, expect, it } from 'vitest';
import { duration, resolveMotion, storeOverride, systemPrefersReduced } from '../core/motion';

describe('motion preference', () => {
  it('defaults to full motion with no media query support', () => {
    expect(systemPrefersReduced()).toBe(false);
    expect(resolveMotion().mode).toBe('full');
  });

  it('honours an explicit override over the system', () => {
    storeOverride('reduced');
    const state = resolveMotion();
    expect(state.mode).toBe('reduced');
    expect(state.source).toBe('manual');
  });

  it('clears an override back to the system', () => {
    storeOverride('reduced');
    storeOverride(null);
    expect(resolveMotion().source).toBe('system');
  });

  it('zeroes every duration when reduced', () => {
    expect(duration('scene', true)).toBe(0);
    expect(duration('fast', true)).toBe(0);
  });

  it('returns authored durations otherwise', () => {
    expect(duration('scene', false)).toBe(900);
    expect(duration('reveal', false)).toBe(480);
  });
});
