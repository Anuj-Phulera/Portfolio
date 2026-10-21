# Motion tooling — measured, not assumed

Data pulled from the npm registry and GitHub API on **2026-10-21**. Licences and versions change; re-check before committing to a stack.

| Package | Latest | Licence (as published) | Repository | Last push | Notes |
|---|---|---|---|---|---|
| `gsap` | 3.15.0 | "Standard 'no charge' license" (not OSI) | greensock/GSAP | 2026-04-13 | Free for the standard license; terms are not MIT. Read them before shipping. |
| `lenis` | 1.3.27 | MIT | darkroomengineering/lenis | 2026-10-18 | Smooth scroll; small surface area; very active. |
| `animejs` | 4.5.0 | MIT | juliangarnier/anime | 2026-08-21 | Animation engine; v4 API differs substantially from v3. |
| `three` | 0.186.1 | MIT | mrdoob/three.js | 2026-10-21 | Very active; large bundle if used carelessly. |
| `@react-three/fiber` | 9.8.2 | MIT | pmndrs/react-three-fiber | 2026-10-21 | React renderer for three. |
| `motion` | 14.5.0 | MIT | motiondivision/motion | 2026-10-21 | Formerly Framer Motion; React + vanilla. |
| View Transitions API | spec | WICG repo (NOASSERTION) | WICG/view-transitions | 2026-08-21 | Browser-native; needs progressive enhancement. |

## What each is actually for

- **GSAP** — timeline sequencing with precise control over overlapping elements. Its real advantage is not "smoothness" but **orchestration**: one timeline, many actors, exact offsets. The licence is the thing to check, not the API.
- **Lenis** — a scroll-normalisation layer. It changes the *feel* of scrolling globally, which means it is also an accessibility decision. If used, it must respect reduced motion and never hijack keyboard scrolling.
- **anime.js** — small, declarative, good for targeted micro-sequences and SVG. Not a scroll orchestration system.
- **Motion** — React-first, layout animations, gestures; strong when the UI is componentised.
- **three / R3F** — only when a real 3D scene answers a question. A particle field that could be a CSS gradient is a 500 KB excuse.
- **View Transitions** — the cheapest way to make page-to-page changes feel authored, with a built-in fallback when unsupported.

## The decision this brief actually needs

Not "which library," but **which layer owns motion**:

1. **CSS + native APIs** (transitions, scroll-driven animations, View Transitions) — smallest payload, best accessibility defaults.
2. **One imperative timeline library** (GSAP or anime.js) for a small number of authored sequences.
3. **A 3D layer** (three/R3F) only for a scene that cannot exist otherwise.

The order matters. Start at 1. Add 2 for the two or three moments that deserve choreography. Add 3 only if the concept dies without it.

## Accessibility constraints that apply to every option

- `prefers-reduced-motion` is a hard requirement, not a nicety: it must remove *parallax, pinned scroll, autoplay and large travel*, not merely shorten durations.
- Scroll hijacking must never remove native keyboard paging or find-in-page behaviour.
- Every animated reveal must have a non-animated end state that is readable if the animation never runs.

## Verdict for this project (provisional — not a locked stack)

The experiments in `../../07-motion-lab/` are built with **no libraries at all**, to establish what the browser can already do. That baseline is the honest starting point: add a dependency only when an experiment proves the native approach insufficient.
