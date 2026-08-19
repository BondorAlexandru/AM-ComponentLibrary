/**
 * Data-display primitives — the "what is this number doing" family.
 *
 * `Delta`, `KpiCard`, `BarList`, `ScoreGauge`, `SectionCard` and `EmptyHint` are
 * extracted from the CMS's `components/dashboard/primitives.tsx`. `Stat` and the
 * two bars come from AM Campaigns, which had written the same tile four times
 * (`PerformancePanel`'s Metric, `CreatorDrawer`'s Stat, and two `Kpi`s) and the
 * same fill bar twice.
 */

'use client'

import type { ReactNode } from 'react'
import { Card } from './Card.js'
import { cn } from '../lib/cn.js'
import { formatNumber } from '../lib/format.js'
import { ArrowDownRight, ArrowUpRight, Minus } from '../icons/index.js'

/** A row in a `BarList` — the shape the CMS's analytics layer already returns. */
export interface CountRow {
  label: string
  count: number
}

export function Delta({ value }: { value: number }) {
  const up = value > 0
  const flat = value === 0
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight
  const color = flat ? "text-ink-3" : up ? "text-ok" : "text-danger-accent"
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {Math.abs(value)}%
    </span>
  )
}

export function KpiCard({
  label,
  value,
  delta,
  hint,
}: {
  label: string
  value: string | number
  delta?: number
  hint?: string
}) {
  return (
    <Card padding="none" className="flex flex-col gap-2 pt-4 pb-[15px] px-[18px]">
      <span className="font-display text-[12px] tracking-[1.4px] uppercase text-ink-3">{label}</span>
      <div className="flex items-end gap-2">
        <span className="font-display text-[27px] leading-none text-ink">{value}</span>
        {delta !== undefined && <span className="mb-0.5"><Delta value={delta} /></span>}
        {hint && <span className="mb-0.5 text-xs text-ink-2 leading-none">{hint}</span>}
      </div>
    </Card>
  )
}

/**
 * The bare metric tile: label, value, optional hint. No card of its own, because
 * these almost always sit in a grid *inside* one — which is exactly why AM
 * Campaigns ended up with four copies rather than reaching for `KpiCard`.
 *
 * Values are `tabular-nums` so a column of them does not shimmy as it updates.
 */
