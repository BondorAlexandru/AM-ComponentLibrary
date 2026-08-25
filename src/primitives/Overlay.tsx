/**
 * Modal + Drawer — extracted verbatim from AM Campaigns `ui/Overlay.tsx`.
 * The CMS has no equivalent (it uses `ConfirmDialog` and bespoke panels), so
 * adding these to the library changes nothing there.
 *
 * Requires tier-2 tokens: `--radius-card` and `--shadow-overlay`.
 * See docs/TOKENS.md.
 *
 * Enter *and* exit are driven by Motion. The `animate-fade-in` /
 * `animate-slide-in` / `animate-pop-in` classes these used to carry are gone,
 * and they had to go rather than merely being joined: the CMS never defined
 * those keyframes at all, and AM Campaigns declares them with
 * `animation-fill-mode: both`. A CSS animation outranks inline style, so a
 * finished `both` animation pins opacity at 1 forever and no JS exit is ever
 * visible. The two cannot coexist, and only one of them can animate the way out.
 *
 * Both panels set `text-ink` explicitly rather than inheriting. They portal into
 * `document.body`, so without it the text colour comes from whatever the host
 * put on <body> — which is `ink` in both apps today, but is ambient state a
 * self-contained overlay should not depend on. The docs site caught this: its
 * chrome sets a light body colour, and the modal title rendered near-invisible
 * on the white surface.
 */

'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '../lib/cn.js'
import { fade, popCentered, slideFrom } from '../motion/variants.js'
import { useVariants } from '../motion/components.js'
import { IconButton } from './Button.js'
import { X } from '../icons/index.js'

/** Built once at module scope — `slideFrom` allocates a fresh object per call. */
const slideFromRight = slideFrom('right')

/**
 * Escape closes, background scroll locks, focus lands inside. Shared by both.
 *
 * Keyed on `open`, not on mount, and that distinction now matters: the exit
 * animation keeps the panel in the DOM for a couple of hundred milliseconds
 * after `open` goes false. Releasing the scroll lock on unmount instead would
 * leave the page frozen for that window, which reads as the app hanging.
 */
function useOverlayBehaviour(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ref.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  return ref
}

export function Drawer({
  open,
  onClose,
  children,
  width = 'max-w-[min(1120px,94vw)]',
  label,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  width?: string
  label?: string
}) {
  const ref = useOverlayBehaviour(open, onClose)
  const scrim = useVariants(fade)
  const panel = useVariants(slideFromRight)
  // The portal used to be guarded by `if (!open) return null`, which also
  // happened to guard `document`. AnimatePresence has to stay mounted across
  // the close, so the SSR guard has to be explicit now.
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          key="drawer"
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          <motion.div
            className="absolute inset-0 bg-[rgba(10,10,15,0.4)]"
            onClick={onClose}
            variants={scrim}
            initial="hidden"
            animate="show"
            exit="exit"
          />
          <motion.div
            ref={ref}
            tabIndex={-1}
            className={cn(
              'bg-canvas text-ink relative flex h-full w-full flex-col shadow-overlay outline-none',
              width,
            )}
            variants={panel}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  width = 'max-w-[520px]',
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
  width?: string
}) {
  const ref = useOverlayBehaviour(open, onClose)
  const scrim = useVariants(fade)
  const panel = useVariants(popCentered)
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          key="modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="absolute inset-0 bg-[rgba(10,10,15,0.4)]"
            onClick={onClose}
            variants={scrim}
            initial="hidden"
            animate="show"
            exit="exit"
          />
          <motion.div
            ref={ref}
            tabIndex={-1}
            className={cn(
              'bg-surface text-ink rounded-card relative flex max-h-[88vh] w-full flex-col shadow-overlay outline-none',
              width,
            )}
            variants={panel}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <header className="flex items-start justify-between gap-4 px-6 pt-5 pb-4">
              <div>
                <h2 className="text-[17px] font-semibold tracking-[-0.01em]">{title}</h2>
                {description && <p className="text-ink-2 mt-1 text-[13px] leading-relaxed">{description}</p>}
              </div>
              <IconButton variant="ghost" size="sm" onClick={onClose} aria-label="Close" icon={<X size={16} />} />
            </header>
            {children && <div className="overflow-y-auto px-6 pb-2">{children}</div>}
            {footer && (
              <footer className="border-hairline flex items-center justify-end gap-2 border-t px-6 py-4">
                {footer}
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
