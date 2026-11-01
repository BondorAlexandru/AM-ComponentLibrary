'use client'

import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Keyboard + screen-reader behaviour for a modal dialog while `isOpen`: focus
 * moves into the dialog (to `initialFocus`, else the first control, else the
 * dialog itself), Tab / Shift+Tab stay inside it, Escape calls `onClose`
 * (unless `closeOnEscape` is false, e.g. while saving), and focus returns to
 * whatever was focused before it opened.
 *
 * Keyed on `isOpen`, not on mount: an exit animation keeps the panel in the DOM
 * for a few hundred milliseconds after the state flips, and focus must be
 * handed back the moment the dialog is logically closed (CLAUDE.md §C.15).
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
    if (!isOpen) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const dialog = dialogRef.current
    const target = initialFocus?.current ?? dialog?.querySelector<HTMLElement>(FOCUSABLE) ?? dialog
    target?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
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
      document.removeEventListener('keydown', onKeyDown)
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus()
    }
  }, [isOpen, dialogRef, initialFocus])
}
