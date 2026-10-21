# VERDE OS app (`VERDE-CBSE-APP`)

**Inspected:** `387a14c` · 2026-10-09 · Next.js App Router, TypeScript, 37 files
**One line:** mission control for the vertical farm — live Firebase telemetry, pump/light control, weather override, AI plant doctor.

## What exists (verified)

- 5 server routes: `api/db`, `api/gemini`, `api/openrouter`, `api/plant-id`, `api/weather`.
- A single-page dashboard shell; all third-party keys stay server-side (no `NEXT_PUBLIC_*` key usage found in the routes inspected).
- The README documents the path/field whitelist for the Firebase proxy — the security model is described precisely, which is unusual and good.
- `.env.example` present.

## Honest limitation

**This cannot be verified from here.** It requires Firebase credentials, an ESP32 publishing data, and three external AI services. Every runtime behaviour is therefore `U`, not `V`:

- whether telemetry actually arrives;
- whether the whitelist rejects out-of-scope paths;
- whether the Plant Doctor round-trip works;
- whether the weather override writes correctly.

What *is* verified: the routes exist, are server-side, take keys from `process.env`, and the build is a standard Next app with no key in the client bundle by construction.

## Why it matters more than the marketing site

The compendium describes the system. This app *is* the system's interface. For a portfolio, a 40-second screen recording of this dashboard answering a real board — pumps toggling, a moisture threshold crossing — is worth more than any hero animation. It also cannot be faked convincingly, which is exactly the point.

## Before it can be presented

- Capture a real session (screen recording, not mockup) with a live board or a documented replay fixture.
- If the hardware is unavailable, build a clearly-labelled **replay mode** with recorded data and a visible `REPLAY` state. A labelled replay is honest; a random-number "live" feed is not.
- Record which parts are Anuj's: firmware, cloud pipeline, this dashboard.
