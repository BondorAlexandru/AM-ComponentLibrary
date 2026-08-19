/**
 * The three customisation layers, and the rule that they stack in a fixed order:
 * tokens < theme < call site. If any of these break, "configure it however you
 * like" stops being true and the only remaining option is forking a component.
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AmUiProvider } from '../theme.js'
import { Button, IconButton, buttonVariants } from '../primitives/Button.js'
import { Card } from '../primitives/Card.js'
import { Badge } from '../primitives/Badge.js'
import { cn } from '../lib/cn.js'

function classes(el: Element) {
  return el.className.split(/\s+/).filter(Boolean)
}

describe('cn — tailwind-merge makes className an override, not a suggestion', () => {
  it('drops the earlier of two conflicting utilities', () => {
    expect(cn('h-[34px]', 'h-12')).toBe('h-12')
    expect(cn('rounded-[8px]', 'rounded-full')).toBe('rounded-full')
    expect(cn('px-4 py-2', 'px-8')).toBe('py-2 px-8')
  })

  it('keeps utilities that only look similar', () => {
    // Different modifier, different property — both must survive.
    expect(cn('p-4 md:p-6')).toBe('p-4 md:p-6')
    expect(cn('text-ink', 'text-[13px]')).toBe('text-ink text-[13px]')
  })

  it('still handles the clsx argument shapes', () => {
    expect(cn('a', false && 'b', ['c'], { d: true, e: false })).toBe('a c d')
  })
})

describe('call-site className beats the component', () => {
  it('replaces the button height rather than sitting beside it', () => {
    render(<Button className="h-12" data-testid="b">Go</Button>)
    const c = classes(screen.getByTestId('b'))
    expect(c).toContain('h-12')
    expect(c).not.toContain('h-[var(--am-h-control-md,34px)]')
  })

  it('replaces the card radius', () => {
    const { container } = render(<Card className="rounded-none">x</Card>)
    const c = classes(container.firstElementChild as Element)
    expect(c).toContain('rounded-none')
    expect(c).not.toContain('rounded-[var(--am-radius-card,var(--radius-card,12px))]')
  })

  it('replaces a badge radius', () => {
    render(<Badge className="rounded-full">New</Badge>)
    const c = classes(screen.getByText('New'))
    expect(c).toContain('rounded-full')
    expect(c).not.toContain('rounded-[var(--am-radius-chip,6px)]')
  })
})

describe('theme — per-component defaults and classes', () => {
  it('applies defaultProps when the call site says nothing', () => {
    render(
      <AmUiProvider theme={{ components: { Button: { defaultProps: { variant: 'secondary' } } } }}>
        <Button data-testid="b">Go</Button>
      </AmUiProvider>,
    )
    const c = classes(screen.getByTestId('b'))
    expect(c).toContain('border-line')          // secondary
    expect(c).not.toContain('bg-accent')        // not the primary default
  })

  it('lets the call site beat the theme default', () => {
    render(
      <AmUiProvider theme={{ components: { Button: { defaultProps: { variant: 'secondary' } } } }}>
        <Button variant="primary" data-testid="b">Go</Button>
      </AmUiProvider>,
    )
    expect(classes(screen.getByTestId('b'))).toContain('bg-accent')
  })

  it('an explicitly undefined prop does not clobber the theme default', () => {
    const maybe = undefined
    render(
      <AmUiProvider theme={{ components: { Button: { defaultProps: { variant: 'secondary' } } } }}>
        <Button variant={maybe} data-testid="b">Go</Button>
      </AmUiProvider>,
    )
    expect(classes(screen.getByTestId('b'))).toContain('border-line')
  })

  it('merges theme classes into every instance', () => {
    render(
      <AmUiProvider theme={{ components: { Button: { className: 'uppercase tracking-wide' } } }}>
        <Button data-testid="b">Go</Button>
      </AmUiProvider>,
    )
    expect(classes(screen.getByTestId('b'))).toEqual(expect.arrayContaining(['uppercase', 'tracking-wide']))
  })

  it('call-site className still wins over a conflicting theme class', () => {
    render(
      <AmUiProvider theme={{ components: { Button: { className: 'rounded-full' } } }}>
        <Button className="rounded-none" data-testid="b">Go</Button>
      </AmUiProvider>,
    )
    const c = classes(screen.getByTestId('b'))
    expect(c).toContain('rounded-none')
    expect(c).not.toContain('rounded-full')
  })

  it('configures IconButton independently of Button', () => {
    render(
      <AmUiProvider theme={{ components: { IconButton: { defaultProps: { variant: 'secondary' } } } }}>
        <IconButton aria-label="Act" icon={<svg />} />
        <Button data-testid="b">Go</Button>
      </AmUiProvider>,
    )
    expect(classes(screen.getByLabelText('Act'))).toContain('border-line')
    expect(classes(screen.getByTestId('b'))).toContain('bg-accent')
  })

  it('renders unchanged with no provider at all', () => {
    render(<Button data-testid="b">Go</Button>)
    const c = classes(screen.getByTestId('b'))
    expect(c).toContain('bg-accent')
    expect(c).toContain('h-[var(--am-h-control-md,34px)]')
  })
})

describe('asChild — render as something else, keep the styling', () => {
  it('renders the child element instead of a button', () => {
    render(
      <Button asChild>
        <a href="/somewhere" data-testid="link">Go</a>
      </Button>,
    )
    const el = screen.getByTestId('link')
    expect(el.tagName).toBe('A')
    expect(el).toHaveAttribute('href', '/somewhere')
    expect(classes(el)).toContain('bg-accent')
  })

  it('chains handlers rather than swallowing the child’s', async () => {
    const user = userEvent.setup()
    const ours = vi.fn()
    const theirs = vi.fn()
    render(
      <Button asChild onClick={ours}>
        <a href="#x" onClick={theirs} data-testid="link">Go</a>
      </Button>,
    )
    await user.click(screen.getByTestId('link'))
    expect(ours).toHaveBeenCalledOnce()
    expect(theirs).toHaveBeenCalledOnce()
  })

  it('lets the child’s className win a conflict', () => {
    render(
      <Button asChild>
        <a href="#x" className="rounded-none" data-testid="link">Go</a>
      </Button>,
    )
    const c = classes(screen.getByTestId('link'))
    expect(c).toContain('rounded-none')
    expect(c).not.toContain('rounded-[var(--am-radius-control,8px)]')
  })
})

describe('exported variants — compose instead of forking', () => {
  it('buttonVariants produces the same classes the component uses', () => {
    render(<Button variant="danger" size="lg" data-testid="b">Go</Button>)
    const fromFn = buttonVariants({ variant: 'danger', size: 'lg' }).split(/\s+/).filter(Boolean)
    const fromEl = classes(screen.getByTestId('b'))
    for (const c of fromFn) expect(fromEl).toContain(c)
  })

  it('can be composed into a custom component', () => {
    function PillButton({ children }: { children: React.ReactNode }) {
      return <button className={cn(buttonVariants({ variant: 'primary' }), 'rounded-full px-6')}>{children}</button>
    }
    render(<PillButton>Custom</PillButton>)
    const c = classes(screen.getByText('Custom'))
    expect(c).toContain('bg-accent')
    expect(c).toContain('rounded-full')
    expect(c).toContain('px-6')
    expect(c).not.toContain('px-4')
  })
})
