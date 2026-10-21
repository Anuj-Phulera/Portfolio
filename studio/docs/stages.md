# Stage questions

Ten stages. Each exists because a question was open, not because a technique was available.

| # | Stage | Question | Reduced path |
|---|---|---|---|
| 01 | Cut sequence | Can shot timing be scheduled in code instead of nudged by eye? | All shots at once |
| 02 | Word reveal | Can type move without fragmenting what a screen reader reads? | Text immediate |
| 03 | Pointer depth | How little motion still reads as depth? | No motion |
| 04 | Reveal once | What changes when content arrives once and stays? | Visible from first frame |
| 05 | Scroll readout | Does smooth scrolling break a position indicator? | Native scroll, same number |
| 06 | View transition | Can the platform alone make a swap feel authored? | Instant swap |
| 07 | Sound gate | Can consent be architectural rather than a setting? | Unchanged — already gated |
| 08 | Scroll scene | How much can CSS animation-timeline do before JS is justified? | Observer fallback |
| 09 | Dial | What must a drag control implement to be usable by everyone? | Thumb jumps |
| 10 | Figures | What must a statistic prove before it is shown? | Final values |

## Rejected stages

Kept here so the same ideas are not re-proposed without new evidence.

| Idea | Why rejected |
|---|---|
| Cursor follower | Decorative; fails on touch and for reduced motion; adds a listener for no information |
| Fake terminal boot | Claims work that is not happening — the exact pattern the audits found |
| Particle field background | 500 KB of GPU for no content |
| Horizontal scroll hijack | Breaks find-in-page and keyboard paging; NIRMAN already abandoned this pattern |
| Autoplaying ambient audio | Consent violation |
| “Count up to 10×” | A number without provenance |
