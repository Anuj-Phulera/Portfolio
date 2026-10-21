# VERDE compendium — fact sheet

**Canonical repo:** `Verde-CBSE` · **Surface:** Next.js marketing/documentation site · **Status:** strong build, two contradicted claims

## Purpose
To document a working vertical-farm system as an engineering artefact: every subsystem explained, not merely advertised.

## Intended user
A technically literate reader — judge, engineer, or curious visitor — who wants to understand how the farm senses, decides, waters and reports.

## Problem
Hardware projects are usually shown as a photo and a claim. This one argues that the interesting part is the loop: sensor → cloud → decision → actuator.

## Essential functionality
Scroll-driven narrative sections, a spec explorer, a hardware board section, a telemetry panel, a comparison, an FAQ, a command palette, a team section.

## Architecture
Next.js 14 App Router, TypeScript, Tailwind, Framer Motion, Lenis, local fonts. Five API routes. Static-first with security headers and a sitemap.

## Verified contribution
Anuj: software, cloud pipeline, vision model, site. **Aarav Choudhary: schematic, PCB layout, power delivery, physical build.** Source: `TeamSection.tsx`.

## Collaborators
Aarav Choudhary — hardware and electronics.

## Evidence of implementation
40+ components; `npm run verify`; a final commit pruning 70 dead files, 6 unused dependencies and adding security headers.

## Limitations
Telemetry is simulated; the "Three.js" claim is false; accessibility is partial and unaudited.

## Most defensible differentiator
The system's **closed loop** — and the site's willingness to explain it in detail rather than gesture at it.

## Portfolio role
The hardware/software collaboration story. Must be presented as a two-person build or not at all.
