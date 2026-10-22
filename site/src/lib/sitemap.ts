import type { Route } from "../content/routes.ts";
import { url } from "./paths.ts";

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * A sitemap for the routes that exist. `lastmod` is the build date, because
 * every page is regenerated on every build — a per-page date would be a guess.
 */
export function sitemapXml(routes: Route[], origin: string, built: string): string {
  const head = '<?xml version="1.0" encoding="UTF-8"?>';
  const body = routes
    .filter((route) => !route.noindex)
    .map(
      (route) =>
        `  <url>\n    <loc>${esc(`${origin}${url(route.path)}`)}</loc>\n    <lastmod>${built}</lastmod>\n    <changefreq>${route.changeFrequency}</changefreq>\n    <priority>${route.priority.toFixed(1)}</priority>\n  </url>`,
    )
    .join("\n");
  return `${head}\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function robotsTxt(origin: string | null): string {
  const lines = ["User-agent: *", "Allow: /"];
  if (origin) lines.push("", `Sitemap: ${origin}${url("/sitemap.xml")}`);
  return `${lines.join("\n")}\n`;
}
