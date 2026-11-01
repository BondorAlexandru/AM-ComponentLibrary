/**
 * Badge / Tag / Status — SpaceBlock design system (Chip, Figma 92:33).
 * Token-driven so they follow the active theme.
 */
import type { ReactNode } from 'react';
type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'neutral';
interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    size?: 'sm' | 'md' | 'lg';
    dot?: boolean;
    className?: string;
}
export declare function Badge({ children, variant, size, dot, className }: BadgeProps): import("react").JSX.Element;
interface TagProps {
    children: ReactNode;
    variant?: BadgeVariant;
    onRemove?: () => void;
    /** Accessible name of the remove button — "Remove fitness" beats a list of identical "Remove tag"s. */
    removeLabel?: string;
    className?: string;
}
export declare function Tag({ children, variant, onRemove, removeLabel, className }: TagProps): import("react").JSX.Element;
interface StatusProps {
    children: ReactNode;
    variant?: 'success' | 'danger' | 'warning' | 'neutral' | 'active';
    size?: 'sm' | 'md';
    className?: string;
}
export declare function Status({ children, variant, size, className }: StatusProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=Badge.d.ts.map