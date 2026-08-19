/**
 * The token contract.
 *
 * Shared primitives never name a colour — they name a *role* (`bg-surface`,
 * `text-ink-2`, `border-hairline`). Each app maps those roles to its own
 * values in its own `@theme inline` block, which is why the CMS can be
 * dark-first and AM Campaigns light-only from one component.
 *
 * The contract is therefore the set of Tailwind utility *names* below, not any
 * particular hex. Tier 1 is required by every consumer. Tier 2 is required only
 * by the primitives listed against it.
 *
 * A consumer proves it satisfies the contract with `findMissingTokens()` in a
 * browser test — a missing token is otherwise invisible until someone opens the
 * one screen that uses it.
 */

/** Colour roles. Consumed as `bg-<name>` / `text-<name>` / `border-<name>`. */
export const TIER1_COLOR_TOKENS = [
  'canvas',
  'surface',
  'surface-2',
  'ink',
  'ink-2',
  'ink-3',
  'accent',
  'accent-text',
  'accent-soft',
  'on-accent',
  'ok',
  'on-ok',
  'warn',
  'danger-accent',
  'on-danger',
  'line',
  'hairline',
  'input',
] as const

/**
 * Tier 2 — only needed by the primitives named here.
 * `Pill` → radius-pill · `Modal`/`Popover` → radius-card, shadow-overlay,
 * shadow-raised, animate-* · `Form.Label` → font-display.
 */
export const TIER2_TOKENS = [
  '--radius-pill',
  '--radius-card',
  '--shadow-overlay',
  '--shadow-raised',
  '--font-display',
] as const

/** Keyframe animation utilities required by `Modal`, `Drawer` and `Popover`. */
export const TIER2_ANIMATIONS = ['animate-fade-in', 'animate-slide-in', 'animate-pop-in'] as const

export type Tier1ColorToken = (typeof TIER1_COLOR_TOKENS)[number]

/**
 * Returns the tier-1 colour roles the current document does *not* resolve.
 * Call from a jsdom/browser test after the app's stylesheet is loaded.
 *
 * Tailwind v4 registers each `@theme` colour as a `--color-<name>` custom
 * property on `:root`, so a resolved value is proof the app mapped the role.
 */
export function findMissingTokens(
  root: Element | null = typeof document === 'undefined' ? null : document.documentElement,
): Tier1ColorToken[] {
  if (!root) return [...TIER1_COLOR_TOKENS]
  const style = getComputedStyle(root)
  return TIER1_COLOR_TOKENS.filter((name) => style.getPropertyValue(`--color-${name}`).trim() === '')
}
