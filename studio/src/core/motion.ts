/**
 * Single source of truth for the motion preference.
 *
 * The studio can be driven by three inputs:
 *  - the operating system preference (media query)
 *  - a manual override set by the visitor (data-motion on <html>)
 *  - a "low power" override for devices that ask for it
 *
 * Everything downstream asks this module, never matchMedia directly, so the
 * reduced path can be tested without changing the OS.
 */

export type MotionMode = 'full' | 'reduced';
export type MotionSource = 'system' | 'manual' | 'power';

const STORAGE_KEY = 'studio.motion';

export interface MotionState {
  mode: MotionMode;
  source: MotionSource;
}

export function systemPrefersReduced(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function readStoredOverride(): MotionMode | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'reduced' || value === 'full' ? value : null;
  } catch {
    return null;
  }
}

export function storeOverride(mode: MotionMode | null): void {
  try {
    if (mode === null) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* storage can be blocked; the studio still works */
  }
}

export function resolveMotion(): MotionState {
  const manual = readStoredOverride();
  if (manual) return { mode: manual, source: 'manual' };
  if (systemPrefersReduced()) return { mode: 'reduced', source: 'system' };
  return { mode: 'full', source: 'system' };
}

export function applyMotion(state: MotionState, root: HTMLElement = document.documentElement): void {
  root.dataset.motion = state.mode;
  root.dataset.motionSource = state.source;
}

/**
 * Duration helper. Components ask for a token, never a raw number, so the
 * reduced path cannot be forgotten in one place and honoured in another.
 */
export function duration(token: 'fast' | 'base' | 'reveal' | 'scene', reduced: boolean): number {
  const table = { fast: 120, base: 220, reveal: 480, scene: 900 } as const;
  return reduced ? 0 : table[token];
}
