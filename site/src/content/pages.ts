import type { Block } from "./types.ts";

export interface Page {
  slug: string;
  kicker: string;
  title: string;
  lede: string;
  description: string;
  blocks: Block[];
}

export const THE_PATTERN: Page = {
  slug: "/notes/the-pattern/",
  kicker: "NOTE 01",
  title: "The pattern",
  lede: "Thirty-four claims were audited. Every number was right. Every feeling was aspirational.",
  description:
    "An audit of 34 claims across eight repositories found that countable claims were exact and experiential claims were not. What changed afterwards.",
  blocks: [
    {
      kind: "prose",
      text:
        "I asked for an audit of my own repositories expecting a list of typos. What came back was a pattern. Routes, objects, edges, CSV lines, lines of audio: every countable claim was exact. The claims about how the work felt were not.",
    },
    {
      kind: "facts",
      title: "Thirty-four claims, five grades",
      rows: [
        ["Verified against source", "14"],
        ["Partial — true with a gap", "4"],
        ["Unverifiable without credentials or a browser", "7"],
        ["Aspirational", "1"],
        ["Contradicted by the source", "8"],
      ],
    },
    {
      kind: "prose",
      text:
        "The drift is editorial, not moral. A number gets counted because it is countable. A feeling gets written because it sounds like the thing you meant. Both are descriptions of the same project, and only one of them can be checked by a stranger.",
    },
    { kind: "quote", text: "The legend is written first; the proof arrives later.", cite: "What the audit found, in one line" },
    {
      kind: "instrument",
      id: "ledger",
      caption:
        "The actual ledger, loaded at build time. Thirty-four claims, filterable by grade. The numbers in this instrument are the same JSON the build uses to decide what this site is allowed to say.",
    },
    {
      kind: "list",
      title: "What I changed after reading it",
      items: [
        "Removed the Three.js badge. The background is a 2D canvas, deliberately, so the product scenes keep the GPU — that is the better story and it was already in the source comment.",
        "Deleted an 18-second loading claim. The source says 4.5 seconds in every commit that exists.",
        "Removed a WCAG AA badge. No audit had been run, so there was nothing behind it.",
        "Withdrew a marketing site from presentation rather than fix its copy around the claims.",
        "Stopped calling rendered illustrations screenshots.",
        "Wrote the missing data as missing: `DATE: NOT RECORDED` instead of an invented date.",
      ],
    },
    {
      kind: "prose",
      text:
        "None of that is an achievement. A corrected claim costs a commit. A false one costs every other claim on the same page, which is a much worse trade for a portfolio whose only advantage is that it can be checked.",
    },
    {
      kind: "prose",
      text:
        "This site runs on the same rule. Every factual sentence in an entry resolves to a claim id, and the build refuses to compile if the id is marked do-not-publish. The evidence panel opens beneath the sentence it supports. If JavaScript fails, the panel is a `<details>` element and still opens.",
    },
  ],
};

export const ABOUT: Page = {
  slug: "/about/",
  kicker: "THE PERSON",
  title: "About",
  lede: "I build software, mostly systems that have to be trusted by someone who cannot see inside them.",
  description:
    "Anuj Phulera: what this record is, how the work on it is checked, and what it does not claim.",
  blocks: [
    {
      kind: "prose",
      text:
        "Six entries on this bench: an adaptive reading interface, a vertical farm and its control room, a research product built on a survey, an e-waste platform, a shader-driven narrative that never shipped, and a private site about distance. Eight repositories. This site is the ninth project, and it is on the bench too.",
    },
    {
      kind: "prose",
      text:
        "I am not going to describe myself with adjectives. The useful thing about a portfolio is not what its author says about himself; it is whether a stranger can check the work and then imagine what he would build next.",
    },
    {
      kind: "list",
      title: "What this record is for",
      items: [
        "To show the work without a grid that makes six unlike things look identical.",
        "To let you operate three of the systems instead of reading about them.",
        "To publish the parts that did not work, in the same typography as the parts that did.",
        "To make every claim openable, so that believing it is optional.",
      ],
    },
    {
      kind: "facts",
      title: "What is not claimed here",
      rows: [
        ["Users", "none counted"],
        ["Revenue", "none"],
        ["Awards", "none"],
        ["Accessibility conformance", "no audit run"],
        ["Production readiness", "not asserted"],
        ["Performance on real devices", "not tested here"],
      ],
    },
    {
      kind: "prose",
      text:
        "Where a fact is missing, the site says so instead of estimating. That is not a disclaimer bolted to the bottom of the page; it is the reason the entries can be trusted where they are confident.",
    },
    {
      kind: "prose",
      text:
        "The method is in [the pattern](/notes/the-pattern/): 34 claims, graded against source, 10 of them blocked from publication. The build, the budgets and the things that remain unfinished are in [the colophon](/colophon/).",
    },
    {
      kind: "aside",
      label: "Contact",
      text:
        "anuj.phulera.work@gmail.com — the only inbox I actually read. No form on this site, because a form is a promise to maintain a form.",
    },
  ],
};

