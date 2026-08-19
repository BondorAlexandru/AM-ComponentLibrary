'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
/**
 * Token-driven fallback ring. Uses `currentColor` so it inherits whatever
 * `text-*` context it sits in, matching the contract an app spinner should honour.
 */
export function DefaultSpinner({ size = 18, className = '' }) {
    return (_jsx("span", { role: "status", "aria-label": "Loading", className: `inline-block shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent align-[-0.125em] ${className}`, style: { width: size, height: size } }));
}
const EMPTY_THEME = {};
const AmUiContext = React.createContext({
    Spinner: DefaultSpinner,
    theme: EMPTY_THEME,
});
export function AmUiProvider({ children, spinner, theme, }) {
    const value = React.useMemo(() => ({ Spinner: spinner ?? DefaultSpinner, theme: theme ?? EMPTY_THEME }), [spinner, theme]);
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
/**
 * Merge the theme's `defaultProps` under the call site's props.
 *
 * A prop explicitly set to `undefined` must not clobber the theme default —
 * `<Button variant={maybeVariant} />` with nothing to pass should still get the
 * theme's choice — so undefined values are stripped before merging.
 */
export function useComponentTheme(name, props) {
    const { theme } = useAmUi();
    const config = theme.components?.[name];
    return React.useMemo(() => {
        if (!config)
            return { props, className: undefined };
        const defined = {};
        for (const key in props) {
            if (props[key] !== undefined)
                defined[key] = props[key];
        }
        return {
            props: { ...config.defaultProps, ...defined },
            className: config.className,
        };
    }, [config, props]);
}
//# sourceMappingURL=theme.js.map