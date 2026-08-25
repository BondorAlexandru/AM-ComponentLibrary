/**
 * The overlays animate out, which means they outlive `open === false` by a
 * couple of hundred milliseconds. That is the whole risk of the change: every
 * side effect an overlay owns — the scroll lock, the key listeners, returning
 * focus — has to be tied to the *state* flip, not to unmount, or the user is
 * locked out of the page for the length of the exit.
 *
 * These pin that, plus the two things that would silently turn the exit back
 * into a jump-cut: AnimatePresence staying mounted across the close, and a
 * closed-on-first-render overlay still rendering nothing at all.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Drawer, Modal } from '../primitives/Overlay.js'
import { ConfirmDialog } from '../primitives/ConfirmDialog.js'
import { Menu } from '../primitives/Menu.js'

describe('Modal — exit', () => {
  it('releases the scroll lock on close, not on unmount', async () => {
    const { rerender } = render(<Modal open onClose={vi.fn()} title="Hi" />)
    expect(document.body.style.overflow).toBe('hidden')

    rerender(<Modal open={false} onClose={vi.fn()} title="Hi" />)
    // Still on screen — the exit is running — but the page already scrolls.
    expect(screen.queryByRole('dialog')).not.toBeNull()
    expect(document.body.style.overflow).not.toBe('hidden')

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })

  it('renders nothing when it was never open', () => {
    render(<Modal open={false} onClose={vi.fn()} title="Hi" />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})

describe('Drawer — exit', () => {
  it('stays mounted through the exit, then goes', async () => {
    const props = { onClose: vi.fn(), children: 'body' }
    const { rerender } = render(<Drawer open {...props} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    rerender(<Drawer open={false} {...props} />)
    expect(screen.queryByRole('dialog')).not.toBeNull()
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })
})

describe('ConfirmDialog — exit', () => {
  it('stays mounted through the exit, then goes', async () => {
    const props = { onClose: vi.fn(), onConfirm: vi.fn(), title: 'Delete?', message: 'Gone for good.' }
    const { rerender } = render(<ConfirmDialog isOpen {...props} />)
    expect(screen.getByText('Delete?')).toBeInTheDocument()

    rerender(<ConfirmDialog isOpen={false} {...props} />)
    expect(screen.queryByText('Delete?')).not.toBeNull()
    await waitFor(() => expect(screen.queryByText('Delete?')).toBeNull())
  })
})

describe('Menu — exit does not resurrect the measure-then-show trick', () => {
  it('is placed and visible while open, and unmounts after the exit', async () => {
    const user = userEvent.setup()
    render(<Menu items={[{ label: 'Rename', onClick: vi.fn() }]} />)

    await user.click(screen.getByLabelText('More actions'))
    const panel = await screen.findByRole('menu')
    // `place()` runs before the open render, so the panel is never revealed at
    // the -9999 parking position.
    expect(panel.style.visibility).toBe('visible')
    expect(panel.style.top).not.toBe('-9999px')

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  })
})
