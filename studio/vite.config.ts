import { defineConfig } from 'vite';

export default defineConfig({
  // The sandbox preview is served from a proxied host, so the dev server has to
  // accept it explicitly. `true` is acceptable here because this is a lab, not
  // a deployment target.
  server: { host: '0.0.0.0', port: 5173, strictPort: false, allowedHosts: true },
  preview: { host: '0.0.0.0', port: 4173, strictPort: false, allowedHosts: true },
  build: { target: 'es2020', sourcemap: false },
  test: {
    environment: 'jsdom',
    include: ['src/test/**/*.test.ts'],
    restoreMocks: true,
  },
} as never);
