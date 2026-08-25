/**
 * Popover + MenuItem/MenuLabel/MenuSeparator — extracted verbatim from
 * AM Campaigns `ui/Menu.tsx`, renamed to `Popover` so it does not collide with
 * the CMS's `Menu` (which this library also ships).
 *
 * The two are genuinely different primitives, not two versions of one:
 * - `Menu` takes a flat `items[]` array, portals itself with `position: fixed`,
 *   and flips above the trigger. Right for a kebab overflow menu that must
 *   escape a scrollable ancestor.
 * - `Popover` is render-prop driven and absolutely positioned inside its
 *   parent. Right when the panel holds arbitrary content (labels, separators,
 *   nested controls) and the parent isn't clipping.
 *
 * Requires tier-2 tokens: `--radius-card` and `--shadow-raised`.
 *
 * The panel used to carry `animate-pop-in`; it is now animated in *and* out by
 * Motion. The class had to be dropped rather than kept alongside: the CMS never
 * defined that keyframe, and AM Campaigns declares it `animation-fill-mode:
 * both`, which outranks inline style and would pin the panel opaque for the
 * whole of the exit. See the header of `Overlay.tsx`.
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/cn.js';
import { pop } from '../motion/variants.js';
import { useVariants } from '../motion/components.js';
/** Lightweight popover — click to open, click-away or Escape to close. */
export function Popover({ trigger, children, align = 'left', width = 'w-56', className, }) {
    const [open, setOpen] = useState(false);
    const panelVariants = useVariants(pop);
    const ref = useRef(null);
    useEffect(() => {
        if (!open)
            return;
        const onDown = (e) => {
            if (!ref.current?.contains(e.target))
                setOpen(false);
        };
        const onKey = (e) => e.key === 'Escape' && setOpen(false);
        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);
    return (_jsxs("div", { ref: ref, className: cn('relative', className), children: [trigger({ open, toggle: () => setOpen((o) => !o) }), _jsx(AnimatePresence, { children: open && (_jsx(motion.div, { className: cn('bg-surface border-hairline absolute z-40 mt-2 overflow-hidden rounded-card border p-1.5 shadow-raised', align === 'right' ? 'right-0' : 'left-0', width), variants: panelVariants, initial: "hidden", animate: "show", exit: "exit", style: { transformOrigin: align === 'right' ? 'top right' : 'top left' }, children: children(() => setOpen(false)) }, "panel")) })] }));
}
export function MenuItem({ children, onClick, icon, danger, active, }) {
    return (_jsxs("button", { onClick: onClick, className: cn('flex w-full items-center gap-2.5 rounded-[var(--am-radius-control,8px)] px-2.5 py-[7px] text-left text-[13px] transition-colors', danger ? 'text-accent-text hover:bg-accent-soft' : 'text-ink-2 hover:bg-input hover:text-ink', active && 'bg-input text-ink font-medium'), children: [icon && _jsx("span", { className: "shrink-0 opacity-70", children: icon }), _jsx("span", { className: "min-w-0 flex-1 truncate", children: children })] }));
}
export function MenuLabel({ children }) {
    return (_jsx("div", { className: "text-ink-3 px-2.5 pt-2 pb-1 text-[10.5px] font-semibold tracking-[0.06em] uppercase", children: children }));
}
export function MenuSeparator() {
    return _jsx("div", { className: "bg-hairline my-1.5 h-px" });
}
//# sourceMappingURL=Popover.js.map