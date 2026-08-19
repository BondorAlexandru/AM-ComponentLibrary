/**
 * Popover + MenuItem/MenuLabel/MenuSeparator — extracted verbatim from
 * AM Campaigns `ui/Menu.tsx`, renamed to `Popover` so it does not collide with
 * the CMS's `Menu` (which this library also ships).
 *
 * The two are genuinely different primitives, not two versions of one:
 * - `Menu` takes a flat `items[]` array, portals itself with `position: fixed`,
 *   and flips above the trigger. Right for a kebab overflow menu that must
 *   escape a scrollable ancestor.
 * - `Popover` is render-prop driven and absolutely positioned inside its
 *   parent. Right when the panel holds arbitrary content (labels, separators,
 *   nested controls) and the parent isn't clipping.
 *
 * Requires tier-2 tokens: `--radius-card`, `--shadow-raised`, `animate-pop-in`.
 */
import { type ReactNode } from 'react';
/** Lightweight popover — click to open, click-away or Escape to close. */
export declare function Popover({ trigger, children, align, width, className, }: {
    trigger: (props: {
        open: boolean;
        toggle: () => void;
    }) => ReactNode;
    children: (close: () => void) => ReactNode;
    align?: 'left' | 'right';
    width?: string;
    className?: string;
}): import("react").JSX.Element;
export declare function MenuItem({ children, onClick, icon, danger, active, }: {
    children: ReactNode;
    onClick?: () => void;
    icon?: ReactNode;
    danger?: boolean;
    active?: boolean;
}): import("react").JSX.Element;
export declare function MenuLabel({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare function MenuSeparator(): import("react").JSX.Element;
//# sourceMappingURL=Popover.d.ts.map