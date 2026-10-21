/**
 * Experiment 4 — motion tokens under reduced motion.
 * Question: can motion be removed without breaking layout or meaning?
 *
 * Durations live in one place. The reduced path zeroes them, and a check
 * asserts that no component can reference a missing token.
 */

export const TOKENS = {
  'dur-instant': 0,
  'dur-fast': 120,
  'dur-base': 220,
  'dur-reveal': 480,
  'dur-scene': 900,
  'ease-out': 'cubic-bezier(.16,1,.3,1)',
  'ease-cut': 'linear',
};

export function resolveDuration(token, reducedMotion = false) {
  if (!(token in TOKENS)) throw new Error(`unknown motion token: ${token}`);
  const value = TOKENS[token];
  if (typeof value !== 'number') throw new Error(`token ${token} is not a duration`);
  return reducedMotion ? 0 : value;
}

export function resolveAll(reducedMotion = false) {
  return Object.fromEntries(
    Object.entries(TOKENS).map(([k, v]) => [k, typeof v === 'number' ? (reducedMotion ? 0 : v) : v]),
  );
}

/** Every animated component must declare its token, so audits can find gaps. */
export function auditTokens(componentTokens) {
  const missing = componentTokens.filter((t) => !(t in TOKENS));
  return { ok: missing.length === 0, missing };
}
