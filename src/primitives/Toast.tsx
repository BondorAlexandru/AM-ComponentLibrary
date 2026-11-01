/**
 * Toast — CMS-canonical. Markup and class strings are the CMS's
 * `components/Toast.tsx`; the icons now come from the library's own set.
 *
 * Three parts, because the apps mount them in different places:
 *   - `useToast()` — the queue. Returns the list plus `success / error / info /
 *     warning` helpers and `remove`.
 *   - `ToastContainer` — the fixed top-right stack and polite live region.
 *     Mount it once per screen (the CMS does it per editor) and hand it the
 *     queue from `useToast`.
 *   - `Toast` — one notification; exported for a custom container.
 *
 * Every toast auto-dismisses (5s default). The close button is an IconButton,
 * not a bare <button>, so the hit area and focus ring match the rest of the
 * library.
 */

'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '../lib/cn.js'
import { slideFrom } from '../motion/variants.js'
import { SPRING } from '../motion/tokens.js'
import { useVariants } from '../motion/components.js'
import { IconButton } from './Button.js'
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from '../icons/index.js'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
  /** Milliseconds before auto-dismiss. Default 5000. */
  duration?: number
}

/** The stack is anchored to the right edge, so that is the edge it comes from. */
const slideInFromRight = slideFrom('right')

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
}

const TONE: Record<ToastType, string> = {
  success: 'text-ok',
  error: 'text-danger-accent',
  info: 'text-ink-2',
  warning: 'text-warn',
}

export function Toast({
  toast,
  onClose,
  className,
}: {
  toast: ToastItem
  onClose: (id: string) => void
  className?: string
}) {
  const variants = useVariants(slideInFromRight)

  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), toast.duration || 5000)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  return (
    <motion.div
      layout
      role="status"
      variants={variants}
      initial="hidden"
      animate="show"
      exit="exit"
      // Only the layout reflow is left to the component-level transition; the
      // enter/exit carry their own inside the variant.
      transition={{ layout: SPRING.smooth }}
      className={cn(
        'bg-surface backdrop-blur-xl border border-hairline rounded-xl shadow-[0_12px_40px_rgba(15,23,42,0.12)] ring-1 ring-black/5 p-4 flex items-start gap-3 min-w-[320px] max-w-md pointer-events-auto',
        className,
      )}
    >
      <div className={cn('flex-shrink-0 mt-0.5', TONE[toast.type])}>{ICONS[toast.type]}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-ink">{toast.message}</p>
      </div>
      <IconButton
        variant="bare"
        size="auto"
        aria-label="Dismiss notification"
        onClick={() => onClose(toast.id)}
        icon={<X className="w-4 h-4" />}
        className="flex-shrink-0 hover:text-ink"
      />
    </motion.div>
  )
}

export function ToastContainer({
  toasts,
  onClose,
  className,
}: {
  toasts: ToastItem[]
  onClose: (id: string) => void
  className?: string
}) {
  return (
    // The container spans a corner of the viewport permanently, so it must not
    // take clicks itself — only the toasts inside it do. It's also a polite live
    // region, so screen readers announce each toast as it appears.
    <div
      aria-live="polite"
      className={cn('fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none', className)}
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  )
}

let counter = 0

/** The queue behind ToastContainer. One per screen; pass `toasts`/`remove` down. */
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const add = useCallback((message: string, type: ToastType = 'info', duration?: number) => {
    const id = `toast-${Date.now()}-${++counter}`
    setToasts((prev) => [...prev, { id, message, type, duration }])
    return id
  }, [])

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = useCallback((message: string, duration?: number) => add(message, 'success', duration), [add])
  const error = useCallback((message: string, duration?: number) => add(message, 'error', duration), [add])
  const info = useCallback((message: string, duration?: number) => add(message, 'info', duration), [add])
  const warning = useCallback((message: string, duration?: number) => add(message, 'warning', duration), [add])

  return { toasts, add, remove, success, error, info, warning }
}
