import { defineConfig } from 'vitest/config';
import path from 'path';

// Standalone vitest config (kept separate from vite.config.ts so test tooling
// can never affect the production build).
export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts'],
  },
});
