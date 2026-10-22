/**
 * Structured data, generated from the same content the pages use.
 *
 * Deliberately narrow: a Person, a WebSite, and one CreativeWork per entry. No
 * ratings, no prices, no aggregate counts — a portfolio that invents schema
 * metadata is doing the same thing as one that invents testimonials.
 */

import type { Project } from "../content/types.ts";
import { SITE } from "../content/site.ts";
import { absolute, ORIGIN } from "./paths.ts";

/** Absolute URLs only: a relative URL in JSON-LD is silently ignored. */
function maybeUrl(path: string): Record<string, string> {
  return ORIGIN ? { url: absolute(path) } : {};
}

export interface JsonLd {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
}

export function personJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    ...maybeUrl("/"),
    jobTitle: "Software engineer",
    knowsAbout: ["interface design", "distributed systems", "embedded systems", "data visualisation"],
    sameAs: [SITE.github],
  };
}

export function siteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    ...maybeUrl("/"),
    description: SITE.description,
    inLanguage: "en-GB",
    author: { "@type": "Person", name: SITE.name },
  };
}

/** One entry, described by what the entry itself says — nothing extra. */
export function projectJsonLd(project: Project): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    headline: project.tagline,
    ...maybeUrl(`/work/${project.slug}/`),
    abstract: project.question,
    dateCreated: project.year,
    creator: { "@type": "Person", name: SITE.name },
    codeRepository: project.repos[0]?.href,
    creativeWorkStatus: project.status,
  };
}

/** Serialise for a <script type="application/ld+json"> block. */
export function toScript(json: JsonLd): string {
  // Escaping "<" prevents a string value from closing the script element.
  return JSON.stringify(json).replace(/</g, "\\u003c");
}
