import { describe, expect, it } from 'vitest';
import { CUT_MAX, DISSOLVE_MAX, MIN_HOLD, progress, schedule, shotAt } from '../core/pacing';

const shots = [
  { name: 'desk', hold: 900, transition: 120 },
  { name: 'greenhouse', hold: 1200, transition: 700 },
  { name: 'door', hold: 1400, transition: 120 },
];

describe('pacing', () => {
  it('schedules absolute starts, accounting for dissolves only', () => {
    const seq = schedule(shots);
    // desk 900 + cut 0 = 900; greenhouse 1200 + dissolve 700 = 2800;
    // door 1400 + final cut 0 = 4200. Written out because the first
    // version of this expectation was wrong by exactly one dissolve.
    expect(seq.shots.map((s) => s.startsAt)).toEqual([0, 900, 2800]);
    expect(seq.duration).toBe(4200);
  });

  it('classifies cuts and dissolves by duration', () => {
    const seq = schedule(shots);
    expect(seq.shots[0]?.kind).toBe('cut');
    expect(seq.shots[1]?.kind).toBe('dissolve');
    expect(CUT_MAX).toBe(200);
    expect(DISSOLVE_MAX).toBe(1200);
  });

  it('rejects a hold that is too short to read', () => {
    expect(() => schedule([{ name: 'x', hold: MIN_HOLD - 1 }])).toThrow(/below/);
  });

  it('rejects a transition that would feel like lag', () => {
    expect(() => schedule([{ name: 'x', hold: 800, transition: 1500 }])).toThrow(/lag/);
  });

  it('rejects an empty sequence', () => {
    expect(() => schedule([])).toThrow(/at least one/);
  });

  it('returns the active shot and null before the start', () => {
    const seq = schedule(shots);
    expect(shotAt(seq, -1)).toBeNull();
    expect(shotAt(seq, 0)?.name).toBe('desk');
    expect(shotAt(seq, 1000)?.name).toBe('greenhouse');
    expect(shotAt(seq, 9999)?.name).toBe('door');
  });

  it('reports clamped progress', () => {
    const seq = schedule(shots);
    expect(progress(seq, -10)).toBe(0);
    expect(progress(seq, seq.duration + 10)).toBe(1);
    expect(progress(seq, seq.duration / 2)).toBeCloseTo(0.5, 1);
  });
});
