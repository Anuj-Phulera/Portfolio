/**
 * Experiment 3 — threshold reveals instead of scroll scrubbing.
 * Question: can content arrive at a decided moment, and stay, rather than
 * tracking the scrollbar?
 *
 * A reveal is a state machine, not a style. It must be idempotent: arriving
 * twice never re-animates, and leaving never hides already-read content.
 */

export const STATES = ['hidden', 'revealing', 'visible'];

export function createReveal({ reducedMotion = false, holdMs = 600 } = {}) {
  let state = 'hidden';
  let startedAt = null;

  return {
    get state() {
      return state;
    },
    /** Called when the element enters the trigger zone. */
    enter(now = 0) {
      if (state !== 'hidden') return { changed: false, state };
      startedAt = now;
      state = reducedMotion ? 'visible' : 'revealing';
      return { changed: true, state, startedAt, delay: reducedMotion ? 0 : holdMs };
    },
    /** Called when the reveal animation ends, or when reduced motion skips it. */
    complete() {
      if (state === 'revealing') state = 'visible';
      return state;
    },
    /** Leaving the viewport never hides content that has been read. */
    leave() {
      return state;
    },
    reset() {
      state = 'hidden';
      startedAt = null;
    },
  };
}

/** Under reduced motion, every element is visible immediately. */
export function initialVisibility(reducedMotion) {
  return reducedMotion ? 'visible' : 'hidden';
}
