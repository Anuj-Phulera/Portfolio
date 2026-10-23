import type { Project } from "./types.ts";
import skillverse from "./data/skillverse.json" with { type: "json" };

/**
 * Six entries. Copy is written from the audits in PREP/, and every factual
 * sentence that needs defending carries a ledger id in a `receipt` block.
 * The build fails if a receipt points at an entry marked do-not-publish.
 */

export const PROJECTS: Project[] = [
  {
    slug: "strata",
    index: "01",
    name: "STRATA",
    tagline: "An interface that rearranges itself around how you read, and tells you what it saw.",
    status: "BUILT",
    statusNote:
      "Running as a static build. The deployed URL could not be reached from the machine that audited it, so this entry says built, not live.",
    year: "2026",
    surface: "Static site. Framework-free React, Vite, no backend.",
    repos: [{ label: "WEBE", href: "https://github.com/UCHIHA-MADARA-ANUJ/WEBE" }],
    attribution: "Sole author of the repository, including all 25 source files.",
    question: "Can an interface change shape for a reader without ever losing their place?",
    blocks: [
      {
        kind: "lede",
        text:
          "Adaptive interfaces usually fail in one of two ways. They change for no legible reason, or they change so cautiously that the adaptation is invisible. STRATA tries a third way: an evidence threshold, a rate limit, an explanation, and an off switch.",
      },
      {
        kind: "prose",
        text:
          "The content is thirty-five objects of astronomy, connected by seventy-nine typed relations. It is deliberately neutral material, because the interface is the subject and the subject should not be flattered by what it is arranging.",
      },
      { kind: "receipt", claim: "CLM-027", note: "the corpus, counted from source" },
      {
        kind: "prose",
        text:
          "There are six ways to read it — a dense mosaic board, a single-column codex, a constellation, a lattice, a console, and a zen view. Which one you get is decided by signals taken from your reading: dwell time, revisits, how fast you are moving.",
      },
      { kind: "receipt", claim: "CLM-028", note: "six paradigms, not themes" },
      {
        kind: "instrument",
        id: "mode",
        caption:
          "A reduction of STRATA's decision, running on three objects instead of thirty-five. It reads dwell, revisits and pace; it explains the read; it can be pinned. The real engine is in `src/engine/decide.ts`.",
      },
      {
        kind: "quote",
        text:
          "Adaptation is a claim about someone's attention. It should be made out loud, with a threshold, and it should be refusable.",
        cite: "The constraint the project is built on",
      },
      {
        kind: "prose",
        text:
          "That constraint is the whole argument. The arrangement is data, never content: the objects do not move, the view does. If the classification is wrong you can pin a mode and it stops guessing. If it changes, a status line says what changed and why.",
      },
      {
        kind: "files",
        title: "Inside the object",
        rows: [
          ["src/engine/classify.ts", "derives reading signals from behaviour"],
          ["src/engine/decide.ts", "picks a paradigm, with a margin rule"],
          ["src/engine/genome.ts", "holds the arrangement"],
          ["src/engine/store.tsx", "persistence, one device, no account"],
          ["src/content/graph.ts", "35 nodes, 79 typed edges"],
          ["src/modes/", "six paradigms, one interface"],
          ["scripts/smoke.mjs", "renders the real app in jsdom, plays three visitors"],
          ["scripts/live-check.mjs", "drives the built site with two visitors"],
        ],
      },
      { kind: "receipt", claim: "CLM-029", note: "the harness that makes the claim checkable" },
      {
        kind: "aside",
        label: "What it cost",
        text:
          "There is no server and no account, so persistence is one device. Two of the six paradigms only appear after a rate limit, which means most visitors will never see them. I think that is correct, and it is also why the instrument above is a reduction rather than the thing itself.",
      },
      {
        kind: "falsifier",
        text:
          "If two people with genuinely different reading behaviour received the same arrangement, the engine would be decoration with a status bar. The harness exists to catch exactly that, and it is the first thing I would run against any change to `decide.ts`.",
      },
      {
        kind: "next",
        text:
          "Put the two-visitor live check in CI. The claim that this interface adapts is currently only as true as the last time I ran a script by hand.",
      },
    ],
    nextSlug: "verde",
  },

  {
    slug: "verde",
    index: "02",
    name: "VERDE",
    tagline: "A vertical farm that senses, decides and waters — and a control room that cannot leak its keys.",
    status: "BUILT",
    statusNote:
      "Built and running as software. The board could not be exercised by the audit, so every physical claim about it is marked unverified rather than restated as fact.",
    year: "2026",
    surface: "Next.js compendium, Next.js control room, firmware and a PCB.",
    repos: [
      { label: "Verde-CBSE", href: "https://github.com/UCHIHA-MADARA-ANUJ/Verde-CBSE" },
      { label: "VERDE-CBSE-APP", href: "https://github.com/UCHIHA-MADARA-ANUJ/VERDE-CBSE-APP" },
    ],
    attribution:
      "Two people. I built the software, the cloud pipeline, the vision model and the site. Aarav Choudhary designed the board, power delivery and physical build.",
    question: "Can a crop survive a bad week?",
    blocks: [
      {
        kind: "lede",
        text:
          "Hardware projects are usually a photograph and a claim. The interesting part is the loop: a sensor reads, the cloud decides, an actuator moves, and the person running the farm finds out whether the decision was right.",
      },
      { kind: "receipt", claim: "CLM-001", note: "who built which half" },
      {
        kind: "prose",
        text:
          "The compendium explains every subsystem rather than advertising the whole. Five small server routes handle contact, health, stats, telemetry and weather, and one command chains typecheck, lint and a production build, so there is a single thing to run before believing anything.",
      },
      { kind: "receipt", claim: "CLM-004", note: "five routes, listed" },
      { kind: "receipt", claim: "CLM-005", note: "one command, no ceremony" },
      {
        kind: "prose",
        text:
          "The control room is the part I would defend hardest. Every third-party key — Firebase, weather, two model providers, plant identification — is read server-side inside an API route. The browser bundle never contains one. That is not a feature you can see, which is exactly why it is worth saying out loud.",
      },
      { kind: "receipt", claim: "CLM-007", note: "key custody, checked for NEXT_PUBLIC usage" },
      {
        kind: "instrument",
        id: "dial",
        caption:
          "A reduction of the farm's control loop: a moisture reading, a threshold, a pump. The reading is a recorded fixture, not a sensor — labelled SIMULATED because it is.",
      },
      {
        kind: "files",
        title: "Inside the object",
        rows: [
          ["app/api/{contact,health,stats,telemetry,weather}/route.ts", "five server routes"],
          ["package.json", "\"verify\": \"tsc --noEmit && next lint && next build\""],
          ["app/components/TeamSection.tsx", "the attribution, in source"],
          ["VERDE-CBSE-APP/app/api/*", "keys read server-side only"],
          [".env.example", "documents that these never reach the browser"],
        ],
      },
      {
        kind: "aside",
        label: "What it cost",
        text:
          "The first version of the site showed a telemetry panel driven by generated numbers and presented it as live. That is the mistake this whole site is organised around, and it was mine. The instrument above is the shape of the correction: a recorded fixture, a visible SIMULATED label, and no pretence that the board is connected.",
      },
      {
        kind: "falsifier",
        text:
          "A single `NEXT_PUBLIC_` reference to a secret, or one key read in a client component, would make the strongest engineering claim on this page false. That is why the claim is written in terms a grep can settle rather than in terms of good practice.",
      },
      {
        kind: "next",
        text:
          "Record one real week of payloads and replay them. A dashboard that can be demonstrated without the board is the difference between a claim and a thing you can show someone.",
      },
    ],
    nextSlug: "skillverse",
  },

  {
    slug: "skillverse",
    index: "03",
    name: "SKILLVERSE",
    tagline: "255 surveys, one question, and a mirror built out of the answers.",
    status: "PARTIAL",
    statusNote:
      "The product exists. The accessibility claim does not: no conformance audit was ever run, so it is withdrawn here. Individual contribution is also unresolved, and this page will not guess.",
    year: "2026",
    surface: "Next.js app, Supabase, Gemini. Research instrument first, product second.",
    repos: [{ label: "S2S", href: "https://github.com/UCHIHA-MADARA-ANUJ/S2S" }],
    attribution:
      "A team project. The repository records a team but not who built which route, so this page names the system rather than itemising people. That is a gap in the record, not modesty.",
    question: "Does screen time become skill time?",
    blocks: [
      {
        kind: "lede",
        text:
          "This entry was wrong by seven people until October 2026. That is the first thing worth telling you about it.",
      },
      {
        kind: "prose",
        text:
          "The number was 261, and it came from counting lines in the submission file. The file is 264 lines because eight free-text answers contain line breaks — so a line count is not a record count. Parsing the same file properly gives 255 records from 254 respondents. The audit that produced this ledger had counted lines too, and it had recorded the result as verified. It was the one kind of claim the audit said was always exact.",
      },
      {
        kind: "prose",
        text:
          "Most arguments about teenagers and screens are moral panic with a graph attached. This one started with a survey — 255 responses from 254 people, submitted between April and July 2026 — and a comparison engine that puts your own habits next to that baseline.",
      },
      { kind: "receipt", claim: "CLM-035", note: "the count, parsed rather than counted by lines" },
      { kind: "receipt", claim: "CLM-016", note: "what the earlier count said, and why it was wrong" },
      {
        kind: "prose",
        text:
          "Thirty-four routes: a personal dashboard, a comparison against the collected baseline, generated pathways, reports and a CSV export. The dataset is the instrument. The model is the part that makes it feel like a product.",
      },
      { kind: "receipt", claim: "CLM-015", note: "counted, not estimated" },
      {
        kind: "chart",
        title: "Daily screen time, 255 responses",
        caption:
          "Banded from the reported hours per day. The modal respondent reports two hours; a long tail reports more than eight.",
        emphasiseMax: true,
        rows: skillverse.hours.map((band) => ({ label: band.label, value: band.count })),
      },
      {
        kind: "chart",
        title: "What the time is for, mean share of a day's screen time",
        caption:
          "Self-reported percentages averaged across all 255 records. Learning and entertainment are within a point of each other — which is the finding, not a rounding error.",
        unit: "%",
        emphasiseMax: false,
        rows: skillverse.split.map((part) => ({ label: part.label, value: part.mean })),
      },
      {
        kind: "chart",
        title: "Age at submission",
        caption:
          "Years, floored. Everyone who answered was between 8 and 23; the 12–15 band is where almost all of the data lives, which bounds how far any claim here can travel.",
        emphasiseMax: true,
        rows: skillverse.age.filter((year) => year.count >= 3).map((year) => ({ label: year.label, value: year.count })),
      },
      {
        kind: "chart",
        title: "Device used most",
        caption:
          "Free-text answers normalised: 'Tv', 'T.V' and 'Telivision' are Television; answers naming two devices are counted once as More than one.",
        emphasiseMax: true,
        rows: skillverse.device.map((item) => ({ label: item.label, value: item.count })),
      },
      {
        kind: "facts",
        title: "The counts that survive",
        rows: [
          ["Parsed records", "255"],
          ["Unique respondents", "254"],
          ["Submitted", "Apr – Jul 2026"],
          ["Routes", "34"],
          ["API routes", "21"],
          ["Accessibility audit", "none run"],
        ],
      },
      {
        kind: "prose",
        text:
          "What the instrument can say is bounded by what it asked. A self-reported survey of 255 rows can describe a pattern inside one group of teenagers who answered between April and July 2026. It cannot describe Indian teenagers, and the product does not claim that it can.",
      },
      {
        kind: "prose",
        text:
          "The routes that matter most are the unglamorous ones: methodology, data handling, consent, the report itself. A product that analyses someone's habits owes them an explanation of how before it shows them a chart.",
      },
      {
        kind: "prose",
        text:
          "Publishing this means publishing aggregates only. No free-text answers, no identifiers, no individual schools. A research instrument that leaks its respondents is not a research instrument.",
      },
      {
        kind: "aside",
        label: "What it cost",
        text:
          "I cannot tell you which parts of this are mine. That is not a rhetorical flourish; it is a missing record, and it is the one thing I cannot fix after the fact. The accessibility badge on the README was also untrue, and it is gone.",
      },
      { kind: "receipt", claim: "CLM-035", note: "the same numbers the charts are drawn from" },
      {
        kind: "falsifier",
        text:
          "If the survey instrument reached a different population from the one described, the dataset would not be the dataset this page says it is. The submission pack and its date are the evidence, and they are the reason the claim is limited to what was collected rather than what it implies.",
      },
      {
        kind: "next",
        text:
          "A commit convention and a per-person ownership record on the next team build, so that the sentence above never has to be written again.",
      },
    ],
    nextSlug: "nirmaan",
  },

  {
    slug: "nirmaan",
    index: "04",
    name: "NIRMAAN",
    tagline: "E-waste collection as a service, and the site I stopped showing.",
    status: "WITHDRAWN",
    statusNote:
      "The application is real. The marketing site is withdrawn: a false loading time, another project's identity, and generated stills presented as captures. It stays listed because deleting it would hide the useful part.",
    year: "2026",
    surface: "Next.js three-role platform, plus a static marketing site.",
    repos: [
      { label: "nirmaan-app", href: "https://github.com/UCHIHA-MADARA-ANUJ/nirmaan-app" },
      { label: "Nirmaan-Portfolio-", href: "https://github.com/UCHIHA-MADARA-ANUJ/Nirmaan-Portfolio-" },
    ],
    attribution:
      "Sole author of both repositories. The marketing site has a second team route, so the team composition of the application is not recorded here and is not claimed.",
    question: "Why does a working product still need an honest website?",
    blocks: [
      {
        kind: "lede",
        text:
          "This is the entry where the numbers were right and the story was not. The application has eighteen routes across three role areas — household, business, operator — and it is the most product-shaped thing I have built.",
      },
      { kind: "receipt", claim: "CLM-009", note: "eighteen routes, three roles" },
      {
        kind: "prose",
        text:
          "The marketing site around it was a different matter. It had nineteen section components and a real WebGL hero, and it also had a loader described in its own README as eighteen seconds. The source says 4.5 seconds in every commit that exists. The number was never in the code.",
      },
      { kind: "receipt", claim: "CLM-013", note: "nineteen sections, no act counter" },
      {
        kind: "source",
        file: "src/app/globals.css:44",
        caption: "A comment left in the stylesheet of a different project's site.",
        lines: ["/* Verde & Resonate Elite Avant-Garde Cyber Overlays */"],
      },
      {
        kind: "prose",
        text:
          "That comment is the whole failure in one line. The brief for this site was to rebuild an identity; the honest version of that brief turned out to be an audit of an identity I had been reusing because it was available.",
      },
      {
        kind: "list",
        title: "What was actually wrong",
        items: [
          "A loading time that existed only in prose.",
          "Reduced-motion handling that existed only in the README.",
          "Six interface stills rendered from hand-written SVG and presented as screenshots.",
          "VERDE's tagline and `VERDE_OS` rendered inside a different product's hero.",
          "Team imagery with no recorded licence.",
        ],
      },
      {
        kind: "aside",
        label: "What it cost",
        text:
          "Withdrawing it cost nothing except the thing I wanted: a polished-looking entry. Keeping it would have cost the only thing the site has, which is that you can check it.",
      },
      {
        kind: "falsifier",
        text:
          "If a single commit in the repository contained an eighteen-second loader, the audit would be wrong and this entry would be unfair. I checked every commit before writing this, because a correction that is itself inaccurate is worse than the claim it replaces.",
      },
      {
        kind: "next",
        text:
          "Rebuild the marketing site from the application's real routes, with captures taken from a running build. It stays withdrawn until that exists — which is a decision about the record, not about the software.",
      },
    ],
    nextSlug: "resonate",
  },

  {
    slug: "resonate",
    index: "05",
    name: "RESONATE",
    tagline: "A recommender that optimises for understanding instead of engagement, built and never shipped.",
    status: "UNBUILT",
    statusNote:
      "Fifty-two routes, three shader pairs, no deployment. There is no README at the root and no live URL, and the configuration was never resolved.",
    year: "2026",
    surface: "pnpm workspace. React, Vite, React Three Fiber, GLSL.",
    repos: [{ label: "Resonate-Portfolio", href: "https://github.com/UCHIHA-MADARA-ANUJ/Resonate-Portfolio" }],
    attribution: "Sole author of the repository.",
    question: "What would a recommender look like if it were trying to understand you rather than keep you?",
    blocks: [
      {
        kind: "lede",
        text:
          "The idea is the strongest one in the drawer: recommendation systems optimise for engagement because engagement is measurable, and emotional understanding is not. The build never got a public face, so the idea is the only thing that ships here.",
      },
      {
        kind: "prose",
        text:
          "Three custom vertex and fragment pairs — glass, neural and singularity — drive three environments. The shaders are real source, not stock effects, and they are the part I still think about.",
      },
      { kind: "receipt", claim: "CLM-020", note: "three pairs, named" },
      {
        kind: "prose",
        text:
          "Fifty-two page routes exist across the artefact and an earlier Next.js build that was kept as a migration backup. There is no canonical route map, which is why this entry gives you the count and not a tour.",
      },
      { kind: "receipt", claim: "CLM-022", note: "a count, not a route map" },
      {
        kind: "files",
        title: "What exists",
        rows: [
          ["artifacts/resonate/src/presentation/shaders/", "glass, neural, singularity — six GLSL files"],
          [".migration-backup/", "the earlier Next.js build, kept"],
          ["package.json", "pnpm workspace, no root README"],
        ],
      },
      {
        kind: "quote",
        text:
          "The idea is the strongest of any project in this body of work; the delivery is the weakest.",
        cite: "The audit's verdict, quoted because it is still true",
      },
      {
        kind: "aside",
        label: "What it cost",
        text:
          "Six consecutive commits of deployment configuration, and then nothing. I can show you the shaders but not the site, and the gap between those two sentences is the actual subject of this entry.",
      },
      {
        kind: "falsifier",
        text:
          "If a deployment existed somewhere I had forgotten, this entry would be wrong about the only thing it asserts. So the assertion is specific: no homepage URL in the repository, no root README, and the last six commits are unresolved hosting configuration.",
      },
      {
        kind: "next",
        text:
          "Publish the three shader pairs as source, with one still rendered locally and labelled honestly. That is a weekend's work, and it is the only thing between this and a built entry.",
      },
    ],
    nextSlug: "rakshabandhan",
  },

  {
    slug: "rakshabandhan",
    index: "06",
    name: "RAKSHABANDHAN",
    tagline: "A private site about distance, and the design principle it produced.",
    status: "WITHHELD",
    statusNote:
      "Built for one person. Consent to publish has not been given, so the entry is closed. It is listed because hiding it would make the record dishonest.",
    year: "2026",
    surface: "Next.js narrative site, static export, hand-written Web Audio.",
    repos: [{ label: "Rakshbandhan", href: "https://github.com/UCHIHA-MADARA-ANUJ/Rakshbandhan" }],
    attribution:
      "Sole author. The person the site is about has not agreed to be in a portfolio, so the content stays out and only the engineering and the principle are described.",
    question: "How do you build a ritual you cannot attend?",
    blocks: [
      {
        kind: "lede",
        text:
          "Nine named chapters and a title route. A hand-written audio engine, not a media element with a volume control. A hold-to-tie interaction instead of a button labelled send. That is all this page will say about the content.",
      },
      { kind: "receipt", claim: "CLM-024", note: "nine chapters, plus the title route" },
      { kind: "receipt", claim: "CLM-023", note: "245 lines of Web Audio" },
      {
        kind: "prose",
        text:
          "The reason it matters here is a commit. The timeline in the original build had invented dates presented as a record. A later commit removed them and replaced them with the truth: `DATE: NOT RECORDED`, `SOMETIME AFTER THAT`, `IDK WHEN`. The status line changed from LIVE to PARTIAL RECOVERY.",
      },
      { kind: "receipt", claim: "CLM-025", note: "the de-fabrication commit, 9e3fea6" },
      {
        kind: "prose",
        text:
          "The ending is not a button. It is a press you have to hold, which is a different promise from a click: it takes time, it can be abandoned halfway, and it cannot be sent by accident. That one interaction took longer to get right than any route on the site, and it is the part I would defend as design rather than implementation.",
      },
      {
        kind: "prose",
        text:
          "That is the most useful thing I have made, and it is a deletion. Every UNVERIFIED mark on this site descends from it: a fact that is missing gets a label, not a plausible number. It is also why the entries above say withdrawn and unbuilt in the same typography as built.",
      },
      {
        kind: "aside",
        label: "What it cost",
        text:
          "Nothing technical, although the repository is 121 MB because a build cache was committed, which is its own small lesson. The real cost is that the strongest thing I have made is the one I cannot show you.",
      },
      {
        kind: "falsifier",
        text:
          "The de-fabrication commit is the evidence for everything on this page. If it did not exist, the design principle would be an idea I had rather than something I did, and the entry would lose the only part of it you can check.",
      },
      {
        kind: "next",
        text:
          "Ask again and accept the answer. Until then the entry stays closed, and the principle it produced keeps working everywhere else on this site.",
      },
    ],
    nextSlug: null,
  },
];

export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
