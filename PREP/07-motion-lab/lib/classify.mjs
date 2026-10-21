/**
 * Experiment 2 — reading-behaviour classification.
 * Question: what does it take to make an adaptive interface trustworthy?
 *
 * Pure model of the STRATA decision rule: a read is only acted on when
 * confidence is high AND the margin over the runner-up is clear AND enough
 * time has passed since the last change.
 */

export const SIGNALS = ['linearity', 'dwell', 'revisits', 'velocity', 'clicks'];
export const PARADIGMS = ['constellation', 'mosaic', 'codex', 'lattice', 'console', 'zen'];

export const MIN_CONFIDENCE = 0.65;
export const MIN_MARGIN = 0.15;
export const MIN_INTERVAL_MS = 9000;

/**
 * Turn raw behaviour into a normalised 0..1 score per paradigm.
 * Deliberately simple: the point is the decision rule, not the ML.
 */
export function score({ linearity = 0, dwell = 0, revisits = 0, velocity = 0, clicks = 0 }) {
  const clamp = (n) => Math.max(0, Math.min(1, n));
  const skimming = clamp(velocity) * (1 - clamp(dwell)) + clamp(clicks) * 0.3;
  const reading = clamp(dwell) * (1 - clamp(velocity) * 0.5) + clamp(linearity) * 0.4;
  const comparing = clamp(revisits) * 0.6 + clamp(clicks) * 0.2;
  const raw = {
    constellation: 0.2 + skimming * 0.5,
    mosaic: 0.15 + skimming * 0.8,
    codex: 0.15 + reading * 0.85,
    lattice: 0.1 + comparing * 0.8,
    console: 0.05 + clicks * 0.9,
    zen: 0.05 + (1 - clamp(velocity)) * 0.3 + clamp(dwell) * 0.4,
  };
  // Raw, comparable strengths in 0..1. Deliberately not normalised: a
  // normalised distribution makes a fixed confidence threshold meaningless.
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, clamp(v)]));
}

export function decide(scores) {
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [winner, confidence] = ranked[0];
  const margin = ranked[0][1] - ranked[1][1];
  return { winner, confidence, margin, eligible: confidence >= MIN_CONFIDENCE && margin >= MIN_MARGIN };
}

/**
 * A guard that must be consulted before applying a change.
 * Returns a decision plus a reason, because the interface has to explain itself.
 */
export function guard({ scores, nowMs, lastChangeMs, pinned, currentParadigm }) {
  if (pinned) return { apply: false, reason: 'pinned by the reader' };
  const d = decide(scores);
  if (!d.eligible) {
    return {
      apply: false,
      reason: `not enough evidence (confidence ${d.confidence.toFixed(2)}, margin ${d.margin.toFixed(2)})`,
      ...d,
    };
  }
  const since = nowMs - lastChangeMs;
  if (since < MIN_INTERVAL_MS) {
    return { apply: false, reason: `cooling down (${Math.round((MIN_INTERVAL_MS - since) / 1000)}s left)`, ...d };
  }
  if (d.winner === currentParadigm) {
    return { apply: false, reason: 'already in the best-fit structure', ...d };
  }
  return {
    apply: true,
    reason: `read changed: ${currentParadigm} → ${d.winner} (confidence ${d.confidence.toFixed(2)}, margin ${d.margin.toFixed(2)})`,
    ...d,
  };
}
