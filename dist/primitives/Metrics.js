/**
 * Data-display primitives — the "what is this number doing" family.
 *
 * `Delta`, `KpiCard`, `BarList`, `ScoreGauge`, `SectionCard` and `EmptyHint` are
 * extracted from the CMS's `components/dashboard/primitives.tsx`. `Stat` and the
 * two bars come from AM Campaigns, which had written the same tile four times
 * (`PerformancePanel`'s Metric, `CreatorDrawer`'s Stat, and two `Kpi`s) and the
 * same fill bar twice.
 */
'use client';
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'motion/react';
import { Card } from './Card.js';
import { cn } from '../lib/cn.js';
import { formatNumber } from '../lib/format.js';
import { ArrowDownRight, ArrowUpRight, Minus } from '../icons/index.js';
import { DURATION, EASE, STAGGER, tween } from '../motion/tokens.js';
import { AnimatedNumber, useMotionEnabled } from '../motion/components.js';
/**
 * Count a figure up only when it is a whole number.
 *
 * `AnimatedNumber` interpolates and rounds, so a fraction would land on a
 * different string than the one the caller passed — 12.5 arriving as "13".
 * A figure that changes when you animate it is worse than one that does not
 * animate at all, so anything else is rendered exactly as given.
 */
function Figure({ value }) {
    if (typeof value !== 'number' || !Number.isInteger(value))
        return _jsx(_Fragment, { children: value });
    // `AnimatedNumber` calls `useInView` unconditionally, and Motion's `inView`
    // constructs an `IntersectionObserver` with no feature check. `Reveal` is a
    // motion primitive and may fairly demand one; a metric tile is not, and an
    // app should not have to stub a browser API to render a number.
    if (typeof IntersectionObserver === 'undefined')
        return _jsx(_Fragment, { children: value });
    return (_jsx(AnimatedNumber, { value: value, 
        // `String` rather than the default `toLocaleString`: the CMS never
        // grouped these, and separators here would be a design change nobody
        // asked for.
        format: (v) => String(Math.round(v)), 
        // Not on view. A KPI tile has to reach its real value even where nothing
        // ever reports visibility — a stubbed observer under test, a headless
        // render — and "counted up early, off screen" is a far cheaper failure
        // than "shows zero forever".
        countOnView: false }));
}
export function Delta({ value }) {
    const up = value > 0;
    const flat = value === 0;
    const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;
    const color = flat ? "text-ink-3" : up ? "text-ok" : "text-danger-accent";
    return (_jsxs("span", { className: `inline-flex items-center gap-0.5 text-xs font-medium ${color}`, children: [_jsx(Icon, { className: "w-3.5 h-3.5" }), Math.abs(value), "%"] }));
}
export function KpiCard({ label, value, delta, hint, }) {
    return (_jsxs(Card, { padding: "none", className: "flex flex-col gap-2 pt-4 pb-[15px] px-[18px]", children: [_jsx("span", { className: "font-display text-[12px] tracking-[1.4px] uppercase text-ink-3", children: label }), _jsxs("div", { className: "flex items-end gap-2", children: [_jsx("span", { className: "font-display text-[27px] leading-none text-ink", children: _jsx(Figure, { value: value }) }), delta !== undefined && _jsx("span", { className: "mb-0.5", children: _jsx(Delta, { value: delta }) }), hint && _jsx("span", { className: "mb-0.5 text-xs text-ink-2 leading-none", children: hint })] })] }));
}
/**
 * The bare metric tile: label, value, optional hint. No card of its own, because
 * these almost always sit in a grid *inside* one — which is exactly why AM
 * Campaigns ended up with four copies rather than reaching for `KpiCard`.
 *
 * Values are `tabular-nums` so a column of them does not shimmy as it updates.
 */
