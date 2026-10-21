/**
 * Pacing — the editing model behind every cinematic moment in the studio.
 *
 * A shot is a composition. It is held for a duration, then cut. A cut is
 * <= 200ms; a dissolve is 200–1200ms; anything longer reads as lag and is
 * rejected at construction time rather than discovered in review.
 */

export interface ShotSpec {
  readonly name: string;
  readonly hold: number;
  readonly transition?: number;
}

export interface ScheduledShot extends Required<ShotSpec> {
  readonly index: number;
  readonly startsAt: number;
  readonly kind: 'cut' | 'dissolve';
}

export interface Sequence {
  readonly shots: ScheduledShot[];
  readonly duration: number;
}

export const MIN_HOLD = 400;
export const MAX_HOLD = 6000;
export const CUT_MAX = 200;
export const DISSOLVE_MAX = 1200;

export function schedule(shots: readonly ShotSpec[]): Sequence {
  if (shots.length === 0) throw new Error('a sequence needs at least one shot');
  let cursor = 0;
  const scheduled = shots.map((shot, index) => {
    const transition = shot.transition ?? 120;
    if (shot.hold < MIN_HOLD) throw new Error(`shot "${shot.name}": hold ${shot.hold}ms is below ${MIN_HOLD}ms`);
    if (shot.hold > MAX_HOLD) throw new Error(`shot "${shot.name}": hold ${shot.hold}ms exceeds ${MAX_HOLD}ms`);
    if (transition > DISSOLVE_MAX) {
      throw new Error(`shot "${shot.name}": transition ${transition}ms exceeds ${DISSOLVE_MAX}ms (reads as lag)`);
    }
    const kind = transition <= CUT_MAX ? 'cut' : 'dissolve';
    const entry: ScheduledShot = { name: shot.name, hold: shot.hold, transition, kind, index, startsAt: cursor };
    cursor += shot.hold + (kind === 'dissolve' ? transition : 0);
    return entry;
  });
  return { shots: scheduled, duration: cursor };
}

export function shotAt(sequence: Sequence, timeMs: number): ScheduledShot | null {
  if (timeMs < 0) return null;
  let active: ScheduledShot | null = null;
  for (const shot of sequence.shots) {
    if (timeMs >= shot.startsAt) active = shot;
    else break;
  }
  return active;
}

/** Progress through the whole sequence, 0..1, clamped. */
export function progress(sequence: Sequence, timeMs: number): number {
  if (sequence.duration === 0) return 1;
  return Math.max(0, Math.min(1, timeMs / sequence.duration));
}
