# Direction B — THRESHOLD

*Five rooms, one light.*

## Rationale
The subject's stated love is atmosphere, timing, and the anime grammar of held shots and cuts. Threshold takes that seriously without borrowing a single anime artefact: it is a sequence of five rooms, each entered through a doorway of light, each holding one argument. The emotional target is **anticipation** — the feeling of standing in a corridor before something important.

## Atmosphere
Night, but warm. Near-black brown walls, amber light, bone text, deep shadow. Dust visible in the beam. Sound is optional and never automatic: room tone, a distant door, a pen on paper — all synthesised or licensed, all mutable.

## Narrative
Five thresholds, in order:
1. **The Desk** — where the work happens. 2 a.m., one lamp.
2. **The Greenhouse** — VERDE, and the idea of systems that keep something alive.
3. **The Scrapyard** — NIRMAAN, and the argument that waste is a design failure.
4. **The Observatory** — STRATA, and the idea that an interface should watch and explain.
5. **The Door** — what comes next, left open.

The visitor is not told a biography; they are shown five places the work came from. Each room discloses one honest fact, including one failure.

## Visual language
- **Palette:** `#0B0908` void, `#1A1512` wall, `#E8DCC8` bone, `#C97B3C` lamplight, `#6B5E52` dust. No pure black, no pure white, no red.
- **Type:** a high-contrast serif for room titles (Fraunces, OFL), a neutral grotesque for body (Inter or Public Sans, OFL), mono only for the one or two metadata lines that are real.
- **Composition:** full-bleed light plane; text placed low and small, as if read by the light; enormous negative space; one object per room.
- **Lighting:** a single gradient beam, a vignette, a dust layer at 3% opacity. Light is the only ornament.

## Navigation
The five rooms are the navigation: a vertical ruler on the right, no labels until hover/focus, plus a visible "Contents" escape at all times. Each room is a scroll segment of roughly 1.5 viewports; there is no hijacking — native scroll drives the light.

## Motion philosophy
- **Held frames.** Each room has a still moment of at least 800 ms before any text appears.
- **One camera move per room,** 900–1400 ms, easing with a long tail (`cubic-bezier(.16,1,.3,1)`).
- **Cuts, not transitions,** between rooms: a 120 ms darkening, then the next light.
- **One pinned moment only:** the final door opens as you scroll the last 40% and then releases.
- **Reduced motion:** the light is static, text is visible immediately, the door is replaced by an open doorway illustration; nothing is lost.

## Sound
Off by default. A single control in the contents panel: *"Room tone."* When enabled: a low room hum, a page turn on room change, a soft click on the door. Never a jump-scare. Volume capped, remembers the choice, stops on tab blur.

## Signature interaction — the room remembers
If the visitor stays in a room for more than 20 seconds, the light warms very slightly (2–3%) and a single line of marginalia appears, as if the room noticed. It is explained once in the contents panel — the site never pretends to be magic. Inspired by STRATA's rule: **adaptation must explain itself.**

## Text storyboard (first 40 seconds)
1. **0.0s** — Near-black. A thin vertical line of amber light at the centre, 2 px wide.
2. **0.8s** — The line widens over 1.2 s into a doorway. A small line of type appears low: *"ANUJ PHULERA."*
3. **3.0s** — Silence. Nothing moves for one full second.
4. **4.0s** — *"Five rooms. Some of them are unfinished."*
5. **6.5s** — *"Scroll to enter."* — small, low, with a visible Contents link.
6. **9.0s** — First scroll: the doorway light grows; the corridor wall passes; the Desk resolves.
7. **14.0s** — In the Desk, three short lines appear one at a time, 400 ms apart.
8. **30.0s** — The visitor reaches the room's one failure line, set apart, no decoration.

## What it is good at
- Memorability through pacing rather than effects.
- Emotion: it can make a project feel like it mattered.
- The "unfinished rooms" idea lets honesty feel like atmosphere rather than a disclaimer.

## Failure modes
- **Pretension.** If the prose is not excellent, five rooms become five mood boards.
- **Content starvation.** One idea per room is a hard editorial constraint; the work must carry it.
- **Cost.** Lighting, sound and timing are expensive to get right; 80% of it looks cheap.
- **Accessibility debt.** Full-bleed light and low text position are contrast hazards.
- **Slow to the facts.** Needs a visible, complete contents page as the escape hatch.

## What would make it generic
Black page, serif headline, a video background, and a line about "craft." Without the rooms' specific arguments and the discipline of held frames, it is every dark portfolio of the last five years.
