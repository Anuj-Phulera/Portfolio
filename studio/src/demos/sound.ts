/**
 * Demo 07 — sound that cannot start on its own.
 *
 * Question: can audio consent be a property of the architecture rather than
 * a promise in a settings menu?
 *
 * The gate refuses to create an AudioContext until a real gesture has
 * happened. The oscillator below is a room tone, not music; it exists to
 * prove the mechanic, and it stops when the tab loses focus.
 */
export interface SoundDemo {
  destroy(): void;
  state(): string;
}

export function mountSound(root: HTMLElement): SoundDemo {
  const toggle = root.querySelector<HTMLButtonElement>('[data-sound-toggle]');
  const status = root.querySelector<HTMLElement>('[data-sound-status]');
  if (!toggle || !status) throw new Error('sound markup missing');

  let ctx: AudioContext | null = null;
  let gain: GainNode | null = null;
  let osc: OscillatorNode | null = null;
  let enabled = false;

  const report = () => {
    status.textContent = enabled ? 'room tone on · 63Hz · −38dB' : 'silent';
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.textContent = enabled ? 'Mute room tone' : 'Enable room tone';
  };

  const ensureGraph = () => {
    if (ctx) return;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctor();
    gain = ctx.createGain();
    gain.gain.value = 0.012;
    osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 63;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
  };

  const onClick = () => {
    enabled = !enabled;
    if (enabled) {
      ensureGraph();
      void ctx?.resume();
    } else {
      void ctx?.suspend();
    }
    report();
  };

  const onVisibility = () => {
    if (!ctx) return;
    if (document.hidden) void ctx.suspend();
    else if (enabled) void ctx.resume();
  };

  toggle.addEventListener('click', onClick);
  document.addEventListener('visibilitychange', onVisibility);
  report();

  return {
    state: () => (enabled ? 'on' : 'off'),
    destroy() {
      toggle.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVisibility);
      osc?.stop();
      void ctx?.close();
    },
  };
}
