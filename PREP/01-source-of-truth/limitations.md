# Limitations of this audit

Everything here exists so that no later document can quietly overstate what was checked.

## Environment

- **No browser installed.** No deployed site could be loaded, driven, screenshotted, or visually verified. Every claim about how a live site *looks* or *behaves* is **U**.
- **Restricted network.** Reachable: `github.com`, `codeload.github.com`, `api.github.com`, `registry.npmjs.org`, `pypi.org`, `files.pythonhosted.org`. Not reachable: Vercel, GitHub Pages, and the general web. Deployment status is therefore **U** across every project.
- **No credentials** for Firebase, Supabase, Gemini, OpenRouter, Plant.id, or OpenWeather. No runtime test of any API route was possible.
- **No hardware.** The ESP8266, sensors, pump, and camera could not be exercised. Every physical claim about VERDE is **U/P**.

## Method limits

- Static reading finds what is *written*, not what *runs*. A route that exists may still throw.
- `git grep` across a 48 MB repository timed out once; searches were narrowed rather than assumed.
- Two repositories were not cloned (`Rakshbandhan` was, at 121 MB; `Dayum` at 227 MB was not). `Rakshbandhan` inspection was limited to tree, history, and selected files to avoid repeated slow operations.
- The eleven unaudited repositories in `repository-survey.md` remain unaudited. No claim in this package depends on them.

## Claims this audit explicitly does **not** make

- That any deployment currently works.
- That any test suite passes today (no project dependencies were installed).
- That any project is "production-ready."
- That the subject is or is not responsible for a specific feature — beyond the two-person attribution documented in `TeamSection.tsx`.
- That the unaudited repositories contain anything in particular.

## What would lift these limits

1. A machine with a browser and unrestricted network, to run each project and capture evidence.
2. Credentials or recorded fixtures for the API-dependent projects.
3. The subject's own account of intent, which is the only source for why a decision was made — and even that is partial, as the 18-second answer demonstrated.
