/**
 * Guards on the shader audit.
 *
 * The data file holds measurements of six GLSL files that are not in this
 * repository. These tests keep it that way, and stop the numbers drifting away
 * from each other if someone edits one and not the rest.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const report = JSON.parse(
  readFileSync(new URL("./resonate-shaders.json", import.meta.url), "utf8"),
) as {
  measuredAt: string;
  files: number;
  lines: number;
  codeLines: number;
  vendoredLines: number;
  attributionPresent: boolean;
  vendoredIn: string[];
  programs: {
    file: string;
    stage: string;
    lines: number;
    code: number;
    comment: number;
    vendoredLines: number;
    writtenHere: number;
    unused: string[];
  }[];
  unusedHelpers: { file: string; names: string[] }[];
  similarPrograms: { files: string[]; similarity: number }[];
};

test("the audit covers the three pairs the entry claims", () => {
  assert.equal(report.files, 6);
  const names = report.programs.map((program) => program.file).sort();
  assert.deepEqual(names, [
    "glass.frag",
    "glass.vert",
    "neural.frag",
    "neural.vert",
    "singularity.frag",
    "singularity.vert",
  ]);
});

test("no GLSL source text is stored, only measurements", () => {
  const raw = readFileSync(new URL("./resonate-shaders.json", import.meta.url), "utf8");
  assert.ok(!raw.includes("gl_FragColor"), "a fragment body leaked into the data");
  assert.ok(!raw.includes("gl_Position"), "a vertex body leaked into the data");
  assert.ok(!raw.includes("uniform"), "a declaration leaked into the data");
  assert.ok(raw.length < 4096, `data file is ${raw.length} bytes; keep it small`);
});

test("each program's lines add up", () => {
  for (const program of report.programs) {
    assert.ok(
      program.lines >= program.code + program.comment,
      `${program.file}: more counted lines than exist`,
    );
    assert.equal(
      program.code,
      program.vendoredLines + program.writtenHere,
      `${program.file}: code does not split into vendored and original`,
    );
  }
});

test("the totals agree with the programs they summarise", () => {
  const sum = (pick: (p: (typeof report.programs)[number]) => number): number =>
    report.programs.reduce((total, program) => total + pick(program), 0);

  assert.equal(report.lines, sum((program) => program.lines));
  assert.equal(report.codeLines, sum((program) => program.code));
  assert.equal(report.vendoredLines, sum((program) => program.vendoredLines));
});

test("the vendored code carries no attribution", () => {
  assert.equal(report.attributionPresent, false);
  assert.deepEqual(report.vendoredIn, ["neural.vert", "singularity.vert"]);
  assert.ok(report.vendoredLines > 0);
});

test("the two soft-point fragments are reported as one effect", () => {
  const pair = report.similarPrograms.find(
    (entry) => entry.files.includes("neural.frag") && entry.files.includes("singularity.frag"),
  );
  assert.ok(pair, "the pair should be present");
  assert.ok(pair.similarity >= 0.8 && pair.similarity < 1, "near-identical, not identical");
});

test("the dead helpers in singularity.vert are recorded", () => {
  const entry = report.unusedHelpers.find((item) => item.file === "singularity.vert");
  assert.ok(entry);
  assert.deepEqual(entry.names.sort(), ["permute", "taylorInvSqrt"]);
});

test("the audit says when it was taken", () => {
  assert.match(report.measuredAt, /^\d{4}-\d{2}-\d{2}$/);
});
