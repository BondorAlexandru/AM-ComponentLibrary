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
interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    confirmVariant?: 'danger' | 'primary';
    isLoading?: boolean;
}
export declare function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText, confirmVariant, isLoading, }: ConfirmDialogProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=ConfirmDialog.d.ts.map