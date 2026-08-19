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
 * one screen that uses it. Read that function's doc comment before using it:
 * `@theme inline` means there is no `--color-*` property to read back, so the
 * app must pass its own role → variable map.
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
 * role → the CSS custom property the app maps it to.
 *
 * The app has to tell us this, and it is worth being clear about why. Both
 * consumers declare their palette with Tailwind v4's **`@theme inline`**, and
 * `inline` means exactly what it says: Tailwind substitutes the value into each
 * utility (`.bg-ok{background-color:var(--ok)}`) instead of emitting a
 * `--color-ok` custom property. So there is no `--color-*` to read back, and no
 * app-agnostic name to guess either — the CMS calls the `ok` role `--sb-ok` and
 * its `danger-accent` role `--sb-danger`.
 *
 * Probing a rendered element instead doesn't work: Tailwind is JIT, so
 * `bg-warn` has no rule at all unless some scanned file already used it, and a
 * missing rule is indistinguishable from a missing token.
 *
 * Passing the map explicitly is therefore the only honest version of this
 * check. It catches what actually goes wrong: someone deletes or renames a
 * variable in the app's CSS and every component using that role goes
 * transparent.
 */
export type TokenMap = Partial<Record<Tier1ColorToken, string>>

/** The CMS's mapping (`app/globals.css`). */
export const CMS_TOKEN_MAP: Required<TokenMap> = {
  canvas: '--sb-canvas',
  surface: '--sb-surface',
  'surface-2': '--sb-surface-2',
  ink: '--sb-ink',
  'ink-2': '--sb-ink-2',
  'ink-3': '--sb-ink-3',
  accent: '--sb-accent',
  'accent-text': '--sb-accent-text',
  'accent-soft': '--sb-accent-soft',
  'on-accent': '--sb-on-accent',
  ok: '--sb-ok',
  'on-ok': '--sb-on-ok',
  warn: '--sb-warn',
  'danger-accent': '--sb-danger',
  'on-danger': '--sb-on-danger',
  line: '--sb-line',
  hairline: '--sb-hairline',
  input: '--sb-input',
}

/** AM Campaigns' mapping (`src/index.css`). */
export const CAMPAIGNS_TOKEN_MAP: Required<TokenMap> = {
  canvas: '--canvas',
  surface: '--surface',
  'surface-2': '--surface-2',
  ink: '--ink',
  'ink-2': '--ink-2',
  'ink-3': '--ink-3',
  accent: '--accent',
  'accent-text': '--accent-text',
  'accent-soft': '--accent-soft',
  'on-accent': '--on-accent',
  ok: '--ok',
  'on-ok': '--on-ok',
  warn: '--warn',
  'danger-accent': '--danger',
  'on-danger': '--on-danger',
  line: '--line',
  hairline: '--hairline',
  input: '--input',
}

/**
 * Returns the tier-1 colour roles the app does not satisfy — either absent from
 * `map`, or mapped to a custom property that resolves to nothing.
 *
 * Call it where the app's real stylesheet is loaded: an e2e/browser test, not
 * jsdom (jsdom does not evaluate an external stylesheet, so every role would
 * read as missing).
 *
 * ```ts
 * expect(findMissingTokens(CAMPAIGNS_TOKEN_MAP)).toEqual([])
 * ```
 */
export function findMissingTokens(
  map: TokenMap,
  root: Element | null = typeof document === 'undefined' ? null : document.documentElement,
): Tier1ColorToken[] {
  if (!root) return [...TIER1_COLOR_TOKENS]
  const style = getComputedStyle(root)
  return TIER1_COLOR_TOKENS.filter((role) => {
    const cssVar = map[role]
    if (!cssVar) return true
    return style.getPropertyValue(cssVar).trim() === ''
  })
}
