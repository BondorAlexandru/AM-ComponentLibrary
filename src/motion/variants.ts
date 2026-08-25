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

import type { Variants } from 'motion/react'
import { DURATION, EASE, SPRING, STAGGER } from './tokens.js'

/** Plain crossfade. Scrims, tab panels, anything with no direction to it. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.base, ease: EASE } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE } },
}

/**
 * Rise into place. The scroll-reveal and the page-body transition.
 *
 * `show` is a function so a call site can pass a delay through Motion's
 * `custom` prop without redefining the variant.
 */
export const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slower, ease: EASE, delay },
  }),
  exit: { opacity: 0, y: -8, transition: { duration: DURATION.fast, ease: EASE } },
}

/**
 * Pop from slightly small. Everything that opens *near where you clicked* —
 * menus, dropdowns, popovers, modals.
 *
 * The scale floor is 0.96 rather than something more dramatic because these
 * often contain text: below about 0.94 the type visibly reflows and the whole
 * thing reads as cheap.
 */
export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: -4 },
  show: { opacity: 1, scale: 1, y: 0, transition: SPRING.snappy },
  exit: { opacity: 0, scale: 0.97, y: -2, transition: { duration: DURATION.fast, ease: EASE } },
}

/** The modal panel: same gesture as `pop`, centred, so it rises rather than drops. */
export const popCentered: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: SPRING.smooth },
  exit: { opacity: 0, scale: 0.98, y: 4, transition: { duration: DURATION.fast, ease: EASE } },
}

/**
 * Slide in from an edge. Drawers and sheets.
 *
 * Distance is a percentage of the element's own size, so one variant serves a
 * 320px side panel and a full-height sheet without measuring either.
 */
export const slideFrom = (side: 'left' | 'right' | 'top' | 'bottom'): Variants => {
  const enter = { duration: DURATION.slow, ease: EASE }
  const leave = { duration: DURATION.base, ease: EASE }
  // Written as four explicit branches rather than one computed `[axis]` key:
  // a computed key widens the object to a string index signature and Motion's
  // `Variants` type rejects it, since `transition` then looks like a CSS value.
  switch (side) {
    case 'left':
      return {
        hidden: { opacity: 0, x: '-100%' },
        show: { opacity: 1, x: 0, transition: enter },
        exit: { opacity: 0, x: '-100%', transition: leave },
      }
    case 'right':
      return {
        hidden: { opacity: 0, x: '100%' },
        show: { opacity: 1, x: 0, transition: enter },
        exit: { opacity: 0, x: '100%', transition: leave },
      }
    case 'top':
      return {
        hidden: { opacity: 0, y: '-100%' },
        show: { opacity: 1, y: 0, transition: enter },
        exit: { opacity: 0, y: '-100%', transition: leave },
      }
    case 'bottom':
      return {
        hidden: { opacity: 0, y: '100%' },
        show: { opacity: 1, y: 0, transition: enter },
        exit: { opacity: 0, y: '100%', transition: leave },
      }
  }
}

/**
 * A list that reveals its children one after another.
 *
 * Pair with `riseItem` on each child. `staggerChildren` only reaches direct
 * children, so the item variant has to sit on the element the container maps
 * over — not on something nested inside it.
 */
export const staggerList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER, delayChildren: 0.02 } },
  exit: { transition: { staggerChildren: STAGGER / 2, staggerDirection: -1 } },
}

/** The child of `staggerList`. A shorter rise than `rise` — it repeats N times. */
export const riseItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
  exit: { opacity: 0, y: -6, transition: { duration: DURATION.fast, ease: EASE } },
}

/**
 * Height collapse. The one shape that cannot be done in CSS without either a
 * magic-number `max-height` or a `ResizeObserver`, which is most of why this
 * library took on a motion runtime at all.
 *
 * `height: 'auto'` is measured by Motion on every open, so the content may
 * change size between openings and still animate correctly.
 */
export const collapse: Variants = {
  hidden: { height: 0, opacity: 0, transition: { duration: DURATION.base, ease: EASE } },
  show: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: DURATION.base, ease: EASE },
      opacity: { duration: DURATION.fast, ease: EASE, delay: 0.04 },
    },
  },
}
