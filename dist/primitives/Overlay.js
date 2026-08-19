/**
 * Modal + Drawer — extracted verbatim from AM Campaigns `ui/Overlay.tsx`.
 * The CMS has no equivalent (it uses `ConfirmDialog` and bespoke panels), so
 * adding these to the library changes nothing there.
 *
 * Requires tier-2 tokens: `--radius-card`, `--shadow-overlay`, and the
 * `animate-fade-in` / `animate-slide-in` / `animate-pop-in` keyframes.
 * See docs/TOKENS.md.
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn.js';
import { IconButton } from './Button.js';
import { X } from '../icons/index.js';
/** Escape closes, background scroll locks, focus lands inside. Shared by both. */
function useOverlayBehaviour(open, onClose) {
    const ref = useRef(null);
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                onClose();
            }
        };
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        ref.current?.focus();
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);
    return ref;
}
export function Drawer({ open, onClose, children, width = 'max-w-[min(1120px,94vw)]', label, }) {
    const ref = useOverlayBehaviour(open, onClose);
    if (!open)
        return null;
    return createPortal(_jsxs("div", { className: "fixed inset-0 z-50 flex justify-end", role: "dialog", "aria-modal": "true", "aria-label": label, children: [_jsx("div", { className: "animate-fade-in absolute inset-0 bg-[rgba(10,10,15,0.4)]", onClick: onClose }), _jsx("div", { ref: ref, tabIndex: -1, className: cn('animate-slide-in bg-canvas relative flex h-full w-full flex-col shadow-overlay outline-none', width), children: children })] }), document.body);
}
export function Modal({ open, onClose, title, description, children, footer, width = 'max-w-[520px]', }) {
    const ref = useOverlayBehaviour(open, onClose);
    if (!open)
        return null;
    return createPortal(_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", role: "dialog", "aria-modal": "true", children: [_jsx("div", { className: "animate-fade-in absolute inset-0 bg-[rgba(10,10,15,0.4)]", onClick: onClose }), _jsxs("div", { ref: ref, tabIndex: -1, className: cn('animate-pop-in bg-surface rounded-card relative flex max-h-[88vh] w-full flex-col shadow-overlay outline-none', width), children: [_jsxs("header", { className: "flex items-start justify-between gap-4 px-6 pt-5 pb-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-[17px] font-semibold tracking-[-0.01em]", children: title }), description && _jsx("p", { className: "text-ink-2 mt-1 text-[13px] leading-relaxed", children: description })] }), _jsx(IconButton, { variant: "ghost", size: "sm", onClick: onClose, "aria-label": "Close", icon: _jsx(X, { size: 16 }) })] }), children && _jsx("div", { className: "overflow-y-auto px-6 pb-2", children: children }), footer && (_jsx("footer", { className: "border-hairline flex items-center justify-end gap-2 border-t px-6 py-4", children: footer }))] })] }), document.body);
}
//# sourceMappingURL=Overlay.js.map