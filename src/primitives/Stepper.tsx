/**
 * A linear progress indicator for a multi-step flow. Both apps had one — AM
 * Campaigns in `AddContentModal`, the CMS in `ComponentImportClient` — with the
 * same rules: completed steps are clickable to go back, future steps are not.
 *
 * That "cannot skip forward" behaviour is the whole point. A stepper that lets
 * you jump to step 3 before step 2 is valid is a set of tabs wearing a costume.
 */

'use client'

import type { ReactNode } from 'react'
import { cn } from '../lib/cn.js'
import { Check } from '../icons/index.js'

export interface Step {
  label: ReactNode
  /** Shown under the label at md. Skipped entirely at sm. */
  hint?: ReactNode
}

export function Stepper({
  steps,
  current,
  onGo,
  size = 'md',
  className,
}: {
  steps: Step[]
  /** Zero-based index of the active step. */
  current: number
  /** Called when a *completed* step is clicked. Omit to make the stepper inert. */
  onGo?: (index: number) => void
  size?: 'sm' | 'md'
  className?: string
}) {
  return (
    <ol className={cn('flex items-center', className)} aria-label="Progress">
      {steps.map((s, i) => {
        const done = i < current
        const active = i === current
        const canGo = done && !!onGo
        return (
          <li
            key={i}
            className={cn('flex items-center', i < steps.length - 1 && 'flex-1')}
            aria-current={active ? 'step' : undefined}
          >
            <button
              type="button"
              onClick={() => canGo && onGo(i)}
              disabled={!canGo}
              className={cn('flex items-center gap-2 text-left', canGo && 'cursor-pointer')}
            >
              <span
                className={cn(
                  'flex shrink-0 items-center justify-center rounded-full font-bold transition-colors',
                  size === 'sm' ? 'h-5 w-5 text-[10.5px]' : 'h-6 w-6 text-[11.5px]',
                  done || active ? 'bg-accent text-on-accent' : 'border-line text-ink-3 border',
                )}
              >
                {done ? <Check size={size === 'sm' ? 11 : 13} /> : i + 1}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    'block font-medium whitespace-nowrap transition-colors',
                    size === 'sm' ? 'text-[11.5px]' : 'text-[12.5px]',
                    active ? 'text-ink' : done ? 'text-ink-2' : 'text-ink-3',
                  )}
                >
                  {s.label}
                </span>
                {s.hint && size === 'md' && (
                  <span className="text-ink-3 block text-[10.5px] whitespace-nowrap">{s.hint}</span>
                )}
              </span>
            </button>
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={cn('mx-3 h-px flex-1 transition-colors', done ? 'bg-accent/40' : 'bg-hairline')}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
