import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: [
      { find: '@am/ui/icons', replacement: fileURLToPath(new URL('../src/icons/index.tsx', import.meta.url)) },
      { find: '@am/ui', replacement: fileURLToPath(new URL('../src/index.ts', import.meta.url)) },
    ],
  },
  test: { environment: 'jsdom', globals: true, include: ['src/**/*.test.{ts,tsx}'] },
})
