# Cinematic design is editing, not effects

## The claim

A site feels cinematic when the author controls **what you look at, for how long, and what you feel before the next thing**. That is editing. Particle counts do not make a site cinematic; a cut does.

## Vocabulary used in this folder

| Term | Meaning on the web |
|---|---|
| **Shot** | One stable composition occupying the viewport |
| **Hold** | Time in which nothing changes except what the reader does |
| **Cut** | A change of composition with no transition, or with a sub-200 ms one |
| **Dissolve** | A deliberate 400–1200 ms overlap, used rarely |
| **Beat** | A unit of attention: one idea, one action, one reveal |
| **Rack focus** | Moving emphasis (blur, contrast, scale) without moving layout |
| **Match cut** | Two compositions connected by a shared shape or position |

## Six rules

1. **Enter late, leave early.** Start each shot after the action has begun; cut before it finishes. This is why the best hero sections feel like they were already happening.
2. **One idea per shot.** If a viewport contains two arguments, it contains none.
3. **Hold longer than feels comfortable.** A still frame for 800–1200 ms reads as confidence. A frame that animates immediately reads as anxiety.
4. **Cut on motion, not on scroll position.** Trigger the cut when the previous shot's motion completes, not at an arbitrary percentage.
5. **Silence is a cut too.** Remove the cursor effect, the marquee, the hover sound for one section. The absence is audible.
6. **The reader is the editor.** Every cut must be skippable by scrolling normally. If the reader cannot move faster, it is not a film; it is a hostage situation.

## Timing defaults (to be tested in the motion lab)

| Event | Default | Notes |
|---|---|---|
| Micro-feedback (hover, press) | 80–140 ms | Must feel instant |
| State change (toggle, select) | 160–240 ms | Ease-out |
| Reveal of text block | 400–600 ms | Fade + 8–12 px rise |
| Scene transition | 700–1200 ms | Rare; one per chapter at most |
| Hold before text | 600–1000 ms | After a scene becomes visible |
| Scroll-linked scrub | never | Replaced by threshold-triggered cuts |

## What this rules out

- Reveal-on-scroll applied to every paragraph, which produces a site that is always arriving and never present.
- Timelines that play on load regardless of where the reader is looking.
- Motion whose only purpose is to demonstrate that motion was implemented.
