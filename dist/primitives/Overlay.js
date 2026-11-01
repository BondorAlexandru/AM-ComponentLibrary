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
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/cn.js';
import { useDialogA11y } from '../lib/useDialogA11y.js';
import { fade, popCentered, slideFrom } from '../motion/variants.js';
import { useVariants } from '../motion/components.js';
import { IconButton } from './Button.js';
import { X } from '../icons/index.js';
/** Built once at module scope — `slideFrom` allocates a fresh object per call. */
const slideFromRight = slideFrom('right');
/**
 * Escape closes, background scroll locks, focus lands inside, Tab stays inside,
 * and focus goes back where it came from on close. Shared by both.
 *
 * Keyed on `open`, not on mount, and that distinction now matters: the exit
 * animation keeps the panel in the DOM for a couple of hundred milliseconds
 * after `open` goes false. Releasing the scroll lock on unmount instead would
 * leave the page frozen for that window, which reads as the app hanging.
 */
function useOverlayBehaviour(open, onClose) {
    const ref = useRef(null);
    // Initial focus is the panel itself (tabIndex -1), as before — the first
    // control inside a drawer is rarely the right place to land.
    useDialogA11y(ref, open, onClose, { initialFocus: ref });
    useEffect(() => {
        if (!open)
            return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);
    return ref;
}
export function Drawer({ open, onClose, children, width = 'max-w-[min(1120px,94vw)]', label, className, }) {
    const ref = useOverlayBehaviour(open, onClose);
    const scrim = useVariants(fade);
    const panel = useVariants(slideFromRight);
    // The portal used to be guarded by `if (!open) return null`, which also
    // happened to guard `document`. AnimatePresence has to stay mounted across
    // the close, so the SSR guard has to be explicit now.
    if (typeof document === 'undefined')
        return null;
    return createPortal(_jsx(AnimatePresence, { children: open && (_jsxs("div", { className: "fixed inset-0 z-50 flex justify-end", role: "dialog", "aria-modal": "true", "aria-label": label, children: [_jsx(motion.div, { className: "absolute inset-0 bg-[rgba(10,10,15,0.4)]", onClick: onClose, variants: scrim, initial: "hidden", animate: "show", exit: "exit" }), _jsx(motion.div, { ref: ref, tabIndex: -1, className: cn('bg-canvas text-ink relative flex h-full w-full flex-col shadow-overlay outline-none', width, className), variants: panel, initial: "hidden", animate: "show", exit: "exit", children: children })] }, "drawer")) }), document.body);
}
export function Modal({ open, onClose, title, description, children, footer, width = 'max-w-[520px]', className, }) {
    const ref = useOverlayBehaviour(open, onClose);
    const scrim = useVariants(fade);
    const panel = useVariants(popCentered);
    // The title names the dialog, and the description describes it.
    const titleId = useId();
    const descriptionId = useId();
    if (typeof document === 'undefined')
        return null;
    return createPortal(_jsx(AnimatePresence, { children: open && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, "aria-describedby": description ? descriptionId : undefined, children: [_jsx(motion.div, { className: "absolute inset-0 bg-[rgba(10,10,15,0.4)]", onClick: onClose, variants: scrim, initial: "hidden", animate: "show", exit: "exit" }), _jsxs(motion.div, { ref: ref, tabIndex: -1, className: cn('bg-surface text-ink rounded-card relative flex max-h-[88vh] w-full flex-col shadow-overlay outline-none', width, className), variants: panel, initial: "hidden", animate: "show", exit: "exit", children: [_jsxs("header", { className: "flex items-start justify-between gap-4 px-6 pt-5 pb-4", children: [_jsxs("div", { children: [_jsx("h2", { id: titleId, className: "text-[17px] font-semibold tracking-[-0.01em]", children: title }), description && _jsx("p", { id: descriptionId, className: "text-ink-2 mt-1 text-[13px] leading-relaxed", children: description })] }), _jsx(IconButton, { variant: "ghost", size: "sm", onClick: onClose, "aria-label": "Close", icon: _jsx(X, { size: 16 }) })] }), children && _jsx("div", { className: "overflow-y-auto px-6 pb-2", children: children }), footer && (_jsx("footer", { className: "border-hairline flex items-center justify-end gap-2 border-t px-6 py-4", children: footer }))] })] }, "modal")) }), document.body);
}
//# sourceMappingURL=Overlay.js.map