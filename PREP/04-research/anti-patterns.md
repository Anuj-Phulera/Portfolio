# Anti-patterns — the things this portfolio must not do

Each entry is drawn from something observed in the subject's own work or the wider genre. These are not moral judgments; they are devices that have been used so often they no longer signify.

## The costume

| Pattern | Why it fails | Use instead |
|---|---|---|
| Boot sequence with fake system checks | It claims work that is not happening. The 18-second loader is the canonical example. | A real load state, truthfully short, or no loader at all. |
| Fabricated telemetry / uptime / firmware versions | Detectable in four seconds with devtools. Destroys every other claim on the page. | Real data, recorded data clearly labelled, or no data. |
| HUD labels (`SYS.ONLINE`, `[SCANNING]`) | Genre furniture. Carries no information. | Labels that name the actual state of the actual thing. |
| Particle field as default background | 500 KB of GPU to say nothing. | A background that is part of the content, or none. |
| Dark + red because the GitHub persona uses it | Derives identity from a username, which the subject explicitly rejected. | A palette derived from the work and the argument. |
| Glass cards, gradient meshes, pill everything | The current AI-default look. | One material decision, executed precisely. |

## The structure

| Pattern | Why it fails | Use instead |
|---|---|---|
| Card grid of projects | Makes eight unlike things look identical. | A different form per project, inside one grammar. |
| "About / Work / Skills / Contact" | A résumé with scroll effects. | A sequence of arguments with a reason to continue. |
| Pinned scroll on everything | Costs the reader control and breaks on mobile. | Pin once, for the one moment that earns it. |
| Scroll hijacking | Breaks find-in-page, keyboard paging, and trust. | Native scroll; choreograph within it. |
| Hidden navigation | Novel for the author, hostile for the visitor. | Visible index; hidden *delights*, not hidden doors. |

## The copy

| Pattern | Why it fails | Use instead |
|---|---|---|
| "Creative developer / digital craftsman / building the future" | Says nothing; appears on thousands of sites. | A specific sentence about a specific thing. |
| "Passionate about" | Unfalsifiable. | What you did on a Tuesday night and why. |
| Superlatives ("India's first") | Invites one search that disproves it. | A date, a competition, a constraint. |
| Fake scarcity or fake numbers | Ethically worse than boring. | Nothing. |
| A manifesto longer than the work | Signals insecurity. | One line, placed inside evidence. |

## The build

| Pattern | Why it fails | Use instead |
|---|---|---|
| Autoplaying audio | Hostile; violates consent. | Sound after an explicit gesture, with a persistent mute. |
| Mouse-only interactions | Excludes keyboard and touch users. | Touch/keyboard equivalent or a non-interactive fallback. |
| Reduced-motion as a global "animation: none" | Removes meaning, leaves broken layouts. | A designed reduced-motion path with the same content. |
| Screenshots that are mockups | A lie that is discovered on contact. | Real captures, or clearly labelled renders. |
| One more effect instead of one more test | The pattern the audits found. | Verify, then stop. |

## The meta-pattern

Every item above substitutes **the feeling of depth** for depth. The portfolio's entire advantage is that it can afford the real thing: it has eight projects, a documented failure history, a genuine design idea, and a subject willing to label what is unfinished. Nothing else is needed.
