/**
 * Button — AM design system (extracted verbatim from the CMS implementation,
 * which is the canonical source for this primitive).
 *
 * One filled accent primary, outline-first secondaries, quiet ghosts.
 * Semantic fills (danger/success) reserved for meaning.
 *
 * Every class here resolves through a semantic token (see docs/TOKENS.md) —
 * no raw hex, no app-specific colour name. That is what lets the CMS render
 * dark-first and AM Campaigns render light from the same component.
 */

'use client'

import * as React from 'react'
import { type ReactNode, forwardRef } from 'react'
import { Spinner } from '../provider.js'

/**
 * `primary | secondary | tertiary | danger | success | ghost` are the CMS
 * variants and their class strings are frozen — changing one changes the CMS.
 *
 * `quiet` and `dark` were added for AM Campaigns. `quiet` is not a new design:
 * it is the exact treatment `IconButton`'s ghost already uses, now available
 * on a text button. `dark` is an ink-filled button for use on tinted panels.
 */
type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'ghost' | 'quiet' | 'dark'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const baseClasses = `
  inline-flex items-center justify-center gap-2
  font-medium rounded-[8px] cursor-pointer
  transition-colors duration-150
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-1 focus-visible:ring-offset-canvas
  disabled:opacity-50 disabled:cursor-not-allowed
`

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:opacity-90 active:opacity-95',
  secondary: 'border border-line text-ink hover:bg-input',
  tertiary: 'bg-accent-soft text-accent-text hover:opacity-80',
  danger: 'bg-danger-accent text-on-danger hover:opacity-90 active:opacity-95',
  success: 'bg-ok text-on-ok hover:opacity-90 active:opacity-95',
  ghost: 'bg-input border border-hairline text-ink-2 hover:text-ink',
  quiet: 'bg-transparent text-ink-2 hover:bg-input hover:text-ink',
  dark: 'bg-ink text-canvas hover:opacity-90 active:opacity-95',
}

// Explicit heights so buttons line up exactly in bar rows (md = the 34px bar-control height).
const sizeClasses = {
  sm: 'h-[28px] px-3 text-[12.5px]',
  md: 'h-[34px] px-4 text-[13px]',
  lg: 'h-[40px] px-5 text-[14px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const widthClass = fullWidth ? 'w-full' : ''

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${widthClass}
          ${className}
        `}
        {...props}
      >
        {loading && <Spinner size={16} />}
        {!loading && leftIcon && leftIcon}
        {children}
        {!loading && rightIcon && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'

// Icon Button variant
interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: ReactNode
  'aria-label': string
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const iconBaseClasses = `
  relative inline-flex items-center justify-center shrink-0
  rounded-[8px] transition-colors duration-150 cursor-pointer
  before:absolute before:content-[''] before:-inset-1.5
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-1 focus-visible:ring-offset-canvas
  disabled:opacity-50 disabled:cursor-not-allowed
`

const iconVariantClasses = {
  primary: 'bg-accent text-on-accent hover:opacity-90',
  secondary: 'border border-line text-ink hover:bg-input',
  tertiary: 'bg-accent-soft text-accent-text hover:opacity-80',
  danger: 'bg-transparent text-danger-accent hover:bg-danger-accent/10',
  ghost: 'bg-transparent text-ink-2 hover:bg-input hover:text-ink',
}

// Explicit px — the CMS overrides --spacing-8/10/11, so h-8/h-10/h-11 mis-size.
const iconSizeClasses = {
  sm: 'h-[32px] w-[32px] text-sm',
  md: 'h-[40px] w-[40px] text-base',
  lg: 'h-[44px] w-[44px] text-lg',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, 'aria-label': ariaLabel, variant = 'ghost', size = 'md', className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        className={`
          ${iconBaseClasses}
          ${iconVariantClasses[variant]}
          ${iconSizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {icon}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'
