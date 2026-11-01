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
import { type ReactNode } from 'react';
export interface TabItem<T extends string = string> {
    id: T;
    label: ReactNode;
    icon?: ReactNode;
    disabled?: boolean;
    /** A count or dot rendered after the label. */
    badge?: ReactNode;
}
export declare function Tabs<T extends string>({ items, value, onChange, 'aria-label': ariaLabel, className, size, }: {
    items: TabItem<T>[];
    value: T;
    onChange: (id: T) => void;
    'aria-label'?: string;
    className?: string;
    size?: 'sm' | 'md';
}): import("react").JSX.Element;
export declare function SegmentedControl<T extends string>({ items, value, onChange, 'aria-label': ariaLabel, className, size, variant, }: {
    items: TabItem<T>[];
    value: T;
    onChange: (id: T) => void;
    'aria-label'?: string;
    className?: string;
    size?: 'sm' | 'md';
    /**
     * `pill` is the AM Campaigns treatment (ink pill on an open row). `boxed` is
     * the CMS's: a bordered `bg-input` tray with an `accent-soft` tile for the
     * active segment — the range picker, the heat-map filters, the theme toggle.
     */
    variant?: 'pill' | 'boxed';
}): import("react").JSX.Element;
//# sourceMappingURL=Tabs.d.ts.map