# RAKSHABANDHAN (`Rakshbandhan`)

**Inspected:** `686cd26` · 2026-08-27 · Next.js, 10 routes, custom audio engine, 121 MB repository
**One line:** a ten-chapter personal site about a sibling relationship across 1,450 km.

## What exists (verified)

- 10 routes: `distance`, `dossier`, `finale`, `letter`, `lie`, `love`, `ritual`, `timeline`, `transmission`, plus root.
- `app/audio.js` — **245 lines** of hand-written Web Audio. A real custom audio engine, not a `<audio>` tag.
- `app/eggs.js` — 75 lines of hidden interactions. `app/particles.jsx`, `app/chrome.jsx`, `app/content.js` (227 lines of narrative copy).
- Self-hosted fonts: Kalam (handwriting), Oswald (condensed display), Space Mono (terminal).
- 35 commits, including a branded 404, a reduced-motion intro skip, and a song credit.

## The most important commit in the entire body of work

`9e3fea6` — *"fix: timeline dates de-fabricated — only April + today are real, the log honestly forgets the rest (DATE: NOT RECORDED / SOMETIME AFTER THAT / IDK WHEN)"*

The diff replaces invented precision with honest absence:

```
- { d: 'MAY 09',  t: 'TEASING MODE: ENABLED', ... }
+ { d: 'SOMETIME AFTER THAT', t: 'TEASING MODE: ENABLED', l: 'nobody knows the exact day...' }

- tag: 'SYSTEM LOG · 2026 · LIVE'
+ tag: 'SYSTEM LOG · PARTIAL RECOVERY'
```

This happened on 27 August 2026 — two months before this conversation, unprompted. It is documented proof that the principle discussed in the brief is not a new idea being imposed on the work; **the subject has already made this exact call once, on his own narrative.**

It is also a genuinely original interface idea: **render missing data as missing, not as plausible filler.** Almost no portfolio does this. It is worth designing around.

## Problems before public presentation

- The repository commits `.next/cache` — build packs up to 29 MB. 121 MB total for a 10-page site. That is a hygiene failure, and it makes cloning hostile.
- No live deployment recorded.
- Personal narrative requires consent from the person it is about. That is not a technical question and must be answered before publishing.

## Grade

Content and audio: **V**. Deployment: **U**. Consent: **open, blocking**.
