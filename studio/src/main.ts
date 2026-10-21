import './styles/base.css';
import './styles/demos.css';

import { applyMotion, resolveMotion, storeOverride } from './core/motion';
import { createScroll } from './core/scroll';
import { qs } from './core/dom';
import { mountCut } from './demos/cut';
import { mountWords } from './demos/words';
import { mountParallax } from './demos/parallax';
import { mountReveals } from './demos/reveal';
import { mountScrollLine } from './demos/scrollline';
import { mountViewTransition } from './demos/viewtransition';
import { mountSound } from './demos/sound';
import { mountScrollScene } from './demos/scrollscene';
import { mountDial } from './demos/dial';
import { mountCounter } from './demos/counter';

let state = resolveMotion();
applyMotion(state);

let scroll = createScroll(state.mode === 'reduced');

const cleanups: Array<() => void> = [];
const reduced = () => state.mode === 'reduced';

function mountAll(): void {
  const cut = mountCut(qs('#cut-root'), reduced());
  const words = mountWords(qs('#words-root'), reduced());
  const parallax = mountParallax(qs('#depth-root'), reduced());
  const reveals = mountReveals(document, reduced());
  const line = mountScrollLine(qs('#scroll-root'), scroll);
  const vt = mountViewTransition(qs('#vt-root'));
  const sound = mountSound(qs('#sound-root'));
  const scene = mountScrollScene(qs('#scene-root'), reduced());
  const dial = mountDial(
    qs('#dial-root'),
    { min: 0, max: 100, value: 65, label: 'Moisture threshold', unit: '%' },
    reduced(),
  );
  const figures = mountCounter(qs('#figures-root'), reduced());

  qs<HTMLButtonElement>('#cut-play').addEventListener('click', cut.play);
  qs<HTMLButtonElement>('#cut-reset').addEventListener('click', cut.reset);
  qs<HTMLButtonElement>('#words-replay').addEventListener('click', words.play);

  cleanups.push(
    () => cut.destroy(),
    () => parallax.destroy(),
    () => reveals.destroy(),
    () => line.destroy(),
    () => vt.destroy(),
    () => sound.destroy(),
    () => scene.destroy(),
    () => dial.destroy(),
    () => figures.play(),
  );
}

function teardown(): void {
  while (cleanups.length) cleanups.pop()?.();
}

mountAll();

/* Motion toggle: changes the token layer and remounts the demos so the
   reduced path is genuinely exercised rather than described. */
const toggle = qs<HTMLButtonElement>('#motion-toggle');
const label = qs<HTMLElement>('#motion-state');

const reflect = () => {
  const on = state.mode === 'reduced';
  toggle.setAttribute('aria-pressed', String(on));
  toggle.setAttribute('aria-label', on ? 'Disable reduced motion' : 'Enable reduced motion');
  label.textContent = `motion: ${state.mode} (${state.source})`;
};

toggle.addEventListener('click', () => {
  state = { mode: state.mode === 'reduced' ? 'full' : 'reduced', source: 'manual' };
  storeOverride(state.mode);
  applyMotion(state);
  reflect();
  teardown();
  scroll.destroy();
  scroll = createScroll(state.mode === 'reduced');
  mountAll();
});

reflect();

/* Respect a live change of the OS preference only while no manual override
   is set, so the toggle is not fought by the system. */
window.matchMedia?.('(prefers-reduced-motion: reduce)').addEventListener?.('change', () => {
  if (state.source === 'manual') return;
  state = resolveMotion();
  applyMotion(state);
  reflect();
  teardown();
  scroll.destroy();
  scroll = createScroll(state.mode === 'reduced');
  mountAll();
});

window.addEventListener('beforeunload', () => {
  teardown();
  scroll.destroy();
});
