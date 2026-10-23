#!/usr/bin/env node
/**
 * Turn the SkillVerse submission CSV into publishable aggregates.
 *
 * The rule this script exists to enforce: **no row leaves this file**. It reads
 * the CSV, keeps only counts and means, and writes a small JSON document. Cities,
 * ages that could single someone out, free-text answers, submission ids and
 * respondent ids are never written — see `docs/content-policy.md`.
 *
 * The CSV itself is not in this repository and must not be committed.
 *
 * Usage: node scripts/skillverse-aggregates.mjs <csv> [out.json]
 */
import { readFileSync, writeFileSync } from "node:fs";

/** Minimal RFC 4180 reader: quoted fields, escaped quotes, embedded newlines. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else quoted = false;
      } else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") field += char;
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const HOUR_BANDS = [
  [0, 2, "0–2 h"],
  [2, 4, "2–4 h"],
  [4, 6, "4–6 h"],
  [6, 8, "6–8 h"],
  [8, Infinity, "8 h +"],
];

/** Normalise the device column: people typed TV, Tv, tv, T.V, Telivision. */
export function normaliseDevice(raw) {
  const value = raw.trim().toLowerCase();
  if (!value) return null;
  const has = (...words) => words.some((word) => value.includes(word));
  if (has("and", "+", "/")) return "More than one";
  if (has("tv", "t.v", "telivision", "television")) return "Television";
  if (has("smartphone", "phone", "mobile")) return "Smartphone";
  if (has("laptop")) return "Laptop";
  if (has("tablet", "ipad")) return "Tablet";
  if (has("desktop", "computer", "pc")) return "Desktop";
  return "Other";
}

function topN(map, n) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

export function aggregate(rows) {
  const header = rows[0].map((name) => name.trim());
  const records = rows.slice(1).filter((row) => (row[0] ?? "").trim() !== "");
  const col = (name) => header.indexOf(name);

  const age = new Map();
  const hours = HOUR_BANDS.map(([, , label]) => [label, 0]);
  const device = new Map();
  const platforms = new Map();
  let learning = 0;
  let entertainment = 0;
  let social = 0;
  let counted = 0;
  const dates = [];

  const ageIdx = col("How old are you?");
  const hoursIdx = col("How many hours per day do you spend on screens?");
  const deviceIdx = col("What device do you use MOST?");
  const platformIdx = col("Which platforms do you use regularly?");
  const learnIdx = col("% of your screen time is for LEARNING?" .replace("%", "What %"));
  const learnCol = col("What % of your screen time is for LEARNING?");
  const entCol = col("What % is for ENTERTAINMENT?");
  const socCol = col("What % is for SOCIALIZING?");
  const dateIdx = col("Submitted at");

  for (const record of records) {
    const years = Number(record[ageIdx]);
    if (Number.isFinite(years) && years >= 8 && years <= 25) {
      const label = String(Math.floor(years));
      age.set(label, (age.get(label) ?? 0) + 1);
    }

    const daily = Number(record[hoursIdx]);
    if (Number.isFinite(daily) && daily >= 0) {
      const band = HOUR_BANDS.findIndex(([min, max]) => daily >= min && daily < max);
      if (band >= 0) hours[band][1] += 1;
    }

    const deviceName = normaliseDevice(record[deviceIdx] ?? "");
    if (deviceName) device.set(deviceName, (device.get(deviceName) ?? 0) + 1);

    for (const platform of (record[platformIdx] ?? "").split(",")) {
      const name = platform.trim();
      if (name) platforms.set(name, (platforms.get(name) ?? 0) + 1);
    }

    const learn = Number(record[learnCol]);
    const ent = Number(record[entCol]);
    const soc = Number(record[socCol]);
    if ([learn, ent, soc].every((value) => Number.isFinite(value) && value >= 0 && value <= 100)) {
      learning += learn;
      entertainment += ent;
      social += soc;
      counted += 1;
    }

    const date = (record[dateIdx] ?? "").slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) dates.push(date);
  }

  dates.sort();
  const respondents = new Set(records.map((row) => (row[1] ?? "").trim()).filter(Boolean)).size;

  return {
    meta: {
      records: records.length,
      respondents,
      firstSubmission: dates[0] ?? null,
      lastSubmission: dates.at(-1) ?? null,
      splitSampleOf: counted,
      note: "Counts and means only. No identifiers, free text, individual ages over 25, or cities.",
    },
    age: [...age.entries()].sort((a, b) => Number(a[0]) - Number(b[0])).map(([label, count]) => ({ label, count })),
    hours: hours.map(([label, count]) => ({ label, count })),
    device: topN(device, 6).map(([label, count]) => ({ label, count })),
    split: [
      { label: "Learning", mean: Math.round((learning / counted) * 10) / 10 },
      { label: "Entertainment", mean: Math.round((entertainment / counted) * 10) / 10 },
      { label: "Social", mean: Math.round((social / counted) * 10) / 10 },
    ],
    platforms: topN(platforms, 8).map(([label, count]) => ({ label, count })),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const source = process.argv[2];
  const out = process.argv[3] ?? "src/content/data/skillverse.json";
  if (!source) {
    console.error("usage: skillverse-aggregates.mjs <csv> [out.json]");
    process.exit(1);
  }
  const result = aggregate(parseCsv(readFileSync(source, "utf8")));
  writeFileSync(out, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`${result.meta.records} records → ${out}`);
  console.log(`${result.meta.respondents} respondents, ${result.meta.firstSubmission} to ${result.meta.lastSubmission}`);
  const bytes = JSON.stringify(result).length;
  console.log(`aggregates only: ${bytes} bytes, no rows`);
}
