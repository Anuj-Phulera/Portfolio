/**
 * Reads a shader directory and reports what is in it.
 *
 * This exists because the RESONATE entry said the shaders were "real source,
 * not stock effects", and that sentence was never checked. Measuring the files
 * turned three things up: a vendored noise core carrying no attribution, two
 * helper functions defined and never called, and two fragment programs that
 * differ in a single line.
 *
 * It reports measurements, never source. None of the GLSL is copied into this
 * repository — the same rule the survey CSV follows. What ships is the count.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * The functions that make up the MIT-licensed simplex/curl noise core.
 *
 * `permute` and `taylorInvSqrt` carry constants that only appear in Ashima
 * Arts and Stefan Gustavson's webgl-noise (1.79284291400159, 0.85373472095314)
 * and in the curl-noise derivation that circulates with it. Anything in these
 * spans is counted as vendored rather than written here.
 */
export const VENDORED_FUNCTIONS = [
  "mod289",
  "permute",
  "taylorInvSqrt",
  "snoise",
  "snoiseVec3",
  "curlNoise",
];

/** A trailing newline is not a line of code; drop the empty element it leaves. */
export function trimTrailingBlank(source) {
  return source.endsWith("\n") ? source.slice(0, -1) : source;
}

/** Strip comments so line counts describe code rather than prose. */
export function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ""))
    .split("\n")
    .map((line) => line.replace(/\/\/.*$/, ""))
    .join("\n");
}

/** Count the non-blank lines of a source file and of its comment-free form. */
export function lineStats(source) {
  const lines = trimTrailingBlank(source).split("\n");
  const code = stripComments(source).split("\n");
  const all = lines.length;
  const commentOnly = lines.filter(
    (line, index) => line.trim() !== "" && code[index].trim() === "",
  ).length;
  const codeOnly = code.filter((line) => line.trim() !== "").length;
  return { lines: all, code: codeOnly, comment: commentOnly };
}

/**
 * Find top-level function definitions and the line span each occupies.
 *
 * GLSL here is written one function per top-level block beginning in column 0,
 * so a lightweight scan is enough; this is not a parser and does not pretend
 * to be one. It is checked against the real files by its test.
 */
