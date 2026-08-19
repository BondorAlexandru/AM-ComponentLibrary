/**
 * The token contract's own guard. jsdom does resolve custom properties declared
 * in an inline <style>, which is enough to prove the checker works — the real
 * value comes from calling it in each app's e2e run, where the app's actual
 * stylesheet is loaded.
 */

import { afterEach, describe, expect, it } from 'vitest'
import {
  CAMPAIGNS_TOKEN_MAP,
  CMS_TOKEN_MAP,
  TIER1_COLOR_TOKENS,
  findMissingTokens,
} from '../tokens/contract.js'

function declare(vars: Record<string, string>) {
  const style = document.createElement('style')
  style.textContent = `:root{${Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(';')}}`
  document.head.appendChild(style)
  return style
}

afterEach(() => {
  document.head.querySelectorAll('style').forEach((s) => s.remove())
})

describe('findMissingTokens', () => {
  it('reports every role when nothing is declared', () => {
    expect(findMissingTokens(CAMPAIGNS_TOKEN_MAP)).toEqual([...TIER1_COLOR_TOKENS])
  })

  it('reports nothing when every mapped variable resolves', () => {
    declare(Object.fromEntries(Object.values(CAMPAIGNS_TOKEN_MAP).map((v) => [v, '#fff'])))
    expect(findMissingTokens(CAMPAIGNS_TOKEN_MAP)).toEqual([])
  })

  it('names the one role whose variable was removed', () => {
    const vars = Object.fromEntries(Object.values(CAMPAIGNS_TOKEN_MAP).map((v) => [v, '#fff']))
    delete vars[CAMPAIGNS_TOKEN_MAP.warn]
    declare(vars)
    expect(findMissingTokens(CAMPAIGNS_TOKEN_MAP)).toEqual(['warn'])
  })

  it('treats a role missing from the map as missing', () => {
    declare(Object.fromEntries(Object.values(CAMPAIGNS_TOKEN_MAP).map((v) => [v, '#fff'])))
    const { ok: _ok, ...partial } = CAMPAIGNS_TOKEN_MAP
    expect(findMissingTokens(partial)).toEqual(['ok'])
  })
})

describe('the shipped maps cover the contract', () => {
  it.each([
    ['CMS', CMS_TOKEN_MAP],
    ['AM Campaigns', CAMPAIGNS_TOKEN_MAP],
  ])('%s maps every tier-1 role exactly once', (_name, map) => {
    expect(Object.keys(map).sort()).toEqual([...TIER1_COLOR_TOKENS].sort())
    // A duplicated variable would mean two roles silently share a value.
    const vars = Object.values(map)
    expect(new Set(vars).size).toBe(vars.length)
  })
})