export function Stat({
  label,
  value,
  hint,
  delta,
  size = 'md',
  className,
}: {
  label: ReactNode
  value: ReactNode
  hint?: ReactNode
  delta?: number
  /** sm 15px · md 17px · lg 22px. Match it to how much room the tile has. */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const valueSize = {
    sm: 'text-[15px] tracking-[-0.01em]',
    md: 'text-[17px] tracking-[-0.02em]',
    lg: 'text-[22px] tracking-[-0.02em]',
  }[size]
  return (
    <div className={cn('min-w-0', className)}>
      <p className="text-ink-3 truncate text-[11px]">{label}</p>
      <p className={cn('text-ink mt-0.5 leading-none font-bold tabular-nums', valueSize)}>{value}</p>
      {(hint || delta !== undefined) && (
        <div className="mt-1 flex items-center gap-1.5">
          {delta !== undefined && <Delta value={delta} />}
          {hint && <span className="text-ink-3 text-[10.5px]">{hint}</span>}
        </div>
      )}
    </div>
  )
}

/** Horizontal "bar list" — a labelled ranking with proportional fill bars. */
export function BarList({
  title,
  rows,
  emptyText = "No data yet",
  formatLabel,
  hrefBase,
}: {
  title: string
  rows: CountRow[]
  emptyText?: string
  formatLabel?: (label: string) => string
  hrefBase?: (label: string) => string | undefined
}) {
  const max = rows.reduce((m, r) => Math.max(m, r.count), 0) || 1
  return (
    <Card padding="md">
      <h3 className="font-display text-[12px] tracking-[1.4px] uppercase text-ink-3 mb-4">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-ink-3 py-4 text-center">{emptyText}</p>
      ) : (
        <ul className="space-y-1.5">
          {rows.map((r, i) => {
            const label = formatLabel ? formatLabel(r.label) : r.label
            const href = hrefBase?.(r.label)
            const content = (
              <div className="relative flex items-center justify-between px-2 py-1.5 rounded-lg overflow-hidden group">
                <div
                  className="absolute inset-y-0 left-0 bg-accent-soft group-hover:opacity-80 transition-opacity rounded-lg"
                  style={{ width: `${(r.count / max) * 100}%` }}
                  aria-hidden
                />
                <span className="relative truncate text-sm text-ink-2 pr-2" title={label}>
                  {label}
                </span>
                <span className="relative text-sm font-medium text-ink tabular-nums">
                  {formatNumber(r.count)}
                </span>
              </div>
            )
            return (
              <li key={`${r.label}-${i}`}>
                {href ? (
                  <a href={href} target="_blank" rel="noreferrer" className="block">
                    {content}
                  </a>
                ) : (
                  content
                )}
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

/**
 * Circular 0-100 score gauge (the CMS's SEO health score).
 *
 * The CMS original painted the arc with inline `var(--sb-ok)` etc. Those are the
 * CMS's own variable names and would resolve to nothing in AM Campaigns, so the
 * arc uses `stroke-*` utilities instead — same resolved colour, and §C.2-clean.
 */
export function ScoreGauge({
  score,
  label,
  size = 110,
}: {
  score: number | null
  label?: string
  size?: number
}) {
  const v = score ?? 0
  const stroke = 9
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - v / 100)
  const arc =
    score === null ? 'stroke-ink-3' : v >= 90 ? 'stroke-ok' : v >= 50 ? 'stroke-warn' : 'stroke-danger-accent'
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" role="img" aria-label={label ?? `Score ${score ?? 'unavailable'}`}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" className="stroke-input" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={arc}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-[30px] leading-none text-ink">{score === null ? "—" : Math.round(v)}</span>
        </div>
      </div>
      {label && <span className="text-sm text-ink-2 mt-1">{label}</span>}
    </div>
  )
}

export function SectionCard({
  title,
  action,
  variant = "eyebrow",
  children,
}: {
  title: string
  action?: ReactNode
  variant?: "eyebrow" | "heading"
  children: ReactNode
}) {
  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-4">
        <h3
          className={
            variant === "heading"
              ? "font-display text-sm font-semibold tracking-tight text-ink"
              : "font-display text-[12px] tracking-[1.4px] uppercase text-ink-3"
          }
        >
          {title}
        </h3>
        {action}
      </div>
      {children}
    </Card>
  )
}

export function EmptyHint({ children }: { children: ReactNode }) {
  return (
    <div className="text-center py-12 px-4 border border-dashed border-hairline rounded-2xl bg-input">
      <p className="text-sm text-ink-2 max-w-md mx-auto">{children}</p>
    </div>
  )
}

const BAR_HEIGHT = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' } as const

/**
 * A single proportional fill. Both apps had written this by hand five times
 * between them — a rounded track with an inline `style={{ width: 'NN%' }}`.
 *
 * The width has to stay an inline style: Tailwind cannot emit a class for a
 * runtime percentage (see §C.3), so `w-[${pct}%]` would silently produce nothing.
 */
export function ProgressBar({
  value,
  max = 100,
  tone = 'accent',
  size = 'md',
  label,
  showValue = false,
  className,
}: {
  value: number
  max?: number
  tone?: 'accent' | 'ok' | 'warn' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  /** Caption above the bar. Renders a label row with the value on the right. */
  label?: ReactNode
  showValue?: boolean
  className?: string
}) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100))
  const fill = { accent: 'bg-accent', ok: 'bg-ok', warn: 'bg-warn', danger: 'bg-danger-accent' }[tone]
  return (
    <div className={cn('min-w-0', className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          {label && <span className="text-ink-2 truncate text-[12px]">{label}</span>}
          {showValue && <span className="text-ink-3 shrink-0 text-[11.5px] tabular-nums">{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn('bg-input w-full overflow-hidden rounded-pill', BAR_HEIGHT[size])}
      >
        <div className={cn('h-full rounded-pill transition-[width] duration-300', fill)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export interface BarSegment {
  key: string
  value: number
  /** Utility classes for this segment's fill, e.g. `bg-ok`. */
  className?: string
  label?: string
  onClick?: () => void
  /** Dim the segment — for a filter that excludes it. */
  muted?: boolean
}

/**
 * A stacked composition bar: one track, many proportional segments. Campaigns
 * uses it for "how is this campaign distributed across stages", where each
 * segment is also a filter toggle.
 *
 * Segments carry their own colour class rather than a variant, for the same
 * reason `Pill` does — a domain set has more states than a union should hold.
 */
export function SegmentedBar({
  segments,
  size = 'md',
  className,
}: {
  segments: BarSegment[]
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0)
  return (
    <div className={cn('bg-input flex w-full gap-0.5 overflow-hidden rounded-pill', BAR_HEIGHT[size], className)}>
      {total === 0
        ? null
        : segments.map((s) =>
            s.value <= 0 ? null : (
              <button
                key={s.key}
                type="button"
                title={s.label}
                aria-label={s.label}
                disabled={!s.onClick}
                onClick={s.onClick}
                style={{ width: `${(s.value / total) * 100}%` }}
                className={cn(
                  'rounded-pill transition-opacity',
                  s.onClick && 'hover:opacity-70',
                  !s.onClick && 'cursor-default',
                  s.muted && 'opacity-25',
                  s.className ?? 'bg-accent',
                )}
              />
            ),
          )}
    </div>
  )
}
