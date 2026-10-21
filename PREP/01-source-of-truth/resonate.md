# RESONATE (`Resonate-Portfolio`)

**Inspected:** `14fe277` · 2026-06-20 · pnpm workspace, React + Vite artefact, Next.js migration backup, R3F, custom GLSL
**One line:** a cinematic platform about algorithmic empathy, with custom shaders and a scroll-driven narrative.

## What exists (verified)

- 370 tracked files in a pnpm monorepo: `artifacts/resonate` (Vite app), `.migration-backup` (a full Next.js App Router site), `lib/`, `scripts/`.
- **52 `page.tsx` files** across both trees — the README's "~25 pages" is conservative, not inflated.
- **Three shader pairs** — `glass`, `neural`, `singularity` — duplicated in the backup and the artefact. Real GLSL, with both `.vert` and `.frag`.
- `three`, `@react-three/fiber`, `gsap` in the artefact dependencies.
- A waitlist CLI terminal (`feat: build interactive waitlist CLI terminal`).

## Why there is no README

The root has no README. The only README sits inside `.migration-backup`. There is no live URL. For a portfolio, this project currently has **no public face at all** — which is a loss, because the shader work is real.

## Deployment history is the story here

Six consecutive commits are Vercel plumbing:

```
vercel.json: framework=vite...
Switch to framework:static to stop Vercel auto-detection...
Fix vite outDir and vercel outputDirectory...
Fix vercel.json: correct buildCommand/outputDirectory...
Fix vercel.json: remove rootDirectory (not valid)...
Remove stale Next.js layout/template files that triggered auto-detection
```

The site never shipped. This is the clearest example in the body of work of **deployment friction consuming the remaining energy** — the thing got built and then died at the door.

## Use in the portfolio

Either bring one artefact to a working deployed state, or present it honestly as an unshipped experiment with the shader code visible. Do not claim a live experience that does not exist. The three shaders are good enough to show as stills with source excerpts — that is an honest, compelling exhibit.
