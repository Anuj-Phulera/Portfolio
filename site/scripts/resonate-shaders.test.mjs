/**
 * Tests for the shader audit.
 *
 * Two of these exist because the detector was wrong when it was written: a
 * one-line function containing a semicolon did not match the opener pattern,
 * and `main` was reported as an unused helper. Both are held down here so the
 * numbers in the data file cannot drift silently.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  auditDirectory,
  attributionPresent,
  findFunctions,
  lineStats,
  lcsLength,
  nearDuplicates,
  unusedHelpers,
} from "./resonate-shaders.mjs";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const VERTEX = `uniform float uTime;
varying vec3 vColor;

// A vendored-looking helper, written on one line with a semicolon inside it.
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

vec4 taylorInvSqrt(vec4 r){
  return 1.79284291400159 - 0.85373472095314 * r;
}

void main() {
  vec3 pos = position;
  pos += permute(vec4(pos, 1.0)).xyz;
  pos *= taylorInvSqrt(vec4(1.0)).x;
  vColor = pos;
}
`;

const FRAGMENT = `varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = distance(gl_PointCoord, vec2(0.5));
  if (d > 0.5) discard;
  float strength = smoothstep(0.5, 0.1, d);
  gl_FragColor = vec4(vColor, vAlpha * strength);
}
`;

test("a one-line function with a semicolon in its body is found", () => {
  const names = findFunctions(VERTEX).map((fn) => fn.name);
  assert.deepEqual(names, ["permute", "taylorInvSqrt", "main"]);
});

test("an indented call is not mistaken for a definition", () => {
  const names = findFunctions(VERTEX).map((fn) => fn.name);
  assert.ok(!names.includes("mod"), "mod appears only inside permute's body");
  assert.equal(names.filter((name) => name === "permute").length, 1);
});

test("main is an entry point, not an unused helper", () => {
  assert.deepEqual(unusedHelpers(VERTEX), []);
});

test("a defined-but-never-called helper is reported", () => {
  const dead = `vec4 permute(vec4 x){ return x; }
void main() { gl_Position = vec4(0.0); }
`;
  assert.deepEqual(unusedHelpers(dead), ["permute"]);
});

test("a trailing newline is not counted as a line", () => {
  assert.equal(lineStats("void main() {}\n").lines, 1);
  assert.equal(lineStats("void main() {}\n\n").lines, 2);
  assert.equal(lineStats("void main() {}").lines, 1);
});

test("comments are not counted as code", () => {
  const stats = lineStats("// a note\nvoid main() {}\n");
  assert.equal(stats.code, 1);
  assert.equal(stats.comment, 1);
});

test("lcsLength measures how much two programs share", () => {
  assert.equal(lcsLength(["a", "b", "c"], ["a", "b", "c"]), 3);
  assert.equal(lcsLength(["a", "b", "c"], ["a", "x", "c"]), 2);
  assert.equal(lcsLength([], ["a"]), 0);
});

test("two fragments differing in one falloff line are one effect", () => {
  const twin = FRAGMENT.replace("smoothstep(0.5, 0.1, d)", "exp(-d * 6.0)");
  const pairs = nearDuplicates([
    { file: "one.frag", source: FRAGMENT },
    { file: "two.frag", source: twin },
  ]);
  assert.equal(pairs.length, 1);
  assert.deepEqual(pairs[0].files, ["one.frag", "two.frag"]);
  assert.ok(pairs[0].similarity > 0.8);
});

test("two genuinely different programs are not paired", () => {
  const other = `varying vec3 vColor;
void main() {
  vec3 n = normalize(vColor);
  float f = pow(1.0 - dot(n, vec3(0.0, 0.0, 1.0)), 3.0);
  gl_FragColor = vec4(f);
}
`;
  assert.deepEqual(
    nearDuplicates([
      { file: "one.frag", source: FRAGMENT },
      { file: "other.frag", source: other },
    ]),
    [],
  );
});

test("attribution is found when a licence line is present, and not otherwise", () => {
  assert.equal(attributionPresent([{ source: "// Copyright (c) 2011 Ashima Arts" }]), true);
  assert.equal(attributionPresent([{ source: "// Distributed under the MIT License" }]), true);
  assert.equal(attributionPresent([{ source: VERTEX }, { source: FRAGMENT }]), false);
});

test("auditDirectory reads a directory and totals what it finds", () => {
  const directory = mkdtempSync(join(tmpdir(), "shaders-"));
  writeFileSync(join(directory, "a.vert"), VERTEX);
  writeFileSync(join(directory, "b.frag"), FRAGMENT);
  writeFileSync(join(directory, "notes.md"), "ignored");

  const report = auditDirectory(directory);
  assert.equal(report.files, 2, "only .vert and .frag are shader programs");
  assert.equal(report.lines, lineStats(VERTEX).lines + lineStats(FRAGMENT).lines);
  assert.equal(report.attributionPresent, false);
  assert.ok(report.vendoredLines > 0, "permute and taylorInvSqrt are the noise core");
  assert.deepEqual(report.unusedHelpers, [], "permute is called from main here");
});
