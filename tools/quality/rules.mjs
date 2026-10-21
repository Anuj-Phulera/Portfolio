/**
 * Quality checks that can be automated honestly.
 * Each returns findings; none claims to replace human review.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/** Phrases that assert unverifiable status. Allowed only in explicit registers. */
export const BANNED_CLAIMS = [
  'live telemetry',
  'live sensor',
  'real-time telemetry',
  'india\u2019s first',
  "india's first",
  'award-winning',
  'award winning',
  'wcag aa compliant',
  'production-ready',
  '100% accessible',
  'fully accessible',
];

/**
 * Files where a banned phrase is legitimate because the file is *about* the ban
 * (the ledger records contradictions; the anti-pattern list names them).
 */
export const ALLOWED_PREFIXES = [
  'PREP/01-source-of-truth/',
  'PREP/02-claims/',
  'PREP/04-research/anti-patterns.md',
  'PREP/10-blueprint/final-report.md',
];

export const ALLOWED_FILES = [
  'PREP/02-claims/ledger.json',
  'PREP/02-claims/ledger-report.md',
  'PREP/02-claims/contradictions.md',
  'PREP/02-claims/wording-guide.md',
  'PREP/04-research/anti-patterns.md',
  'PREP/01-source-of-truth/corrections.md',
  'PREP/10-blueprint/final-report.md',
];

/** Remove inline code and quoted strings: these are quotations, not assertions. */
export function stripQuoted(text) {
  return text
    .replace(/`[^`]*`/g, ' ')
    .replace(/"[^"\n]*"/g, ' ')
    .replace(/“[^”]*”/g, ' ');
}

export function findBannedClaims(text, file = '') {
  if (ALLOWED_FILES.includes(file)) return [];
  if (ALLOWED_PREFIXES.some((p) => file.startsWith(p))) return [];
  const lower = stripQuoted(text).toLowerCase();
  const lines = lower.split('\n');
  const hits = [];
  lines.forEach((line, i) => {
    for (const phrase of BANNED_CLAIMS) {
      if (line.includes(phrase)) hits.push({ file, line: i + 1, phrase, text: line.trim().slice(0, 120) });
    }
  });
  return hits;
}

export const PLACEHOLDER_PATTERNS = [
  { name: 'todo', re: /\bTODO\b/ },
  { name: 'tbd', re: /\bTBD\b/ },
  { name: 'fixme', re: /\bFIXME\b/ },
  { name: 'lorem', re: /\blorem ipsum\b/i },
  { name: 'xxx', re: /\bXXX\b/ },
  { name: 'placeholder', re: /\bplaceholder text\b/i },
];

export function findPlaceholders(text, file = '') {
  const hits = [];
  text.split('\n').forEach((line, i) => {
    for (const p of PLACEHOLDER_PATTERNS) {
      if (p.re.test(line)) hits.push({ file, line: i + 1, kind: p.name, text: line.trim().slice(0, 120) });
    }
  });
  return hits;
}

/** Markdown links that point at repository files must resolve. */
export function findBrokenRelativeLinks(text, file, baseDir, exists = existsSync) {
  const hits = [];
  const re = /\[[^\]]*\]\(([^)#\s]+)(?:#[^)]*)?\)/g;
  let m;
  while ((m = re.exec(text))) {
    const target = m[1];
    if (/^(https?:|mailto:|#|\/)/.test(target)) continue;
    const path = resolve(baseDir, dirname(file), target);
    if (!exists(path)) hits.push({ file, target });
  }
  return hits;
}

export function readIfExists(p) {
  return existsSync(p) ? readFileSync(p, 'utf8') : null;
}
