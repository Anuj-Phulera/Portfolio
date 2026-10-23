/**
 * The mode engine: a reduction of STRATA's decision.
 *
 * It reads three signals a person actually produces — how long they stay on an
 * object, whether they come back, and how much of the set they cover — and
 * changes the arrangement. Every automatic change is explained in the read-out
 * and can be refused with Pin. Nothing here is random.
 */

type Layout = "codex" | "mosaic" | "lattice";

const LAYOUTS: Layout[] = ["codex", "mosaic", "lattice"];
const IDLE_MS = 4600;
const DEEP_MS = 1500;

interface Reading {
  layout: Layout;
  read: string;
  confidence: string;
}

export function initMode(root: Element): void {
  const stage = root.querySelector<HTMLElement>("[data-stage]");
  if (!stage) return;

  const objects = Array.from(stage.querySelectorAll<HTMLElement>("[data-object]"));
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-layout-btn]"));
  const pin = root.querySelector<HTMLButtonElement>("[data-pin]");
  const readEl = root.querySelector<HTMLElement>("[data-read]");
  const modeEl = root.querySelector<HTMLElement>("[data-mode]");
  const confEl = root.querySelector<HTMLElement>("[data-conf]");
  const stateEl = root.querySelector<HTMLElement>("[data-state]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  const dwell = new Map<string, number>();
  const visits = new Map<string, number>();
  const enteredAt = new Map<string, number>();
  const pending = new Map<string, number>();

  let layout: Layout = "codex";
  let live = false;
  let pinned = false;
  let idleTimer = 0;
  let idleIndex = 0;

  function setLayout(next: Layout, reason: string, confidence: string): void {
    layout = next;
    stage!.dataset.layout = next;
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button.dataset.layoutBtn === next));
    }
    if (modeEl) modeEl.textContent = next.toUpperCase();
    if (readEl) readEl.textContent = reason;
    if (confEl) confEl.textContent = confidence;
  }

  function setState(text: string): void {
    if (stateEl) stateEl.textContent = text;
  }

  function stopIdle(): void {
    if (idleTimer) window.clearInterval(idleTimer);
    idleTimer = 0;
  }

  function startIdle(): void {
    if (reduced.matches || live || pinned) {
      setState(reduced.matches ? "STATIC" : "DEMO");
      return;
    }
    setState("DEMO");
    idleTimer = window.setInterval(() => {
      idleIndex = (idleIndex + 1) % LAYOUTS.length;
      const next = LAYOUTS[idleIndex] ?? "codex";
      stage!.dataset.layout = next;
      for (const button of buttons) {
        button.setAttribute("aria-pressed", String(button.dataset.layoutBtn === next));
      }
      if (modeEl) modeEl.textContent = next.toUpperCase();
    }, IDLE_MS);
  }

  function markLive(): void {
    if (!live) {
      live = true;
      stopIdle();
      setState(reduced.matches ? "STATIC" : "LIVE");
    }
  }

  function coverage(): number {
    return visits.size;
  }

  function revisits(): number {
    let total = 0;
    for (const count of visits.values()) if (count > 1) total += 1;
    return total;
  }

  function maxDwell(): number {
    let max = 0;
    for (const value of dwell.values()) max = Math.max(max, value);
    // The object under the pointer has not been left yet, so its time counts too.
    for (const started of enteredAt.values()) max = Math.max(max, performance.now() - started);
    return max;
  }

  function decide(): Reading | null {
    const covered = coverage();
    const back = revisits();
    const deepest = maxDwell();

    if (back >= 1 && covered >= 2) {
      return { layout: "lattice", read: `RETURNING · ${back} REVISIT${back > 1 ? "S" : ""}`, confidence: "HIGH" };
    }
    if (deepest >= DEEP_MS) {
      return {
        layout: "codex",
        read: `DEEP · ${(deepest / 1000).toFixed(1)}S ON ONE OBJECT`,
        confidence: deepest >= DEEP_MS * 2 ? "HIGH" : "LOW",
      };
    }
    if (covered >= 3) {
      return { layout: "mosaic", read: "WIDE · 3 OBJECTS", confidence: "HIGH" };
    }
    return null;
  }

  function evaluate(): void {
    if (pinned) {
      if (readEl) readEl.textContent = "PINNED BY YOU";
      if (confEl) confEl.textContent = "MANUAL";
      return;
    }
    const reading = decide();
    if (reading && reading.layout !== layout) {
      setLayout(reading.layout, reading.read, reading.confidence);
    } else if (reading) {
      if (readEl) readEl.textContent = reading.read;
      if (confEl) confEl.textContent = reading.confidence;
    }
  }

  for (const object of objects) {
    const id = object.dataset.object ?? "";
    const enter = (): void => {
      markLive();
      visits.set(id, (visits.get(id) ?? 0) + 1);
      enteredAt.set(id, performance.now());
      object.dataset.active = "true";
      // A visitor who rests on an object should see the engine notice, without
      // having to leave first. The read updates once the dwell threshold is met.
      const timer = window.setTimeout(() => evaluate(), DEEP_MS + 60);
      pending.set(id, timer);
    };
    const leave = (): void => {
      const timer = pending.get(id);
      if (timer) window.clearTimeout(timer);
      pending.delete(id);
      const started = enteredAt.get(id);
      if (started !== undefined) {
        dwell.set(id, (dwell.get(id) ?? 0) + (performance.now() - started));
        enteredAt.delete(id);
      }
      object.dataset.active = "false";
      evaluate();
    };
    object.addEventListener("pointerenter", enter);
    object.addEventListener("pointerleave", leave);
    object.addEventListener("focusin", enter);
    object.addEventListener("focusout", leave);
  }

  for (const button of buttons) {
    button.addEventListener("click", () => {
      markLive();
      const next = (button.dataset.layoutBtn ?? "codex") as Layout;
      setLayout(next, "CHOSEN BY YOU", "MANUAL");
    });
  }

  pin?.addEventListener("click", () => {
    markLive();
    pinned = !pinned;
    pin.setAttribute("aria-pressed", String(pinned));
    setState(pinned ? "PINNED" : "LIVE");
    if (pinned) {
      if (readEl) readEl.textContent = "PINNED BY YOU";
      if (confEl) confEl.textContent = "MANUAL";
    } else {
      evaluate();
    }
  });

  reduced.addEventListener("change", () => {
    if (reduced.matches) {
      stopIdle();
      setState(live ? "STATIC" : "STATIC");
    } else if (!live) {
      startIdle();
    }
  });

  setLayout("codex", "DEMO", "—");
  startIdle();
}
