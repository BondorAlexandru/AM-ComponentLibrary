import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { ToastContainer, useToast } from '../primitives/Toast.js'
import { Form } from '../primitives/Form.js'
import { SegmentedControl } from '../primitives/Tabs.js'
import { IconButton } from '../primitives/Button.js'
import { AmUiProvider } from '../provider.js'

const noMotion = { motion: { enabled: false } }

function ToastHarness({ duration }: { duration?: number }) {
  const t = useToast()
  return (
    <AmUiProvider theme={noMotion}>
      <button onClick={() => t.success('Saved', duration)}>Fire</button>
      <ToastContainer toasts={t.toasts} onClose={t.remove} />
    </AmUiProvider>
  )
}

describe('Toast', () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }))
  afterEach(() => vi.useRealTimers())

  it('enqueues, announces, and auto-dismisses', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<ToastHarness duration={1000} />)
    await user.click(screen.getByText('Fire'))
    expect(screen.getByRole('status')).toHaveTextContent('Saved')
    await act(async () => {
      vi.advanceTimersByTime(1100)
    })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('dismisses from the × before the timer', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<ToastHarness />)
    await user.click(screen.getByText('Fire'))
    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

describe('Form.Switch', () => {
  it('is a switch that reports the next value and wires its label', async () => {
    const user = userEvent.setup()
    function Harness() {
      const [on, setOn] = useState(false)
      return <Form.Switch checked={on} onChange={setOn} label="Chatbot enabled" />
    }
    render(<Harness />)
    const sw = screen.getByRole('switch', { name: 'Chatbot enabled' })
    expect(sw).toHaveAttribute('aria-checked', 'false')
    await user.click(sw)
    expect(sw).toHaveAttribute('aria-checked', 'true')
    await user.click(screen.getByText('Chatbot enabled'))
    expect(sw).toHaveAttribute('aria-checked', 'false')
  })

  it('does nothing while disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Form.Switch checked={false} onChange={onChange} aria-label="Enable" disabled />)
    await user.click(screen.getByRole('switch'))
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('SegmentedControl — boxed', () => {
  it('renders the CMS tray and tile classes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <AmUiProvider theme={noMotion}>
        <SegmentedControl
          variant="boxed"
          aria-label="Range"
          value="7"
          onChange={onChange}
          items={[{ id: '7', label: '7d' }, { id: '30', label: '30d' }]}
        />
      </AmUiProvider>,
    )
    const list = screen.getByRole('tablist', { name: 'Range' })
    expect(list.className).toContain('bg-input')
    expect(list.className).toContain('border-hairline')
    const active = screen.getByRole('tab', { name: '7d' })
    expect(active.className).toContain('bg-accent-soft')
    expect(active.className).toContain('text-accent-text')
    await user.click(screen.getByRole('tab', { name: '30d' }))
    expect(onChange).toHaveBeenCalledWith('30')
  })
})

describe('IconButton — bare/auto', () => {
  it('adds no box and the bare colours', () => {
    render(<IconButton variant="bare" size="auto" aria-label="Edit" icon={<svg />} />)
    const b = screen.getByRole('button', { name: 'Edit' })
    expect(b.className).toContain('text-ink-3')
    expect(b.className).not.toMatch(/h-\[var\(--am-h-icon/)
  })
})

describe('Button — link', () => {
  it('drops the size height and padding but keeps the font size', async () => {
    const { Button } = await import('../primitives/Button.js')
    render(<Button variant="link" size="sm">Show history</Button>)
    const b = screen.getByRole('button', { name: 'Show history' })
    expect(b.className).toContain('h-auto')
    expect(b.className).toContain('px-0')
    expect(b.className).not.toContain('h-[var(--am-h-control-sm,28px)]')
    expect(b.className).toContain('text-[length:var(--am-text-control-sm,12.5px)]')
  })
})

describe('library buttons never submit a surrounding form', () => {
  it('ConfirmDialog Cancel/Confirm and the Modal close button are type="button"', async () => {
    const user = userEvent.setup()
    const { ConfirmDialog } = await import('../primitives/ConfirmDialog.js')
    const { Modal } = await import('../primitives/Overlay.js')
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault())
    const onClose = vi.fn()
    render(
      <AmUiProvider theme={noMotion}>
        <form onSubmit={onSubmit}>
          <ConfirmDialog isOpen onClose={onClose} onConfirm={() => {}} title="Erase?" message="Gone." confirmText="Erase" />
        </form>
      </AmUiProvider>,
    )
    await user.click(screen.getByText('Cancel'))
    await user.click(screen.getByText('Erase'))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
    render(
      <AmUiProvider theme={noMotion}>
        <form onSubmit={onSubmit}>
          <Modal open onClose={onClose} title="In a form" />
        </form>
      </AmUiProvider>,
    )
    // Modal portals to body, so this also proves the close button is inert as a submitter.
    expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute('type', 'button')
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveAttribute('type', 'button')
  })
})
