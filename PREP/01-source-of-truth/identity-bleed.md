# Identity bleed between projects

Four projects share one visual skeleton. This file records it precisely, because the eventual portfolio must not become the fifth.

## The shared skeleton

| Element | VERDE compendium | NIRMAN site | RESONATE | RAKSHABANDHAN |
|---|---|---|---|---|
| Dark base palette | yes | yes | yes | yes |
| Boot / loader sequence | `BootCurtain` | `GenesisLoader` | terminal | "fresh visit" intro |
| Terminal capitals / HUD labels | `LiveTerminal`, `ScrambleText` | throughout | CLI waitlist | `SYSTEM LOG` |
| Pinned or hijacked scroll | `HorizontalDeck` | v6–v9, abandoned | scroll narrative | chapter routes |
| Mono + condensed display type | IBM Plex Mono + Oswald | mono + display | — | Space Mono + Oswald |
| Particle / field background | `NeuralField` (2D) | `HeroFluid` (R3F) | `neural.frag` | `particles.jsx` |
| Custom cursor | yes | `CustomCursor` | — | `chrome.jsx` |

## The literal carry-over

`Nirmaan-Portfolio-` contains:

- `src/app/globals.css:44` — `/* Verde & Resonate Elite Avant-Garde Cyber Overlays */`
- `src/app/layout.tsx:45` — `{/* Verde & Resonate Master Cyber Overlays */}`
- `src/components/sections/GenesisLoader.tsx:40` — `"0xVERDE_RESONATE_CORE"`
- `src/components/sections/Hero.tsx:184` — `VERDE_OS`
- `Hero.tsx:134` and `GenesisLoader.tsx:121` — *"Chlorophyll meets silicon"*, VERDE's tagline

## What this means, precisely

It is **not** plagiarism of another person. Every repository is authored by the same hand. It is **template inertia** — a visual system reused because it was available, while the subject was under time pressure.

But from a visitor's point of view, it has the same effect as plagiarism: three different products feel like reskins of one another, and the author looks like someone with one idea applied repeatedly. For a portfolio whose entire argument is *"I don't want to follow existing patterns,"* that is the most damaging possible impression.

## The constraint this creates

> Any two projects of different subject matter must not share a layout grammar, a loader, a colour system, or a motion signature. Shared *taste* is fine. Shared *structure* is not.

This applies to the portfolio itself: it must not be the fifth skin. The direction must be chosen for the person, not inherited from the last build.
