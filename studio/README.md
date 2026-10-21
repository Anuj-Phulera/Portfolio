# Motion Studio

A working studio of motion techniques. **Not the portfolio** — an instrument bench where each demo answers one stated question.

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 25 tests
npm run build    # typecheck + production build
```

## The seven stages

| # | Technique | Question it answers |
|---|---|---|
| 01 | GSAP timeline from a pacing model | Can a cut sequence be scheduled in code instead of nudged by eye? |
| 02 | anime.js staggered words | Can type move without fragmenting what a screen reader reads? |
| 03 | Pointer depth | How little motion still reads as depth — and what happens on touch? |
| 04 | IntersectionObserver reveals | What changes when content arrives once and stays? |
| 05 | Lenis progress | Does smooth scrolling break a position readout? |
| 06 | View Transitions | Can the platform alone make a state change feel authored? |
| 07 | Web Audio | Can consent be architectural rather than a setting? |
| 08 | CSS `animation-timeline` | How much scroll animation can run without JS? |
| 09 | Pointer + keyboard + ARIA | What must a drag control implement to be usable by everyone? |
| 10 | Data integrity | What must a statistic prove before it is shown? |

## Structure

```
src/
  core/     preference · pacing · scroll · dom · registry · capability
  demos/    one file per stage, all destroyable
  styles/   tokens · base · stage composition
  test/     unit + integration (jsdom)
docs/       architecture · stages · performance · accessibility · defects · ADRs
```

Each demo exports a mount function that returns a `destroy()`. The page tears down and remounts everything when the motion preference changes, so the reduced path is genuinely executed rather than described.

## Measured facts

- Production bundle: **51 KB gzipped** for HTML + CSS + JS, including Lenis, anime.js and GSAP.
- Tests: **49**, across 10 files, including an integration test that mounts every stage in jsdom.
- Static accessibility check: **0 findings** on the built page.
- Known defects: **6 logged, 1 fixed** — see `docs/defects.md`.
- Motion durations live in one token block; the reduced path zeroes them at the root.

## What this studio does not do

- It is not responsive-polished beyond 360–1440 px assumptions; that needs a device.
- Nothing here has been visually verified: **no browser is available in this environment.**
- It makes no accessibility conformance claim. The reduced-motion and keyboard paths are designed, not audited.

## Documentation

- [`docs/architecture.md`](docs/architecture.md) — layers, rules, test strategy
- [`docs/stages.md`](docs/stages.md) — every question, every reduced path, rejected ideas
- [`docs/performance.md`](docs/performance.md) — measured gzip, and what it omits
- [`docs/accessibility.md`](docs/accessibility.md) — implemented, not implemented, gaps
- [`docs/defects.md`](docs/defects.md) — open defects with severity
- [`docs/decisions/`](docs/decisions/) — four ADRs

## Bugs the tests found

1. The pacing test's expected timeline omitted a 700 ms dissolve, so the assertion was wrong by exactly one transition. Corrected in the test, with the arithmetic written out.
2. `data-line` was empty in the real page, so the word-reveal demo would have rendered a blank line. The component now reads the element's own text, which also means the sentence is readable with JavaScript off.
