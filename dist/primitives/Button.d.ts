/**
 * Button — AM design system (extracted verbatim from the CMS implementation,
 * which is the canonical source for this primitive).
 *
 * One filled accent primary, outline-first secondaries, quiet ghosts.
 * Semantic fills (danger/success) reserved for meaning.
 *
 * Every class here resolves through a semantic token (see docs/TOKENS.md) —
 * no raw hex, no app-specific colour name. That is what lets the CMS render
 * dark-first and AM Campaigns render light from the same component.
 */
import * as React from 'react';
import { type ReactNode } from 'react';
/**
 * `primary | secondary | tertiary | danger | success | ghost` are the CMS
 * variants and their class strings are frozen — changing one changes the CMS.
 *
 * `quiet` and `dark` were added for AM Campaigns. `quiet` is not a new design:
 * it is the exact treatment `IconButton`'s ghost already uses, now available
 * on a text button. `dark` is an ink-filled button for use on tinted panels.
 */
type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'ghost' | 'quiet' | 'dark';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    icon: ReactNode;
    'aria-label': string;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}
export declare const IconButton: React.ForwardRefExoticComponent<IconButtonProps & React.RefAttributes<HTMLButtonElement>>;
export {};
//# sourceMappingURL=Button.d.ts.map