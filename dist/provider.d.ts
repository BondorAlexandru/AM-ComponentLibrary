import * as React from 'react';
/**
 * Slots an app fills in so shared primitives can stay brand-neutral.
 *
 * The CMS loading indicator is a WebGL SpaceBlock "B" (`sb-loader.js`) — a
 * brand asset, not a design-system primitive. Hardcoding it in the library
 * would push SpaceBlock branding into AM Campaigns; hardcoding a plain ring
 * would silently change every CMS button's loading state. So the spinner is
 * a slot: each app supplies its own and shared components render it.
 */
export interface SpinnerProps {
    size?: number;
    className?: string;
}
export interface AmUiContextValue {
    /** Loading indicator used by `Button` (loading state), `LoadingOverlay`, etc. */
    Spinner: React.ComponentType<SpinnerProps>;
}
/**
 * Token-driven fallback ring. Uses `currentColor` so it inherits whatever
 * `text-*` context it sits in, matching the contract the CMS spinner honours.
 */
export declare function DefaultSpinner({ size, className }: SpinnerProps): React.JSX.Element;
export declare function AmUiProvider({ children, spinner, }: {
    children: React.ReactNode;
    /** Brand loading indicator. Omit to use the token-driven ring. */
    spinner?: React.ComponentType<SpinnerProps>;
}): React.JSX.Element;
export declare function useAmUi(): AmUiContextValue;
/** The active app spinner. Renders the fallback ring when no provider is mounted. */
export declare function Spinner(props: SpinnerProps): React.JSX.Element;
//# sourceMappingURL=provider.d.ts.map