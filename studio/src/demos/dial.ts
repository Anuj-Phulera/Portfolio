/**
 * Demo 09 — a control you can drag, and also use without dragging.
 *
 * Question: what does an honest operable instrument require before it is
 * allowed to call itself accessible?
 *
 * Requirements implemented here:
 *  - pointer drag
 *  - arrow keys, Home/End
 *  - a real range input underneath, visually hidden but exposed to AT
 *  - a numeric readout that is never invented
 *  - reduced motion: no easing, the thumb jumps
 */

export interface DialOptions {
  min: number;
  max: number;
  value: number;
  label: string;
  unit?: string;
  onChange?: (value: number) => void;
}

export function mountDial(root: HTMLElement, options: DialOptions, reduced: boolean): { destroy(): void } {
  const track = root.querySelector<HTMLElement>('[data-dial-track]');
  const thumb = root.querySelector<HTMLElement>('[data-dial-thumb]');
  const input = root.querySelector<HTMLInputElement>('[data-dial-input]');
  const readout = root.querySelector<HTMLElement>('[data-dial-readout]');
  if (!track || !thumb || !input || !readout) throw new Error('dial markup missing');

  const { min, max, label } = options;
  let value = clamp(options.value);

  function clamp(next: number): number {
    return Math.min(max, Math.max(min, Math.round(next)));
  }

  function render(): void {
    const ratio = (value - min) / (max - min || 1);
    thumb!.style.left = `${ratio * 100}%`;
    thumb!.style.transition = reduced ? 'none' : '';
    input!.value = String(value);
    input!.setAttribute('aria-valuetext', `${value}${options.unit ?? ''}`);
    readout!.textContent = `${value}${options.unit ?? ''}`;
    options.onChange?.(value);
  }

  function set(next: number): void {
    value = clamp(next);
    render();
  }

  const onInput = () => set(Number(input!.value));

  const onPointerDown = (event: PointerEvent) => {
    track!.setPointerCapture(event.pointerId);
    const move = (e: PointerEvent) => {
      const rect = track!.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      set(min + ratio * (max - min));
    };
    move(event);
    const up = () => {
      track!.removeEventListener('pointermove', move);
      track!.removeEventListener('pointerup', up);
      track!.removeEventListener('pointercancel', up);
    };
    track!.addEventListener('pointermove', move);
    track!.addEventListener('pointerup', up);
    track!.addEventListener('pointercancel', up);
  };

  const onKey = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        set(value + 1);
        event.preventDefault();
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        set(value - 1);
        event.preventDefault();
        break;
      case 'Home':
        set(min);
        event.preventDefault();
        break;
      case 'End':
        set(max);
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  track.addEventListener('pointerdown', onPointerDown);
  track.addEventListener('keydown', onKey);
  input.addEventListener('input', onInput);
  track.setAttribute('role', 'slider');
  track.setAttribute('tabindex', '0');
  track.setAttribute('aria-label', label);
  track.setAttribute('aria-valuemin', String(min));
  track.setAttribute('aria-valuemax', String(max));
  render();

  return {
    destroy() {
      track.removeEventListener('pointerdown', onPointerDown);
      track.removeEventListener('keydown', onKey);
      input.removeEventListener('input', onInput);
    },
  };
}