export function Stat({ label, value, hint, delta, size = 'md', className, }) {
    const valueSize = {
        sm: 'text-[15px] tracking-[-0.01em]',
        md: 'text-[17px] tracking-[-0.02em]',
        lg: 'text-[22px] tracking-[-0.02em]',
        xl: 'text-[28px] tracking-[-0.03em]',
    }[size];
    return (_jsxs("div", { className: cn('min-w-0', className), children: [_jsx("p", { className: "text-ink-3 truncate text-[11px]", children: label }), _jsx("p", { className: cn('text-ink mt-0.5 leading-none font-bold tabular-nums', valueSize), children: _jsx(Figure, { value: value }) }), (hint || delta !== undefined) && (_jsxs("div", { className: "mt-1 flex items-center gap-1.5", children: [delta !== undefined && _jsx(Delta, { value: delta }), hint && _jsx("span", { className: "text-ink-3 text-[10.5px]", children: hint })] }))] }));
}
/** Horizontal "bar list" — a labelled ranking with proportional fill bars. */
export function BarList({ title, rows, emptyText = "No data yet", formatLabel, hrefBase, }) {
    const max = rows.reduce((m, r) => Math.max(m, r.count), 0) || 1;
    const enabled = useMotionEnabled();
    return (_jsxs(Card, { padding: "md", children: [_jsx("h3", { className: "font-display text-[12px] tracking-[1.4px] uppercase text-ink-3 mb-4", children: title }), rows.length === 0 ? (_jsx("p", { className: "text-sm text-ink-3 py-4 text-center", children: emptyText })) : (_jsx("ul", { className: "space-y-1.5", children: rows.map((r, i) => {
                    const label = formatLabel ? formatLabel(r.label) : r.label;
                    const href = hrefBase?.(r.label);
                    const content = (_jsxs("div", { className: "relative flex items-center justify-between px-2 py-1.5 rounded-lg overflow-hidden group", children: [_jsx(motion.div, { className: "absolute inset-y-0 left-0 bg-accent-soft group-hover:opacity-80 transition-opacity rounded-lg origin-left", style: { width: `${(r.count / max) * 100}%` }, initial: enabled ? { scaleX: 0 } : false, animate: { scaleX: 1 }, transition: { duration: DURATION.slow, ease: EASE, delay: i * STAGGER }, "aria-hidden": true }), _jsx("span", { className: "relative truncate text-sm text-ink-2 pr-2", title: label, children: label }), _jsx("span", { className: "relative text-sm font-medium text-ink tabular-nums", children: formatNumber(r.count) })] }));
                    return (_jsx("li", { children: href ? (_jsx("a", { href: href, target: "_blank", rel: "noreferrer", className: "block", children: content })) : (content) }, `${r.label}-${i}`));
                }) }))] }));
}
/**
 * Circular 0-100 score gauge (the CMS's SEO health score).
 *
 * The CMS original painted the arc with inline `var(--sb-ok)` etc. Those are the
 * CMS's own variable names and would resolve to nothing in AM Campaigns, so the
 * arc uses `stroke-*` utilities instead — same resolved colour, and §C.2-clean.
 */
