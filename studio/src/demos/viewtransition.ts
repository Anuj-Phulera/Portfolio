/**
 * Demo 06 — a page-like transition with the View Transitions API.
 *
 * Question: can a change of state feel authored using only the platform,
 * with a visible fallback where the API does not exist?
 */
export function mountViewTransition(root: HTMLElement): { destroy(): void } {
  const button = root.querySelector<HTMLButtonElement>('[data-swap]');
  const panel = root.querySelector<HTMLElement>('[data-panel]');
  const note = root.querySelector<HTMLElement>('[data-support]');
  if (!button || !panel) throw new Error('view transition markup missing');

  const supported = typeof document !== 'undefined' && 'startViewTransition' in document;
  if (note) note.textContent = supported ? 'supported here · cross-fade 240ms' : 'not supported · instant swap (the fallback path)';

  let state = 0;
  const states = [
    { title: 'STATE ONE', body: 'A panel that changes identity rather than position.' },
    { title: 'STATE TWO', body: 'The layout is identical. Only the content is different.' },
  ];

  const swap = () => {
    state = (state + 1) % states.length;
    const next = states[state];
    if (!next) return;
    const write = () => {
      panel.querySelector('[data-title]')!.textContent = next.title;
      panel.querySelector('[data-body]')!.textContent = next.body;
    };
    if (supported) {
      (document as Document & { startViewTransition: (cb: () => void) => unknown }).startViewTransition(write);
    } else {
      write();
    }
  };

  button.addEventListener('click', swap);
  return { destroy: () => button.removeEventListener('click', swap) };
}
