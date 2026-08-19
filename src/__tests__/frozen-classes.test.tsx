/**
 * The CMS-canonical primitives are consumed by a shipped app whose design must
 * not move. These tests pin the exact class strings for every variant/size the
 * CMS renders, so an "improvement" to a Tailwind class fails here rather than
 * in production.
 *
 * If a test in this file fails, the change is a CMS design change. That needs
 * a deliberate decision (and a CMS changelog entry) — not a passing test.
 */

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button, IconButton } from '../primitives/Button.js'
import { Badge, Status } from '../primitives/Badge.js'
import { Card } from '../primitives/Card.js'
import { EmptyState } from '../primitives/EmptyState.js'
import { BarList, Delta, EmptyHint, KpiCard, SectionCard } from '../primitives/Metrics.js'

/** Class attributes are multi-line template literals; compare as a set. */
function classesOf(el: Element): Set<string> {
  return new Set(el.className.split(/\s+/).filter(Boolean))
}
function expectClasses(el: Element, expected: string) {
  const actual = classesOf(el)
  for (const c of expected.split(/\s+/).filter(Boolean)) {
    expect(actual, `expected class "${c}"`).toContain(c)
  }
}

describe('Button — frozen CMS classes', () => {
  const FROZEN_VARIANTS: Record<string, string> = {
    primary: 'bg-accent text-on-accent hover:opacity-90 active:opacity-95',
    secondary: 'border border-line text-ink hover:bg-input',
    tertiary: 'bg-accent-soft text-accent-text hover:opacity-80',
    danger: 'bg-danger-accent text-on-danger hover:opacity-90 active:opacity-95',
    success: 'bg-ok text-on-ok hover:opacity-90 active:opacity-95',
    ghost: 'bg-input border border-hairline text-ink-2 hover:text-ink',
  }

  const FROZEN_SIZES: Record<string, string> = {
    sm: 'h-[28px] px-3 text-[12.5px]',
    md: 'h-[34px] px-4 text-[13px]',
    lg: 'h-[40px] px-5 text-[14px]',
  }

  it.each(Object.entries(FROZEN_VARIANTS))('variant %s is unchanged', (variant, expected) => {
    render(
      <Button variant={variant as 'primary'} data-testid="b">
        Go
      </Button>,
    )
    expectClasses(screen.getByTestId('b'), expected)
  })

  it.each(Object.entries(FROZEN_SIZES))('size %s is unchanged', (size, expected) => {
    render(
      <Button size={size as 'md'} data-testid="b">
        Go
      </Button>,
    )
    expectClasses(screen.getByTestId('b'), expected)
  })

  it('defaults to primary at md — the CMS default', () => {
    render(<Button data-testid="b">Go</Button>)
    expectClasses(screen.getByTestId('b'), `${FROZEN_VARIANTS.primary} ${FROZEN_SIZES.md}`)
  })

  it('keeps the 8px radius and the accent focus ring', () => {
    render(<Button data-testid="b">Go</Button>)
    expectClasses(
      screen.getByTestId('b'),
      'rounded-[8px] focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-canvas',
    )
  })
})

describe('IconButton — frozen CMS classes', () => {
  it.each([
    ['sm', 'h-[32px] w-[32px] text-sm'],
    ['md', 'h-[40px] w-[40px] text-base'],
    ['lg', 'h-[44px] w-[44px] text-lg'],
  ])('size %s is unchanged', (size, expected) => {
    render(<IconButton size={size as 'md'} aria-label="Act" icon={<svg />} />)
    expectClasses(screen.getByLabelText('Act'), expected)
  })

  it('defaults to a transparent ghost', () => {
    render(<IconButton aria-label="Act" icon={<svg />} />)
    expectClasses(screen.getByLabelText('Act'), 'bg-transparent text-ink-2 hover:bg-input hover:text-ink')
  })
})

describe('Badge / Status — frozen CMS classes', () => {
  it('primary chip keeps the 6px radius and soft accent fill', () => {
    render(<Badge variant="primary">New</Badge>)
    expectClasses(screen.getByText('New'), 'rounded-[6px] bg-accent-soft text-accent-text')
  })

  it('success chip is outline-only', () => {
    render(<Badge variant="success">Live</Badge>)
    expectClasses(screen.getByText('Live'), 'bg-transparent text-ok border-ok')
  })

  it('Status renders a dot in the semantic colour', () => {
    const { container } = render(<Status variant="danger">Failed</Status>)
    const dot = container.querySelector('span > span')
    expect(dot).not.toBeNull()
    expectClasses(dot as Element, 'bg-danger-accent rounded-full')
  })
})

