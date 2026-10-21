# NIRMAAN site (`Nirmaan-Portfolio-`)

**Inspected:** `efdef9b` · 2026-06-21 · Next.js static export, GSAP, Three.js / R3F, 135 tracked files
**One line:** a 16-act cinematic marketing site for the e-waste platform.

## What exists (verified)

- `src/components/sections/`: `GenesisLoader`, `Hero`, `HeroFluid`, `MissionManifesto`, `Graveyard`, `Gaps`, `Forge`, `Cortex`, `EcosystemRoles`, `FeasibilityScalability`, `ImpactIntelligence`, `LiveMapInner`, `Network`, `Nexus`, `ProductScreens`, `Roadmap`, `SolutionOverview`, `TechnologyArchitecture`, `TrustVerification`, `Architects`, plus `ui/` primitives.
- `HeroFluid` is real R3F (`@react-three/fiber` in dependencies) — an instanced particle field.
- A `/team/anuj` and `/team/aarav` route exist.

## The three defects, with receipts

**1. Inherited identity.** Source comments literally say `/* Verde & Resonate Elite Avant-Garde Cyber Overlays */` (`globals.css:44`) and `{/* Verde & Resonate Master Cyber Overlays */}` (`layout.tsx:45`). `GenesisLoader.tsx:40` boots `0xVERDE_RESONATE_CORE`. `Hero.tsx:184` renders `VERDE_OS`. Two taglines from VERDE — *"Chlorophyll meets silicon"* — appear in `Hero.tsx` and `GenesisLoader.tsx`. This is a template carried across three subjects, not an accident.

**2. Documentation inflation.** README: *"First-Visit Mode (18s)"*. History: `duration = 5000` at v6, `4500` in all twelve later commits. The README also claims `prefers-reduced-motion` fallbacks and `[SKIP GENESIS]` overrides; at HEAD the phrase `prefers-reduced-motion` appears exactly once in the entire repository — inside that README sentence.

**3. Escalation instead of diagnosis.** 13 commits in one day, v6→v11, names growing as breakage grew (*God-Mode Build → Production Fix → Vercel Bugwipe → Pin Eradication*). v9 deletes 357 lines and abandons the pinned horizontal scroll. Four days later, four calm fix commits resolve hydration errors #418/#423, a WebGL crash, and console noise.

## What is genuinely good in it

- The content strategy is sharp: *The Graveyard*, *The Market Matrix*, *Five taps from clutter to clean*. Each act argues something.
- The final four commits are the best engineering behaviour in the whole body of work: reproduce the error, name it precisely, fix it, verify.
- `Pre-checking WebGL support before Canvas mount` is a defensive pattern most portfolios never bother with.

## Verdict

This site is the clearest example of the pattern: **the ambition arrives before the truth, and the truth wins in the end, but the marketing copy never gets updated to match.** It should not be presented again until the identity bleed is removed and the loader claim is either implemented or deleted.
