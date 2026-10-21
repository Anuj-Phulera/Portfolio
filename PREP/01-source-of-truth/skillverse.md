# SKILLVERSE (`S2S`)

**Inspected:** `05f2383` · 2026-07-06 · Next.js 14, TypeScript, Tailwind, Supabase, Gemini, R3F / three, GSAP, Lenis, Recharts
**One line:** an AI analytics platform built on a real survey of Indian teenagers' screen habits.

## What exists (verified)

- **34 page routes** and **21 API routes** — the README's "34 routes" is exact.
- `SUBMISSION_PACK/` contains `SkillVerse_Raw_Data_250_Records.csv` (**262 lines** including header — real respondents, dated 2026-05-22, with free-text answers), a survey form PDF, reports, and charts.
- `data/curated/` and `data/research/` JSON sets; `data/embeddings/`.
- Dependencies confirm the architecture: `@supabase/ssr`, `@fingerprintjs/fingerprintjs`, `gsap`, `lenis`, `three`, `recharts`, `papaparse`, `zod`, `zustand`.
- README is unusually specific: environment variables, demo-mode fallback without keys, schema, API table.

## What is un verified

| Claim | Grade | Reason |
|---|---|---|
| "Built in 4 weeks by 4 students at Colonel's Central Academy" | **U** | No external corroboration accessible; team composition not in the repo. |
| "WCAG AA compliant" | **P → likely X** | No automated accessibility test, no audit artefact. `prefers-reduced-motion` appears in a small number of files only. A badge is not an audit. |
| "8 AI analysis pipelines" | **P** | Several Gemini routes exist; the count of eight distinct pipelines was not traced. |
| Deployed | **U** | `skillverse-xi.vercel.app` cannot be reached from this environment. |

## The dataset — handle with care

262 rows including free-text answers from named-by-ID teenagers: age, grade, gender, city, screen habits, personal descriptions of projects they built. This is the most valuable evidence in the entire body of work, and the most sensitive.

**Rules for portfolio use** (expanded in `../09-assets/privacy-dataset.md`):
- Never commit the raw CSV to a public portfolio repository.
- Publish aggregates only: n, distributions, and a documented method.
- Quote no free-text answer that could identify a respondent.
- State the survey's limitations: convenience sample, self-reported, single city cluster.

## The strongest differentiator

Not the AI features — those are now commodity. The differentiator is that **the claims rest on collected data**. A portfolio that shows "I surveyed 262 teenagers, here is the instrument, here is the distribution, here is what I would do differently" is more credible than any animation.
