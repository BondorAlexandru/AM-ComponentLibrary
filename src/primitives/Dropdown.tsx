/**
 * Dropdown — fully custom, token-styled replacement for native <select>.
 *
 * Native selects render an OS popup that can't be themed; this renders its own
 * listbox (same portal/flip logic as ui/Menu). Drop-in friendly: it accepts
 * <option> children like a real select and calls onChange with a synthetic
 * { target: { value } }, so existing `(e) => e.target.value` handlers work.
 */

'use client'

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
  isValidElement,
} from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check } from '../icons/index.js'

export interface DropdownOption {
  value: string
  label: ReactNode
  disabled?: boolean
}

export interface DropdownChangeEvent {
  target: { value: string }
}

interface DropdownProps {
  value: string | undefined
  onChange: (e: DropdownChangeEvent) => void
  /** Either pass options, or <option> children (parsed like a native select). */
  options?: DropdownOption[]
  children?: ReactNode
  placeholder?: string
  disabled?: boolean
  /** Trigger styling. Overrides the default field look entirely when set. */
  className?: string
  'aria-label'?: string
  title?: string
}

/** Recursively pull { value, label } out of <option>/<optgroup> children. */
function optionsFromChildren(children: ReactNode): DropdownOption[] {
  const out: DropdownOption[] = []
  React.Children.forEach(children, (child) => {
    if (!isValidElement(child)) return
    const el = child as React.ReactElement<{
      value?: string | number
      children?: ReactNode
      disabled?: boolean
    }>
    if (el.type === 'option') {
      out.push({
        value: String(el.props.value ?? el.props.children ?? ''),
        label: el.props.children,
        disabled: el.props.disabled,
      })
    } else if (el.type === 'optgroup' || el.props.children) {
      out.push(...optionsFromChildren(el.props.children))
    }
  })
  return out
}

const DEFAULT_TRIGGER =
  'h-[var(--am-h-control-md,34px)] w-full rounded-[var(--am-radius-control,8px)] border border-line bg-input pl-[10px] pr-[8px] text-[12.5px] text-ink hover:border-accent/60 focus-visible:outline-none focus-visible:border-accent transition-colors'

export function Dropdown({
  value,
  onChange,
  options,
  children,
  placeholder = 'Select…',
  disabled,
  className = '',
  'aria-label': ariaLabel,
  title,
}: DropdownProps) {
  const opts = options ?? optionsFromChildren(children)
  const selected = opts.find((o) => o.value === value)

  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [menuNode, setMenuNode] = useState<HTMLDivElement | null>(null)

  // Position the fixed listbox under the trigger; flip above when cramped.
  const place = useCallback(() => {
    const btn = triggerRef.current
    if (!btn) return
    const r = btn.getBoundingClientRect()
    const menuH = Math.min(280, opts.length * 34 + 12)
    const below = window.innerHeight - r.bottom
    const top = below < menuH + 8 && r.top > menuH + 8 ? r.top - menuH - 4 : r.bottom + 4
    const width = Math.max(r.width, 140)
    const left = Math.min(r.left, window.innerWidth - width - 8)
    setCoords({ top, left, width })
  }, [opts.length])

  useEffect(() => {
    if (!open) return
    place()
    const onScroll = () => place()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [open, place])

  // Outside click + Escape close.
  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node
      if (triggerRef.current?.contains(t) || menuNode?.contains(t)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, menuNode])

  const commit = (v: string) => {
    onChange({ target: { value: v } })
    setOpen(false)
    triggerRef.current?.focus()
  }

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!open) {
        setOpen(true)
        setActiveIdx(Math.max(0, opts.findIndex((o) => o.value === value)))
        return
      }
      if (e.key === 'ArrowDown') setActiveIdx((i) => Math.min(opts.length - 1, i + 1))
      else if (e.key === 'ArrowUp') setActiveIdx((i) => Math.max(0, i - 1))
      else if (activeIdx >= 0 && !opts[activeIdx]?.disabled) commit(opts[activeIdx].value)
    }
  }

  const listbox =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={setMenuNode}
            role="listbox"
            aria-label={ariaLabel}
            style={{
              position: 'fixed',
              top: coords?.top ?? -9999,
              left: coords?.left,
              width: coords?.width,
              visibility: coords ? 'visible' : 'hidden',
            }}
            className="z-[110] max-h-[280px] overflow-y-auto rounded-[var(--am-radius-panel,10px)] border border-hairline bg-surface p-[6px] shadow-[0_8px_12px_rgba(0,0,0,0.25)] flex flex-col gap-[2px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {opts.map((o, i) => {
              const isSelected = o.value === value
              return (
                <button
                  key={`${o.value}-${i}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={o.disabled}
                  onClick={() => commit(o.value)}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={`flex w-full items-center gap-2 rounded-[var(--am-radius-control,8px)] px-[10px] py-[7px] text-left text-[13px] transition-colors disabled:opacity-40 ${
                    isSelected
                      ? 'bg-accent-soft text-accent-text font-medium'
                      : i === activeIdx
                        ? 'bg-input text-ink'
                        : 'text-ink-2 hover:bg-input hover:text-ink'
                  }`}
                >
                  <span className="min-w-0 flex-1 truncate">{o.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              )
            })}
          </div>,
          document.body
        )
      : null

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        title={title}
        onClick={() => {
          setOpen((o) => {
            if (!o) {
              place()
              setActiveIdx(Math.max(0, opts.findIndex((op) => op.value === value)))
            }
            return !o
          })
        }}
        onKeyDown={onTriggerKeyDown}
        className={`inline-flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed ${className || DEFAULT_TRIGGER}`}
      >
        <span className={`min-w-0 flex-1 truncate text-left ${selected ? '' : 'text-ink-3'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-ink-3 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      {listbox}
    </>
  )
}
