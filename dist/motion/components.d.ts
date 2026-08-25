/**
 * The motion primitives — the four shapes that were being hand-rolled in both
 * apps, badly, in slightly different ways.
 *
 * These are not wrappers for their own sake. Each one exists because the plain
 * version has a specific failure the apps kept hitting:
 *
 * - `Reveal` — an IntersectionObserver per element, which both apps wrote and
 *   AM Campaigns then abandoned mid-migration (its `.am-reveal` CSS is still in
 *   `index.css` with no JS behind it).
 * - `Collapse` — `height: auto` cannot be transitioned in CSS. Every accordion
 *   in both apps therefore jump-cuts while its chevron rotates smoothly, which
 *   is the tell that nobody could make it work.
 * - `Stagger` — a list reveal needs `staggerChildren` on the parent and a
 *   matching variant on each child; getting one of the two wrong silently
 *   animates nothing.
 * - `AnimatedNumber` — counting with `setState` re-renders the tree 60 times a
 *   second. Motion values do not re-render at all.
 */
import * as React from 'react';
import type { Variants } from 'motion/react';
/**
 * Whether library animation is switched on for this app.
 *
 * Only reflects the explicit `theme.motion.enabled` flag — reduced-motion is
 * Motion's job via `<MotionConfig reducedMotion="user">`, which degrades each
 * animation individually instead of killing all of them.
 */
export declare function useMotionEnabled(): boolean;
/**
 * Strip the timing out of a variant set, keeping the targets.
 *
 * Every variant in `src/motion/variants.ts` carries its own `transition`, and a
 * variant-level transition beats anything set on the component or on
 * `MotionConfig` — which is why `theme.motion.enabled` cannot be implemented by
 * passing a global override. The animation still runs; it just takes no time,
 * so the element lands on its target immediately and `AnimatePresence` still
 * unmounts it correctly on exit.
 */
export declare function instantVariants(variants: Variants): Variants;
/**
 * The variants to actually use. Pass every `variants={...}` in the library
 * through this, or `theme.motion.enabled: false` is a promise the component
 * does not keep.
 */
export declare function useVariants(variants: Variants): Variants;
/**
 * Mount once at the app root.
 *
 * `reducedMotion="user"` is the whole reason this exists as a named export
 * rather than a line in each app: it makes every `motion` component in the tree
 * — ours and the app's — drop transforms and keep opacity for anyone who asked
 * their OS for less movement. Without it, honouring that preference is a
 * conditional in every single component.
 */
export declare function AmUiMotionConfig({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Seconds to wait after the element enters the viewport. */
    delay?: number;
    /** Element to render. `li` when the reveal is a list item, so the list stays valid. */
    as?: 'div' | 'li' | 'section';
    children?: React.ReactNode;
}
/**
 * Rises into place the first time it is scrolled to, then stops being involved.
 *
 * `once: true` is not a performance tweak — an element that re-animates every
 * time it re-enters the viewport is actively unpleasant to scroll past twice.
 */
export declare function Reveal({ delay, as, className, children, ...rest }: RevealProps): React.JSX.Element;
export interface CollapseProps {
    open: boolean;
    className?: string;
    children?: React.ReactNode;
}
/**
 * Animates between zero height and whatever the content measures.
 *
 * `overflow: hidden` is applied inline rather than as a class so a caller's
 * `className` cannot accidentally remove the one thing that makes the clip
 * work. It is restored to `visible` on open so a menu or tooltip inside the
 * panel is not clipped once the animation finishes.
 */
export declare function Collapse({ open, className, children }: CollapseProps): React.JSX.Element | null;
export interface StaggerProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Animate on scroll instead of on mount. */
    inView?: boolean;
    children?: React.ReactNode;
}
/**
 * Reveals its children in sequence. Pair with `StaggerItem` on each child —
 * `staggerChildren` only reaches *direct* children, so the item has to be the
 * element this maps over, not something nested inside it.
 */
export declare function Stagger({ inView, className, children, ...rest }: StaggerProps): React.JSX.Element;
/** One child of a `Stagger`. */
export declare function StaggerItem({ as, className, children, ...rest }: {
    as?: 'div' | 'li';
} & React.HTMLAttributes<HTMLDivElement>): React.JSX.Element;
export interface AnimatedNumberProps {
    value: number;
    /** Seconds. Defaults to a deliberate, readable count. */
    duration?: number;
    /** Start counting when scrolled into view rather than on mount. */
    countOnView?: boolean;
    /** Turn the running number into display text. Defaults to a rounded integer. */
    format?: (value: number) => string;
    className?: string;
}
/**
 * Counts from its previous value to the new one without re-rendering.
 *
 * The number lives in a motion value and is written straight to the DOM node,
 * so a dashboard full of these costs one render, not sixty per second per tile.
 */
export declare function AnimatedNumber({ value, duration, countOnView, format, className, }: AnimatedNumberProps): React.JSX.Element;
//# sourceMappingURL=components.d.ts.map