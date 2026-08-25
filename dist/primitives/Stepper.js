/**
 * A linear progress indicator for a multi-step flow. Both apps had one — AM
 * Campaigns in `AddContentModal`, the CMS in `ComponentImportClient` — with the
 * same rules: completed steps are clickable to go back, future steps are not.
 *
 * That "cannot skip forward" behaviour is the whole point. A stepper that lets
 * you jump to step 3 before step 2 is valid is a set of tabs wearing a costume.
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'motion/react';
import { cn } from '../lib/cn.js';
import { Check } from '../icons/index.js';
import { SPRING, tween } from '../motion/tokens.js';
import { useMotionEnabled } from '../motion/components.js';
export function Stepper({ steps, current, onGo, size = 'md', className, }) {
    const enabled = useMotionEnabled();
    return (_jsx("ol", { className: cn('flex items-center', className), "aria-label": "Progress", children: steps.map((s, i) => {
            const done = i < current;
            const active = i === current;
            const canGo = done && !!onGo;
            return (_jsxs("li", { className: cn('flex items-center', i < steps.length - 1 && 'flex-1'), "aria-current": active ? 'step' : undefined, children: [_jsxs("button", { type: "button", onClick: () => canGo && onGo(i), disabled: !canGo, className: cn('flex items-center gap-2 text-left', canGo && 'cursor-pointer'), children: [_jsx(motion.span, { className: cn('flex shrink-0 items-center justify-center rounded-full font-bold transition-colors', size === 'sm' ? 'h-5 w-5 text-[10.5px]' : 'h-6 w-6 text-[11.5px]', done || active ? 'bg-accent text-on-accent' : 'border-line text-ink-3 border'), initial: false, animate: { scale: enabled && active ? 1.08 : 1 }, transition: SPRING.snappy, children: done ? _jsx(Check, { size: size === 'sm' ? 11 : 13 }) : i + 1 }), _jsxs("span", { className: "min-w-0", children: [_jsx("span", { className: cn('block font-medium whitespace-nowrap transition-colors', size === 'sm' ? 'text-[11.5px]' : 'text-[12.5px]', active ? 'text-ink' : done ? 'text-ink-2' : 'text-ink-3'), children: s.label }), s.hint && size === 'md' && (_jsx("span", { className: "text-ink-3 block text-[10.5px] whitespace-nowrap", children: s.hint }))] })] }), i < steps.length - 1 && (
                    // The completed half is a second line drawn over the track rather
                    // than a colour swap on it, so progress travels the connector in
                    // the direction the user is going instead of blinking on.
                    _jsx("span", { "aria-hidden": true, className: "bg-hairline relative mx-3 h-px flex-1", children: _jsx(motion.span, { className: "bg-accent/40 absolute inset-0 origin-left", initial: false, animate: { scaleX: done ? 1 : 0 }, 
                            // Zero is not a duration off the scale — it is `INSTANT`, the
                            // way `instantVariants` honours `motion.enabled: false`: land
                            // on the end state in one frame, markup identical.
                            transition: enabled ? tween('slow') : { duration: 0 } }) }))] }, i));
        }) }));
}
//# sourceMappingURL=Stepper.js.map