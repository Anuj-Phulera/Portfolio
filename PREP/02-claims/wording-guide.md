# Wording guide

Every public sentence about a project must be defensible in the room where someone asks "show me."

## The three tenses

| Tense | Use it when | Example |
|---|---|---|
| **Built** | grade V | "Thirty-four routes." "Two hundred sixty-one responses." |
| **Designed to** | grade P | "The dashboard is designed to read the farm's sensors." |
| **Planned** | grade A | "The next version will add replay mode." |

Never use the present tense for something that only exists as intent. This is the single rule that would have prevented every defect in `../01-source-of-truth/corrections.md`.

## Substitutions that cost nothing and buy credibility

| Don't write | Write |
|---|---|
| "live sensor data" | "recorded sensor data, replayed" / "simulated telemetry, labelled" |
| "real-time dashboard" | "dashboard that polls the sensor feed every three seconds" |
| "WCAG AA compliant" | "reduced-motion support in four components; no conformance audit yet" |
| "India's first" | "built for E-Colosseum 2026" |
| "cinematic 18-second intro" | "a four-and-a-half second boot sequence" |
| "AI-powered platform" | "uses Gemini for X, Y and Z" |
| "full-stack developer" | "I build the interface, the API routes, and the schema behind them" |

## The specificity test

A sentence passes if a hostile reader could verify it in under two minutes. If verification requires trusting you, rewrite it.

- Passes: *"261 responses, collected on 22 May 2026, stored in the repository as a CSV."*
- Fails: *"Data-driven insights from hundreds of students."*

## Attribution sentences

VERDE: *"Built with Aarav Choudhary. I wrote the software, cloud pipeline, vision model and site; Aarav designed the board, power delivery and physical build."*

SKILLVERSE: *"A four-person team project; my contribution is not yet itemised in this repository."* — an honest placeholder, not a claim.

## Banned constructions (enforced by the ledger validator)

`live`, `real-time`, `first`, `award-winning`, `WCAG AA`, `production-ready`, `fully tested` — unless the entry is grade **V** and the evidence directly supports that exact word.

## On numbers

Numbers are allowed to be precise and should be. Every number in public copy must cite its source in the ledger. Precision without a source is worse than vagueness, because it invites verification and fails it.