export interface BuildMetrics {
  pages: number;
  htmlBytes: number;
  cssBytes: number;
  jsBytes: number;
  fontBytes: number;
}

export function colophonPage(metrics: BuildMetrics, claims: { total: number; publishable: number; blocked: number }): Page {
  return {
    slug: "/colophon/",
    kicker: "ENTRY 09",
    title: "Colophon",
    lede: "This site is the ninth project. It is built the same way as the other eight: a claim, and then the thing that checks it.",
    description:
      "How this site is built: no framework, three JavaScript islands, static HTML for every page, weights measured at build time, and the checks that run before it ships.",
    blocks: [
      {
        kind: "prose",
        text:
          "Every page is written to static HTML by a Node build script. There is no framework, no client-side router and no hydration. Three islands of JavaScript — the mode engine, the watering dial and the ledger slicer — are loaded together in one small bundle. Everything else is native: the evidence panels are `<details>`, the contents is a list, and the object under the cloth is a `<details>` too.",
      },
      {
        kind: "facts",
        title: "Weights, measured at build time",
        rows: [
          ["Pages", String(metrics.pages)],
          ["HTML, all pages", kb(metrics.htmlBytes)],
          ["CSS", kb(metrics.cssBytes)],
          ["JavaScript", kb(metrics.jsBytes)],
          ["Fonts, latin subsets", kb(metrics.fontBytes)],
          ["First load, home", kb(metrics.htmlBytes / metrics.pages + metrics.cssBytes + metrics.jsBytes + metrics.fontBytes)],
        ],
      },
      {
        kind: "prose",
        text:
          "The numbers above are written by the build, not typed by hand. If the site gets heavier, this page changes by itself, and `tools/quality/bundle-budget.mjs` fails the build when a budget is crossed.",
      },
      {
        kind: "facts",
        title: "Claims",
        rows: [
          ["Entries in the ledger", String(claims.total)],
          ["Clear to publish", String(claims.publishable)],
          ["Blocked by the audit", String(claims.blocked)],
          ["Citations resolved at build time", "all"],
        ],
      },
      {
        kind: "list",
        title: "What runs before it ships",
        items: [
          "Content tests: escaping, inline syntax, claims parsing, the citation gate.",
          "A claims gate that refuses to build if a page cites a do-not-publish entry.",
          "A static accessibility checker over every generated page.",
          "A link and anchor checker over every internal href.",
          "A bundle budget measured against the real files on disk.",
        ],
      },
      {
        kind: "list",
        title: "What this build generates",
        items: [
          "Twelve pages, each with its own title, description and canonical URL.",
          "A sitemap and a robots file that points at it.",
          "Structured data: a Person, a WebSite, and one CreativeWork per entry — no ratings, no counts, nothing the copy does not say.",
          "A claims gate that stops the build if a blocked claim is cited or printed.",
        ],
      },
      {
        kind: "aside",
        label: "What is not finished",
        text:
          "No browser was available while this was built. Layout, focus order, the reduced-motion path and the three islands have been checked by script and by reading, not by watching; the browser pass is written down as a checklist in the repository. A deployment workflow exists, but publishing needs one manual switch that this machine cannot reach.",
      },
      {
        kind: "prose",
        text:
          "The source is [the same repository](https://github.com/Anuj-Phulera/Portfolio), including the claims ledger this site is generated from and the audit that produced it. A portfolio that asks to be trusted should be inspectable.",
      },
      {
        kind: "next",
        text:
          "Type is Space Grotesk and IBM Plex Mono, both SIL Open Font License, self-hosted. No analytics, no cookies, no third-party requests at runtime.",
      },
    ],
  };
}

function kb(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`;
}
