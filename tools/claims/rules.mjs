/**
 * Validation rules for the claims ledger.
 * Pure functions so they can be unit-tested without touching the filesystem.
 */

export const PROJECTS = [
  'verde-compendium',
  'verde-app',
  'nirmaan-app',
  'nirmaan-portfolio',
  'skillverse',
  'resonate',
  'rakshabandhan',
  'strata',
  'verde-previous',
  'portfolio',
  'profile',
];

export const GRADES = ['V', 'P', 'U', 'A', 'X'];
export const PUBLIC_USE = ['publish', 'publish-with-caveat', 'do-not-publish', 'internal-only'];

/** Words that assert completion or measurement and therefore require grade V. */
export const PROHIBITED_WHEN_UNVERIFIED = [
  'live',
  'real-time',
  'real time',
  'first ',
  'award-winning',
  'award winning',
  'wcag aa',
  'production-ready',
  'fully tested',
  'battle-tested',
];

const TEAM_PROJECTS = new Set(['verde-compendium', 'skillverse']);

const isString = (v) => typeof v === 'string' && v.trim().length > 0;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function validateEntry(entry, index = 0) {
  const errors = [];
  const where = entry && entry.id ? entry.id : `entry[${index}]`;

  if (!entry || typeof entry !== 'object') return [`${where}: not an object`];

  if (!isString(entry.id) || !/^CLM-\d{3}$/.test(entry.id)) {
    errors.push(`${where}: id must match CLM-NNN`);
  }
  if (!isString(entry.project) || !PROJECTS.includes(entry.project)) {
    errors.push(`${where}: unknown project "${entry.project}"`);
  }
  if (!isString(entry.claim)) errors.push(`${where}: claim is required`);
  if (!isString(entry.source)) errors.push(`${where}: source is required`);
  if (!GRADES.includes(entry.grade)) errors.push(`${where}: grade must be one of ${GRADES.join(', ')}`);
  if (!Array.isArray(entry.evidence) || entry.evidence.length === 0) {
    errors.push(`${where}: evidence must be a non-empty array`);
  }
  if (!isString(entry.safe_wording)) errors.push(`${where}: safe_wording is required`);
  if (!PUBLIC_USE.includes(entry.public_use)) {
    errors.push(`${where}: public_use must be one of ${PUBLIC_USE.join(', ')}`);
  }
  if (!isString(entry.reviewed) || !ISO_DATE.test(entry.reviewed)) {
    errors.push(`${where}: reviewed must be an ISO date (YYYY-MM-DD)`);
  }

  if (entry.grade === 'X' && !['do-not-publish', 'internal-only'].includes(entry.public_use)) {
    errors.push(`${where}: contradicted claims may only be do-not-publish or internal-only`);
  }
  if ((entry.grade === 'U' || entry.grade === 'A') && entry.public_use === 'publish') {
    errors.push(`${where}: grade ${entry.grade} may not be published as fact`);
  }
  if (TEAM_PROJECTS.has(entry.project) && !isString(entry.attribution)) {
    errors.push(`${where}: team project requires attribution`);
  }

  if (entry.grade !== 'V' && isString(entry.safe_wording)) {
    const lower = entry.safe_wording.toLowerCase();
    for (const word of PROHIBITED_WHEN_UNVERIFIED) {
      if (lower.includes(word)) {
        errors.push(`${where}: "${word}" in safe_wording requires grade V (has ${entry.grade})`);
      }
    }
  }

  return errors;
}

export function validateLedger(ledger) {
  const errors = [];
  if (!ledger || !Array.isArray(ledger.entries)) {
    return ['ledger.entries must be an array'];
  }
  const seen = new Set();
  ledger.entries.forEach((entry, i) => {
    errors.push(...validateEntry(entry, i));
    if (entry && entry.id) {
      if (seen.has(entry.id)) errors.push(`${entry.id}: duplicate id`);
      seen.add(entry.id);
    }
  });
  return errors;
}

export function summarise(ledger) {
  const counts = Object.fromEntries(GRADES.map((g) => [g, 0]));
  for (const e of ledger.entries) counts[e.grade] = (counts[e.grade] || 0) + 1;
  const blockers = ledger.entries.filter((e) => e.public_use === 'do-not-publish').map((e) => e.id);
  return { total: ledger.entries.length, counts, blockers };
}
