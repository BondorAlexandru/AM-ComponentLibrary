'use client'

import { useEffect, useRef, type RefObject } from 'react'

/** Open dialogs, oldest first. The last entry is the one that owns the keyboard. */
const openDialogs: symbol[] = []

/**
 * The last element focused outside any modal dialog. An `autoFocus` control
 * inside a dialog takes focus during React's commit, before this hook's effect
 * runs, so by then `document.activeElement` is already inside the dialog and
 * the opener is lost. Tracking focus outside dialogs keeps it.
 */
let lastFocusOutside: HTMLElement | null = null
let tracking = false
function trackFocusOutsideDialogs() {
  if (tracking || typeof document === 'undefined') return
  tracking = true
  document.addEventListener(
    'focusin',
    (e) => {
      const t = e.target as HTMLElement | null
      if (t && !t.closest('[aria-modal="true"]')) lastFocusOutside = t
    },
    true,
  )
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Keyboard + screen-reader behaviour for a modal dialog while `isOpen`: focus
 * moves into the dialog (to `initialFocus`, else the first control, else the
 * dialog itself — unless an `autoFocus` control inside already has it), Tab / Shift+Tab stay inside it, Escape calls `onClose`
 * (unless `closeOnEscape` is false, e.g. while saving), and focus returns to
 * whatever was focused before it opened.
 *
 * Keyed on `isOpen`, not on mount: an exit animation keeps the panel in the DOM
 * for a few hundred milliseconds after the state flips, and focus must be
 * handed back the moment the dialog is logically closed (CLAUDE.md §C.15).
 *
 * Dialogs stack. Every open dialog registers itself, and only the topmost one
 * answers Escape and traps Tab: a media picker opened from inside a settings
 * modal closes on its own with Escape, and Tab cycles inside the picker, not
 * the modal underneath. Without the stack both document listeners fire, so one
 * Escape closes everything and the lower dialog drags focus back to itself.
 *
 * Lifted from the CMS (`components/ui/useDialogA11y.ts`), where it wrapped the
 * library's ConfirmDialog; it now backs ConfirmDialog, Modal and Drawer here.
 */
export function useDialogA11y(
  dialogRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onClose: () => void,
  {
    initialFocus,
    closeOnEscape = true,
  }: { initialFocus?: RefObject<HTMLElement | null>; closeOnEscape?: boolean } = {},
): void {
  const onCloseRef = useRef(onClose)
  const escapeRef = useRef(closeOnEscape)
  useEffect(() => {
    onCloseRef.current = onClose
    escapeRef.current = closeOnEscape
  }, [onClose, closeOnEscape])

  useEffect(() => {
    trackFocusOutsideDialogs()
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const self = Symbol('dialog')
    openDialogs.push(self)
    const isTopmost = () => openDialogs[openDialogs.length - 1] === self
    const dialog = dialogRef.current
    const active = document.activeElement as HTMLElement | null
    // An autoFocus control inside the dialog already has focus: keep it there,
    // and restore to the opener recorded before it moved.
    const focusAlreadyInside = !!(dialog && active && dialog.contains(active))
    const previouslyFocused = focusAlreadyInside ? lastFocusOutside : active
    if (!focusAlreadyInside) {
      const target = initialFocus?.current ?? dialog?.querySelector<HTMLElement>(FOCUSABLE) ?? dialog
      target?.focus()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isTopmost()) return
      const el = dialogRef.current
      if (!el) return
      if (e.key === 'Escape') {
        if (!escapeRef.current) return
        e.stopPropagation()
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null)
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const first = items[0]!
      const last = items[items.length - 1]!
      const active = document.activeElement
      if (e.shiftKey && (active === first || !el.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (active === last || !el.contains(active))) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      const i = openDialogs.indexOf(self)
      if (i !== -1) openDialogs.splice(i, 1)
      document.removeEventListener('keydown', onKeyDown)
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus()
    }
  }, [isOpen, dialogRef, initialFocus])
}
