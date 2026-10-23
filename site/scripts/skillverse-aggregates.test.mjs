import assert from "node:assert/strict";
import { test } from "node:test";
import { aggregate, normaliseDevice, parseCsv } from "./skillverse-aggregates.mjs";

test("the CSV reader handles quotes, escaped quotes and embedded newlines", () => {
  const rows = parseCsv('a,b\n"one, two","say ""hi""\nagain"\n');
  assert.deepEqual(rows[0], ["a", "b"]);
  assert.deepEqual(rows[1], ["one, two", 'say "hi"\nagain']);
});

test("a line count and a record count disagree exactly when they should", () => {
  const csv = 'id,respondent,date\n1,r1,2026-05-01\n2,r2,"a\nb"\n3,r3,2026-05-02\n';
  assert.equal(csv.split("\n").length, 6);
  assert.equal(parseCsv(csv).slice(1).length, 3);
});

test("the device column is normalised rather than counted raw", () => {
  assert.equal(normaliseDevice("TV"), "Television");
  assert.equal(normaliseDevice("tv"), "Television");
  assert.equal(normaliseDevice("T.V"), "Television");
  assert.equal(normaliseDevice("Telivision"), "Television");
  assert.equal(normaliseDevice("Smartphone"), "Smartphone");
  assert.equal(normaliseDevice("Phone and laptop"), "More than one");
  assert.equal(normaliseDevice(""), null);
});

test("aggregation drops identifiers and returns counts only", () => {
  const header = [
    "Submission ID",
    "Respondent ID",
    "Submitted at",
    "How old are you?",
    "How many hours per day do you spend on screens?",
    "What device do you use MOST?",
    "Which platforms do you use regularly?",
    "What % of your screen time is for LEARNING?",
    "What % is for ENTERTAINMENT?",
    "What % is for SOCIALIZING?",
  ];
  const csv = [
    header.join(","),
    "a1,r1,2026-05-01,14,3,Laptop,YouTube,40,30,30",
    "a2,r1,2026-05-02,15,5,TV,YouTube,20,50,30",
  ].join("\n");

  const result = aggregate(parseCsv(csv));
  const text = JSON.stringify(result);
  assert.equal(result.meta.records, 2);
  assert.equal(result.meta.respondents, 1, "two submissions from one respondent");
  assert.ok(!text.includes("a1"), "submission id leaked");
  assert.ok(!text.includes("r1"), "respondent id leaked");
  assert.deepEqual(result.split.map((part) => part.mean), [30, 40, 30]);
  assert.equal(result.device.find((d) => d.label === "Television")?.count, 1);
});

test("rows without a submission id are ignored", () => {
  const header = ["Submission ID", "Respondent ID", "Submitted at", "How old are you?"];
  const result = aggregate(parseCsv([header.join(","), "a1,r1,2026-05-01,14", ",,,"].join("\n")));
  assert.equal(result.meta.records, 1);
});

test("ages outside the survey population are dropped rather than published", () => {
  const header = ["Submission ID", "Respondent ID", "Submitted at", "How old are you?"];
  const result = aggregate(parseCsv([header.join(","), "a1,r1,2026-05-01,14", "a2,r2,2026-05-01,64"].join("\n")));
  assert.deepEqual(result.age, [{ label: "14", count: 1 }]);
});
