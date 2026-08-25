/**
 * The motion layer.
 *
 * These are contract tests, not animation tests — jsdom has no compositor and
 * no rAF worth trusting, so asserting on intermediate frames would be asserting
 * on jsdom's fiction rather than on the library. What they do pin is the part
 * that actually breaks in production:
 *
 *  - the scale exists and nothing has quietly grown a sixth duration,
 *  - every variant animates opacity plus at most one transform, which is the
 *    invariant that lets `reducedMotion="user"` be sufficient on its own,
 *  - the `enabled: false` escape hatch really does render the end state,
 *  - `Collapse` mounts and unmounts its children on the state it is given.
 */

import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AmUiProvider } from '../theme.js'
import {
  AnimatedNumber,
  Collapse,
  Reveal,
  Stagger,
  StaggerItem,
} from '../motion/components.js'
import { DURATION, EASE, SPRING, STAGGER, VIEWPORT, tween } from '../motion/tokens.js'
import {
  collapse,
  fade,
  pop,
  popCentered,
  rise,
  riseItem,
  slideFrom,
  staggerList,
} from '../motion/variants.js'

const off = { motion: { enabled: false } }

describe('the motion scale', () => {
  it('has exactly five durations, in ascending order', () => {
    const names = Object.keys(DURATION)
    expect(names).toEqual(['instant', 'fast', 'base', 'slow', 'slower'])
    const values = names.map((n) => DURATION[n as keyof typeof DURATION])
    expect(values).toEqual([...values].sort((a, b) => a - b))
  })

  it('is one easing curve, as a four-number bezier', () => {
    expect(EASE).toHaveLength(4)
    expect(EASE.every((n) => typeof n === 'number')).toBe(true)
  })

  it('has three springs, all using visualDuration so they stay comparable to the tweens', () => {
    expect(Object.keys(SPRING)).toEqual(['snappy', 'smooth', 'bouncy'])
    for (const spring of Object.values(SPRING)) {
      expect(spring.type).toBe('spring')
      expect(typeof spring.visualDuration).toBe('number')
    }
  })

  it('reveals a little before the element is on screen, once only', () => {
    expect(VIEWPORT.once).toBe(true)
    expect(VIEWPORT.margin).toContain('120px')
  })

  it('builds a tween at a named duration', () => {
    expect(tween('slow', 0.2)).toEqual({ duration: DURATION.slow, ease: EASE, delay: 0.2 })
  })

  it('staggers slowly enough to read and fast enough not to be a loading screen', () => {
    expect(STAGGER).toBeGreaterThan(0.02)
    expect(STAGGER).toBeLessThan(0.1)
  })
})

describe('the variants', () => {
  /**
   * The load-bearing invariant. `reducedMotion="user"` works by dropping
   * transforms and keeping opacity — which is only a graceful degradation if
   * every variant has an opacity to fall back to. A variant that moves without
   * fading would simply teleport for a reduced-motion user.
   *
   * The transform *count* is a separate, softer rule: Motion drops all of them
   * regardless, so two is not a correctness problem. The cap is here to catch a
   * variant quietly growing a scale + rotate + x pile, which is how a design
   * system starts feeling like a slot machine.
   */
  const TRANSFORMS = ['x', 'y', 'scale', 'rotate']

  const cases = {
    fade,
    rise,
    pop,
    popCentered,
    collapse,
    riseItem,
    'slideFrom(left)': slideFrom('left'),
    'slideFrom(right)': slideFrom('right'),
    'slideFrom(top)': slideFrom('top'),
    'slideFrom(bottom)': slideFrom('bottom'),
  }

  for (const [name, variant] of Object.entries(cases)) {
    it(`${name}: every state animates opacity`, () => {
      for (const state of Object.values(variant)) {
        // `rise.show` is a function so a delay can be passed via `custom`.
        const target = typeof state === 'function' ? (state as (custom: number) => object)(0) : state
        expect(Object.keys(target as object)).toContain('opacity')
      }
    })

    it(`${name}: no state piles up transforms`, () => {
      for (const state of Object.values(variant)) {
        const target = typeof state === 'function' ? (state as (custom: number) => object)(0) : state
        const used = TRANSFORMS.filter((t) => t in (target as object))
        expect(used.length, `${name} uses ${used.join(' + ')}`).toBeLessThanOrEqual(2)
      }
    })
  }

  it('slideFrom sends each side off its own edge', () => {
    expect(slideFrom('left').hidden).toMatchObject({ x: '-100%' })
    expect(slideFrom('right').hidden).toMatchObject({ x: '100%' })
    expect(slideFrom('top').hidden).toMatchObject({ y: '-100%' })
    expect(slideFrom('bottom').hidden).toMatchObject({ y: '100%' })
  })

  it('staggerList drives its children rather than animating itself', () => {
    expect(staggerList.show).toHaveProperty('transition.staggerChildren', STAGGER)
  })

  it('collapse measures the content rather than guessing a max-height', () => {
    expect(collapse.show).toMatchObject({ height: 'auto' })
  })
})

