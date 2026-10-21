# STRATA (DEEP FIELD) — fact sheet

**Canonical repo:** `WEBE` · **Surface:** static site, no backend · **Status:** strongest artefact, unverified live

## Purpose
To test a proposition rather than to show off: **an interface can reorganise itself around how a person reads, and remain trustworthy.** The astronomy content is the test material, deliberately neutral so the interface is the subject.

## Intended user
Someone who wants to browse a knowledge graph and is willing to let the structure move — but who would abandon the site the moment it felt unpredictable or lost their place.

## Problem
Adaptive interfaces usually fail in one of two ways: they change for no legible reason, or they change so cautiously that adaptation is invisible. STRATA's answer is an evidence threshold, a rate limit, an explanation, and an off switch.

## Essential functionality
Six paradigms (constellation, mosaic, codex, lattice, console, zen) selected by a read of reading behaviour; typed relations between 35 objects; a mind panel that reports the read; pinning; a status bar with generation count.

## Architecture
Framework-free React + Vite. `engine/classify.ts` derives signals; `engine/decide.ts` chooses a paradigm with a margin rule; `engine/genome.ts` holds the arrangement; `engine/store.tsx` owns persistence. Content is data, never mutated.

## Verified contribution
Sole author of the repository; all 25 source files. Live deployment unverified.

## Collaborators
None recorded.

## Evidence of implementation
`scripts/smoke.mjs` (jsdom + esbuild, three visitor archetypes), `scripts/live-check.mjs` (real browser, two visitors), `scripts/screenshot.mjs`.

## Limitations
No accounts, no server, single-device persistence. The README overstates nothing found so far — the counts are exact.

## Most defensible differentiator
**The terms of adaptation, not the adaptation.** It tells you what changed and why, rate-limits itself, and lets you refuse. That is a design argument nobody else in this body of work makes.

## Portfolio role
Anchor. The one project whose claim and verification were designed together.
