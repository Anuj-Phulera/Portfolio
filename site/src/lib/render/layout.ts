import { PROJECTS } from "../../content/projects.ts";
import { NAV, SITE } from "../../content/site.ts";
import { html, type Html } from "../html.ts";
import { absolute, applyBase } from "../paths.ts";
import { toScript, type JsonLd } from "../jsonld.ts";
import { stamp } from "./ui.ts";

export interface Assets {
  css: string[];
  js: string[];
  fonts: string[];
}

export interface ShellOptions {
  title: string;
  description: string;
  path: string;
  body: Html;
  assets: Assets;
  marker?: string;
  structuredData?: JsonLd[];
  noindex?: boolean;
}

function nav(current: string): Html {
  return html`
    <nav class="nav" aria-label="Contents">
      ${NAV.map(
        (item) => html`
          <a href="${item.href}" ${item.href === current ? html`aria-current="page"` : ""}>${item.label}</a>
        `,
      )}
    </nav>
  `;
}

function footer(): Html {
  return html`
    <footer class="foot">
      <div class="shell">
        <div class="foot__grid">
          <div>
            <h2>Entries</h2>
            <ul>
              ${PROJECTS.map(
                (project) => html`
                  <li>
                    <a href="/work/${project.slug}/">${project.name}</a>
                    <span class="foot__stamp">${project.status}</span>
                  </li>
                `,
              )}
            </ul>
          </div>
          <div>
            <h2>Elsewhere</h2>
            <ul>
              <li><a href="/work/">All entries</a></li>
              <li><a href="/notes/the-pattern/">The pattern</a></li>
              <li><a href="/about/">About</a></li>
              <li><a href="/colophon/">Colophon</a></li>
              <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
            </ul>
          </div>
          <div>
            <h2>This site</h2>
            <ul>
              <li><span class="foot__stamp">STATIC HTML</span> no framework</li>
              <li><span class="foot__stamp">3 ISLANDS</span> the rest is native</li>
              <li><a href="${SITE.source}">Read the source</a></li>
            </ul>
          </div>
        </div>
        <div class="foot__base">
          <span>${SITE.name} · built ${SITE.built}</span>
          <span>No analytics, no cookies, no third-party requests.</span>
          <span><a href="/colophon/">What this site weighs</a></span>
        </div>
      </div>
    </footer>
  `;
}

export function documentShell(options: ShellOptions): string {
  const origin = (process.env.SITE_ORIGIN ?? "").replace(/\/$/, "");
  const { title, description, path, body, assets, marker, structuredData = [], noindex = false } = options;
  const fullTitle = path === "/" ? title : `${title} — ${SITE.name}`;
  const shell = (): string => `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHead(fullTitle)}</title>
<meta name="description" content="${escapeHead(description)}">
<meta name="theme-color" content="#f2efe9">
<meta name="color-scheme" content="light">
${noindex ? '<meta name="robots" content="noindex">' : ""}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHead(fullTitle)}">
<meta property="og:description" content="${escapeHead(description)}">
${origin ? `<meta property="og:url" content="${escapeHead(absolute(path))}">` : ""}
${origin ? `<link rel="canonical" href="${escapeHead(absolute(path))}">` : ""}
${assets.fonts.map((href) => `<link rel="preload" href="${href}" as="font" type="font/woff2" crossorigin>`).join("\n")}
${assets.css.map((href) => `<link rel="stylesheet" href="${href}">`).join("\n")}
${structuredData.map((json) => `<script type="application/ld+json">${toScript(json)}</script>`).join("\n")}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="masthead">
  <div class="shell masthead__inner">
    <a class="masthead__name" href="/">${SITE.name}</a>
    <p class="masthead__meta">${SITE.bench} · 2026</p>
    ${nav(path)}
  </div>
</header>
${marker ? `<span class="edge-marker" aria-hidden="true">${escapeHead(marker)}</span>` : ""}
<main id="main">
${body.value}
</main>
${footer().value}
${assets.js.map((src) => `<script type="module" src="${src}"></script>`).join("\n")}
</body>
</html>
`;
  return applyBase(shell());
}

function escapeHead(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export { stamp };
