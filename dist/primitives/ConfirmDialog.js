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
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "motion/react";
import { fade, popCentered } from "../motion/variants.js";
import { useVariants } from "../motion/components.js";
import { Button } from "./Button.js";
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmVariant = 'danger', isLoading = false, }) {
    const scrim = useVariants(fade);
    const panel = useVariants(popCentered);
    return (_jsx(AnimatePresence, { children: isOpen && (_jsx(motion.div, { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4", variants: scrim, initial: "hidden", animate: "show", exit: "exit", children: _jsxs(motion.div, { className: "bg-surface rounded-[var(--am-radius-card,var(--radius-card,12px))] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.5)] border border-hairline w-full max-w-md p-6", variants: panel, initial: "hidden", animate: "show", exit: "exit", children: [_jsx("h2", { className: "text-lg font-semibold tracking-tight text-ink mb-2", children: title }), _jsx("p", { className: "text-sm text-ink-2 mb-6 leading-relaxed", children: message }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { variant: "tertiary", onClick: onClose, disabled: isLoading, children: "Cancel" }), _jsx(Button, { variant: confirmVariant, onClick: onConfirm, loading: isLoading, children: confirmText })] })] }) }, "confirm")) }));
}
//# sourceMappingURL=ConfirmDialog.js.map