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
export type ToastType = 'success' | 'error' | 'info' | 'warning';
export interface ToastItem {
    id: string;
    type: ToastType;
    message: string;
    /** Milliseconds before auto-dismiss. Default 5000. */
    duration?: number;
}
export declare function Toast({ toast, onClose, className, }: {
    toast: ToastItem;
    onClose: (id: string) => void;
    className?: string;
}): import("react").JSX.Element;
export declare function ToastContainer({ toasts, onClose, className, }: {
    toasts: ToastItem[];
    onClose: (id: string) => void;
    className?: string;
}): import("react").JSX.Element;
/** The queue behind ToastContainer. One per screen; pass `toasts`/`remove` down. */
export declare function useToast(): {
    toasts: ToastItem[];
    add: (message: string, type?: ToastType, duration?: number) => string;
    remove: (id: string) => void;
    success: (message: string, duration?: number) => string;
    error: (message: string, duration?: number) => string;
    info: (message: string, duration?: number) => string;
    warning: (message: string, duration?: number) => string;
};
//# sourceMappingURL=Toast.d.ts.map