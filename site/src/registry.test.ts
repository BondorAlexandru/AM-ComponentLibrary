/**
 * The teeth behind CLAUDE.md §C.12.
 *
 * A rule saying "document new additions" is a comment until something fails when
 * you don't. This asserts the docs site covers every runtime export of the
 * library, and that each entry actually shows states rather than just describing
 * the component in prose.
 */

import { describe, expect, it } from 'vitest'
import * as lib from '@am/ui'
import { ENTRIES, GROUP_ORDER } from './registry.ts'

/** Type-only exports are erased at runtime, so this is exactly the set that needs a specimen. */
const RUNTIME_EXPORTS = Object.keys(lib).sort()

const COVERED = new Set(ENTRIES.flatMap((e) => e.covers))

describe('docs coverage', () => {
  it('documents every runtime export of @am/ui', () => {
    const undocumented = RUNTIME_EXPORTS.filter((name) => !COVERED.has(name))
    expect(
      undocumented,
      `Add these to a DocEntry's \`covers\` and show their states on the site (CLAUDE.md §C.12):\n  ${undocumented.join('\n  ')}`,
    ).toEqual([])
  })

  it('does not claim to cover exports that no longer exist', () => {
    const stale = [...COVERED].filter((name) => !RUNTIME_EXPORTS.includes(name))
    expect(stale, `These are documented but not exported — renamed or removed?`).toEqual([])
  })

  it('covers each export exactly once, so there is one place to look', () => {
    const seen = new Map<string, string[]>()
    for (const entry of ENTRIES) {
      for (const name of entry.covers) {
        seen.set(name, [...(seen.get(name) ?? []), entry.id])
      }
    }
    const duplicated = [...seen.entries()].filter(([, ids]) => ids.length > 1)
    expect(duplicated.map(([name, ids]) => `${name}: ${ids.join(', ')}`)).toEqual([])
  })
})

describe('entry shape', () => {
  it.each(ENTRIES.map((e) => [e.id, e] as const))('%s is a usable doc page', (_id, entry) => {
    expect(entry.name, 'needs a name').toBeTruthy()
    expect(entry.summary.length, 'summary should say what it is and what it is for').toBeGreaterThan(40)
    expect(GROUP_ORDER).toContain(entry.group as (typeof GROUP_ORDER)[number])

    // The whole point of the site: you can see the states.
    expect(entry.states.length, 'needs at least one state group').toBeGreaterThan(0)
    for (const group of entry.states) {
      expect(group.title, `${entry.id}: state group needs a title`).toBeTruthy()
      expect(group.items.length, `${entry.id}/${group.title}: needs at least one specimen`).toBeGreaterThan(0)
      for (const item of group.items) {
        expect(item.label, `${entry.id}/${group.title}: every specimen needs a label`).toBeTruthy()
        expect(item.node, `${entry.id}/${group.title}/${item.label}: needs something to render`).toBeDefined()
      }
    }
  })

  it.each(ENTRIES.map((e) => [e.id, e] as const))('%s has unique specimen labels per group', (_id, entry) => {
    for (const group of entry.states) {
      const labels = group.items.map((i) => i.label)
      expect(new Set(labels).size, `${entry.id}/${group.title}: duplicate labels`).toBe(labels.length)
    }
  })

  it('has unique ids', () => {
    const ids = ENTRIES.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('documents props for every component that takes them', () => {
    // Utilities and token constants legitimately have no props table.
    const propless = ENTRIES.filter((e) => !e.props?.length).map((e) => e.id)
    expect(propless.sort()).toEqual(['tokens'])
  })
})
