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
'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { motion } from 'motion/react';
import { cn } from '../lib/cn.js';
import { Slot } from '../lib/Slot.js';
import { Spinner, useComponentTheme } from '../theme.js';
import { H, R, T } from '../tokens/geometry.js';
import { SPRING } from '../motion/tokens.js';
import { useMotionEnabled } from '../motion/components.js';
/**
 * The press. Nothing on hover — every variant already changes opacity there,
 * and a button that also grows under the cursor turns a toolbar into a row of
 * twitching targets. The tap is the one moment the control has to confirm it
 * received the click, so that is the only moment it moves.
 */
const PRESS = { scale: 0.97 };
/** Smaller box, so the same proportional squeeze needs a bigger number. */
const PRESS_ICON = { scale: 0.92 };
/**
 * `primary | secondary | tertiary | danger | success | ghost` are the CMS
 * variants; their treatments are frozen (§C.1). `quiet` and `dark` were added
 * for AM Campaigns — `quiet` is not new design, it is exactly the treatment
 * `IconButton`'s ghost already used, now available on a text button.
 */
export const buttonVariants = cva(cn('inline-flex items-center justify-center gap-2 font-medium cursor-pointer', R.control, 'transition-colors duration-150', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-1 focus-visible:ring-offset-canvas', 'disabled:opacity-50 disabled:cursor-not-allowed'), {
    variants: {
        variant: {
            primary: 'bg-accent text-on-accent hover:opacity-90 active:opacity-95',
            secondary: 'border border-line text-ink hover:bg-input',
            tertiary: 'bg-accent-soft text-accent-text hover:opacity-80',
            danger: 'bg-danger-accent text-on-danger hover:opacity-90 active:opacity-95',
            success: 'bg-ok text-on-ok hover:opacity-90 active:opacity-95',
            ghost: 'bg-input border border-hairline text-ink-2 hover:text-ink',
            quiet: 'bg-transparent text-ink-2 hover:bg-input hover:text-ink',
            dark: 'bg-ink text-canvas hover:opacity-90 active:opacity-95',
            // An action that reads as inline text: "Show history", "Reset to auto".
            // Height and padding are stripped below so it sits on the text baseline.
            link: 'bg-transparent text-accent-text hover:underline underline-offset-2',
        },
        size: {
            // Explicit heights so buttons line up exactly in bar rows
            // (md = the shared 34px bar-control height).
            sm: cn(H.controlSm, 'px-3', T.controlSm),
            md: cn(H.controlMd, 'px-4', T.controlMd),
            lg: cn(H.controlLg, 'px-5', T.controlLg),
        },
        fullWidth: { true: 'w-full', false: '' },
    },
    // Listed after size, so tailwind-merge lets these win over the size's h-/px-.
    compoundVariants: [{ variant: 'link', class: 'h-auto px-0' }],
    defaultVariants: { variant: 'primary', size: 'md', fullWidth: false },
});
export const Button = React.forwardRef(function Button(inProps, ref) {
    const { props, className: themeClassName } = useComponentTheme('Button', inProps);
    const animate = useMotionEnabled();
    const { children, variant, size, fullWidth, loading = false, leftIcon, rightIcon, disabled, className, asChild = false, ...rest } = props;
    const classes = cn(buttonVariants({ variant, size, fullWidth }), themeClassName, className);
    const content = (_jsxs(_Fragment, { children: [loading && _jsx(Spinner, { size: 16 }), !loading && leftIcon, children, !loading && rightIcon] }));
    // asChild hands the classes to the child; a disabled/loading state has no
    // meaning on an arbitrary element, so the caller owns that.
    if (asChild) {
        return (_jsx(Slot, { className: classes, ...rest, children: children }));
    }
    if (!animate) {
        return (_jsx("button", { ref: ref, disabled: disabled || loading, className: classes, ...rest, children: content }));
    }
    return (_jsx(motion.button, { ref: ref, disabled: disabled || loading, className: classes, whileTap: PRESS, transition: SPRING.snappy, ...rest, children: content }));
});
export const iconButtonVariants = cva(cn('relative inline-flex items-center justify-center shrink-0', R.control, 'transition-colors duration-150 cursor-pointer', 
// Widens the hit area past the visible box without changing the layout box.
"before:absolute before:content-[''] before:-inset-1.5", 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-1 focus-visible:ring-offset-canvas', 'disabled:opacity-50 disabled:cursor-not-allowed'), {
    variants: {
        variant: {
            primary: 'bg-accent text-on-accent hover:opacity-90',
            secondary: 'border border-line text-ink hover:bg-input',
            tertiary: 'bg-accent-soft text-accent-text hover:opacity-80',
            danger: 'bg-transparent text-danger-accent hover:bg-danger-accent/10',
            ghost: 'bg-transparent text-ink-2 hover:bg-input hover:text-ink',
            // The CMS's row hover actions: no box, no wash, just the glyph. The
            // ::before hit area still applies, so a 13px icon is still tappable.
            bare: 'bg-transparent text-ink-3 hover:text-ink-2',
        },
        size: {
            sm: cn(H.iconSm, 'text-sm'),
            md: cn(H.iconMd, 'text-base'),
            lg: cn(H.iconLg, 'text-lg'),
            // No box at all — the icon's own size is the button's size. Pair with `bare`.
            auto: '',
        },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
});
export const IconButton = React.forwardRef(function IconButton(inProps, ref) {
    const { props, className: themeClassName } = useComponentTheme('IconButton', inProps);
    const animate = useMotionEnabled();
    const { icon, variant, size, className, asChild = false, ...rest } = props;
    const classes = cn(iconButtonVariants({ variant, size }), themeClassName, className);
    if (asChild) {
        return (_jsx(Slot, { className: classes, ...rest, children: icon }));
    }
    if (!animate) {
        return (_jsx("button", { ref: ref, className: classes, ...rest, children: icon }));
    }
    return (_jsx(motion.button, { ref: ref, className: classes, whileTap: PRESS_ICON, transition: SPRING.snappy, ...rest, children: icon }));
});
//# sourceMappingURL=Button.js.map