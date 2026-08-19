/**
 * Card Component — Liquid Glass design system
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/cn.js';
export function Card({ children, className = '', padding = 'md', shadow = 'sm', border = true, hover = false, onClick, }) {
    const paddingClasses = {
        none: '',
        sm: 'p-3',
        md: 'p-4 md:p-6',
        lg: 'p-6 md:p-8',
    };
    const shadowClasses = {
        none: '',
        sm: 'shadow-[0_1px_3px_rgba(0,0,0,0.12)]',
        md: 'shadow-[0_2px_10px_rgba(0,0,0,0.16)]',
        lg: 'shadow-[0_18px_50px_rgba(0,0,0,0.28)]',
    };
    const borderClass = border ? 'border border-hairline' : '';
    const hoverClass = hover
        ? 'hover:border-line transition-colors cursor-pointer'
        : '';
    const clickableClass = onClick ? 'cursor-pointer' : '';
    return (_jsx("div", { className: cn(`
        bg-surface rounded-[var(--am-radius-card,var(--radius-card,12px))]
        ${paddingClasses[padding]}
        ${shadowClasses[shadow]}
        ${borderClass}
        ${hoverClass}
        ${clickableClass}`, className), onClick: onClick, children: children }));
}
export function CardHeader({ title, subtitle, action, className = '' }) {
    return (_jsxs("div", { className: cn(`flex items-start justify-between mb-4`, className), children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "text-lg font-semibold tracking-tight text-ink truncate", children: title }), subtitle && (_jsx("p", { className: "text-sm text-ink-2 mt-1 truncate", children: subtitle }))] }), action && _jsx("div", { className: "ml-4 flex-shrink-0", children: action })] }));
}
export function CardFooter({ children, className = '' }) {
    return (_jsx("div", { className: cn(`
        flex items-center justify-between
        pt-4 mt-4 border-t border-hairline`, className), children: children }));
}
export function CardSection({ children, title, className = '' }) {
    return (_jsxs("div", { className: cn(`py-4`, className), children: [title && (_jsx("h4", { className: "text-sm font-medium text-ink-2 mb-2", children: title })), children] }));
}
// Export as namespace
Card.Header = CardHeader;
Card.Footer = CardFooter;
Card.Section = CardSection;
//# sourceMappingURL=Card.js.map