/**
 * Experiment 1 — cut timing.
 * Question: can a sequence enforce "enter late, leave early" instead of
 * accumulating arbitrary delays?
 *
 * A Sequence is a list of shots with a hold (stillness) and a transition
 * (the cut into the next shot). It computes absolute start times and rejects
 * configurations that would read as accidental rather than authored.
 */

export const MIN_HOLD_MS = 400;
export const MAX_HOLD_MS = 4000;
export const CUT_MS = 160; // sub-200ms = a cut, not a dissolve
export const MAX_DISSOLVE_MS = 1200;

export function buildSequence(shots) {
  if (!Array.isArray(shots) || shots.length === 0) {
    throw new Error('sequence needs at least one shot');
  }
  let cursor = 0;
  const scheduled = shots.map((shot, index) => {
    const hold = shot.hold ?? 800;
    const transition = shot.transition ?? CUT_MS;
    const kind = transition <= 200 ? 'cut' : transition <= MAX_DISSOLVE_MS ? 'dissolve' : 'invalid';
    if (hold < MIN_HOLD_MS) throw new Error(`shot ${index}: hold ${hold}ms is below ${MIN_HOLD_MS}ms`);
    if (hold > MAX_HOLD_MS) throw new Error(`shot ${index}: hold ${hold}ms exceeds ${MAX_HOLD_MS}ms`);
    if (kind === 'invalid') throw new Error(`shot ${index}: transition ${transition}ms exceeds ${MAX_DISSOLVE_MS}ms`);
    const entry = { index, name: shot.name ?? `shot-${index}`, startsAt: cursor, hold, transition, kind };
    cursor += hold + (kind === 'cut' ? 0 : transition);
    return entry;
  });
  return { shots: scheduled, duration: cursor };
}

export function shotAt(sequence, timeMs) {
  if (timeMs < 0) return null;
  let current = sequence.shots[0];
  for (const shot of sequence.shots) {
    if (timeMs >= shot.startsAt) current = shot;
  }
  return current;
}

/** A cut should land on the completion of motion, not on an arbitrary scroll %. */
export function isCutPoint(sequence, timeMs) {
  return sequence.shots.some((s) => s.kind === 'cut' && Math.abs(s.startsAt - timeMs) < 1);
}
