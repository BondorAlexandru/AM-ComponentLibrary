/**
 * Behaviour the apps depend on: the bits that would silently break a flow
 * rather than merely look wrong.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../primitives/Button.js'
import { Menu } from '../primitives/Menu.js'
import { Dropdown } from '../primitives/Dropdown.js'
import { Modal } from '../primitives/Overlay.js'
import { Popover, MenuItem } from '../primitives/Popover.js'
import { isVideoUrl } from '../primitives/MediaThumb.js'
import { AmUiProvider } from '../provider.js'
import { cn } from '../lib/cn.js'
import { formatBytes, formatNumber } from '../lib/format.js'
import { ProgressBar, SegmentedBar } from '../primitives/Metrics.js'
import { SegmentedControl, Tabs } from '../primitives/Tabs.js'
import { Stepper } from '../primitives/Stepper.js'

describe('Button', () => {
  it('swaps children for the spinner and disables itself while loading', () => {
    render(<Button loading>Save</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders the app-supplied spinner, not the fallback ring', () => {
    const BrandSpinner = () => <span data-testid="brand-spinner" role="status" />
    render(
      <AmUiProvider spinner={BrandSpinner}>
        <Button loading>Save</Button>
      </AmUiProvider>,
    )
    expect(screen.getByTestId('brand-spinner')).toBeInTheDocument()
  })

  it('hides leftIcon/rightIcon while loading', () => {
    render(
      <Button loading leftIcon={<span data-testid="left" />} rightIcon={<span data-testid="right" />}>
        Save
      </Button>,
    )
    expect(screen.queryByTestId('left')).toBeNull()
    expect(screen.queryByTestId('right')).toBeNull()
  })
})

describe('Menu', () => {
  const items = [
    { label: 'Rename', onClick: vi.fn() },
    { label: 'Delete', onClick: vi.fn(), variant: 'danger' as const },
  ]

  it('opens on click, fires the item, and closes', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Menu items={[{ label: 'Rename', onClick }]} />)

    await user.click(screen.getByLabelText('More actions'))
    await user.click(await screen.findByRole('menuitem', { name: 'Rename' }))

    expect(onClick).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('menuitem')).toBeNull())
  })

  it('closes on Escape without firing anything', async () => {
    const user = userEvent.setup()
    render(<Menu items={items} />)
    await user.click(screen.getByLabelText('More actions'))
    expect(await screen.findByRole('menu')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    expect(items[0].onClick).not.toHaveBeenCalled()
  })

  it('marks the trigger with aria-expanded', async () => {
    const user = userEvent.setup()
    render(<Menu items={items} />)
    const trigger = screen.getByLabelText('More actions')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })
})

describe('Dropdown', () => {
  it('parses <option> children and reports the value like a native select', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Dropdown value="a" onChange={onChange} aria-label="Pick">
        <option value="a">Alpha</option>
        <option value="b">Beta</option>
      </Dropdown>,
    )

    await user.click(screen.getByLabelText('Pick', { selector: 'button' }))
    await user.click(await screen.findByRole('option', { name: 'Beta' }))

    // Existing `(e) => e.target.value` handlers must keep working.
    expect(onChange).toHaveBeenCalledWith({ target: { value: 'b' } })
  })

  it('shows the placeholder when nothing matches the value', () => {
    render(
      <Dropdown value={undefined} onChange={vi.fn()} placeholder="Choose one" aria-label="Pick">
        <option value="a">Alpha</option>
      </Dropdown>,
    )
    expect(screen.getByText('Choose one')).toBeInTheDocument()
  })

  it('opens with the keyboard and marks the selected option', async () => {
    const user = userEvent.setup()
    render(
      <Dropdown value="b" onChange={vi.fn()} aria-label="Pick">
        <option value="a">Alpha</option>
        <option value="b">Beta</option>
      </Dropdown>,
    )
    screen.getByLabelText('Pick', { selector: 'button' }).focus()
    await user.keyboard('{ArrowDown}')
    expect(await screen.findByRole('option', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true')
  })
})

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(<Modal open={false} onClose={vi.fn()} title="Hi" />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('closes on Escape and restores body scroll on unmount', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { unmount } = render(<Modal open onClose={onClose} title="Hi" />)

    expect(document.body.style.overflow).toBe('hidden')
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()

    unmount()
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('closes from the header close button', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Modal open onClose={onClose} title="Hi" />)
    await user.click(screen.getByLabelText('Close'))
    expect(onClose).toHaveBeenCalledOnce()
  })
})

describe('Popover', () => {
  it('gives the caller a close function that actually closes', async () => {
    const user = userEvent.setup()
    render(
      <Popover trigger={({ toggle }) => <button onClick={toggle}>Open</button>}>
        {(close) => <MenuItem onClick={close}>Done</MenuItem>}
      </Popover>,
    )
    await user.click(screen.getByText('Open'))
    await user.click(screen.getByText('Done'))
    await waitFor(() => expect(screen.queryByText('Done')).toBeNull())
  })
})

describe('isVideoUrl', () => {
  it.each([
    ['https://cdn.example.com/clip.mp4', true],
    ['https://cdn.example.com/clip.mp4?v=2', true],
    ['https://cdn.example.com/clip.mp4#t=0.1', true],
    ['https://cdn.example.com/photo.jpg', false],
    ['https://cdn.example.com/no-extension', false],
    ['https://cdn.example.com/dir.mp4/file', false],
    [null, false],
  ])('%s → %s', (url, expected) => {
    expect(isVideoUrl(url as string | null)).toBe(expected)
  })
})

describe('cn', () => {
  it('matches the clsx shapes the apps use', () => {
    expect(cn('a', false && 'b', ['c', ['d']], { e: true, f: false }, null, undefined)).toBe('a c d e')
  })
})

describe('ProgressBar', () => {
  it('reports its value to assistive tech and clamps out-of-range input', () => {
    const { rerender } = render(<ProgressBar value={42} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42')

    rerender(<ProgressBar value={-10} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')

    rerender(<ProgressBar value={250} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('scales to a custom max', () => {
    render(<ProgressBar value={5} max={20} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25')
  })

  it('survives max={0} instead of dividing by zero', () => {
    render(<ProgressBar value={5} max={0} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })
})

describe('SegmentedBar', () => {
  it('sizes each segment against the total, skipping empty ones', () => {
    const { container } = render(
      <SegmentedBar
        segments={[
          { key: 'a', value: 3, label: 'A' },
          { key: 'b', value: 1, label: 'B' },
          { key: 'c', value: 0, label: 'C' },
        ]}
      />,
    )
    const parts = container.querySelectorAll('button')
    expect(parts).toHaveLength(2)
    expect((parts[0] as HTMLElement).style.width).toBe('75%')
    expect((parts[1] as HTMLElement).style.width).toBe('25%')
  })

  it('renders nothing when every segment is zero', () => {
    const { container } = render(<SegmentedBar segments={[{ key: 'a', value: 0 }]} />)
    expect(container.querySelectorAll('button')).toHaveLength(0)
  })

  it('only makes a segment interactive when it has an onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <SegmentedBar
        segments={[
          { key: 'a', value: 1, label: 'Clickable', onClick },
          { key: 'b', value: 1, label: 'Inert' },
        ]}
      />,
    )
    expect(screen.getByLabelText('Inert')).toBeDisabled()
    await user.click(screen.getByLabelText('Clickable'))
    expect(onClick).toHaveBeenCalledOnce()
  })
})

describe('Tabs', () => {
  const items = [
    { id: 'a' as const, label: 'Overview' },
    { id: 'b' as const, label: 'Traffic' },
    { id: 'c' as const, label: 'Locked', disabled: true },
  ]

  it('marks the active tab and reports the chosen id', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tabs items={items} value="a" onChange={onChange} aria-label="Sections" />)

    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Traffic' })).toHaveAttribute('aria-selected', 'false')

    await user.click(screen.getByRole('tab', { name: 'Traffic' }))
    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('does not fire for a disabled tab', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Tabs items={items} value="a" onChange={onChange} />)
    await user.click(screen.getByRole('tab', { name: 'Locked' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('exposes a tablist for assistive tech', () => {
    render(<Tabs items={items} value="a" onChange={vi.fn()} aria-label="Sections" />)
    expect(screen.getByRole('tablist', { name: 'Sections' })).toBeInTheDocument()
  })
})

describe('SegmentedControl', () => {
  it('behaves like Tabs but renders pills', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <SegmentedControl
        items={[{ id: 'x' as const, label: 'Feedback' }, { id: 'y' as const, label: 'Activity' }]}
        value="x"
        onChange={onChange}
      />,
    )
    expect(screen.getByRole('tab', { name: 'Feedback' })).toHaveAttribute('aria-selected', 'true')
    await user.click(screen.getByRole('tab', { name: 'Activity' }))
    expect(onChange).toHaveBeenCalledWith('y')
  })
})

describe('Stepper', () => {
  const steps = [{ label: 'Method' }, { label: 'Details' }, { label: 'Review' }]

  it('lets you go back to a completed step but never forward', async () => {
    const user = userEvent.setup()
    const onGo = vi.fn()
    render(<Stepper steps={steps} current={1} onGo={onGo} />)

    await user.click(screen.getByText('Method'))
    expect(onGo).toHaveBeenCalledWith(0)

    onGo.mockClear()
    await user.click(screen.getByText('Review'))
    expect(onGo, 'a future step must not be reachable').not.toHaveBeenCalled()
  })

  it('is inert without onGo — even for completed steps', async () => {
    const user = userEvent.setup()
    render(<Stepper steps={steps} current={2} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.every((b) => (b as HTMLButtonElement).disabled)).toBe(true)
    await user.click(screen.getByText('Method'))
  })

  it('marks the active step with aria-current', () => {
    render(<Stepper steps={steps} current={1} />)
    const items = screen.getAllByRole('listitem')
    expect(items[1]).toHaveAttribute('aria-current', 'step')
    expect(items[0]).not.toHaveAttribute('aria-current')
  })
})

describe('formatNumber / formatBytes', () => {
  it.each([
    [0, '0'],
    [999, '999'],
    [1000, '1.0k'],
    [1234, '1.2k'],
    [12345, '12k'],
    [1_200_000, '1.2M'],
    [12_000_000, '12M'],
    [-1234, '-1.2k'],
  ])('formatNumber(%s) → %s', (n, expected) => {
    expect(formatNumber(n)).toBe(expected)
  })

  it('formatNumber survives NaN rather than printing it', () => {
    expect(formatNumber(NaN)).toBe('0')
  })

  it.each([
    [0, '0 B'],
    [512, '512 B'],
    [1536, '1.5 KB'],
    [1_048_576, '1.0 MB'],
  ])('formatBytes(%s) → %s', (n, expected) => {
    expect(formatBytes(n)).toBe(expected)
  })
})
