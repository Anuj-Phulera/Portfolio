# Technical feasibility assessment

No stack is locked. What follows is the decision space, with the trade-offs that actually matter for this project.

## What the site must do

- Serve mostly static long-form content with exact URLs.
- Support 2–4 bespoke interactive moments, one of which may be a small WebGL or canvas instrument.
- Work without JavaScript for reading.
- Respect reduced motion, keyboard and screen readers by construction.
- Load fast on a mid-range phone in India.
- Be maintainable by one student between school terms.

## Options

| Option | Strength | Cost | Verdict |
|---|---|---|---|
| **Astro + islands** | Ships almost no JS by default; each interactive moment is an isolated island; excellent for content sites | New mental model if unfamiliar; fewer ready-made patterns | **Strongest technical fit** |
| **Next.js static export** | Familiar from existing projects; large ecosystem; MDX easy | Hydration surface is large; needs discipline to keep JS small; App Router complexity for a mostly-static site | **Strongest familiarity fit** |
| **Vite + React SPA** | Simple, fast dev; full control | No per-route HTML; weaker first paint and SEO; needs routing work | Fine for a prototype; wrong for publication |
| **Plain HTML/CSS/TS** | Zero framework, best possible performance | Manual templating and routing; content duplication risk | Viable, and a deliberate statement |

## Recommendation (not a decision)

**Astro with React islands only where interaction demands it**, because the site is 80% reading and the performance budget is tight. If the subject prefers to stay in a familiar stack, **Next.js static export** is acceptable — provided the first-route JS budget is enforced from day one.

The honest tie-breaker: whichever stack the subject will still be able to maintain in a year, alone, without re-learning it.

## Motion

Start with the dependency-free baseline in `../07-motion-lab/`. Add one library only for sequences the baseline cannot express, and record the specific sequence and reason in the decision log. GSAP's licence is "standard no-charge", not MIT — read it before shipping.

## Content

MDX files in the repository, one per project, validated against the claims ledger at build time. No CMS unless editing becomes a bottleneck; a CMS adds a dependency and a failure mode for a single author.

## Hosting

Vercel (familiar, free tier) or GitHub Pages (already used for STRATA). Either is acceptable. Whichever is chosen, the build must be reproducible from a clean clone and the deploy must be reversible.

## Testing

- `node --test` for logic (already in use here).
- Playwright for the interactions and the accessibility smoke pass, **once a real browser is available**. Not installed in this environment.
- The manual procedures in `../08-quality/` are not optional extras; they are the only way to verify what scripts cannot.

## Feasibility verdict

| Requirement | Feasible? | Note |
|---|---|---|
| Static, fast, accessible reading experience | Yes | Well-understood |
| One operable instrument (STRATA miniature) | Yes, with effort | The engine logic already exists; the work is the interface |
| Four instruments | Risky | Each is a small product |
| Custom shaders | Feasible | Existing code to learn from; keep to one scene |
| Optional sound design | Feasible, low priority | Consent architecture already tested |
| Full 3D navigation | Not recommended | Budget and accessibility cost outweigh the benefit |

## The constraint that decides everything

**One person, alone, to a finished standard.** Any feature that cannot be finished should be cut before it is started, not after.
