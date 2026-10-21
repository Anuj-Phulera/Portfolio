/**
 * Demo 02 — anime.js word reveal with an accessible copy.
 *
 * Question: can typography move word by word without a screen reader
 * announcing fragments, and without the paragraph reflowing on every frame?
 *
 * The line box is reserved before the animation starts, so nothing below it
 * shifts. The visible words are aria-hidden; the sentence exists once.
 */
import anime from 'animejs';
import { splitWords } from '../core/dom';
import { duration } from '../core/motion';

export function mountWords(root: HTMLElement, reduced: boolean): { play(): void } {
  const target = root.querySelector<HTMLElement>('[data-line]');
  const button = root.querySelector<HTMLButtonElement>('[data-replay]');
  if (!target) throw new Error('words demo markup missing');

  const text = target.dataset.line ?? '';
  const { root: splitRoot, words } = splitWords(text);
  target.replaceChildren(splitRoot);
  target.style.minHeight = `${target.getBoundingClientRect().height || 0}px`;

  const run = () => {
    if (reduced) {
      anime.set(words, { opacity: 1, translateY: 0 });
      return;
    }
    anime.set(words, { opacity: 0, translateY: 12 });
    anime({
      targets: words,
      opacity: [0, 1],
      translateY: [12, 0],
      duration: duration('reveal', false),
      delay: anime.stagger(38),
      easing: 'cubicBezier(0.16, 1, 0.3, 1)',
    });
  };

  button?.addEventListener('click', run);
  run();

  return { play: run };
}
