# The site

The portfolio itself. Direction C from `PREP/05-directions/` — a bench of
operable miniatures — with the receipt discipline of Direction A and the
held-frame pacing of Direction B. The recommendation and its reasoning are in
`PREP/05-directions/comparison.md`; the local decision record is in
`docs/decisions/0001-instrument-as-spine.md`.

## What is here

```
build.ts              renders 12 pages, gates on the claims ledger, measures the build
src/content/          typed copy: six entries, three instruments, two prose pages
src/lib/              ledger, escaping, inline syntax, rendering, the three instruments
src/islands/          the only JavaScript on the site: mode engine, dial, ledger slicer
src/styles/           tokens, base, layout, components, pages, print
public/               favicon, robots.txt
dist/                 the built site (generated, not committed)
docs/                 decisions, content policy, accessibility, performance
```

## Run it

```bash
npm install
npm run build      # build.ts → dist/
npm run serve      # static preview on 0.0.0.0:4173
npm test           # 38 tests, no browser required
npm run check      # tsc --noEmit
```

`node build.ts` needs no compiler: Node 22 strips the types. Vite is used only
to bundle `src/islands/main.ts` and the stylesheet; everything else is a plain
Node script writing files.

## The rule

Every factual sentence that needs defending is a `receipt` block with a ledger
id. At build time:

1. every cited id must exist and be marked `publish` or `publish-with-caveat`;
2. no text from a `do-not-publish` or `internal-only` entry may appear verbatim
   in the output;
3. the build stops, with the offending ids, if either fails.

That is why `build.ts` prints how many claims were cited and how many are
blocked. It is not decoration: it is the only reason the copy can be trusted.

## Numbers

Measured by `build.ts` on every run and printed at the end:

| | |
|---|---|
| pages | 12 |
| HTML, all pages, gzip | 37.6 KB |
| CSS, gzip | 6.0 KB |
| JavaScript, gzip | 1.7 KB |
| fonts, latin subsets | 36.1 KB |
| total transfer | 81.4 KB |

Budgets are enforced by `tools/quality/site-budget.mjs`: js 12 KB, css 12 KB,
largest page 8 KB, fonts 40 KB, total 100 KB.

## What is not done

- No browser was available while this was built. Layout, focus order and the
  reduced-motion path are checked by script and by reading, not by watching.
- Deployment is not configured. `SITE_BASE` exists so a project-page deploy can
  be rooted at a subpath, but no host has been chosen.
- Three instruments, not the four in the direction document. The fourth is the
  cloth-covered object on the home page, which is an honest placeholder rather
  than an instrument.
