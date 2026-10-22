/**
 * Base-path handling.
 *
 * The site is written with root-absolute links ("/work/"), which is correct at
 * a domain root and wrong on a project page ("/Portfolio/work/"). Rather than
 * threading a prefix through every renderer, the prefix is applied once to the
 * finished HTML. One rule, one place, one test.
 */

/** Normalise SITE_BASE to either "/" or "/something/". */
export function normaliseBase(input: string | undefined): string {
  const value = (input ?? "/").trim();
  if (value === "" || value === "/") return "/";
  const withLeading = value.startsWith("/") ? value : `/${value}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

/** Join a site-absolute path onto the base. */
export function url(path: string, base: string = normaliseBase(process.env.SITE_BASE)): string {
  if (base === "/") return path;
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Rewrite root-absolute href/src attributes onto the base. Idempotent: a URL
 * that already starts with the base is left alone.
 */
export function applyBase(html: string, base: string = normaliseBase(process.env.SITE_BASE)): string {
  if (base === "/") return html;
  const prefix = base.replace(/\/$/, "");
  return html.replace(
    /(\s(?:href|src|content)=")(\/(?!\/)[^"]*)(")/g,
    (_match, before: string, path: string, after: string) => {
      if (path === prefix || path.startsWith(`${prefix}/`)) return `${before}${path}${after}`;
      return `${before}${prefix}${path}${after}`;
    },
  );
}

/** The site's public origin, without a trailing slash. Empty until deployed. */
export const ORIGIN = (process.env.SITE_ORIGIN ?? "").replace(/\/$/, "");

/** An absolute URL for canonical tags and the sitemap. */
export function absolute(path: string): string {
  return `${ORIGIN}${url(path)}`;
}
