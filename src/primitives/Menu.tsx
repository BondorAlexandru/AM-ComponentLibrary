/**
 * Menu — a lightweight overflow / dropdown menu for decluttering action bars.
 *
 * Keep the primary action visible as a Button; move secondary and destructive
 * actions into a <Menu> behind a kebab trigger.
 *
 * The dropdown is rendered in a portal with `position: fixed` (anchored to the
 * trigger's bounding box) so it is never clipped by a scrollable/overflow-hidden
 * ancestor — e.g. the pages sidebar list. It also flips above the trigger when
 * there isn't room below.
 */

'use client'

import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { MoreHorizontal } from '../icons/index.js'

export interface MenuItem {
  label: string
  icon?: ReactNode
  onClick: () => void
  variant?: 'default' | 'danger'
  disabled?: boolean
}

export function Menu({
  items,
  trigger,
  align = 'right',
  buttonClassName = '',
  'aria-label': ariaLabel = 'More actions',
}: {
  items: MenuItem[]
  trigger?: ReactNode
  align?: 'left' | 'right'
  buttonClassName?: string
  'aria-label'?: string
}) {
  const [open, setOpen] = useState(false)
  // null until measured — we render the portal invisibly, measure, then place it
  // (avoids a one-frame flash at the wrong position).
  const [coords, setCoords] = useState<{ top: number; left?: number; right?: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Position the fixed dropdown relative to the trigger, flipping up if there's
  // no room below. Stable across renders (deps rarely change) so it can be used
  // as both a scroll/resize listener and the menu node's ref callback.
  const place = useCallback(() => {
    const btn = triggerRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const menuHeight = menuRef.current?.offsetHeight ?? items.length * 40 + 8
    const gap = 6
    const spaceBelow = window.innerHeight - rect.bottom
    const openUp = spaceBelow < menuHeight + gap + 6 && rect.top > menuHeight
    const top = openUp ? rect.top - menuHeight - gap : rect.bottom + gap
    const next: { top: number; left?: number; right?: number } = { top }
    if (align === 'right') next.right = window.innerWidth - rect.right
    else next.left = rect.left
    setCoords(next)
  }, [align, items.length])

  // Measure once the menu node mounts (so we know its real height for the flip),
  // and re-measure it on scroll/resize so it follows the trigger.
  const setMenuNode = useCallback(
    (el: HTMLDivElement | null) => {
      menuRef.current = el
      if (el) place()
    },
    [place]
  )

  // While open, keep the menu anchored as scrolling ancestors (capture=true) or
  // the window move. No setState in the effect body — listeners handle it.
  useEffect(() => {
    if (!open) return
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open, place])

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      const t = e.target as Node
      if (triggerRef.current?.contains(t) || menuRef.current?.contains(t)) return
      setOpen(false)
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  const dropdown =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={setMenuNode}
            role="menu"
            style={{
              position: 'fixed',
              top: coords?.top ?? -9999,
              left: coords?.left,
              right: coords?.right,
              visibility: coords ? 'visible' : 'hidden',
            }}
            className="z-[100] w-[196px] rounded-[10px] border border-hairline bg-surface shadow-[0_8px_12px_rgba(0,0,0,0.25)] p-[6px] flex flex-col gap-[2px]"
          >
            {items.map((item, i) => (
              <button
                key={i}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  setOpen(false)
                  item.onClick()
                }}
                className={`flex w-full items-center gap-[10px] px-[10px] py-[8px] text-[13px] font-medium rounded-[8px] text-left transition-colors disabled:opacity-40 ${
                  item.variant === 'danger'
                    ? 'text-danger-accent hover:bg-danger-accent/10'
                    : 'text-ink hover:bg-input'
                }`}
              >
                {item.icon && <span className="w-3.5 h-3.5 flex-shrink-0 grid place-items-center [&>svg]:w-3.5 [&>svg]:h-3.5">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>,
          document.body
        )
      : null

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => {
            const next = !o
            // Seed an initial position on open (refined once the menu mounts)
            // so it never paints at a stale spot.
            if (next) place()
            return next
          })
        }}
        className={
          buttonClassName ||
          'inline-flex items-center justify-center h-9 w-9 rounded-[8px] text-ink-3 hover:bg-input hover:text-ink transition-colors'
        }
      >
        {trigger ?? <MoreHorizontal className="w-4 h-4" />}
      </button>
      {dropdown}
    </div>
  )
}
