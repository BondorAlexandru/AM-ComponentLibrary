/**
 * Two ways to switch between sibling views, and they are not interchangeable.
 *
 * `Tabs` is the underline row the CMS uses for page-level sections — it had
 * been written out by hand in four places (`app/page.tsx`,
 * `ProjectDashboardClient`, `ChatbotAdminClient`, `ComponentWorkbench`) with
 * small drifts between them. The a11y-complete version won.
 *
 * `SegmentedControl` is the pill group AM Campaigns uses inside a panel, where
 * an underline would compete with the panel's own borders.
 *
 * Rule of thumb: underline for navigating a page, pills for filtering a panel.
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/cn.js';
import { SPRING } from '../motion/tokens.js';
import { useMotionEnabled } from '../motion/components.js';
export function Tabs({ items, value, onChange, 'aria-label': ariaLabel, className, size = 'md', }) {
    // Two tab bars on one page must not share an indicator, or clicking in one
    // slides the other's underline across the screen to meet it.
    const layoutId = `am-tabs-${useId()}`;
    const animate = useMotionEnabled();
    return (_jsx("div", { className: cn('border-hairline border-b', className), children: _jsx("div", { role: "tablist", "aria-label": ariaLabel, className: "-mb-px flex min-w-0 items-center gap-4 overflow-x-auto [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden", children: items.map((t) => (_jsxs("button", { role: "tab", type: "button", "aria-selected": value === t.id, disabled: t.disabled, onClick: () => onChange(t.id), className: cn(
                // `before` widens the hit area past the visible text without
                // adding padding that would break the underline alignment.
                "focus-visible:ring-accent focus-visible:ring-offset-canvas relative inline-flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none before:absolute before:inset-y-0 before:-inset-x-2 before:content-[''] disabled:cursor-not-allowed disabled:opacity-40", size === 'sm' ? 'py-2 text-[13px] font-medium' : 'py-3 text-sm font-medium', 
                // The underline is drawn by the shared indicator below, but every
                // tab keeps `border-b-2 border-transparent` so the row's height
                // does not change by two pixels as the selection moves.
                value === t.id
                    ? cn('text-accent-text', animate ? 'border-transparent' : 'border-accent')
                    : 'text-ink-3 hover:text-ink border-transparent'), children: [t.icon, t.label, t.badge, animate && value === t.id && (_jsx(motion.span, { "aria-hidden": true, layoutId: layoutId, 
                        // -bottom-0.5 because an absolute child is positioned against
                        // the padding box; 0 would float two pixels above the border.
                        className: "bg-accent absolute inset-x-0 -bottom-0.5 h-0.5", transition: SPRING.snappy }))] }, t.id))) }) }));
}
export function SegmentedControl({ items, value, onChange, 'aria-label': ariaLabel, className, size = 'md', }) {
    const layoutId = `am-segmented-${useId()}`;
    const animate = useMotionEnabled();
    return (_jsx("nav", { role: "tablist", "aria-label": ariaLabel, className: cn('flex min-w-0 flex-wrap items-center gap-1', className), children: items.map((t) => (_jsxs("button", { role: "tab", type: "button", "aria-selected": value === t.id, disabled: t.disabled, onClick: () => onChange(t.id), className: cn('rounded-pill relative isolate inline-flex items-center gap-1.5 font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-40', size === 'sm' ? 'px-2.5 py-1 text-[12px]' : 'px-3 py-1.5 text-[12.5px]', value === t.id
                ? cn('text-canvas', !animate && 'bg-ink')
                : 'text-ink-2 hover:bg-input hover:text-ink'), children: [t.icon, t.label, t.badge, animate && value === t.id && (_jsx(motion.span, { "aria-hidden": true, layoutId: layoutId, 
                    // `isolate` on the button makes it the stacking context, so the
                    // negative z-index paints the pill above the button's own
                    // background but still behind the label — no wrapper element,
                    // and therefore no change to what the caller's children sit in.
                    className: "bg-ink rounded-pill absolute inset-0 -z-10", transition: SPRING.snappy }))] }, t.id))) }));
}
//# sourceMappingURL=Tabs.js.map