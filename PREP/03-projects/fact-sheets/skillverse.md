# SKILLVERSE — fact sheet

**Canonical repo:** `S2S` · **Surface:** Next.js web app · **Status:** large, data-backed, unverified a11y claim

## Purpose
To turn a research question — *does screen time become skill time?* — into a product that analyses a respondent's own habits against a collected baseline.

## Intended user
Indian teenagers and their teachers/parents; in a competition context, judges evaluating research rigour.

## Problem
Screen-time discourse is moral panic without data. SkillVerse replaces opinion with a 261-response survey and a comparison engine.

## Essential functionality
Survey ingestion, personal dashboard, comparison against baseline, AI-generated pathways, reports, CSV export, authentication, QR sharing.

## Architecture
Next.js 14 App Router, Supabase (Postgres + RLS) with in-memory fallback, Gemini, Zustand, Recharts, GSAP/Lenis, three/R3F.

## Verified contribution
Four-person team per the README. **Individual contribution is not itemised in the repository and must not be claimed until the team confirms it.**

## Collaborators
Three other students, unnamed in the repository. Needs confirmation before publication.

## Evidence of implementation
34 routes, 21 API routes, `SUBMISSION_PACK/` with raw data and PDFs, curated JSON datasets, embeddings.

## Limitations
No tests. No accessibility audit. Demo mode without keys. Survey is self-reported and geographically clustered.

## Most defensible differentiator
**The dataset.** Not the AI features — the instrument, the raw responses, and the willingness to keep them.

## Portfolio role
The research exhibit. Publish aggregates and methodology; never the raw free-text answers.
