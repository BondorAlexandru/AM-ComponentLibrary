'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
/**
 * Token-driven fallback ring. Uses `currentColor` so it inherits whatever
 * `text-*` context it sits in, matching the contract the CMS spinner honours.
 */
export function DefaultSpinner({ size = 18, className = '' }) {
    return (_jsx("span", { role: "status", "aria-label": "Loading", className: `inline-block shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent align-[-0.125em] ${className}`, style: { width: size, height: size } }));
}
const AmUiContext = React.createContext({ Spinner: DefaultSpinner });
export function AmUiProvider({ children, spinner, }) {
    const value = React.useMemo(() => ({ Spinner: spinner ?? DefaultSpinner }), [spinner]);
    return _jsx(AmUiContext.Provider, { value: value, children: children });
}
export function useAmUi() {
    return React.useContext(AmUiContext);
}
/** The active app spinner. Renders the fallback ring when no provider is mounted. */
export function Spinner(props) {
    const { Spinner: Impl } = useAmUi();
    return _jsx(Impl, { ...props });
}
//# sourceMappingURL=provider.js.map