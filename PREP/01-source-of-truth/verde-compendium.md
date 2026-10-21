# VERDE — technical compendium (`Verde-CBSE`)

**Inspected:** `9d5576d` · 2026-10-09 · Next.js 14 App Router, TypeScript, Tailwind, Framer Motion, Lenis
**One line:** a documentation site for a sensor-driven vertical farm, built as an engineering artefact rather than a brochure.

## What exists (verified)

- 40+ components under `app/components/`: `BootCurtain`, `NeuralField`, `Telemetry`, `SensingSection`, `BoardSection`, `TowerStory`, `SpecExplorer`, `HorizontalDeck`, `CommandPalette`, `CustomCursor`, `LiveTerminal`, `ScrambleText`, `SplitText`, `VelocityMarquee`, `SideRail`, `ScrollProgress`.
- 5 API routes: `contact`, `health`, `stats`, `telemetry`, `weather`.
- `app/sitemap.ts`, `app/robots.ts`, `next.config.mjs` with cache + security headers, `DEPLOYMENT.md`, `vercel.json`, `.nvmrc`.
- `npm run verify` = `tsc --noEmit && next lint && next build` — a real verification script exists.
- A team section naming two authors (see `../03-projects/attribution.md`).

## What is not what it says

| Claim | Grade | Evidence |
|---|---|---|
| "Interactive Three.js background", Three.js 0.162 badge | **X** | No `three` dependency in `package.json`; no `three` import anywhere. `NeuralField.tsx` is explicitly `getContext("2d")` with the comment *"Pure canvas: no shaders, no WebGL context stolen from the product scenes."* The code is honest; the README is not. |
| "Live sensor telemetry" | **X** | `app/api/telemetry/route.ts` generates every value with `Math.random()`, including `uptime: 99.97`, `firmware: "V3.0.0"`, `wifi.ssid: "VERDE_MESH_01"`. |
| "Real-time dashboard" | **P** | The dashboard UI exists; the data behind it is simulated on this site. The separate app repo does poll Firebase — that is a different artefact. |
| "Performance tiers / adaptive rendering" | **P** | Reduced-motion is handled inside `NeuralField`; a tier system is not implemented as a route-level concept. |
| "Accessibility — keyboard nav, skip links, reduced motion" | **P** | Some components honour `prefers-reduced-motion`; no audit, no automated check, no evidence of keyboard testing. |

## Engineering judgement worth keeping

The codebase contains deliberate restraint that its documentation then oversells. Two examples:

1. `NeuralField` avoids WebGL specifically so the product scenes keep the GPU — a performance decision, written in a comment, not in the marketing.
2. The final commit prunes 70 dead files, 6 unused dependencies, and adds security headers. That is finish work, and it is the most professional commit in the repository.

**What this project proves about its author:** he can build a large, coherent Next.js surface area alone, and he knows how to close a project down properly. **What it does not prove:** that the farm's telemetry is live on the web, or that the visual field is 3D.

## Before it can be presented as finished

- Correct or remove the Three.js claim.
- Label the telemetry demo as simulated, in the interface, not only in the repo.
- Run `npm run verify` and record the result.
- Decide whether the hardware photography is Aarav's, Anuj's, or shared — and credit it.
