import { TIER1_COLOR_TOKENS, type Tier1ColorToken } from '@am/ui'

/**
 * The three themes a shared component actually has to survive.
 *
 * These values are a **mirror** of the two apps' stylesheets, not a new
 * palette — the whole point of previewing here is to see what the CMS and AM
 * Campaigns will really render. Sources:
 *
 *   cms-dark    ../CMS/app/globals.css        `:root[data-theme="dark"]`
 *   cms-light   ../CMS/app/globals.css        `:root, :root[data-theme="light"]`
 *   campaigns   ../Influencer/src/index.css   `:root`
 *
 * `npm run check:themes` diffs them against those files when the sibling repos
 * are checked out, so drift fails loudly instead of quietly making the docs lie.
 *
 * Applied by writing `--am-*` custom properties onto <html>, which is also how
 * portalled components (Modal, Drawer, Menu, Dropdown) inherit the theme — they
 * render into document.body, so a themed wrapper element would not reach them.
 */

export type ThemeId = 'cms-dark' | 'cms-light' | 'campaigns'

export interface Theme {
  id: ThemeId
  label: string
  app: string
  /** What this theme is for, in one line. */
  note: string
  scheme: 'dark' | 'light'
  roles: Record<Tier1ColorToken, string>
  /** Tier-2 tokens, plus whether the real app declares them today. */
  tier2: Record<string, { value: string; declared: boolean }>
}

/** Tier-2 values the CMS does not declare — the site supplies them so the
 *  Campaigns-origin primitives (Pill, Modal, Drawer, Popover) can be previewed
 *  in the CMS palettes at all. Marked `declared: false` so the Tokens page can
 *  say so out loud rather than implying the CMS is ready for them. */
const CMS_TIER2 = (scheme: 'dark' | 'light'): Theme['tier2'] => ({
  '--radius-pill': { value: '999px', declared: false },
  '--radius-card': { value: '12px', declared: false },
  '--shadow-overlay': {
    value: scheme === 'dark' ? '0 24px 60px -15px rgba(0, 0, 0, 0.5)' : '0 24px 60px rgba(10, 10, 15, 0.22)',
    declared: false,
  },
  '--shadow-raised': { value: '0 8px 12px rgba(0, 0, 0, 0.25)', declared: false },
  '--font-display': { value: 'ui-sans-serif, system-ui, sans-serif', declared: true },
})

export const THEMES: Theme[] = [
  {
    id: 'cms-dark',
    label: 'CMS · dark',
    app: 'SpaceBlock CMS',
    note: 'The CMS’s opt-in dark theme. If a component only works on light, it breaks here first.',
    scheme: 'dark',
    roles: {
      canvas: '#080a14',
      surface: '#0c0e1a',
      'surface-2': '#121524',
      ink: '#f4f5f7',
      'ink-2': 'rgba(244, 245, 247, 0.62)',
      'ink-3': 'rgba(244, 245, 247, 0.5)',
      accent: '#e50f76',
      'accent-text': '#ff7ab8',
      'accent-soft': 'rgba(240, 23, 126, 0.14)',
      'on-accent': '#ffffff',
      ok: '#3ddc97',
      'on-ok': '#04160d',
      warn: '#fdbe4a',
      'danger-accent': '#ff6b85',
      'on-danger': '#2b070e',
      line: 'rgba(244, 245, 247, 0.16)',
      hairline: 'rgba(244, 245, 247, 0.08)',
      input: 'rgba(255, 255, 255, 0.03)',
    },
    tier2: CMS_TIER2('dark'),
  },
  {
    id: 'cms-light',
    label: 'CMS · light',
    app: 'SpaceBlock CMS',
    note: 'The CMS default since the light-default change. Note how the on-* roles flip: on-ok is white here, near-black in dark.',
    scheme: 'light',
    roles: {
      canvas: '#f6f6f9',
      surface: '#ffffff',
      'surface-2': '#efeff5',
      ink: '#0b0d18',
      'ink-2': 'rgba(11, 13, 24, 0.74)',
      'ink-3': 'rgba(11, 13, 24, 0.64)',
      accent: '#d9086b',
      'accent-text': '#b8045a',
      'accent-soft': 'rgba(217, 8, 107, 0.1)',
      'on-accent': '#ffffff',
      ok: '#0e8655',
      'on-ok': '#ffffff',
      warn: '#9a6708',
      'danger-accent': '#cf3527',
      'on-danger': '#ffffff',
      line: 'rgba(11, 13, 24, 0.2)',
      hairline: 'rgba(11, 13, 24, 0.1)',
      input: 'rgba(11, 13, 24, 0.03)',
    },
    tier2: CMS_TIER2('light'),
  },
  {
    id: 'campaigns',
    label: 'Campaigns',
    app: 'AM Campaigns',
    note: 'Light only. Slightly softer lines and ink than the CMS light theme — the two are close, not identical.',
    scheme: 'light',
    roles: {
      canvas: '#f6f6f9',
      surface: '#ffffff',
      'surface-2': '#efeff5',
      ink: '#0b0d18',
      'ink-2': 'rgba(11, 13, 24, 0.72)',
      'ink-3': 'rgba(11, 13, 24, 0.56)',
      accent: '#d9086b',
      'accent-text': '#b8045a',
      'accent-soft': 'rgba(217, 8, 107, 0.1)',
      'on-accent': '#ffffff',
      ok: '#0e8655',
      'on-ok': '#ffffff',
      warn: '#9a6708',
      'danger-accent': '#cf3527',
      'on-danger': '#ffffff',
      line: 'rgba(11, 13, 24, 0.16)',
      hairline: 'rgba(11, 13, 24, 0.09)',
      input: 'rgba(11, 13, 24, 0.03)',
    },
    tier2: {
      '--radius-pill': { value: '999px', declared: true },
      '--radius-card': { value: '12px', declared: true },
      '--shadow-overlay': { value: '0 24px 60px rgba(10, 10, 15, 0.22)', declared: true },
      '--shadow-raised': {
        value: '0 2px 8px rgba(10, 10, 15, 0.07), 0 8px 24px rgba(10, 10, 15, 0.06)',
        declared: true,
      },
      '--font-display': { value: "'DM Sans', ui-sans-serif, system-ui, sans-serif", declared: true },
    },
  },
]

/**
 * Dark first, deliberately — it is the harsher test. A component that assumes a
 * light canvas breaks here immediately, whereas the reverse often goes unnoticed.
 * This is the docs' starting view, not a claim about either app's default (the
 * CMS defaults to light and AM Campaigns is light-only).
 */
export const DEFAULT_THEME: ThemeId = 'cms-dark'

export function themeById(id: ThemeId): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}

/** Write a theme onto <html> so previews *and* portalled overlays pick it up. */
export function applyTheme(id: ThemeId) {
  const theme = themeById(id)
  const root = document.documentElement
  for (const role of TIER1_COLOR_TOKENS) root.style.setProperty(`--am-${role}`, theme.roles[role])
  for (const [name, { value }] of Object.entries(theme.tier2)) root.style.setProperty(name, value)
  root.dataset.amTheme = id
  root.style.colorScheme = theme.scheme
}
