/**
 * Button — AM design system.
 *
 * Four ways to change how this looks, in increasing order of specificity:
 *
 *   1. **Tokens.** `--am-h-control-md`, `--am-radius-control`, `--am-text-base`,
 *      and the colour roles. Restyle every button in the app from your CSS.
 *   2. **Theme.** `<AmUiProvider theme={{ components: { Button: {
 *      defaultProps: { variant: 'secondary' }, className: 'rounded-full' } } }}>`
 *   3. **`className`.** Wins over both — `cn` runs tailwind-merge, so
 *      `className="h-12"` really does replace the height rather than sitting
 *      next to it and hoping.
 *   4. **`buttonVariants`.** Exported, so you can build your own component on
 *      the same classes rather than forking this one.
 *
 * `asChild` renders the child element instead of a `<button>`, for the case
 * where you need a link that looks like a button.
 */

'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn.js'
import { Slot } from '../lib/Slot.js'
import { Spinner, useComponentTheme } from '../theme.js'
import { H, R, T } from '../tokens/geometry.js'

/**
 * `primary | secondary | tertiary | danger | success | ghost` are the CMS
 * variants; their treatments are frozen (§C.1). `quiet` and `dark` were added
 * for AM Campaigns — `quiet` is not new design, it is exactly the treatment
 * `IconButton`'s ghost already used, now available on a text button.
 */
export const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-2 font-medium cursor-pointer',
    R.control,
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-1 focus-visible:ring-offset-canvas',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ),
  {
    variants: {
      variant: {
        primary: 'bg-accent text-on-accent hover:opacity-90 active:opacity-95',
        secondary: 'border border-line text-ink hover:bg-input',
        tertiary: 'bg-accent-soft text-accent-text hover:opacity-80',
        danger: 'bg-danger-accent text-on-danger hover:opacity-90 active:opacity-95',
        success: 'bg-ok text-on-ok hover:opacity-90 active:opacity-95',
        ghost: 'bg-input border border-hairline text-ink-2 hover:text-ink',
        quiet: 'bg-transparent text-ink-2 hover:bg-input hover:text-ink',
        dark: 'bg-ink text-canvas hover:opacity-90 active:opacity-95',
      },
      size: {
        // Explicit heights so buttons line up exactly in bar rows
        // (md = the shared 34px bar-control height).
        sm: cn(H.controlSm, 'px-3', T.controlSm),
        md: cn(H.controlMd, 'px-4', T.controlMd),
        lg: cn(H.controlLg, 'px-5', T.controlLg),
      },
      fullWidth: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'primary', size: 'md', fullWidth: false },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    ButtonVariants {
  children?: React.ReactNode
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  /** Render the child element instead of a `<button>` — a link, a router Link. */
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(inProps, ref) {
  const { props, className: themeClassName } = useComponentTheme('Button', inProps)
  const {
    children,
    variant,
    size,
    fullWidth,
    loading = false,
    leftIcon,
    rightIcon,
    disabled,
    className,
    asChild = false,
    ...rest
  } = props

  const classes = cn(buttonVariants({ variant, size, fullWidth }), themeClassName, className)

  const content = (
    <>
      {loading && <Spinner size={16} />}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </>
  )

  // asChild hands the classes to the child; a disabled/loading state has no
  // meaning on an arbitrary element, so the caller owns that.
  if (asChild) {
    return (
      <Slot className={classes} {...(rest as React.HTMLAttributes<HTMLElement>)}>
        {children}
      </Slot>
    )
  }

  return (
    <button ref={ref} disabled={disabled || loading} className={classes} {...rest}>
      {content}
    </button>
  )
})

export const iconButtonVariants = cva(
  cn(
    'relative inline-flex items-center justify-center shrink-0',
    R.control,
    'transition-colors duration-150 cursor-pointer',
    // Widens the hit area past the visible box without changing the layout box.
    "before:absolute before:content-[''] before:-inset-1.5",
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-1 focus-visible:ring-offset-canvas',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ),
  {
    variants: {
      variant: {
        primary: 'bg-accent text-on-accent hover:opacity-90',
        secondary: 'border border-line text-ink hover:bg-input',
        tertiary: 'bg-accent-soft text-accent-text hover:opacity-80',
        danger: 'bg-transparent text-danger-accent hover:bg-danger-accent/10',
        ghost: 'bg-transparent text-ink-2 hover:bg-input hover:text-ink',
      },
      size: {
        sm: cn(H.iconSm, 'text-sm'),
        md: cn(H.iconMd, 'text-base'),
        lg: cn(H.iconLg, 'text-lg'),
      },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
  },
)

export type IconButtonVariants = VariantProps<typeof iconButtonVariants>

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'color'>,
    IconButtonVariants {
  icon: React.ReactNode
  /** Required — an icon-only control with no accessible name is unusable. */
  'aria-label': string
  asChild?: boolean
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  inProps,
  ref,
) {
  const { props, className: themeClassName } = useComponentTheme('IconButton', inProps)
  const { icon, variant, size, className, asChild = false, ...rest } = props
  const classes = cn(iconButtonVariants({ variant, size }), themeClassName, className)

  if (asChild) {
    return (
      <Slot className={classes} {...(rest as React.HTMLAttributes<HTMLElement>)}>
        {icon}
      </Slot>
    )
  }

  return (
    <button ref={ref} className={classes} {...rest}>
      {icon}
    </button>
  )
})
