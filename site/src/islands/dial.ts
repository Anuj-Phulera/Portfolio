/**
 * The watering dial: the control rule from VERDE, reduced to one sensor and
 * one actuator. The series is a fixed fixture, and the instrument says so.
 * Nothing is random and nothing is presented as a live reading.
 */

export function initDial(root: Element): void {
  const range = root.querySelector<HTMLInputElement>("[data-threshold]");
  const bars = Array.from(root.querySelectorAll<HTMLElement>("[data-bar]"));
  const autoBtn = root.querySelector<HTMLButtonElement>("[data-auto]");
  const pumpBtn = root.querySelector<HTMLButtonElement>("[data-pump]");
  const thresholdOut = root.querySelector<HTMLElement>("[data-threshold-out]");
  const liveThreshold = root.querySelector<HTMLElement>("[data-live-threshold]");
  const moistureOut = root.querySelector<HTMLElement>("[data-moisture]");
  const pumpOut = root.querySelector<HTMLElement>("[data-live-pump]");
  const whyOut = root.querySelector<HTMLElement>("[data-why]");
  const stateEl = root.querySelector<HTMLElement>("[data-state]");
  if (!range || bars.length === 0) return;

  const values = bars.map((bar) => Number(bar.dataset.value ?? "0"));
  const moisture = values[values.length - 1] ?? 0;
  let automatic = true;
  let manualPump = false;

  function render(): void {
    const threshold = Number(range!.value);
    const pumpOn = automatic ? moisture < threshold : manualPump;

    for (const [index, bar] of bars.entries()) {
      const value = values[index] ?? 0;
      bar.dataset.below = String(value < threshold);
      bar.dataset.now = String(index === values.length - 1);
    }

    if (autoBtn) autoBtn.setAttribute("aria-pressed", String(automatic));
    if (pumpBtn) {
      pumpBtn.disabled = automatic;
      pumpBtn.setAttribute("aria-pressed", String(manualPump));
    }
    if (thresholdOut) thresholdOut.textContent = String(threshold);
    if (liveThreshold) liveThreshold.textContent = String(threshold);
    if (moistureOut) moistureOut.textContent = String(moisture);
    if (pumpOut) pumpOut.textContent = pumpOn ? "ON" : "OFF";
    if (whyOut) {
      whyOut.textContent = automatic
        ? `${moisture}% is ${moisture < threshold ? "below" : "at or above"} ${threshold}%`
        : "manual override";
    }
    if (stateEl) stateEl.textContent = automatic ? "AUTO" : "MANUAL";
  }

  range.addEventListener("input", render);

  autoBtn?.addEventListener("click", () => {
    automatic = !automatic;
    render();
  });

  pumpBtn?.addEventListener("click", () => {
    manualPump = !manualPump;
    render();
  });

  render();
}
