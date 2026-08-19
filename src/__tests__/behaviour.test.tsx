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
