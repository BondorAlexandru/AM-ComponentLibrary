/**
 * Pill — a fully caller-styled chip.
 *
 * Distinct from `Badge`, and deliberately so: `Badge` is variant-driven with a
 * fixed 6px radius and owns its colours, which is right for a small closed set
 * of statuses. `Pill` owns only shape, spacing and the optional dot, and takes
 * its colours from `className` — which is what a domain-coloured set (campaign
 * stages, platform tags) needs. Extracted from AM Campaigns.
 *
 * Requires the `--radius-pill` token (see docs/TOKENS.md, tier 2).
 */

import type { ReactNode } from 'react'
import { cn } from '../lib/cn.js'

export function Pill({
  children,
  className,
  dot,
  size = 'md',
}: {
  children: ReactNode
  className?: string
  /** Utility class for the leading dot's colour, e.g. `bg-ok`. */
  dot?: string
  size?: 'sm' | 'md'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border font-medium whitespace-nowrap',
        size === 'sm' ? 'px-2 py-[1px] text-[11px]' : 'px-2.5 py-[3px] text-[12px]',
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dot)} />}
      {children}
    </span>
  )
}
