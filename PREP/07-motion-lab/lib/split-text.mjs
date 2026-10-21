/**
 * Experiment 6 — animated text that screen readers can still read whole.
 * Question: can typography move without fragmenting the accessible name?
 *
 * Animation libraries often split a sentence into spans; screen readers then
 * announce fragments. The fix is structural: the visible split is aria-hidden,
 * and a single accessible copy carries the full sentence.
 */

export function splitText(text, { by = 'word' } = {}) {
  if (typeof text !== 'string' || !text.trim()) throw new Error('text is required');
  const parts = by === 'word' ? text.split(/(\s+)/) : [...text];
  const visible = parts
    .filter((p) => p.length > 0)
    .map((p) => ({ text: p, isSpace: /^\s+$/.test(p) }));
  return {
    accessible: text,
    visible,
    html:
      `<span aria-hidden="true">` +
      visible
        .map((p) => (p.isSpace ? ' ' : `<span class="t-part">${escapeHtml(p.text)}</span>`))
        .join('') +
      `</span>` +
      `<span class="sr-only">${escapeHtml(text)}</span>`,
  };
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Preserve line boxes so a word-by-word reveal cannot reflow the paragraph. */
export function reserveLines(count, lineHeightPx) {
  if (!Number.isInteger(count) || count < 1) throw new Error('count must be a positive integer');
  return { minHeight: `${count * lineHeightPx}px`, lineHeight: `${lineHeightPx}px` };
}
