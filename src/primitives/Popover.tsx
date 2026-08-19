/**
 * Popover + MenuItem/MenuLabel/MenuSeparator — extracted verbatim from
 * AM Campaigns `ui/Menu.tsx`, renamed to `Popover` so it does not collide with
 * the CMS's `Menu` (which this library also ships).
 *
 * The two are genuinely different primitives, not two versions of one:
 * - `Menu` takes a flat `items[]` array, portals itself with `position: fixed`,
 *   and flips above the trigger. Right for a kebab overflow menu that must
 *   escape a scrollable ancestor.
 * - `Popover` is render-prop driven and absolutely positioned inside its
 *   parent. Right when the panel holds arbitrary content (labels, separators,
 *   nested controls) and the parent isn't clipping.
 *
 * Requires tier-2 tokens: `--radius-card`, `--shadow-raised`, `animate-pop-in`.
 */

'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '../lib/cn.js'

/** Lightweight popover — click to open, click-away or Escape to close. */
export function Popover({
  trigger,
  children,
  align = 'left',
  width = 'w-56',
  className,
}: {
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode
  children: (close: () => void) => ReactNode
  align?: 'left' | 'right'
  width?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className={cn('relative', className)}>
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      {open && (
        <div
          className={cn(
            'animate-pop-in bg-surface border-hairline absolute z-40 mt-2 overflow-hidden rounded-card border p-1.5 shadow-raised',
            align === 'right' ? 'right-0' : 'left-0',
            width,
          )}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}

export function MenuItem({
  children,
  onClick,
  icon,
  danger,
  active,
}: {
  children: ReactNode
  onClick?: () => void
  icon?: ReactNode
  danger?: boolean
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-[8px] px-2.5 py-[7px] text-left text-[13px] transition-colors',
        danger ? 'text-accent-text hover:bg-accent-soft' : 'text-ink-2 hover:bg-input hover:text-ink',
        active && 'bg-input text-ink font-medium',
      )}
    >
      {icon && <span className="shrink-0 opacity-70">{icon}</span>}
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </button>
  )
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-ink-3 px-2.5 pt-2 pb-1 text-[10.5px] font-semibold tracking-[0.06em] uppercase">
      {children}
    </div>
  )
}

export function MenuSeparator() {
  return <div className="bg-hairline my-1.5 h-px" />
}
