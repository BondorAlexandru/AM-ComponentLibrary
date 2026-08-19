import { type ClassValue } from 'clsx';
export type { ClassValue };
/**
 * Join class names, then resolve Tailwind conflicts so the *last* one wins.
 *
 * The `twMerge` half is what makes `className` a real override rather than a
 * suggestion. Two utilities of the same kind have identical CSS specificity, so
 * without it the winner is decided by the order Tailwind happened to emit them
 * in the stylesheet — not by the order you wrote them. `cn('h-[34px]', 'h-12')`
 * would leave both classes on the element and give you whichever Tailwind felt
 * like. Now it emits `h-12` alone.
 *
 * This is why every component takes the caller's `className` last: base classes,
 * then the theme's per-component classes, then yours. Yours win.
 */
export declare function cn(...inputs: ClassValue[]): string;
//# sourceMappingURL=cn.d.ts.map