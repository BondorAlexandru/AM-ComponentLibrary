'use client'

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

import * as React from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from 'motion/react'
import type { Variants } from 'motion/react'
import { MotionConfig } from 'motion/react'
import { cn } from '../lib/cn.js'
import { useAmUi } from '../theme.js'
import { DURATION, EASE, VIEWPORT } from './tokens.js'
import { collapse, riseItem, staggerList } from './variants.js'

/**
 * Whether library animation is switched on for this app.
 *
 * Only reflects the explicit `theme.motion.enabled` flag — reduced-motion is
 * Motion's job via `<MotionConfig reducedMotion="user">`, which degrades each
 * animation individually instead of killing all of them.
 */
export function useMotionEnabled(): boolean {
  const { theme } = useAmUi()
  return theme.motion?.enabled ?? true
}

/**
 * "Has this been scrolled into view yet?", without assuming the API exists.
 *
 * Motion's own `useInView` (and `whileInView`) construct an
 * `IntersectionObserver` with no feature check, so mounting one throws outright
 * where the API is absent — most commonly jsdom, which means a component using
 * it cannot be rendered in a unit test at all. A metric tile should not require
 * an app to stub a browser API in order to display a number.
 *
 * Where the API is missing we report **visible**, not hidden. The failure modes
 * are not symmetric: assuming hidden means content that never appears and a
 * counter stuck on zero, while assuming visible means an animation nobody was
 * in a position to watch.
 */
function useInViewSafe(ref: React.RefObject<Element | null>, margin: string): boolean {
  const [seen, setSeen] = React.useState(false)

  React.useEffect(() => {
    if (seen) return
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin, seen])

  return seen
}

/** Zero-duration: the end state, on the first frame. */
const INSTANT = { duration: 0 } as const

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
export function instantVariants(variants: Variants): Variants {
  const out: Variants = {}
  for (const [state, target] of Object.entries(variants)) {
    out[state] =
      typeof target === 'function'
        ? (...args: Parameters<typeof target>) => ({
            ...(target(...args) as object),
            transition: INSTANT,
          })
        : { ...(target as object), transition: INSTANT }
  }
  return out
}

/**
 * The variants to actually use. Pass every `variants={...}` in the library
 * through this, or `theme.motion.enabled: false` is a promise the component
 * does not keep.
 */
export function useVariants(variants: Variants): Variants {
  const enabled = useMotionEnabled()
  return React.useMemo(
    () => (enabled ? variants : instantVariants(variants)),
    [enabled, variants],
  )
}

/**
 * Mount once at the app root.
 *
 * `reducedMotion="user"` is the whole reason this exists as a named export
 * rather than a line in each app: it makes every `motion` component in the tree
 * — ours and the app's — drop transforms and keep opacity for anyone who asked
 * their OS for less movement. Without it, honouring that preference is a
 * conditional in every single component.
 */
export function AmUiMotionConfig({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: DURATION.base, ease: EASE }}>
      {children}
    </MotionConfig>
  )
}

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Seconds to wait after the element enters the viewport. */
  delay?: number
  /** Element to render. `li` when the reveal is a list item, so the list stays valid. */
  as?: 'div' | 'li' | 'section'
  children?: React.ReactNode
}

/**
 * Rises into place the first time it is scrolled to, then stops being involved.
 *
 * `once: true` is not a performance tweak — an element that re-animates every
 * time it re-enters the viewport is actively unpleasant to scroll past twice.
 */
export function Reveal({ delay = 0, as = 'div', className, children, ...rest }: RevealProps) {
  const enabled = useMotionEnabled()
  const ref = React.useRef<HTMLDivElement>(null)
  // Not Motion's `whileInView`: that constructs an IntersectionObserver with no
  // feature check, which makes this component unrenderable in jsdom. Same
  // behaviour, one guard. See `useInViewSafe`.
  const shown = useInViewSafe(ref, VIEWPORT.margin)
  // Cast to the div flavour: the three tags take the same DOM props at runtime,
  // but their handler types are nominally distinct, so the union is unusable.
  const Tag = (as === 'li' ? motion.li : as === 'section' ? motion.section : motion.div) as typeof motion.div

  if (!enabled) {
    const Plain = as as 'div'
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    )
  }

  return (
    <Tag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{ duration: DURATION.slower, ease: EASE, delay }}
      {...(rest as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </Tag>
  )
}

