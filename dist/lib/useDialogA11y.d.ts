import { type RefObject } from 'react';
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
export declare function useDialogA11y(dialogRef: RefObject<HTMLElement | null>, isOpen: boolean, onClose: () => void, { initialFocus, closeOnEscape, }?: {
    initialFocus?: RefObject<HTMLElement | null>;
    closeOnEscape?: boolean;
}): void;
//# sourceMappingURL=useDialogA11y.d.ts.map