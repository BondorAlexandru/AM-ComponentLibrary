/**
 * ConfirmDialog — CMS-canonical. The markup and every class string here are the
 * CMS's; only the way it enters and leaves has changed.
 *
 * `'use client'` is new. It was previously omitted on purpose — both apps only
 * ever import this from a client component, and the CMS original had no
 * directive — but AnimatePresence and `motion` are hook-bearing client
 * components, so the file cannot be a server component any more. Nothing
 * regresses at today's call sites; a future server-component one is now ruled
 * out rather than merely unlikely.
 */

'use client'

import { AnimatePresence, motion } from "motion/react"
import { fade, popCentered } from "../motion/variants.js"
import { useVariants } from "../motion/components.js"
import { Button } from "./Button.js"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  confirmVariant?: 'danger' | 'primary'
  isLoading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  confirmVariant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const scrim = useVariants(fade)
  const panel = useVariants(popCentered)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="confirm"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          variants={scrim}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <motion.div
            className="bg-surface rounded-[var(--am-radius-card,var(--radius-card,12px))] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.5)] border border-hairline w-full max-w-md p-6"
            variants={panel}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <h2 className="text-lg font-semibold tracking-tight text-ink mb-2">{title}</h2>
            <p className="text-sm text-ink-2 mb-6 leading-relaxed">{message}</p>
            <div className="flex justify-end gap-2">
              <Button variant="tertiary" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button variant={confirmVariant} onClick={onConfirm} loading={isLoading}>
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
