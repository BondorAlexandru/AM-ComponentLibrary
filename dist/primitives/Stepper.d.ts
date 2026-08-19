/**
 * A linear progress indicator for a multi-step flow. Both apps had one — AM
 * Campaigns in `AddContentModal`, the CMS in `ComponentImportClient` — with the
 * same rules: completed steps are clickable to go back, future steps are not.
 *
 * That "cannot skip forward" behaviour is the whole point. A stepper that lets
 * you jump to step 3 before step 2 is valid is a set of tabs wearing a costume.
 */
import type { ReactNode } from 'react';
export interface Step {
    label: ReactNode;
    /** Shown under the label at md. Skipped entirely at sm. */
    hint?: ReactNode;
}
export declare function Stepper({ steps, current, onGo, size, className, }: {
    steps: Step[];
    /** Zero-based index of the active step. */
    current: number;
    /** Called when a *completed* step is clicked. Omit to make the stepper inert. */
    onGo?: (index: number) => void;
    size?: 'sm' | 'md';
    className?: string;
}): import("react").JSX.Element;
//# sourceMappingURL=Stepper.d.ts.map