import type { ReactNode } from 'react'

export interface PropDoc {
  name: string
  type: string
  default?: string
  required?: boolean
  /** What it does and when you'd reach for it — not a restatement of the type. */
  note: string
}

export interface StateItem {
  label: string
  /** Why this state exists / what to look at. Shown under the label. */
  note?: string
  node: ReactNode
  /** Render on a checkerboard, so "transparent" is visibly not "canvas-coloured". */
  checker?: boolean
  /**
   * This specimen is docs UI (a data table, a readout), not a themed component.
   * Render it on the docs background instead of the theme's canvas — otherwise
   * its fixed chrome colours become unreadable when the canvas flips to white.
   */
  raw?: boolean
  /** Take the full row rather than a grid cell. */
  wide?: boolean
}

export interface StateGroup {
  title: string
  note?: string
  cols?: 1 | 2 | 3 | 4
  items: StateItem[]
}

export interface DocEntry {
  id: string
  name: string
  group: string
  /** One or two sentences: what it is and what it's for. */
  summary: string
  /** Where the implementation came from — see CLAUDE.md §C.1. */
  origin: 'cms' | 'campaigns' | 'library'
  /** CMS-canonical: class strings pinned by frozen-classes.test.tsx. */
  frozen?: boolean
  /** Barrel exports this entry documents. Drives the coverage test. */
  covers: string[]
  /** Copy-pasteable import line. */
  imports?: string
  props?: { title?: string; rows: PropDoc[] }[]
  states: StateGroup[]
  /** Tier-2 tokens required, e.g. '--radius-pill'. */
  requires?: string[]
  /** Anything a reader would otherwise have to find out the hard way. */
  notes?: string[]
}
