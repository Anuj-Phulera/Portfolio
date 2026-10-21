/**
 * The studio index as data.
 *
 * Stages used to be hardcoded in the page and duplicated in the README. A
 * registry keeps one list, which the page renders, the tests verify and the
 * documentation generator reads.
 */

export interface DemoMeta {
  readonly id: string;
  readonly index: number;
  readonly title: string;
  readonly technique: string;
  readonly question: string;
  readonly finding: string;
  readonly reducedBehaviour: string;
}

export const DEMOS: readonly DemoMeta[] = [
  {
    id: 'cut',
    index: 1,
    title: 'A cut sequence, timed in code',
    technique: 'GSAP + pacing model',
    question:
      'Can three shots hold, cut and dissolve to a schedule decided before the animation is written?',
    finding:
      'The timeline is generated from the pacing model, so an accidental 600ms “cut” is rejected at construction.',
    reducedBehaviour: 'All three shots shown at once, no transitions.',
  },
  {
    id: 'words',
    index: 2,
    title: 'Type that moves without breaking',
    technique: 'anime.js + accessible split',
    question:
      'Can words animate one by one while a screen reader still hears one sentence, and nothing below shifts?',
    finding:
      'Visible fragments are aria-hidden; the sentence exists once; the line box is reserved before the first frame.',
    reducedBehaviour: 'Text present immediately, no stagger.',
  },
  {
    id: 'depth',
    index: 3,
    title: 'How little motion reads as depth',
    technique: 'pointer events',
    question: 'What is the smallest pointer response that still feels physical?',
    finding: 'Capped at 6px, transform-only, disabled for coarse pointers.',
    reducedBehaviour: 'No motion; the layer sits still.',
  },
  {
    id: 'reveal',
    index: 4,
    title: 'Arrive once, stay',
    technique: 'IntersectionObserver',
    question: 'What changes when content arrives at a decided moment and never leaves?',
    finding: 'Idempotent reveals remove the “always loading” feeling of scroll-linked animation.',
    reducedBehaviour: 'Everything visible from the first frame.',
  },
  {
    id: 'progress',
    index: 5,
    title: 'A position readout that tells the truth',
    technique: 'Lenis',
    question: 'Does smooth scrolling break a progress indicator?',
    finding: 'The readout is identical in both worlds; it just reports which one is active.',
    reducedBehaviour: 'Native scroll; the number stays correct.',
  },
  {
    id: 'swap',
    index: 6,
    title: 'A change of state that feels authored',
    technique: 'View Transitions API',
    question: 'Can the platform alone make a swap feel considered?',
    finding: 'One feature detection, and the fallback is the new content with no transition.',
    reducedBehaviour: 'Instant swap.',
  },
  {
    id: 'sound',
    index: 7,
    title: 'Sound that cannot start on its own',
    technique: 'Web Audio',
    question: 'Can consent be architectural rather than a setting?',
    finding: 'A 63Hz tone at -38dB, stopped on blur, never assumed.',
    reducedBehaviour: 'Unchanged — sound already requires a gesture.',
  },
  {
    id: 'scene',
    index: 8,
    title: 'Scroll, without a scroll listener',
    technique: 'CSS animation-timeline',
    question: 'How much can CSS scroll-driven animation do before a JS scroll handler is justified?',
    finding: 'Native where available; a threshold reveal where not. Scrubbing is never emulated.',
    reducedBehaviour: 'All panels visible, no scroll-linked animation.',
  },
  {
    id: 'dial',
    index: 9,
    title: 'A control you can drag — and also not drag',
    technique: 'pointer + keyboard + ARIA',
    question: 'What must an operable instrument implement before it may call itself accessible?',
    finding: 'Drag, arrows, Home/End, a real range input underneath, clamping and a live value.',
    reducedBehaviour: 'The thumb jumps instead of easing.',
  },
  {
    id: 'figures',
    index: 10,
    title: 'Numbers that must show their receipt',
    technique: 'data integrity',
    question: 'What does an animated statistic have to prove before it is allowed on screen?',
    finding: 'A figure without a source and a commit sha throws instead of rendering.',
    reducedBehaviour: 'Final values shown immediately.',
  },
];

export function byId(id: string): DemoMeta | undefined {
  return DEMOS.find((demo) => demo.id === id);
}

export function assertRegistryIntegrity(demos: readonly DemoMeta[]): void {
  const ids = new Set<string>();
  const indexes = new Set<number>();
  for (const demo of demos) {
    if (ids.has(demo.id)) throw new Error(`duplicate demo id: ${demo.id}`);
    if (indexes.has(demo.index)) throw new Error(`duplicate demo index: ${demo.index}`);
    if (!demo.question.trim()) throw new Error(`demo ${demo.id} has no question`);
    if (demo.reducedBehaviour.trim().length < 10) throw new Error(`demo ${demo.id} has no reduced path documented`);
    ids.add(demo.id);
    indexes.add(demo.index);
  }
  const ordered = [...demos].sort((a, b) => a.index - b.index);
  ordered.forEach((demo, i) => {
    if (demo.index !== i + 1) throw new Error(`demo indexes must be contiguous from 1: ${demo.id} is ${demo.index}`);
  });
}

assertRegistryIntegrity(DEMOS);
