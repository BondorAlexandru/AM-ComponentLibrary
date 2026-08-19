/**
 * EmptyState — extracted verbatim from the CMS implementation.
 *
 * `chrome` is the one addition: the CMS always draws the surface card
 * (border + radius), which is right for a full-page empty list. AM Campaigns
 * renders empty states *inside* already-carded panels, where a second border
 * reads as a bug. `chrome` defaults to `true`, so the CMS is unchanged.
 */
import type { ReactNode } from 'react';
interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    /** Draw the surface card around the state. `false` for nesting inside a panel. */
    chrome?: boolean;
}
export declare function EmptyState({ title, description, icon, action, className, size, chrome, }: EmptyStateProps): import("react").JSX.Element;
export declare function EmptyDocumentsIcon({ className }: {
    className?: string;
}): import("react").JSX.Element;
export declare function EmptySearchIcon({ className }: {
    className?: string;
}): import("react").JSX.Element;
export declare function EmptyImageIcon({ className }: {
    className?: string;
}): import("react").JSX.Element;
export {};
//# sourceMappingURL=EmptyState.d.ts.map