import "../styles/index.css";
import { initDial } from "./dial.ts";
import { initLedger } from "./ledger.ts";
import { initMode } from "./mode.ts";

/**
 * Three islands, one bundle. Each one upgrades markup that is already complete
 * without it, so a failed script costs the interaction and not the content.
 */
function start(): void {
  document.querySelectorAll("[data-mode-root]").forEach(initMode);
  document.querySelectorAll("[data-dial-root]").forEach(initDial);
  document.querySelectorAll("[data-ledger-root]").forEach(initLedger);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}
