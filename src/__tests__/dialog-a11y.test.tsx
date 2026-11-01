/**
 * Dialog semantics the CMS used to bolt on locally and now get from the
 * library: focus lands inside, Tab stays inside, Escape closes (unless the
 * dialog says not to), focus returns to the opener.
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { ConfirmDialog } from '../primitives/ConfirmDialog.js'
import { Modal } from '../primitives/Overlay.js'
import { AmUiProvider } from '../provider.js'

const noMotion = { motion: { enabled: false } }

/**
 * The focus trap skips controls whose offsetParent is null — how a browser
 * marks a hidden element. jsdom has no layout and reports null for everything,
 * which would make every control look hidden. Report the parent instead.
 */
const realOffsetParent = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetParent')
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
    configurable: true,
    get(this: HTMLElement) {
      return this.parentNode
    },
  })
})
afterAll(() => {
  if (realOffsetParent) Object.defineProperty(HTMLElement.prototype, 'offsetParent', realOffsetParent)
})

function ConfirmHarness({ loading = false }: { loading?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <AmUiProvider theme={noMotion}>
      <button onClick={() => setOpen(true)}>Open</button>
      <ConfirmDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="Delete page?"
        message="Gone for good."
        confirmText="Delete"
        isLoading={loading}
      />
    </AmUiProvider>
  )
}

describe('ConfirmDialog — dialog semantics', () => {
  it('is an alertdialog labelled by its title, with focus on Cancel', async () => {
    const user = userEvent.setup()
    render(<ConfirmHarness />)
    await user.click(screen.getByText('Open'))
    const dialog = screen.getByRole('alertdialog', { name: 'Delete page?' })
    expect(dialog).toHaveAccessibleDescription('Gone for good.')
    await waitFor(() => expect(screen.getByText('Cancel')).toHaveFocus())
  })

  it('traps Tab inside and returns focus to the opener on close', async () => {
    const user = userEvent.setup()
    render(<ConfirmHarness />)
    const opener = screen.getByText('Open')
    await user.click(opener)
    await waitFor(() => expect(screen.getByText('Cancel')).toHaveFocus())
    await user.tab()
    expect(screen.getByText('Delete')).toHaveFocus()
    await user.tab()
    expect(screen.getByText('Cancel')).toHaveFocus()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    expect(opener).toHaveFocus()
  })

  it('ignores Escape while loading', async () => {
    const user = userEvent.setup()
    render(<ConfirmHarness loading />)
    await user.click(screen.getByText('Open'))
    await user.keyboard('{Escape}')
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })
})

describe('Modal — focus trap', () => {
  it('keeps Tab inside the panel and hands focus back on close', async () => {
    const user = userEvent.setup()
    function Harness() {
      const [open, setOpen] = useState(false)
      return (
        <AmUiProvider theme={noMotion}>
          <button onClick={() => setOpen(true)}>Open</button>
          <Modal open={open} onClose={() => setOpen(false)} title="Rename">
            <input aria-label="Name" />
            <button>Save</button>
          </Modal>
        </AmUiProvider>
      )
    }
    render(<Harness />)
    const opener = screen.getByText('Open')
    await user.click(opener)
    const dialog = screen.getByRole('dialog')
    // Focus lands on the panel (tabIndex -1) inside the dialog wrapper.
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true))
    await user.tab()
    await user.tab()
    await user.tab()
    await user.tab() // past the last control → wraps to the first (the header ×)
    expect(dialog.contains(document.activeElement)).toBe(true)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(opener).toHaveFocus()
  })

  it('is named by its title and described by its description', () => {
    render(
      <AmUiProvider theme={noMotion}>
        <Modal open onClose={() => {}} title="What’s New" description="Since your last visit" />
      </AmUiProvider>,
    )
    const dialog = screen.getByRole('dialog', { name: 'What’s New' })
    expect(dialog).toHaveAccessibleDescription('Since your last visit')
  })

  it('accepts a className on the panel', async () => {
    const onClose = vi.fn()
    render(
      <AmUiProvider theme={noMotion}>
        <Modal open onClose={onClose} title="Styled" className="bg-canvas" />
      </AmUiProvider>,
    )
    expect(screen.getByRole('dialog').querySelector('.bg-canvas')).not.toBeNull()
  })
})

describe('stacked dialogs', () => {
  it('lets only the topmost dialog answer Escape and Tab', async () => {
    const user = userEvent.setup()
    function Harness() {
      const [outer, setOuter] = useState(false)
      const [inner, setInner] = useState(false)
      return (
        <AmUiProvider theme={noMotion}>
          <button onClick={() => setOuter(true)}>Open outer</button>
          <Modal open={outer} onClose={() => setOuter(false)} title="Settings">
            <button onClick={() => setInner(true)}>Pick image</button>
          </Modal>
          <Modal open={inner} onClose={() => setInner(false)} title="Media">
            <button>First</button>
            <button>Second</button>
          </Modal>
        </AmUiProvider>
      )
    }
    render(<Harness />)
    await user.click(screen.getByText('Open outer'))
    await user.click(screen.getByText('Pick image'))
    const media = screen.getByRole('dialog', { name: 'Media' })
    await user.tab()
    await user.tab()
    await user.tab()
    await user.tab()
    expect(media.contains(document.activeElement)).toBe(true)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Media' })).not.toBeInTheDocument())
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Settings' })).not.toBeInTheDocument())
  })
})

describe('autoFocus inside a dialog', () => {
  it('keeps focus on the autoFocus field and restores it to the opener on close', async () => {
    const user = userEvent.setup()
    function Harness() {
      const [open, setOpen] = useState(false)
      return (
        <AmUiProvider theme={noMotion}>
          <button onClick={() => setOpen(true)}>Reset password</button>
          <Modal open={open} onClose={() => setOpen(false)} title="Reset password">
            {/* eslint-disable-next-line jsx-a11y/no-autofocus -- the behaviour under test */}
            <input aria-label="New password" autoFocus />
          </Modal>
        </AmUiProvider>
      )
    }
    render(<Harness />)
    const opener = screen.getByText('Reset password')
    await user.click(opener)
    await waitFor(() => expect(screen.getByLabelText('New password')).toHaveFocus())
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(opener).toHaveFocus()
  })
})

describe('dismissible={false}', () => {
  it('ignores Escape and the scrim, and disables the header close', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <AmUiProvider theme={noMotion}>
        <Modal open onClose={onClose} title="Saving" dismissible={false}>
          <button>Inside</button>
        </Modal>
      </AmUiProvider>,
    )
    await user.keyboard('{Escape}')
    const scrim = screen.getByRole('dialog').firstElementChild as HTMLElement
    await user.click(scrim)
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled()
  })
})
