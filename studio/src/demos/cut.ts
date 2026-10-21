/**
 * Demo 01 — a cut sequence driven by GSAP, timed by the pacing model.
 *
 * Question: can a three-shot sequence hold, cut and dissolve to a schedule
 * that was determined in code rather than by eye?
 *
 * The timeline is built from `schedule()`; GSAP only executes it. Under
 * reduced motion every shot is shown at once with no transitions.
 */
import gsap from 'gsap';
import { schedule } from '../core/pacing';
import { duration } from '../core/motion';

export const CUT_SHOTS = [
  { name: 'Desk', line: '2 a.m. One lamp. The work that never shipped.', hold: 1400, transition: 120 },
  { name: 'Greenhouse', line: 'A board that waters itself, and a dashboard that watches.', hold: 1800, transition: 700 },
  { name: 'Door', line: 'The next room is being built.', hold: 2000, transition: 120 },
] as const;

export interface CutDemo {
  play(): void;
  reset(): void;
  destroy(): void;
}

export function mountCut(root: HTMLElement, reduced: boolean): CutDemo {
  const seq = schedule(CUT_SHOTS.map((s) => ({ ...s })));
  const stage = root.querySelector<HTMLElement>('[data-stage]');
  const readout = root.querySelector<HTMLElement>('[data-readout]');
  if (!stage || !readout) throw new Error('cut demo markup missing');

  const slides = Array.from(stage.querySelectorAll<HTMLElement>('[data-shot]'));
  let timeline: gsap.core.Timeline | null = null;

  const showOnly = (index: number) => {
    slides.forEach((slide, i) => {
      slide.style.opacity = i === index ? '1' : '0';
      slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    const shot = seq.shots[index];
    if (shot) readout.textContent = `shot ${shot.index + 1}/${seq.shots.length} · ${shot.name} · holds ${shot.hold}ms · ${shot.kind}`;
  };

  const reset = () => {
    timeline?.kill();
    timeline = null;
    slides.forEach((slide) => {
      gsap.set(slide, { opacity: 0, y: 0 });
    });
    showOnly(0);
    readout.textContent = 'ready · ' + seq.duration + 'ms total';
  };

  const play = () => {
    timeline?.kill();
    if (reduced) {
      slides.forEach((slide) => {
        slide.style.opacity = '1';
        slide.setAttribute('aria-hidden', 'false');
      });
      readout.textContent = 'reduced motion · all three shots shown at once · ' + seq.duration + 'ms → 0ms';
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    seq.shots.forEach((shot, i) => {
      tl.call(() => showOnly(i), [], shot.startsAt / 1000);
      tl.fromTo(
        slides[i] ?? {},
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: duration('scene', false) / 1000 },
        shot.startsAt / 1000,
      );
      if (i < seq.shots.length - 1) {
        tl.to(slides[i] ?? {}, { opacity: 0, duration: (shot.kind === 'dissolve' ? 0.7 : 0.12) }, (shot.startsAt + shot.hold) / 1000);
      }
    });
    timeline = tl;
  };

  reset();
  return {
    play,
    reset,
    destroy() {
      timeline?.kill();
      timeline = null;
    },
  };
}
