/**
 * Button — AM design system.
 *
 * Four ways to change how this looks, in increasing order of specificity:
 *
 *   1. **Tokens.** `--am-h-control-md`, `--am-radius-control`, `--am-text-base`,
 *      and the colour roles. Restyle every button in the app from your CSS.
 *   2. **Theme.** `<AmUiProvider theme={{ components: { Button: {
 *      defaultProps: { variant: 'secondary' }, className: 'rounded-full' } } }}>`
 *   3. **`className`.** Wins over both — `cn` runs tailwind-merge, so
 *      `className="h-12"` really does replace the height rather than sitting
 *      next to it and hoping.
 *   4. **`buttonVariants`.** Exported, so you can build your own component on
 *      the same classes rather than forking this one.
 *
 * `asChild` renders the child element instead of a `<button>`, for the case
 * where you need a link that looks like a button.
 */
import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
/**
 * `primary | secondary | tertiary | danger | success | ghost` are the CMS
 * variants; their treatments are frozen (§C.1). `quiet` and `dark` were added
 * for AM Campaigns — `quiet` is not new design, it is exactly the treatment
 * `IconButton`'s ghost already used, now available on a text button.
 */
export declare const buttonVariants: (props?: ({
    variant?: "primary" | "secondary" | "tertiary" | "danger" | "success" | "ghost" | "quiet" | "dark" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
    fullWidth?: boolean | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type ButtonVariants = VariantProps<typeof buttonVariants>;
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>, ButtonVariants {
    children?: React.ReactNode;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    /** Render the child element instead of a `<button>` — a link, a router Link. */
    asChild?: boolean;
}
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export declare const iconButtonVariants: (props?: ({
    variant?: "primary" | "secondary" | "tertiary" | "danger" | "ghost" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type IconButtonVariants = VariantProps<typeof iconButtonVariants>;
export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'color'>, IconButtonVariants {
    icon: React.ReactNode;
    /** Required — an icon-only control with no accessible name is unusable. */
    'aria-label': string;
    asChild?: boolean;
}
export declare const IconButton: React.ForwardRefExoticComponent<IconButtonProps & React.RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=Button.d.ts.map