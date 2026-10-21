/**
 * Experiment 5 — sound consent.
 * Question: can audio be structurally impossible before a gesture?
 *
 * The controller has no way to create an AudioContext. It only reports
 * whether sound is allowed; the caller creates the context after a gesture.
 * That makes "no autoplay" a property of the architecture, not a promise.
 */

export function createAudioGate({ remembered = null } = {}) {
  // remembered: true (user previously enabled), false (previously muted), null (unknown)
  let enabled = remembered === true;
  let gestureSeen = false;

  return {
    get allowed() {
      return gestureSeen && enabled;
    },
    get state() {
      if (!gestureSeen) return 'awaiting-gesture';
      return enabled ? 'on' : 'off';
    },
    /** Must be called from inside a real user gesture handler. */
    gesture() {
      gestureSeen = true;
      return this.state;
    },
    enable() {
      if (!gestureSeen) return { changed: false, reason: 'requires a user gesture' };
      enabled = true;
      return { changed: true, state: this.state };
    },
    disable() {
      enabled = false;
      return { changed: true, state: this.state };
    },
    /** Tab blur pauses sound without changing the preference. */
    blur() {
      return { shouldPause: enabled };
    },
  };
}
