#!/usr/bin/env node
/**
 * The docs site mirrors both apps' palettes in `site/src/themes.ts` so it can
 * preview a component in each. A mirror that drifts is worse than no mirror —
 * the site keeps looking authoritative while showing colours nothing renders.
 *
 * This diffs the mirror against the real stylesheets. It needs the sibling repos
 * checked out next to this one; where they are absent (CI, a fresh clone) it
 * skips with a note rather than failing, because it cannot verify either way.
 *
 *   node scripts/check-theme-drift.mjs
 */

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const repo = resolve(here, '..')

const SOURCES = [
  {
    themeId: 'cms-dark',
    file: resolve(repo, '../CMS/app/globals.css'),
    label: 'CMS dark  (:root[data-theme="dark"])',
    // Dark is opt-in since the CMS switched its default to light; the light
    // values live on the combined `:root, :root[data-theme="light"]` selector.
    block: (css) => sliceBlock(css, ':root[data-theme="dark"] {'),
    varFor: (role) => `--sb-${role === 'danger-accent' ? 'danger' : role}`,
  },
  {
    themeId: 'cms-light',
    file: resolve(repo, '../CMS/app/globals.css'),
    label: 'CMS light (:root, :root[data-theme="light"]) — the CMS default',
    block: (css) => sliceBlock(css, ':root,\n:root[data-theme="light"] {'),
    varFor: (role) => `--sb-${role === 'danger-accent' ? 'danger' : role}`,
  },
  {
    themeId: 'campaigns',
    file: resolve(repo, '../Influencer/src/index.css'),
    label: 'AM Campaigns (:root)',
    block: (css) => sliceBlock(css, ':root {'),
    varFor: (role) => `--${role === 'danger-accent' ? 'danger' : role}`,
  },
]

/** Everything from `marker` to the first line that is just `}`. */
function sliceBlock(css, marker) {
  const start = css.indexOf(marker)
  if (start === -1) return null
  const end = css.indexOf('\n}', start)
  return end === -1 ? null : css.slice(start, end)
}

function declaredValue(block, name) {
  // `--x: value;` — allow arbitrary whitespace, capture up to the semicolon.
  const m = block.match(new RegExp(`${name.replace(/-/g, '\\-')}\\s*:\\s*([^;]+);`))
  return m ? m[1].trim() : null
}

/** Pull the `roles` object out of a THEMES entry in the TS mirror. */
function mirrorRoles(source, themeId) {
  const idAt = source.indexOf(`id: '${themeId}'`)
  if (idAt === -1) return null
  const rolesAt = source.indexOf('roles: {', idAt)
  const end = source.indexOf('\n    },', rolesAt)
  const body = source.slice(rolesAt, end)
  const out = {}
  for (const m of body.matchAll(/^\s{6}'?([a-z0-9-]+)'?:\s*'([^']+)',$/gm)) out[m[1]] = m[2]
  return out
}

/** Normalise so `rgba(11, 13, 24, 0.16)` and `rgba(11,13,24,.16)` compare equal. */
function norm(v) {
  return v
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/(^|[^0-9])\.(\d)/g, '$10.$2')
    .replace(/,0?\.?0+\)/, (m) => m)
}

const themesSrc = readFileSync(resolve(repo, 'site/src/themes.ts'), 'utf8')
const contractSrc = readFileSync(resolve(repo, 'src/tokens/contract.ts'), 'utf8')

// Scope to the TIER1 array — TIER2_TOKENS sits at the same indent and would
// otherwise be read as a colour role.
const tier1Block = (() => {
  const start = contractSrc.indexOf('export const TIER1_COLOR_TOKENS')
  const end = contractSrc.indexOf('] as const', start)
  if (start === -1 || end === -1) throw new Error('could not find TIER1_COLOR_TOKENS in src/tokens/contract.ts')
  return contractSrc.slice(start, end)
})()
const roles = [...tier1Block.matchAll(/^\s{2}'([a-z0-9-]+)',$/gm)].map((m) => m[1])
if (!roles.length) throw new Error('parsed zero tier-1 roles — the contract format changed')

let problems = 0
let skipped = 0

for (const src of SOURCES) {
  if (!existsSync(src.file)) {
    console.log(`⊘ skipped ${src.label} — ${src.file} not found`)
    skipped++
    continue
  }
  const css = readFileSync(src.file, 'utf8')
  const block = src.block(css)
  if (!block) {
    console.error(`✗ ${src.label}: could not locate the token block in ${src.file}`)
    problems++
    continue
  }
  const mirror = mirrorRoles(themesSrc, src.themeId)
  if (!mirror) {
    console.error(`✗ ${src.label}: no '${src.themeId}' entry in site/src/themes.ts`)
    problems++
    continue
  }

  const drift = []
  for (const role of roles) {
    const name = src.varFor(role)
    let actual = declaredValue(block, name)
    // Campaigns aliases --ok to --green; resolve one level of var() indirection.
    const alias = actual?.match(/^var\((--[a-z0-9-]+)\)$/)
    if (alias) actual = declaredValue(block, alias[1]) ?? actual
    const expected = mirror[role]
    if (actual == null) drift.push([role, name, '(not declared)', expected])
    else if (norm(actual) !== norm(expected)) drift.push([role, name, actual, expected])
  }

  if (drift.length) {
    problems += drift.length
    console.error(`\n✗ ${src.label} — ${drift.length} drifted`)
    for (const [role, name, actual, expected] of drift) {
      console.error(`    ${role.padEnd(15)} ${name.padEnd(20)} app: ${String(actual).padEnd(28)} site: ${expected}`)
    }
  } else {
    console.log(`✓ ${src.label} — all ${roles.length} roles match`)
  }
}

if (problems) {
  console.error(
    `\n${problems} mismatch(es). Update site/src/themes.ts to match the app stylesheet, ` +
      `or the app if the site is right. The docs must not show colours nothing renders.`,
  )
  process.exit(1)
}
if (skipped === SOURCES.length) {
  console.log('\nNo sibling repos found — nothing verified. Run this where CMS/ and Influencer/ are checked out.')
}
