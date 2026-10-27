/**
 * Badges as local SVG.
 *
 * A badge is a one-line claim about a repository, so it should be generated
 * from the thing it describes rather than typed. These are written as files in
 * this repository and referenced by relative path, which means no third-party
 * service has to be reachable for the README to render, and every badge can be
 * re-derived by running the command in its own documentation.
 */

/** Approximate advance width of DejaVu Sans at 11px, in pixels, per character. */
const CHAR_WIDTH = 6.6;
const PAD = 10;

function esc(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Render a two-part badge.
 *
 * The label sits on grey, the value on colour, and the width of each half comes
 * from the text it holds. No external font: the SVG names a font-family stack
 * and the renderer picks what it has.
 */
export function badge({ label, value, color = "#0a7d32" }) {
  const labelWidth = Math.round(label.length * CHAR_WIDTH) + PAD * 2;
  const valueWidth = Math.round(value.length * CHAR_WIDTH) + PAD * 2;
  const total = labelWidth + valueWidth;
  const labelMid = Math.round(labelWidth / 2);
  const valueMid = labelWidth + Math.round(valueWidth / 2);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="20" role="img" aria-label="${esc(label)}: ${esc(value)}">
  <title>${esc(label)}: ${esc(value)}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r"><rect width="${total}" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/>
    <rect width="${total}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,DejaVu Sans,Geneva,sans-serif" font-size="11">
    <text x="${labelMid}" y="15" fill="#010101" fill-opacity=".3">${esc(label)}</text>
    <text x="${labelMid}" y="14">${esc(label)}</text>
    <text x="${valueMid}" y="15" fill="#010101" fill-opacity=".3">${esc(value)}</text>
    <text x="${valueMid}" y="14">${esc(value)}</text>
  </g>
</svg>
`;
}

/** Write one badge to disk under `docs/badges/`. */
export function writeBadge(directory, name, options, write) {
  const path = `${directory}/${name}.svg`;
  write(path, badge(options));
  return path;
}
