import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/cn.js';
export function Pill({ children, className, dot, size = 'md', }) {
    return (_jsxs("span", { className: cn('inline-flex items-center gap-1.5 rounded-pill border font-medium whitespace-nowrap', size === 'sm' ? 'px-2 py-[1px] text-[11px]' : 'px-2.5 py-[3px] text-[12px]', className), children: [dot && _jsx("span", { className: cn('h-1.5 w-1.5 shrink-0 rounded-full', dot) }), children] }));
}
//# sourceMappingURL=Pill.js.map