describe('Card — frozen CMS classes', () => {
  it('keeps the 12px surface card with a hairline border', () => {
    const { container } = render(<Card>body</Card>)
    expectClasses(container.firstElementChild as Element, 'bg-surface rounded-[12px] border border-hairline')
  })
})

describe('EmptyState — chrome is additive', () => {
  it('draws the card by default (the CMS behaviour)', () => {
    const { container } = render(<EmptyState title="Nothing here" />)
    expectClasses(container.firstElementChild as Element, 'bg-surface rounded-[12px] border border-hairline')
  })

  it('drops the card when chrome is false', () => {
    const { container } = render(<EmptyState title="Nothing here" chrome={false} />)
    const classes = classesOf(container.firstElementChild as Element)
    expect(classes).not.toContain('bg-surface')
    expect(classes).not.toContain('border-hairline')
    // Layout is untouched.
    expect(classes).toContain('flex')
    expect(classes).toContain('py-12')
  })
})

describe('Metrics — frozen CMS classes', () => {
  it('Delta is ok when up, danger when down, ink-3 when flat', () => {
    const { container: up } = render(<Delta value={12} />)
    expectClasses(up.firstElementChild as Element, 'text-ok')
    const { container: down } = render(<Delta value={-4} />)
    expectClasses(down.firstElementChild as Element, 'text-danger-accent')
    const { container: flat } = render(<Delta value={0} />)
    expectClasses(flat.firstElementChild as Element, 'text-ink-3')
  })

  it('Delta shows the absolute value — the arrow carries the sign', () => {
    render(<Delta value={-17} />)
    expect(screen.getByText(/17%/)).toBeInTheDocument()
  })

  it('KpiCard keeps the display eyebrow and the 27px figure', () => {
    render(<KpiCard label="Sessions" value="12.4k" />)
    expectClasses(screen.getByText('Sessions'), 'font-display text-[12px] tracking-[1.4px] uppercase text-ink-3')
    expectClasses(screen.getByText('12.4k'), 'font-display text-[27px] leading-none text-ink')
  })

  it('BarList fills proportionally to the largest row, not to a total', () => {
    const { container } = render(
      <BarList title="Top pages" rows={[{ label: '/home', count: 50 }, { label: '/about', count: 25 }]} />,
    )
    const fills = container.querySelectorAll('.bg-accent-soft')
    expect((fills[0] as HTMLElement).style.width).toBe('100%')
    expect((fills[1] as HTMLElement).style.width).toBe('50%')
  })

  it('BarList formats counts and shows the empty text', () => {
    // 12_400 crosses the 10k threshold, where formatNumber drops the decimal.
    render(<BarList title="Top pages" rows={[{ label: '/home', count: 12400 }]} />)
    expect(screen.getByText('12k')).toBeInTheDocument()
    render(<BarList title="Under 10k" rows={[{ label: '/about', count: 9400 }]} />)
    expect(screen.getByText('9.4k')).toBeInTheDocument()
    render(<BarList title="Empty" rows={[]} emptyText="Nothing tracked yet" />)
    expect(screen.getByText('Nothing tracked yet')).toBeInTheDocument()
  })

  it('SectionCard switches between the eyebrow and heading treatments', () => {
    render(<SectionCard title="Eyebrow">x</SectionCard>)
    expectClasses(screen.getByText('Eyebrow'), 'font-display text-[12px] tracking-[1.4px] uppercase text-ink-3')
    render(<SectionCard title="Heading" variant="heading">x</SectionCard>)
    expectClasses(screen.getByText('Heading'), 'font-display text-sm font-semibold tracking-tight text-ink')
  })

  it('EmptyHint keeps its dashed inset panel', () => {
    const { container } = render(<EmptyHint>Nothing here</EmptyHint>)
    expectClasses(container.firstElementChild as Element, 'border-dashed border-hairline rounded-2xl bg-input')
  })
})
