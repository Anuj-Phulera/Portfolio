# STRATA / DEEP FIELD (`WEBE`)

**Inspected:** `e8795c8` · 2026-10-18 · Vite, TypeScript, no UI framework, 25 source files
**One line:** an astronomy atlas whose interface restructures itself around how you read.

## Verified, to the object

- `src/content/graph.ts` — **35 nodes** and **79 edges**, each edge typed (`origin-of`, `evidence-for`, `powered-by`, `measured-by`, `contrasts-with` …). The README's counts are exact.
- `src/engine/`: `classify.ts` 244 lines, `decide.ts` 243, `genome.ts` 225, `store.tsx` 486.
- `src/modes/`: **six** distinct interface paradigms — `Constellation`, `Mosaic`, `Codex`, `Lattice`, `Console`, `Zen`.
- `scripts/smoke.mjs` uses **jsdom + esbuild to render the real app**, then plays three visitor types and asserts the engine restructures. `scripts/live-check.mjs` drives the built site with two visitors. `scripts/screenshot.mjs`.
- Commit messages describe behaviour, not vibes: *"read motion and patience: cadence signal, pointer velocity, honest edge semantics"*, *"make the publish script non-destructive"*.

## What is genuinely novel

Most "adaptive" interfaces change *appearance*. STRATA changes **structure**: which paradigm is active, what is available, what the navigation is. It also implements the thing that makes adaptation trustworthy:

- it waits for **evidence** (a confident read plus a clear margin over the runner-up);
- it **rate-limits** itself (no more than once every nine seconds, per the README);
- it **explains what changed and why**;
- it lets you **pin** a structure and disable the engine;
- it **never loses your place**.

That list is the actual intellectual property. Not the six modes — the **terms under which the interface is allowed to change.**

## Limitations

- Live site (`uchiha-madara-anuj.github.io/WEBE`) cannot be reached from this environment: **U**.
- Single-user, local-persistence only; no backend, no accounts.
- Content is astronomy, not the author's own life. Its thesis is proven on neutral material.

## Why it should anchor the portfolio

It is the only artefact where the claim and the verification were designed together. It also yields a design principle that is rare and portable:

> **An interface earns the right to change by explaining itself.**

If the portfolio adapts to a visitor at all — and that is an open question — it must inherit STRATA's constraints, not just its mechanism.