export interface CollapseProps {
  open: boolean
  className?: string
  children?: React.ReactNode
}

/**
 * Animates between zero height and whatever the content measures.
 *
 * `overflow: hidden` is applied inline rather than as a class so a caller's
 * `className` cannot accidentally remove the one thing that makes the clip
 * work. It is restored to `visible` on open so a menu or tooltip inside the
 * panel is not clipped once the animation finishes.
 */
export function Collapse({ open, className, children }: CollapseProps) {
  const enabled = useMotionEnabled()

  if (!enabled) return open ? <div className={className}>{children}</div> : null

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          className={className}
          variants={collapse}
          initial="hidden"
          animate="show"
          exit="hidden"
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export interface StaggerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Animate on scroll instead of on mount. */
  inView?: boolean
  children?: React.ReactNode
}

/**
 * Reveals its children in sequence. Pair with `StaggerItem` on each child —
 * `staggerChildren` only reaches *direct* children, so the item has to be the
 * element this maps over, not something nested inside it.
 */
export function Stagger({ inView = false, className, children, ...rest }: StaggerProps) {
  const enabled = useMotionEnabled()
  if (!enabled) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      variants={staggerList}
      initial="hidden"
      {...(inView ? { whileInView: 'show', viewport: VIEWPORT } : { animate: 'show' })}
      {...(rest as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  )
}

/** One child of a `Stagger`. */
export function StaggerItem({
  as = 'div',
  className,
  children,
  ...rest
}: { as?: 'div' | 'li' } & React.HTMLAttributes<HTMLDivElement>) {
  const enabled = useMotionEnabled()
  if (!enabled) {
    const Plain = as as 'div'
    return <Plain className={className}>{children}</Plain>
  }
  const Tag = (as === 'li' ? motion.li : motion.div) as typeof motion.div
  return (
    <Tag className={className} variants={riseItem} {...(rest as React.ComponentProps<typeof motion.div>)}>
      {children}
    </Tag>
  )
}

export interface AnimatedNumberProps {
  value: number
  /** Seconds. Defaults to a deliberate, readable count. */
  duration?: number
  /** Start counting when scrolled into view rather than on mount. */
  countOnView?: boolean
  /** Turn the running number into display text. Defaults to a rounded integer. */
  format?: (value: number) => string
  className?: string
}

/**
 * Counts from its previous value to the new one without re-rendering.
 *
 * The number lives in a motion value and is written straight to the DOM node,
 * so a dashboard full of these costs one render, not sixty per second per tile.
 */
export function AnimatedNumber({
  value,
  duration = 1.1,
  countOnView = true,
  format = (v) => Math.round(v).toLocaleString(),
  className,
}: AnimatedNumberProps) {
  const enabled = useMotionEnabled()
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInViewSafe(ref, '0px 0px -40px 0px')
  const count = useMotionValue(0)
  const text = useTransform(count, (v) => format(v))
  const started = React.useRef(false)

  React.useEffect(() => {
    if (!enabled) return
    if (countOnView && !inView) return
    // First arrival counts up from zero; later changes animate from wherever
    // the value currently is, so a live-updating figure ticks rather than resets.
    const from = started.current ? count.get() : 0
    started.current = true
    count.set(from)
    const controls = animate(count, value, { duration, ease: EASE })
    return () => controls.stop()
  }, [value, duration, countOnView, inView, enabled, count])

  if (!enabled) return <span className={className}>{format(value)}</span>

  return (
    <span ref={ref} className={cn(className)}>
      <motion.span>{text}</motion.span>
    </span>
  )
}
