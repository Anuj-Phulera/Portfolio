/**
 * The ledger slicer. All 34 rows are in the HTML; this only filters them.
 * With JavaScript off, the full ledger is still readable.
 */

export function initLedger(root: Element): void {
  const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-ledger-row]"));
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-grade-btn]"));
  const count = root.querySelector<HTMLElement>("[data-ledger-count]");
  const stateEl = root.querySelector<HTMLElement>("[data-state]");
  if (rows.length === 0) return;

  function filter(grade: string): void {
    let shown = 0;
    for (const row of rows) {
      const match = grade === "all" || row.dataset.grade === grade;
      row.hidden = !match;
      if (match) shown += 1;
    }
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button.dataset.gradeBtn === grade));
    }
    if (count) count.textContent = String(shown);
    if (stateEl) stateEl.textContent = grade === "all" ? "ALL" : `GRADE ${grade}`;
  }

  for (const button of buttons) {
    button.addEventListener("click", () => filter(button.dataset.gradeBtn ?? "all"));
  }
}
