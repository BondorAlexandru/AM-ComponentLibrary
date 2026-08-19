import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    // See vite.config.ts — `../src` resolves react from the repo root while this
    // app has its own copy. Two React instances break hooks.
    dedupe: ['react', 'react-dom'],
    alias: [
      { find: '@am/ui/icons', replacement: fileURLToPath(new URL('../src/icons/index.tsx', import.meta.url)) },
      { find: '@am/ui', replacement: fileURLToPath(new URL('../src/index.ts', import.meta.url)) },
    ],
  },
  test: { environment: 'jsdom', globals: true, include: ['src/**/*.test.{ts,tsx}'] },
})
