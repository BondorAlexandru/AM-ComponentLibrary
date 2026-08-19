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
export declare function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText, confirmVariant, isLoading, }: ConfirmDialogProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=ConfirmDialog.d.ts.map