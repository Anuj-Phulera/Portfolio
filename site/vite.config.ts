import { resolve } from "node:path";
import { defineConfig } from "vite";

/**
 * Only the islands are bundled by Vite. The pages themselves are static HTML
 * written by build.ts, so the site is readable with JavaScript switched off.
 * CSS is imported from the island entry so it is hashed and cache-busted too.
 */
export default defineConfig({
  root: resolve(import.meta.dirname, "src"),
  base: process.env.SITE_BASE ?? "/",
  // The preview host is a proxy origin, so it has to be named as allowed.
  server: { host: "0.0.0.0", allowedHosts: true },
  preview: { host: "0.0.0.0", allowedHosts: true },
  build: {
    outDir: resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    manifest: true,
    target: "es2022",
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: resolve(import.meta.dirname, "src/islands/main.ts"),
    },
  },
});
