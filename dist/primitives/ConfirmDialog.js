/**
 * ConfirmDialog — CMS-canonical. The markup and every class string here are the
 * CMS's; only the way it enters and leaves has changed.
 *
 * Dialog semantics come from the CMS too (its local wrapper, now folded in):
 * role="alertdialog" labelled by the title and described by the message, focus
 * lands on Cancel — the safe choice on a destructive confirm — Tab is trapped
 * inside, Escape cancels unless `isLoading`, and focus returns on close. There
 * is still no backdrop click: that friction is the feature.
 *
 * `'use client'` is new. It was previously omitted on purpose — both apps only
 * ever import this from a client component, and the CMS original had no
 * directive — but AnimatePresence and `motion` are hook-bearing client
 * components, so the file cannot be a server component any more. Nothing
 * regresses at today's call sites; a future server-component one is now ruled
 * out rather than merely unlikely.
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { fade, popCentered } from "../motion/variants.js";
import { useVariants } from "../motion/components.js";
import { useDialogA11y } from "../lib/useDialogA11y.js";
import { Button } from "./Button.js";
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmVariant = 'danger', isLoading = false, }) {
    const scrim = useVariants(fade);
    const panel = useVariants(popCentered);
    const panelRef = useRef(null);
    const cancelRef = useRef(null);
    const titleId = useId();
    const messageId = useId();
    useDialogA11y(panelRef, isOpen, onClose, { initialFocus: cancelRef, closeOnEscape: !isLoading });
    return (_jsx(AnimatePresence, { children: isOpen && (_jsx(motion.div, { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4", variants: scrim, initial: "hidden", animate: "show", exit: "exit", children: _jsxs(motion.div, { ref: panelRef, role: "alertdialog", "aria-modal": "true", "aria-labelledby": titleId, "aria-describedby": messageId, className: "bg-surface rounded-[var(--am-radius-card,var(--radius-card,12px))] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.5)] border border-hairline w-full max-w-md p-6", variants: panel, initial: "hidden", animate: "show", exit: "exit", children: [_jsx("h2", { id: titleId, className: "text-lg font-semibold tracking-tight text-ink mb-2", children: title }), _jsx("p", { id: messageId, className: "text-sm text-ink-2 mb-6 leading-relaxed", children: message }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { ref: cancelRef, variant: "tertiary", onClick: onClose, disabled: isLoading, children: "Cancel" }), _jsx(Button, { variant: confirmVariant, onClick: onConfirm, loading: isLoading, children: confirmText })] })] }) }, "confirm")) }));
}
//# sourceMappingURL=ConfirmDialog.js.map