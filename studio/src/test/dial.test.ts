import { beforeEach, describe, expect, it } from 'vitest';
import { mountDial } from '../demos/dial';

function markup(): string {
  return `
    <div id="dial">
      <div data-dial-track><div data-dial-thumb></div></div>
      <input type="range" data-dial-input min="0" max="100" value="40" />
      <span data-dial-readout></span>
    </div>`;
}

beforeEach(() => {
  document.body.innerHTML = markup();
});

describe('dial', () => {
  it('renders the initial value', () => {
    mountDial(document.getElementById('dial')!, { min: 0, max: 100, value: 40, label: 'Moisture' }, false);
    expect(document.querySelector('[data-dial-readout]')?.textContent).toBe('40');
  });

  it('steps with arrow keys and clamps at the ends', () => {
    mountDial(document.getElementById('dial')!, { min: 0, max: 100, value: 99, label: 'Moisture', unit: '%' }, false);
    const track = document.querySelector<HTMLElement>('[data-dial-track]')!;
    track.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.querySelector('[data-dial-readout]')?.textContent).toBe('100%');
    track.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.querySelector('[data-dial-readout]')?.textContent).toBe('100%');
  });

  it('supports Home and End', () => {
    mountDial(document.getElementById('dial')!, { min: 0, max: 100, value: 40, label: 'Moisture' }, false);
    const track = document.querySelector<HTMLElement>('[data-dial-track]')!;
    track.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(document.querySelector('[data-dial-readout]')?.textContent).toBe('100');
    track.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(document.querySelector('[data-dial-readout]')?.textContent).toBe('0');
  });

  it('exposes slider semantics', () => {
    mountDial(document.getElementById('dial')!, { min: 0, max: 100, value: 40, label: 'Moisture' }, false);
    const track = document.querySelector<HTMLElement>('[data-dial-track]')!;
    expect(track.getAttribute('role')).toBe('slider');
    expect(track.getAttribute('aria-label')).toBe('Moisture');
    expect(track.getAttribute('aria-valuemax')).toBe('100');
    expect(track.tabIndex).toBe(0);
  });

  it('notifies listeners with clamped values', () => {
    const seen: number[] = [];
    mountDial(
      document.getElementById('dial')!,
      { min: 20, max: 80, value: 40, label: 'Moisture', onChange: (v) => seen.push(v) },
      false,
    );
    const track = document.querySelector<HTMLElement>('[data-dial-track]')!;
    track.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(seen).toEqual([40, 41]);
  });
});
