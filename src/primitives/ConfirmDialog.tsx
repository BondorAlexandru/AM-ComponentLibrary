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
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-[12px] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.5)] border border-hairline w-full max-w-md p-6">
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
      </div>
    </div>
  )
}