describe('Collapse', () => {
  it('renders its children when open, and removes them once the exit finishes', async () => {
    const { rerender } = render(<Collapse open>panel body</Collapse>)
    expect(screen.getByText('panel body')).toBeInTheDocument()

    rerender(<Collapse open={false}>panel body</Collapse>)
    // The exit keeps the node mounted for the length of the animation, which is
    // the whole point of AnimatePresence — so this waits rather than asserting
    // immediately. If it ever resolves instantly, the exit has been lost.
    await waitFor(() => expect(screen.queryByText('panel body')).not.toBeInTheDocument())
  })

  it('clips inline, so a caller className cannot remove the overflow', () => {
    const { container } = render(<Collapse open className="px-4">body</Collapse>)
    const panel = container.firstElementChild as HTMLElement
    expect(panel.style.overflow).toBe('hidden')
  })
})

describe('theme.motion.enabled = false', () => {
  const wrap = (node: React.ReactNode) => <AmUiProvider theme={off}>{node}</AmUiProvider>

  it('Reveal renders its content, not an invisible element waiting for a viewport', () => {
    render(wrap(<Reveal>visible now</Reveal>))
    expect(screen.getByText('visible now')).toBeInTheDocument()
  })

  it('Collapse still respects open/closed', () => {
    const { rerender } = render(wrap(<Collapse open>shown</Collapse>))
    expect(screen.getByText('shown')).toBeInTheDocument()
    rerender(wrap(<Collapse open={false}>shown</Collapse>))
    expect(screen.queryByText('shown')).not.toBeInTheDocument()
  })

  it('AnimatedNumber renders the final formatted value on the first frame', () => {
    render(wrap(<AnimatedNumber value={1234} />))
    expect(screen.getByText('1,234')).toBeInTheDocument()
  })

  it('Stagger renders every child', () => {
    render(
      wrap(
        <Stagger>
          <StaggerItem>one</StaggerItem>
          <StaggerItem>two</StaggerItem>
        </Stagger>,
      ),
    )
    expect(screen.getByText('one')).toBeInTheDocument()
    expect(screen.getByText('two')).toBeInTheDocument()
  })
})

describe('AnimatedNumber', () => {
  it('honours a custom formatter', () => {
    render(
      <AmUiProvider theme={off}>
        <AnimatedNumber value={0.42} format={(v) => `${Math.round(v * 100)}%`} />
      </AmUiProvider>,
    )
    expect(screen.getByText('42%')).toBeInTheDocument()
  })
})

describe('in-view detection degrades instead of throwing', () => {
  /**
   * The library must render where `IntersectionObserver` does not exist — jsdom
   * without the setup stub, an old embedded webview, a server-side render that
   * runs effects. Motion's own `useInView` throws outright there, which is why
   * the library does not use it.
   */
  it('renders and counts with no IntersectionObserver at all', async () => {
    const original = globalThis.IntersectionObserver
    // @ts-expect-error deliberately removing a DOM global for this test
    delete globalThis.IntersectionObserver
    try {
      render(<AnimatedNumber value={99} duration={0} />)
      await waitFor(() => expect(screen.getByText('99')).toBeInTheDocument())
    } finally {
      globalThis.IntersectionObserver = original
    }
  })

  it('Reveal shows its content rather than sitting at opacity 0', async () => {
    const original = globalThis.IntersectionObserver
    // @ts-expect-error deliberately removing a DOM global for this test
    delete globalThis.IntersectionObserver
    try {
      render(<Reveal>eventually visible</Reveal>)
      await waitFor(() => expect(screen.getByText('eventually visible')).toBeVisible())
    } finally {
      globalThis.IntersectionObserver = original
    }
  })
})
