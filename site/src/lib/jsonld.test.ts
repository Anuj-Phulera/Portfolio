import assert from "node:assert/strict";
import { test } from "node:test";
import { personJsonLd, projectJsonLd, siteJsonLd, toScript } from "./jsonld.ts";
import { PROJECTS } from "../content/projects.ts";

test("the person record names the person and nothing invented", () => {
  const json = personJsonLd();
  assert.equal(json["@type"], "Person");
  assert.equal(json.name, "Anuj Phulera");
  assert.ok(!("award" in json));
  assert.ok(!("email" in json));
});

test("the site record is a WebSite with a description", () => {
  const json = siteJsonLd();
  assert.equal(json["@type"], "WebSite");
  assert.ok(String(json.description).length > 40);
});

test("every entry produces a CreativeWork carrying its own status", () => {
  for (const project of PROJECTS) {
    const json = projectJsonLd(project);
    assert.equal(json["@type"], "CreativeWork");
    assert.equal(json.name, project.name);
    assert.equal(json.creativeWorkStatus, project.status);
    assert.equal(json.codeRepository, project.repos[0]?.href);
  }
});

test("serialisation cannot break out of the script element", () => {
  const evil = { ...personJsonLd(), name: "</script><script>alert(1)</script>" };
  const out = toScript(evil);
  assert.ok(!out.includes("</script>"));
  assert.ok(out.includes("\\u003c/script"));
});

test("url fields are absolute or absent, never relative", () => {
  const out = toScript(personJsonLd());
  if (out.includes('"url"')) assert.match(out, /"url":"https:\/\//);
});

test("the output is valid JSON after unescaping", () => {
  const project = PROJECTS[0];
  assert.ok(project);
  const out = toScript(projectJsonLd(project));
  const parsed = JSON.parse(out.replace(/\\u003c/g, "<")) as Record<string, unknown>;
  assert.equal(parsed["@context"], "https://schema.org");
});
