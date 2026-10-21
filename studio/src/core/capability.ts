/**
 * Feature detection, reported honestly.
 *
 * The studio must never claim a technique works on a device it has not
 * checked. Each probe returns a boolean plus the reason, which the page shows
 * next to the demo rather than hiding in a console.
 */

export type Probe = { supported: boolean; note: string };

export function probeViewTransitions(): Probe {
  const supported = typeof document !== 'undefined' && 'startViewTransition' in document;
  return {
    supported,
    note: supported ? 'View Transitions available' : 'no View Transitions — instant swap',
  };
}

export function probeScrollTimeline(): Probe {
  const supported =
    typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('animation-timeline: scroll()');
  return {
    supported,
    note: supported ? 'native scroll-driven animation' : 'fallback: observer-driven reveal',
  };
}

export function probeFinePointer(): Probe {
  const supported = typeof window !== 'undefined' && !!window.matchMedia?.('(pointer: fine)').matches;
  return { supported, note: supported ? 'fine pointer' : 'coarse pointer — depth disabled' };
}

export function probeReducedMotion(): Probe {
  const supported = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  return { supported, note: supported ? 'reader asked for less motion' : 'full motion allowed' };
}

export function summarise(probes: Record<string, Probe>): string {
  return Object.entries(probes)
    .map(([key, value]) => `${key}:${value.supported ? 'yes' : 'no'}`)
    .join(' ');
}
