# NIRMAAN app (`nirmaan-app`)

**Inspected:** `a7ea683` · 2026-06-21 · Next.js 14 App Router, TypeScript, 284 files
**One line:** a three-role e-waste pickup platform — customer, business, admin — with bookings, maps, OTP and an AI assistant.

## What exists (verified)

- 18 page routes across three role groups: `(auth)` login/signup/forgot, `(dashboard)` home, book, bookings, map, profile, `business/*`, `admin/*`.
- 10 API routes: admin bookings/locations/users, bookings, chat, profile update, send-otp, verify-otp.
- Dependencies confirm the architecture: `firebase`, `@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`, `leaflet` + `react-leaflet`, `@google/generative-ai`, `nodemailer`, `sonner`.
- Three separate role UIs, not one UI with conditional labels — the admin, business and customer areas have distinct route trees.

## What is unverified

| Claim | Grade | Reason |
|---|---|---|
| "India's first AI-powered e-waste platform" | **U** | Unfalsifiable marketing superlative. Must not be repeated. |
| "Live routing" | **U** | Leaflet is present; routing logic was not executed. |
| Bookings work end to end | **U** | Needs Firebase + Supabase projects and seeded users. |
| Built for E-Colosseum 2026 | **U** | Stated in README; no external evidence accessible here. |
| Deployed | **U** | No homepage URL set on the repository. |

## Structural reality

Two databases (Firebase for auth/profiles, Supabase for bookings/businesses/locations) is the most consequential decision in this codebase and the one most worth explaining. It is also the most likely source of the "works on my machine" class of failure: the README requires a manual sequence of project creation, schema import, seed SQL, three test accounts, and a linking SQL script before anything works.

That is not a flaw in ambition. It is a flaw in **reproducibility** — and reproducibility is precisely the quality a portfolio claims to demonstrate.

## Before it can be presented

- Publish a seeded demo account, or provide a one-command local fixture that does not require the reader to own two cloud accounts.
- Record the three role flows.
- Replace the superlative with a factual descriptor.
