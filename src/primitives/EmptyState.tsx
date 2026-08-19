/**
 * EmptyState — extracted verbatim from the CMS implementation.
 *
 * `chrome` is the one addition: the CMS always draws the surface card
 * (border + radius), which is right for a full-page empty list. AM Campaigns
 * renders empty states *inside* already-carded panels, where a second border
 * reads as a bug. `chrome` defaults to `true`, so the CMS is unchanged.
 */

'use client'

import type { ReactNode } from 'react'
import { cn } from '../lib/cn.js'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  /** Draw the surface card around the state. `false` for nesting inside a panel. */
  chrome?: boolean
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = '',
  size = 'md',
  chrome = true,
}: EmptyStateProps) {
  const sizeClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
  }

  const iconSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  }

  const chromeClasses = chrome ? 'bg-surface rounded-[var(--am-radius-card,var(--radius-card,12px))] border border-hairline' : ''

  return (
    <div
      className={cn(`
        flex flex-col items-center justify-center
        text-center ${sizeClasses[size]}
        ${chromeClasses}`, className)}
    >
      {icon && (
        <div
          className={`
            ${iconSizes[size]}
            mb-4 text-ink-3
          `}
        >
          {icon}
        </div>
      )}

      <h3 className="text-lg font-semibold tracking-tight text-ink mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-ink-2 mb-4 max-w-md">{description}</p>
      )}

      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

// Default empty state icons
export function EmptyDocumentsIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 156 156"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M78 156c43.078 0 78-34.922 78-78S121.078 0 78 0 0 34.922 0 78s34.922 78 78 78z"
        fill="currentColor"
        opacity="0.1"
      />
      <path
        d="M97.5 54.75h-39a3 3 0 00-3 3v40.5a3 3 0 003 3h39a3 3 0 003-3v-40.5a3 3 0 00-3-3zm-36 6h33v13.5h-33v-13.5zm0 19.5h33v13.5h-33v-13.5z"
        fill="currentColor"
      />
    </svg>
  )
}

export function EmptySearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 156 156"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M78 156c43.078 0 78-34.922 78-78S121.078 0 78 0 0 34.922 0 78s34.922 78 78 78z"
        fill="currentColor"
        opacity="0.1"
      />
      <path
        d="M94.5 72a22.5 22.5 0 11-45 0 22.5 22.5 0 0145 0z"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M88.5 88.5L101 101"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function EmptyImageIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 156 156"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M78 156c43.078 0 78-34.922 78-78S121.078 0 78 0 0 34.922 0 78s34.922 78 78 78z"
        fill="currentColor"
        opacity="0.1"
      />
      <path
        d="M49.5 54.75a3 3 0 00-3 3v40.5a3 3 0 003 3h57a3 3 0 003-3v-40.5a3 3 0 00-3-3h-57zm3 6h51v27l-10.5-10.5a3 3 0 00-4.243 0L69 96.75l-7.5-7.5a3 3 0 00-4.243 0L52.5 93.75v-33z"
        fill="currentColor"
      />
      <circle cx="69" cy="69" r="4.5" fill="currentColor" />
    </svg>
  )
}
