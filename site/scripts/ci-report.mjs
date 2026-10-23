#!/usr/bin/env node
/**
 * Turn a Playwright JSON report into a pull-request comment.
 *
 * The build machine cannot reach the Actions log storage, so the failure detail
 * has to be delivered through a channel that does work. A comment is also the
 * right place for it: the person reviewing the PR sees what broke without
 * downloading a trace.
 *
 * Usage: node scripts/ci-report.mjs <pr-number> [results.json]
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const prNumber = process.argv[2];
const file = process.argv[3] ?? "results.json";

if (!prNumber) {
  console.error("usage: ci-report.mjs <pr-number> [results.json]");
  process.exit(1);
}

if (!existsSync(file)) {
  console.log("no results file; nothing to report");
  process.exit(0);
}

const report = JSON.parse(readFileSync(file, "utf8"));

/** Walk Playwright's nested suites to find the failing tests. */
function collect(suite, out = []) {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests ?? []) {
      const failed = test.results?.some((result) => result.status === "failed" || result.status === "timedOut");
      if (!failed) continue;
      const result = test.results.find((r) => r.status === "failed" || r.status === "timedOut");
      out.push({
        title: spec.title,
        project: test.projectName ?? suite.title,
        line: spec.line,
        file: spec.file?.replace(/^.*\/tests\/browser\//, "") ?? "",
        error: (result?.error?.message ?? result?.error?.value ?? "no message")
          .replace(/\u001b\[[0-9;]*m/g, "")
          .split("\n")
          .slice(0, 6)
          .join("\n"),
      });
    }
  }
  for (const child of suite.suites ?? []) collect(child, out);
  return out;
}

const failures = (report.suites ?? []).flatMap((suite) => collect(suite));
const stats = report.stats ?? {};

if (failures.length === 0) {
  console.log(`no failures in ${file}`);
  process.exit(0);
}

const body = [
  `### Browser suite: ${stats.unexpected ?? failures.length} failing`,
  "",
  `${stats.expected ?? "?"} passed · ${stats.unexpected ?? "?"} failed · ${stats.flaky ?? 0} flaky`,
  "",
  ...failures.map(
    (failure) =>
      [
        `**${failure.project} · ${failure.file}:${failure.line} — ${failure.title}**`,
        "",
        "```",
        failure.error,
        "```",
        "",
      ].join("\n"),
  ),
].join("\n");

try {
  execFileSync("gh", ["pr", "comment", String(prNumber), "--body-file", "-"], { input: body, stdio: ["pipe", "inherit", "inherit"] });
  console.log(`posted ${failures.length} failure(s) to #${prNumber}`);
} catch (error) {
  console.error("could not post comment:", String(error));
  console.log(body);
}
