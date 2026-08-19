'use client'

import * as React from 'react'
import type { ClassValue } from './lib/cn.js'

/**
 * App-level configuration for the whole library.
 *
 * Three layers of customisation, weakest to strongest:
 *
 *   1. **Tokens** — CSS custom properties. Colour roles (`--sb-accent` and
 *      friends, mapped in your `@theme`) and the geometry scale
 *      (`--am-radius-control`, `--am-h-control-md`, …). Change the shape and
 *      palette of everything from your stylesheet, touching no component.
 *   2. **Theme** — this object. Per-component default props and extra classes,
 *      applied to every instance. The equivalent of MUI's `defaultProps` +
 *      `styleOverrides`.
 *   3. **Call site** — props and `className`. Always wins, because `cn` runs
 *      `tailwind-merge` and the caller's classes go last.
 *
 * Anything those three cannot express is a gap in the library, not a reason to
 * fork — the variant functions (`buttonVariants` and friends) are exported so
 * you can compose your own component on top of ours.
 */

export interface ComponentConfig<P> {
  /** Applied when the call site leaves the prop undefined. */
  defaultProps?: Partial<P>
  /**
   * Merged into every instance, after the variant classes and before the call
   * site's `className` — so the call site can still override it.
   */
  className?: ClassValue
}

/**
 * Type-only imports: erased at build time, so there is no runtime cycle even
 * though each primitive imports `useComponentTheme` from here.
 */
import type { ButtonProps, IconButtonProps } from './primitives/Button.js'

export interface AmUiTheme {
  components?: {
    Button?: ComponentConfig<ButtonProps>
    IconButton?: ComponentConfig<IconButtonProps>
    Badge?: ComponentConfig<Record<string, unknown>>
    Pill?: ComponentConfig<Record<string, unknown>>
    Card?: ComponentConfig<Record<string, unknown>>
    EmptyState?: ComponentConfig<Record<string, unknown>>
    Stat?: ComponentConfig<Record<string, unknown>>
    ProgressBar?: ComponentConfig<Record<string, unknown>>
    Tabs?: ComponentConfig<Record<string, unknown>>
    SegmentedControl?: ComponentConfig<Record<string, unknown>>
    Stepper?: ComponentConfig<Record<string, unknown>>
    Menu?: ComponentConfig<Record<string, unknown>>
    Dropdown?: ComponentConfig<Record<string, unknown>>
    Modal?: ComponentConfig<Record<string, unknown>>
    Drawer?: ComponentConfig<Record<string, unknown>>
    Popover?: ComponentConfig<Record<string, unknown>>
  }
}

export type ComponentName = keyof NonNullable<AmUiTheme['components']>

export interface SpinnerProps {
  size?: number
  className?: string
}

export interface AmUiContextValue {
  Spinner: React.ComponentType<SpinnerProps>
  theme: AmUiTheme
}

/**
 * Token-driven fallback ring. Uses `currentColor` so it inherits whatever
 * `text-*` context it sits in, matching the contract an app spinner should honour.
 */
export function DefaultSpinner({ size = 18, className = '' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent align-[-0.125em] ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

const EMPTY_THEME: AmUiTheme = {}

const AmUiContext = React.createContext<AmUiContextValue>({
  Spinner: DefaultSpinner,
  theme: EMPTY_THEME,
})

export function AmUiProvider({
  children,
  spinner,
  theme,
}: {
  children: React.ReactNode
  /** Brand loading indicator. Omit to use the token-driven ring. */
  spinner?: React.ComponentType<SpinnerProps>
  /** Per-component defaults and class overrides. */
  theme?: AmUiTheme
}) {
  const value = React.useMemo<AmUiContextValue>(
    () => ({ Spinner: spinner ?? DefaultSpinner, theme: theme ?? EMPTY_THEME }),
    [spinner, theme],
  )
  return <AmUiContext.Provider value={value}>{children}</AmUiContext.Provider>
}

export function useAmUi(): AmUiContextValue {
  return React.useContext(AmUiContext)
}

/** The active app spinner. Renders the fallback ring when no provider is mounted. */
export function Spinner(props: SpinnerProps) {
  const { Spinner: Impl } = useAmUi()
  return <Impl {...props} />
}

/**
 * Merge the theme's `defaultProps` under the call site's props.
 *
 * A prop explicitly set to `undefined` must not clobber the theme default —
 * `<Button variant={maybeVariant} />` with nothing to pass should still get the
 * theme's choice — so undefined values are stripped before merging.
 */
export function useComponentTheme<P extends object>(
  name: ComponentName,
  props: P,
): { props: P; className: ClassValue } {
  const { theme } = useAmUi()
  const config = theme.components?.[name] as ComponentConfig<P> | undefined

  return React.useMemo(() => {
    if (!config) return { props, className: undefined }
    const defined: Record<string, unknown> = {}
    for (const key in props) {
      if (props[key] !== undefined) defined[key] = props[key]
    }
    return {
      props: { ...(config.defaultProps as object), ...defined } as P,
      className: config.className,
    }
  }, [config, props])
}