export function findFunctions(source) {
  const lines = trimTrailingBlank(source).split("\n");
  const found = [];
  // A definition starts in column 0 and opens a block. The `\{` test is what
  // separates `vec4 permute(vec4 x){return ...;}` from an indented call such as
  // `vec3 p_x0 = snoiseVec3( p - dx );`, which also ends in a semicolon.
  const opener = /^(?:[A-Za-z_][\w]*)\s+([A-Za-z_][\w]*)\s*\([^;{]*\)[^;]*\{/;
  for (let index = 0; index < lines.length; index += 1) {
    const match = opener.exec(lines[index]);
    if (!match) continue;
    let depth = 0;
    let end = index;
    for (let cursor = index; cursor < lines.length; cursor += 1) {
      for (const character of lines[cursor]) {
        if (character === "{") depth += 1;
        if (character === "}") depth -= 1;
      }
      if (depth === 0 && cursor > index) {
        end = cursor;
        break;
      }
      if (depth === 0 && cursor === index && lines[cursor].includes("}")) {
        end = cursor;
        break;
      }
    }
    found.push({ name: match[1], start: index, end });
    index = end;
  }
  return found;
}

/** A function is unused when its name is never called anywhere in the file. */
export function unusedHelpers(source) {
  const code = stripComments(source);
  return findFunctions(source)
    .filter((fn) => {
      // `main` is an entry point, not a helper; nothing calls it by name.
      if (fn.name === "main") return false;
      const calls = code.match(new RegExp(`\\b${fn.name}\\s*\\(`, "g")) ?? [];
      return calls.length <= 1;
    })
    .map((fn) => fn.name);
}

/**
 * Reduce a fragment program to what it computes: comments, blank lines and
 * whitespace removed. Two files with the same shape are one effect.
 */
export function programShape(source) {
  return stripComments(source)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

/** Longest common subsequence length, used to compare two programs line by line. */
export function lcsLength(left, right) {
  const rows = left.length + 1;
  const columns = right.length + 1;
  let previous = new Uint16Array(columns);
  for (let row = 1; row < rows; row += 1) {
    const current = new Uint16Array(columns);
    for (let column = 1; column < columns; column += 1) {
      current[column] =
        left[row - 1] === right[column - 1]
          ? previous[column - 1] + 1
          : Math.max(previous[column], current[column - 1]);
    }
    previous = current;
  }
  return previous[columns - 1];
}

/**
 * Programs that are close to the same program.
 *
 * Identical text would be too strict a test: two soft-point sprites that differ
 * only in their falloff curve are still one effect, and the point of the count
 * is to say so rather than to let a renamed constant hide it.
 */
export function nearDuplicates(entries, threshold = 0.8) {
  const shaped = entries.map((entry) => ({
    file: entry.file,
    lines: programShape(entry.source).split("\n"),
  }));
  const pairs = [];
  for (let left = 0; left < shaped.length; left += 1) {
    for (let right = left + 1; right < shaped.length; right += 1) {
      const a = shaped[left].lines;
      const b = shaped[right].lines;
      const longest = Math.max(a.length, b.length);
      if (longest === 0) continue;
      const ratio = lcsLength(a, b) / longest;
      if (ratio >= threshold) {
        pairs.push({
          files: [shaped[left].file, shaped[right].file],
          similarity: Math.round(ratio * 100) / 100,
        });
      }
    }
  }
  return pairs.sort((a, b) => b.similarity - a.similarity);
}

/** Does any file carry a licence or attribution line for the vendored code? */
export function attributionPresent(entries) {
  return entries.some((entry) =>
    /copyright|licen[cs]e|ashima|gustavson|MIT\b/i.test(entry.source),
  );
}

export function auditDirectory(directory) {
  const files = readdirSync(directory)
    .filter((name) => /\.(vert|frag)$/.test(name))
    .sort();

  const entries = files.map((file) => {
    const source = readFileSync(join(directory, file), "utf8");
    const stats = lineStats(source);
    const functions = findFunctions(source);
    const vendored = functions.filter((fn) => VENDORED_FUNCTIONS.includes(fn.name));
    const vendoredLines = vendored.reduce(
      (total, fn) => total + (fn.end - fn.start + 1),
      0,
    );
    return {
      file,
      stage: file.endsWith(".frag") ? "fragment" : "vertex",
      ...stats,
      vendoredLines,
      writtenHere: stats.code - vendoredLines,
      unused: unusedHelpers(source),
      source,
    };
  });

  const similar = nearDuplicates(entries);

  return {
    files: entries.length,
    lines: entries.reduce((total, entry) => total + entry.lines, 0),
    codeLines: entries.reduce((total, entry) => total + entry.code, 0),
    vendoredLines: entries.reduce((total, entry) => total + entry.vendoredLines, 0),
    programs: entries.map(({ source, ...rest }) => rest),
    vendoredIn: entries.filter((entry) => entry.vendoredLines > 0).map((e) => e.file),
    unusedHelpers: entries
      .filter((entry) => entry.unused.length > 0)
      .map((entry) => ({ file: entry.file, names: entry.unused })),
    attributionPresent: attributionPresent(entries),
    similarPrograms: similar,
  };
}

if (process.argv[1] && process.argv[1].endsWith("resonate-shaders.mjs")) {
  const [directory, out] = process.argv.slice(2);
  if (!directory) {
    console.error("usage: node scripts/resonate-shaders.mjs <shader-dir> [out.json]");
    process.exit(1);
  }
  const report = auditDirectory(directory);
  const json = `${JSON.stringify({ measuredAt: new Date().toISOString().slice(0, 10), ...report }, null, 2)}\n`;
  if (out) {
    const { writeFileSync } = await import("node:fs");
    writeFileSync(out, json);
    console.error(`wrote ${out}`);
  } else {
    process.stdout.write(json);
  }
}
