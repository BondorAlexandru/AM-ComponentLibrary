/**
 * Card Component — Liquid Glass design system
 */

'use client'

import type { ReactNode } from 'react'
import { cn } from '../lib/cn.js'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  border?: boolean
  hover?: boolean
  onClick?: () => void
}

export function Card({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  border = true,
  hover = false,
  onClick,
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
  }

  const shadowClasses = {
    none: '',
    sm: 'shadow-[0_1px_3px_rgba(0,0,0,0.12)]',
    md: 'shadow-[0_2px_10px_rgba(0,0,0,0.16)]',
    lg: 'shadow-[0_18px_50px_rgba(0,0,0,0.28)]',
  }

  const borderClass = border ? 'border border-hairline' : ''
  const hoverClass = hover
    ? 'hover:border-line transition-colors cursor-pointer'
    : ''
  const clickableClass = onClick ? 'cursor-pointer' : ''

  return (
    <div
      className={cn(`
        bg-surface rounded-[var(--am-radius-card,var(--radius-card,12px))]
        ${paddingClasses[padding]}
        ${shadowClasses[shadow]}
        ${borderClass}
        ${hoverClass}
        ${clickableClass}`, className)}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// Card Header
interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}

export function CardHeader({ title, subtitle, action, className = '' }: CardHeaderProps) {
  return (
    <div className={cn(`flex items-start justify-between mb-4`, className)}>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold tracking-tight text-ink truncate">{title}</h3>
        {subtitle && (
          <p className="text-sm text-ink-2 mt-1 truncate">{subtitle}</p>
        )}
      </div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
  )
}

// Card Footer
interface CardFooterProps {
  children: ReactNode
  className?: string
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div
      className={cn(`
        flex items-center justify-between
        pt-4 mt-4 border-t border-hairline`, className)}
    >
      {children}
    </div>
  )
}

// Card Section (for dividing card content)
interface CardSectionProps {
  children: ReactNode
  title?: string
  className?: string
}

export function CardSection({ children, title, className = '' }: CardSectionProps) {
  return (
    <div className={cn(`py-4`, className)}>
      {title && (
        <h4 className="text-sm font-medium text-ink-2 mb-2">{title}</h4>
      )}
      {children}
    </div>
  )
}

// Export as namespace
Card.Header = CardHeader
Card.Footer = CardFooter
Card.Section = CardSection
