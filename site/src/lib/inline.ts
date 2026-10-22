/**
 * A deliberately tiny inline syntax for prose: *emphasis*, `code`, and
 * [text](/internal-or-https-link). Everything else is escaped text.
 *
 * Deliberately not Markdown. The site has six pages of copy written by one
 * person; a full parser would be a dependency and a failure mode for no gain.
 */

import { Html, esc, raw } from "./html.ts";

const TOKEN = /\*([^*\n]+)\*|`([^`\n]+)`|\[([^\]\n]+)\]\(([^)\s]+)\)/g;

function safeHref(href: string): string | null {
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  if (/^https:\/\/[a-z0-9.-]+(\/\S*)?$/i.test(href)) return href;
  return null;
}

export function inline(text: string): Html {
  let out = "";
  let last = 0;
  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    out += esc(text.slice(last, index));
    const [whole, em, code, linkText, href] = match;
    if (em !== undefined) {
      out += `<em>${esc(em)}</em>`;
    } else if (code !== undefined) {
      out += `<code>${esc(code)}</code>`;
    } else if (linkText !== undefined && href !== undefined) {
      const target = safeHref(href);
      out += target
        ? `<a href="${esc(target)}">${esc(linkText)}</a>`
        : esc(whole);
    }
    last = index + whole.length;
  }
  out += esc(text.slice(last));
  return raw(out);
}
