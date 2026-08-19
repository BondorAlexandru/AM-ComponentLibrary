/**
 * Card Component — Liquid Glass design system
 */
import type { ReactNode } from 'react';
interface CardProps {
    children: ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    shadow?: 'none' | 'sm' | 'md' | 'lg';
    border?: boolean;
    hover?: boolean;
    onClick?: () => void;
}
export declare function Card({ children, className, padding, shadow, border, hover, onClick, }: CardProps): import("react").JSX.Element;
export declare namespace Card {
    var Header: typeof CardHeader;
    var Footer: typeof CardFooter;
    var Section: typeof CardSection;
}
interface CardHeaderProps {
    title: string;
    subtitle?: string;
    action?: ReactNode;
    className?: string;
}
export declare function CardHeader({ title, subtitle, action, className }: CardHeaderProps): import("react").JSX.Element;
interface CardFooterProps {
    children: ReactNode;
    className?: string;
}
export declare function CardFooter({ children, className }: CardFooterProps): import("react").JSX.Element;
interface CardSectionProps {
    children: ReactNode;
    title?: string;
    className?: string;
}
export declare function CardSection({ children, title, className }: CardSectionProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=Card.d.ts.map