export function ScoreGauge({ score, label, size = 110, }) {
    const v = score ?? 0;
    const stroke = 9;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - v / 100);
    const arc = score === null ? 'stroke-ink-3' : v >= 90 ? 'stroke-ok' : v >= 50 ? 'stroke-warn' : 'stroke-danger-accent';
    const enabled = useMotionEnabled();
    return (_jsxs("div", { className: "flex flex-col items-center", children: [_jsxs("div", { className: "relative", style: { width: size, height: size }, children: [_jsxs("svg", { width: size, height: size, className: "-rotate-90", role: "img", "aria-label": label ?? `Score ${score ?? 'unavailable'}`, children: [_jsx("circle", { cx: size / 2, cy: size / 2, r: radius, fill: "none", className: "stroke-input", strokeWidth: stroke }), _jsx(motion.circle, { cx: size / 2, cy: size / 2, r: radius, fill: "none", className: arc, strokeWidth: stroke, strokeDasharray: circumference, initial: enabled ? { strokeDashoffset: circumference } : false, animate: { strokeDashoffset: offset }, transition: { duration: DURATION.slower, ease: EASE }, strokeLinecap: "round" })] }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsx("span", { className: "font-display text-[30px] leading-none text-ink", children: score === null ? '—' : _jsx(Figure, { value: Math.round(v) }) }) })] }), label && _jsx("span", { className: "text-sm text-ink-2 mt-1", children: label })] }));
}
export function SectionCard({ title, action, variant = "eyebrow", children, }) {
    return (_jsxs(Card, { padding: "md", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: variant === "heading"
                            ? "font-display text-sm font-semibold tracking-tight text-ink"
                            : "font-display text-[12px] tracking-[1.4px] uppercase text-ink-3", children: title }), action] }), children] }));
}
export function EmptyHint({ children, className }) {
    return (
    // `className` is merged last, so a cramped container (a dropdown, a drawer
    // list) can take the padding down without forking the panel.
    _jsx("div", { className: cn('text-center py-12 px-4 border border-dashed border-hairline rounded-2xl bg-input', className), children: _jsx("p", { className: "text-sm text-ink-2 max-w-md mx-auto", children: children }) }));
}
const BAR_HEIGHT = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };
/**
 * A single proportional fill. Both apps had written this by hand five times
 * between them — a rounded track with an inline `style={{ width: 'NN%' }}`.
 *
 * The width has to stay an inline style: Tailwind cannot emit a class for a
 * runtime percentage (see §C.3), so `w-[${pct}%]` would silently produce nothing.
 */
export function ProgressBar({ value, max = 100, tone = 'accent', size = 'md', label, showValue = false, className, }) {
    const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
    const fill = { accent: 'bg-accent', ok: 'bg-ok', warn: 'bg-warn', danger: 'bg-danger-accent' }[tone];
    const enabled = useMotionEnabled();
    return (_jsxs("div", { className: cn('min-w-0', className), children: [(label || showValue) && (_jsxs("div", { className: "mb-1.5 flex items-baseline justify-between gap-3", children: [label && _jsx("span", { className: "text-ink-2 truncate text-[12px]", children: label }), showValue && _jsxs("span", { className: "text-ink-3 shrink-0 text-[11.5px] tabular-nums", children: [Math.round(pct), "%"] })] })), _jsx("div", { role: "progressbar", "aria-valuenow": Math.round(pct), "aria-valuemin": 0, "aria-valuemax": 100, className: cn('bg-input w-full overflow-hidden rounded-pill', BAR_HEIGHT[size]), children: _jsx(motion.div, { className: cn('h-full rounded-pill', fill), initial: enabled ? { width: 0 } : false, animate: { width: `${pct}%` }, transition: tween('slow') }) })] }));
}
/**
 * A stacked composition bar: one track, many proportional segments. Campaigns
 * uses it for "how is this campaign distributed across stages", where each
 * segment is also a filter toggle.
 *
 * Segments carry their own colour class rather than a variant, for the same
 * reason `Pill` does — a domain set has more states than a union should hold.
 */
export function SegmentedBar({ segments, size = 'md', className, }) {
    const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);
    return (_jsx("div", { className: cn('bg-input flex w-full gap-0.5 overflow-hidden rounded-pill', BAR_HEIGHT[size], className), children: total === 0
            ? null
            : segments.map((s) => s.value <= 0 ? null : (_jsx("button", { type: "button", title: s.label, "aria-label": s.label, disabled: !s.onClick, onClick: s.onClick, style: { width: `${(s.value / total) * 100}%` }, className: cn('rounded-pill transition-opacity', s.onClick && 'hover:opacity-70', !s.onClick && 'cursor-default', s.muted && 'opacity-25', s.className ?? 'bg-accent') }, s.key))) }));
}
//# sourceMappingURL=Metrics.js.map