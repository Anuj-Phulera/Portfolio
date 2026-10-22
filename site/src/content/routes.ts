/**
 * Every page the site publishes, in one list.
 *
 * The build, the sitemap, the tests and the navigation all read this, so a page
 * cannot exist in one of them and be missing from another. Descriptions are
 * derived from the content modules rather than retyped here.
 */

import { ABOUT, THE_PATTERN } from "./pages.ts";
import { PROJECTS } from "./projects.ts";
import { SITE } from "./site.ts";

export type RouteKind = "home" | "index" | "entry" | "note" | "about" | "colophon" | "error";

export interface Route {
  path: string;
  file: string;
  kind: RouteKind;
  title: string;
  description: string;
  priority: number;
  changeFrequency: "monthly" | "yearly";
  /** Kept out of the sitemap and marked noindex. */
  noindex?: boolean;
}

export const ROUTES: Route[] = [
  {
    path: "/",
    file: "index.html",
    kind: "home",
    title: SITE.title,
    description: SITE.description,
    priority: 1,
    changeFrequency: "monthly",
  },
  {
    path: "/work/",
    file: "work/index.html",
    kind: "index",
    title: "Entries",
    description: "Six entries, eight repositories, five statuses. The record, with the unfinished parts left visible.",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  ...PROJECTS.map(
    (project, index): Route => ({
      path: `/work/${project.slug}/`,
      file: `work/${project.slug}/index.html`,
      kind: "entry",
      title: project.name,
      description: project.tagline,
      priority: index === 0 ? 0.9 : 0.8,
      changeFrequency: "monthly",
    }),
  ),
  {
    path: THE_PATTERN.slug,
    file: "notes/the-pattern/index.html",
    kind: "note",
    title: THE_PATTERN.title,
    description: THE_PATTERN.description,
    priority: 0.8,
    changeFrequency: "yearly",
  },
  {
    path: ABOUT.slug,
    file: "about/index.html",
    kind: "about",
    title: ABOUT.title,
    description: ABOUT.description,
    priority: 0.7,
    changeFrequency: "yearly",
  },
  {
    path: "/colophon/",
    file: "colophon/index.html",
    kind: "colophon",
    title: "Colophon",
    description:
      "How this site is built: no framework, three JavaScript islands, static HTML for every page, weights measured at build time, and the checks that run before it ships.",
    priority: 0.6,
    changeFrequency: "yearly",
  },
  {
    path: "/404.html",
    file: "404.html",
    kind: "error",
    title: "Not found",
    description: "This page is not on the bench.",
    priority: 0,
    changeFrequency: "yearly",
    noindex: true,
  },
];

export function routeByPath(path: string): Route | undefined {
  return ROUTES.find((route) => route.path === path);
}

export const INDEXABLE = ROUTES.filter((route) => !route.noindex);
