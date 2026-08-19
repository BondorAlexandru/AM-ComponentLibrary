import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

/**
 * The site imports the library from `../src`, not from `dist`.
 *
 * That is deliberate: docs should render the source you are editing, so a change
 * to a component shows up on `npm run dev` without a rebuild. CI checks `dist`
 * separately (it must never be stale), so nothing is lost by pointing the site
 * at source.
 *
 * `base` targets GitHub Pages at /AM-ComponentLibrary/.
 *
 * `dedupe` is load-bearing. This app has its own node_modules with its own react,
 * while `../src` resolves react from the repo root — two copies, which means two
 * React instances and "invalid hook call" on the first stateful component.
 * @vitejs/plugin-react already dedupes these implicitly; stating it here means a
 * plugin change cannot silently take that away.
 */
export default defineConfig({
  base: process.env.SITE_BASE ?? '/AM-ComponentLibrary/',
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      { find: '@am/ui/icons', replacement: fileURLToPath(new URL('../src/icons/index.tsx', import.meta.url)) },
      { find: '@am/ui', replacement: fileURLToPath(new URL('../src/index.ts', import.meta.url)) },
    ],
  },
})
