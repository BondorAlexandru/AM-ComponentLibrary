/**
 * The shared variant vocabulary.
 *
 * Every enter/exit in the library is one of these six shapes. That is the whole
 * point: a menu, a dropdown and a popover are the same gesture at three sizes,
 * and they should not each invent their own numbers. When a primitive needs
 * something genuinely new, it belongs here first and in the primitive second.
 *
 * All of them animate `opacity` plus at most one transform. Under
 * `<MotionConfig reducedMotion="user">` Motion drops the transform and keeps
 * the opacity automatically, so none of these needs a reduced-motion branch —
 * which is exactly why they are written this way.
 */
import type { Variants } from 'motion/react';
/** Plain crossfade. Scrims, tab panels, anything with no direction to it. */
export declare const fade: Variants;
/**
 * Rise into place. The scroll-reveal and the page-body transition.
 *
 * `show` is a function so a call site can pass a delay through Motion's
 * `custom` prop without redefining the variant.
 */
export declare const rise: Variants;
/**
 * Pop from slightly small. Everything that opens *near where you clicked* —
 * menus, dropdowns, popovers, modals.
 *
 * The scale floor is 0.96 rather than something more dramatic because these
 * often contain text: below about 0.94 the type visibly reflows and the whole
 * thing reads as cheap.
 */
export declare const pop: Variants;
/** The modal panel: same gesture as `pop`, centred, so it rises rather than drops. */
export declare const popCentered: Variants;
/**
 * Slide in from an edge. Drawers and sheets.
 *
 * Distance is a percentage of the element's own size, so one variant serves a
 * 320px side panel and a full-height sheet without measuring either.
 */
export declare const slideFrom: (side: "left" | "right" | "top" | "bottom") => Variants;
/**
 * A list that reveals its children one after another.
 *
 * Pair with `riseItem` on each child. `staggerChildren` only reaches direct
 * children, so the item variant has to sit on the element the container maps
 * over — not on something nested inside it.
 */
export declare const staggerList: Variants;
/** The child of `staggerList`. A shorter rise than `rise` — it repeats N times. */
export declare const riseItem: Variants;
/**
 * Height collapse. The one shape that cannot be done in CSS without either a
 * magic-number `max-height` or a `ResizeObserver`, which is most of why this
 * library took on a motion runtime at all.
 *
 * `height: 'auto'` is measured by Motion on every open, so the content may
 * change size between openings and still animate correctly.
 */
export declare const collapse: Variants;
//# sourceMappingURL=variants.d.ts.map