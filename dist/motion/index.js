/**
 * The motion layer.
 *
 * Re-exported from the package root as well, so `import { Reveal } from '@am/ui'`
 * works; the `@am/ui/motion` subpath exists for an app that wants the vocabulary
 * (`EASE`, `DURATION`, the variants) without pulling the component barrel in.
 *
 * The library does not re-export Motion itself. Both apps already depend on
 * `motion` directly and should import `motion`, `AnimatePresence` and the hooks
 * from `motion/react` — a second copy proxied through here would be one more
 * thing to keep in sync for no benefit.
 */
export { EASE, EASE_IN_OUT, DURATION, SPRING, STAGGER, VIEWPORT, tween, } from './tokens.js';
export { fade, rise, pop, popCentered, slideFrom, staggerList, riseItem, collapse, } from './variants.js';
export { AmUiMotionConfig, Reveal, Collapse, Stagger, StaggerItem, AnimatedNumber, useMotionEnabled, useVariants, instantVariants, } from './components.js';
//# sourceMappingURL=index.js.map