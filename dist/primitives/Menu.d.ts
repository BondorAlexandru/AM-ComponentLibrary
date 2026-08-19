/**
 * Menu — a lightweight overflow / dropdown menu for decluttering action bars.
 *
 * Keep the primary action visible as a Button; move secondary and destructive
 * actions into a <Menu> behind a kebab trigger.
 *
 * The dropdown is rendered in a portal with `position: fixed` (anchored to the
 * trigger's bounding box) so it is never clipped by a scrollable/overflow-hidden
 * ancestor — e.g. the pages sidebar list. It also flips above the trigger when
 * there isn't room below.
 */
import { type ReactNode } from 'react';
export interface MenuItem {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    variant?: 'default' | 'danger';
    disabled?: boolean;
}
export declare function Menu({ items, trigger, align, buttonClassName, 'aria-label': ariaLabel, }: {
    items: MenuItem[];
    trigger?: ReactNode;
    align?: 'left' | 'right';
    buttonClassName?: string;
    'aria-label'?: string;
}): import("react").JSX.Element;
//# sourceMappingURL=Menu.d.ts.map