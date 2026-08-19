/**
 * Two ways to switch between sibling views, and they are not interchangeable.
 *
 * `Tabs` is the underline row the CMS uses for page-level sections — it had
 * been written out by hand in four places (`app/page.tsx`,
 * `ProjectDashboardClient`, `ChatbotAdminClient`, `ComponentWorkbench`) with
 * small drifts between them. The a11y-complete version won.
 *
 * `SegmentedControl` is the pill group AM Campaigns uses inside a panel, where
 * an underline would compete with the panel's own borders.
 *
 * Rule of thumb: underline for navigating a page, pills for filtering a panel.
 */

'use client'

import type { ReactNode } from 'react'
import { cn } from '../lib/cn.js'

export interface TabItem<T extends string = string> {
  id: T
  label: ReactNode
  icon?: ReactNode
  disabled?: boolean
  /** A count or dot rendered after the label. */
  badge?: ReactNode
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  'aria-label': ariaLabel,
  className,
  size = 'md',
}: {
  items: TabItem<T>[]
  value: T
  onChange: (id: T) => void
  'aria-label'?: string
  className?: string
  size?: 'sm' | 'md'
}) {
  return (
    <div className={cn('border-hairline border-b', className)}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="-mb-px flex min-w-0 items-center gap-4 overflow-x-auto [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={value === t.id}
            disabled={t.disabled}
            onClick={() => onChange(t.id)}
            className={cn(
              // `before` widens the hit area past the visible text without
              // adding padding that would break the underline alignment.
              "focus-visible:ring-accent focus-visible:ring-offset-canvas relative inline-flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none before:absolute before:inset-y-0 before:-inset-x-2 before:content-[''] disabled:cursor-not-allowed disabled:opacity-40",
              size === 'sm' ? 'py-2 text-[13px] font-medium' : 'py-3 text-sm font-medium',
              value === t.id ? 'border-accent text-accent-text' : 'text-ink-3 hover:text-ink border-transparent',
            )}
          >
            {t.icon}
            {t.label}
            {t.badge}
          </button>
        ))}
      </div>
    </div>
  )
}

export function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  'aria-label': ariaLabel,
  className,
  size = 'md',
}: {
  items: TabItem<T>[]
  value: T
  onChange: (id: T) => void
  'aria-label'?: string
  className?: string
  size?: 'sm' | 'md'
}) {
  return (
    <nav
      role="tablist"
      aria-label={ariaLabel}
      className={cn('flex min-w-0 flex-wrap items-center gap-1', className)}
    >
      {items.map((t) => (
        <button
          key={t.id}
          role="tab"
          type="button"
          aria-selected={value === t.id}
          disabled={t.disabled}
          onClick={() => onChange(t.id)}
          className={cn(
            'rounded-pill inline-flex items-center gap-1.5 font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-40',
            size === 'sm' ? 'px-2.5 py-1 text-[12px]' : 'px-3 py-1.5 text-[12.5px]',
            value === t.id ? 'bg-ink text-canvas' : 'text-ink-2 hover:bg-input hover:text-ink',
          )}
        >
          {t.icon}
          {t.label}
          {t.badge}
        </button>
      ))}
    </nav>
  )
}
