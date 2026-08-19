/**
 * Badge / Tag / Status — SpaceBlock design system (Chip, Figma 92:33).
 * Token-driven so they follow the active theme.
 */

'use client'

import type { ReactNode } from 'react'

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'neutral'

const chipVariant: Record<BadgeVariant, string> = {
  primary: 'bg-accent-soft text-accent-text border border-transparent',
  secondary: 'bg-input text-ink-2 border border-line',
  success: 'bg-transparent text-ok border border-ok',
  danger: 'bg-transparent text-danger-accent border border-danger-accent',
  warning: 'bg-transparent text-warn border border-warn',
  neutral: 'bg-input text-ink-2 border border-line',
}

const dotColors: Record<BadgeVariant, string> = {
  primary: 'bg-accent',
  secondary: 'bg-ink-3',
  success: 'bg-ok',
  danger: 'bg-danger-accent',
  warning: 'bg-warn',
  neutral: 'bg-ink-3',
}

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  className?: string
}

export function Badge({ children, variant = 'neutral', size = 'md', dot = false, className = '' }: BadgeProps) {
  const sizeClasses = {
    sm: 'text-[12px] px-2 py-[2px]',
    md: 'text-[12px] px-[10px] py-[4px]',
    lg: 'text-[12px] px-3 py-[6px]',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[6px] font-normal whitespace-nowrap ${chipVariant[variant]} ${sizeClasses[size]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  )
}

interface TagProps {
  children: ReactNode
  variant?: BadgeVariant
  onRemove?: () => void
  className?: string
}

export function Tag({ children, variant = 'neutral', onRemove, className = '' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[6px] px-[10px] py-[4px] text-[12px] font-normal ${chipVariant[variant]} ${className}`}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="-mr-1 ml-0.5 rounded-full p-0.5 opacity-70 transition-opacity hover:opacity-100"
          aria-label="Remove tag"
        >
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}

interface StatusProps {
  children: ReactNode
  variant?: 'success' | 'danger' | 'warning' | 'neutral' | 'active'
  size?: 'sm' | 'md'
  className?: string
}

export function Status({ children, variant = 'neutral', size = 'md', className = '' }: StatusProps) {
  const dot = {
    success: 'bg-ok',
    danger: 'bg-danger-accent',
    warning: 'bg-warn',
    neutral: 'bg-ink-3',
    active: 'bg-accent',
  }
  const dotSizes = { sm: 'h-2 w-2', md: 'h-2.5 w-2.5' }
  const textSizes = { sm: 'text-xs', md: 'text-sm' }
  return (
    <span className={`inline-flex items-center gap-2 text-ink-2 ${textSizes[size]} ${className}`}>
      <span className={`${dotSizes[size]} rounded-full ${dot[variant]}`} />
      {children}
    </span>
  )
}
