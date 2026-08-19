import { useState } from 'react'
import {
  Button,
  ConfirmDialog,
  Drawer,
  Form,
  Menu,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  Modal,
  Popover,
} from '@am/ui'
import { Archive, Copy, Eye, MoreHorizontal, Pencil, Settings, Trash2, User } from '@am/ui/icons'
import type { DocEntry } from '../types.ts'

/**
 * Overlays are open/closed by definition, so each specimen is a real trigger.
 * A screenshot of an open modal would not show that Escape closes it or that
 * body scroll locks — the point of a live docs site is that you can check.
 */

function ModalDemo({ label, ...props }: { label: string } & Partial<Parameters<typeof Modal>[0]>) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>{label}</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={props.title ?? 'Rename campaign'}
        {...props}
      >
        {props.children ?? (
          <Form.Field>
            <Form.Label htmlFor="docs-rename">New name</Form.Label>
            <Form.TextInput id="docs-rename" defaultValue="Autumn skincare launch" />
          </Form.Field>
        )}
      </Modal>
    </>
  )
}

function DrawerDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} label="Creator record" width="max-w-[min(560px,94vw)]">
        <header className="border-hairline flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-ink text-[16px] font-semibold">Creator record</h2>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Close</Button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="text-ink-2 text-[13px] leading-relaxed">
            Drawer supplies no header of its own — it is a themed, animated, focus-trapping panel and
            nothing else, because the two apps put very different things at the top of one.
          </p>
        </div>
      </Drawer>
    </>
  )
}

function ConfirmDemo({ variant, loading }: { variant?: 'danger' | 'primary'; loading?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant={variant === 'primary' ? 'secondary' : 'danger'} size="sm" onClick={() => setOpen(true)}>
        {variant === 'primary' ? 'Confirm something' : 'Delete page'}
      </Button>
      <ConfirmDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title={variant === 'primary' ? 'Publish this page?' : 'Delete this page?'}
        message={
          variant === 'primary'
            ? 'It will go live immediately and appear in the site’s navigation.'
            : 'This removes the page and its content blocks. This cannot be undone.'
        }
        confirmText={variant === 'primary' ? 'Publish' : 'Delete'}
        confirmVariant={variant ?? 'danger'}
        isLoading={loading}
      />
    </>
  )
}

export const modalEntry: DocEntry = {
  id: 'modal',
  name: 'Modal & Drawer',
  group: 'Overlays',
  origin: 'campaigns',
  covers: ['Modal', 'Drawer'],
  requires: ['--radius-card', '--shadow-overlay'],
  imports: "import { Modal, Drawer } from '@am/ui'",
  summary:
    'Two portalled overlays sharing one behaviour hook: Escape closes, body scroll locks while open, focus lands inside, and the previous overflow value is restored on unmount. Modal centres and owns its header; Drawer slides in from the right and owns nothing but the panel.',
  props: [
    {
      title: 'Modal',
      rows: [
        { name: 'open', type: 'boolean', required: true, note: 'Returns null when false — nothing is mounted, so no hidden focus targets.' },
        { name: 'onClose', type: '() => void', required: true, note: 'Called by Escape, the backdrop, and the header close button.' },
        { name: 'title', type: 'string', required: true, note: 'Rendered as the h2. Modal always has a visible title.' },
        { name: 'description', type: 'string', note: 'A line under the title, in ink-2.' },
        { name: 'children', type: 'ReactNode', note: 'The scrolling body. Capped at 88vh total height.' },
        { name: 'footer', type: 'ReactNode', note: 'Right-aligned action row above a hairline rule. Omit it and no footer renders.' },
        { name: 'width', type: 'string', default: "'max-w-[520px]'", note: 'A utility class, so you can pass any max-width.' },
      ],
    },
    {
      title: 'Drawer',
      rows: [
        { name: 'open', type: 'boolean', required: true, note: 'As Modal.' },
        { name: 'onClose', type: '() => void', required: true, note: 'As Modal — but there is no built-in close button, so provide one.' },
        { name: 'children', type: 'ReactNode', required: true, note: 'The whole panel. Drawer adds no header or padding.' },
        { name: 'width', type: 'string', default: "'max-w-[min(1120px,94vw)]'", note: 'Wide by default — drawers here hold a record, not a form.' },
        { name: 'label', type: 'string', note: 'aria-label on the dialog. Set it: Drawer has no title to name it.' },
      ],
    },
  ],
  notes: [
    'The Escape handler calls stopPropagation, so a Modal opened from inside a Drawer closes only the Modal. Open the nested example and press Escape twice.',
    'Body scroll lock captures and restores the previous overflow value rather than clearing it, so two overlays closing out of order do not leave the page unscrollable.',
    'The backdrop is a hardcoded rgba(10,10,15,0.4) rather than a token — inherited from AM Campaigns, and the one literal colour left in the library.',
  ],
  states: [
    {
      title: 'Modal',
      note: 'Every specimen is live. Open one, press Escape, click the backdrop, try scrolling the page behind it.',
      cols: 3,
      items: [
        { label: 'title + body', node: <ModalDemo label="Basic" /> },
        { label: '+ description', node: <ModalDemo label="With description" title="Rename campaign" description="Clients see this name in their review portal." /> },
        { label: '+ footer', node: <ModalDemo label="With footer" footer={<><Button variant="tertiary" size="sm">Cancel</Button><Button size="sm">Save</Button></>} /> },
        { label: 'wide', node: <ModalDemo label="Wide (720px)" width="max-w-[720px]" /> },
        { label: 'long body scrolls', node: <ModalDemo label="Long body" children={<div className="flex flex-col gap-3">{Array.from({ length: 14 }, (_, i) => <p key={i} className="text-ink-2 text-[13px]">Paragraph {i + 1} — the body scrolls while the header and footer stay put.</p>)}</div>} /> },
        { label: 'nested in a Drawer', note: 'Escape closes the Modal first, not both.', node: <NestedDemo /> },
      ],
    },
    {
      title: 'Drawer',
      cols: 2,
      items: [
        { label: 'default', node: <DrawerDemo /> },
        { label: 'narrow', node: <NarrowDrawerDemo /> },
      ],
    },
  ],
}

function NarrowDrawerDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>Narrow drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} label="Filters" width="max-w-[380px]">
        <div className="px-6 py-5">
          <h2 className="text-ink mb-3 text-[15px] font-semibold">Filters</h2>
          <Form.Checkbox label="Only overdue" />
          <Form.Checkbox label="Awaiting my review" />
          <div className="h-4" />
          <Button size="sm" fullWidth onClick={() => setOpen(false)}>Apply</Button>
        </div>
      </Drawer>
    </>
  )
}

function NestedDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>Drawer + Modal</Button>
      <Drawer open={open} onClose={() => setOpen(false)} label="Nested demo" width="max-w-[520px]">
        <div className="px-6 py-5">
          <h2 className="text-ink mb-2 text-[15px] font-semibold">Nested overlays</h2>
          <p className="text-ink-2 mb-4 text-[13px] leading-relaxed">
            Open the modal, then press Escape — only the modal closes.
          </p>
          <ModalDemo label="Open a modal" />
        </div>
      </Drawer>
    </>
  )
}

export const confirmDialogEntry: DocEntry = {
  id: 'confirm-dialog',
  name: 'ConfirmDialog',
  group: 'Overlays',
  origin: 'cms',
  frozen: true,
  covers: ['ConfirmDialog'],
  imports: "import { ConfirmDialog } from '@am/ui'",
  summary:
    'A purpose-built confirmation for destructive actions. Deliberately narrower than Modal: a title, a message, cancel, confirm. Nothing to configure means nothing to get wrong on the one dialog you least want to get wrong.',
  props: [
    {
      rows: [
        { name: 'isOpen', type: 'boolean', required: true, note: 'Note the name — isOpen, not open, unlike Modal. Inherited from the CMS.' },
        { name: 'onClose', type: '() => void', required: true, note: 'Cancel. There is no Escape handler and no backdrop click — deliberate friction on a destructive path.' },
        { name: 'onConfirm', type: '() => void', required: true, note: 'The destructive action.' },
        { name: 'title', type: 'string', required: true, note: 'Phrase it as the question.' },
        { name: 'message', type: 'string', required: true, note: 'What will actually happen, and whether it is reversible.' },
        { name: 'confirmText', type: 'string', default: "'Confirm'", note: 'Name the verb — "Delete", not "OK".' },
        { name: 'confirmVariant', type: "'danger' | 'primary'", default: "'danger'", note: 'Danger by default, because that is what this is for.' },
        { name: 'isLoading', type: 'boolean', default: 'false', note: 'Spinner on confirm, cancel disabled — so a slow delete cannot be double-fired.' },
      ],
    },
  ],
  notes: [
    'Unlike Modal, this does not close on Escape or a backdrop click, and does not lock body scroll. On a destructive dialog the extra friction is the feature — but it also means it is the one overlay that does not trap focus.',
    'AM Campaigns deliberately does not use this: it prefers an optimistic action with an undo toast, on the grounds that confirmations get clicked through without being read.',
  ],
  states: [
    {
      title: 'States',
      cols: 3,
      items: [
        { label: "confirmVariant='danger'", node: <ConfirmDemo /> },
        { label: "confirmVariant='primary'", node: <ConfirmDemo variant="primary" /> },
        { label: 'isLoading', note: 'Open it — confirm spins, cancel is disabled.', node: <ConfirmDemo loading /> },
      ],
    },
  ],
}

const MENU_ITEMS = [
  { label: 'Edit', icon: <Pencil className="h-3.5 w-3.5" />, onClick: () => {} },
  { label: 'Duplicate', icon: <Copy className="h-3.5 w-3.5" />, onClick: () => {} },
  { label: 'Archive', icon: <Archive className="h-3.5 w-3.5" />, onClick: () => {}, disabled: true },
  { label: 'Delete', icon: <Trash2 className="h-3.5 w-3.5" />, onClick: () => {}, variant: 'danger' as const },
]

export const menuEntry: DocEntry = {
  id: 'menu',
  name: 'Menu',
  group: 'Overlays',
  origin: 'cms',
  frozen: true,
  covers: ['Menu'],
  imports: "import { Menu } from '@am/ui'",
  summary:
    'The overflow menu behind a kebab trigger: keep the primary action visible as a Button and move secondary and destructive actions in here. Portalled with position: fixed so it escapes any scrollable ancestor, and it flips above the trigger when there is no room below.',
  props: [
    {
      rows: [
        { name: 'items', type: 'MenuItemDescriptor[]', required: true, note: '{ label, icon?, onClick, variant?: "default" | "danger", disabled? }. A flat array — no nesting.' },
        { name: 'trigger', type: 'ReactNode', note: 'Replaces the kebab glyph. The button wrapper stays.' },
        { name: 'align', type: "'left' | 'right'", default: "'right'", note: 'Which edge the panel aligns to.' },
        { name: 'buttonClassName', type: 'string', note: 'Replaces the trigger button’s classes entirely when set.' },
        { name: 'aria-label', type: 'string', default: "'More actions'", note: 'On the trigger. Change it when there are several menus on a page.' },
      ],
    },
  ],
  notes: [
    'It measures itself after mounting before painting — rendered hidden, positioned, then shown — so it never flashes at the wrong spot. It also re-anchors on scroll and resize while open.',
    'This is not Popover. Menu takes an items array and portals itself; Popover is render-prop driven and sits in flow. Both ship, because they are different jobs.',
  ],
  states: [
    {
      title: 'States',
      cols: 3,
      items: [
        { label: 'default kebab', node: <Menu items={MENU_ITEMS} /> },
        { label: 'a danger item', note: 'The Delete row — danger text, danger wash on hover.', node: <Menu items={MENU_ITEMS} /> },
        { label: 'a disabled item', note: 'Archive is at 40% and does not fire.', node: <Menu items={MENU_ITEMS} /> },
        { label: 'custom trigger', node: <Menu items={MENU_ITEMS} trigger={<span className="text-ink-2 text-[12.5px]">Actions</span>} buttonClassName="border-line text-ink hover:bg-input inline-flex h-[34px] items-center rounded-[8px] border px-3" /> },
        { label: "align='left'", node: <Menu items={MENU_ITEMS} align="left" /> },
        { label: 'flips near the viewport edge', note: 'Scroll this to the bottom of the window and open it — the panel opens upward.', node: <Menu items={MENU_ITEMS} /> },
      ],
    },
    {
      title: 'Escaping a clipped ancestor',
      note: 'The container below has overflow: hidden. A non-portalled menu would be cut off at its edge; this one is not.',
      cols: 1,
      items: [
        {
          label: 'inside overflow-hidden',
          wide: true,
          node: (
            <div className="border-line w-full overflow-hidden rounded-lg border">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-ink text-[13px]">A row in a clipped list</span>
                <Menu items={MENU_ITEMS} />
              </div>
            </div>
          ),
        },
      ],
    },
  ],
}

export const popoverEntry: DocEntry = {
  id: 'popover',
  name: 'Popover',
  group: 'Overlays',
  origin: 'campaigns',
  covers: ['Popover', 'MenuItem', 'MenuLabel', 'MenuSeparator'],
  requires: ['--radius-card', '--shadow-raised'],
  imports: "import { Popover, MenuItem, MenuLabel, MenuSeparator } from '@am/ui'",
  summary:
    'The other menu. Render-prop driven and absolutely positioned inside its parent, so it can hold arbitrary content — labels, separators, nested controls — rather than a flat array of actions. Reach for it when the panel is a small UI, and for Menu when it is a list of verbs.',
  props: [
    {
      title: 'Popover',
      rows: [
        { name: 'trigger', type: '({ open, toggle }) => ReactNode', required: true, note: 'You render the trigger, so it can be anything — an avatar, a pill, a whole row.' },
        { name: 'children', type: '(close: () => void) => ReactNode', required: true, note: 'You get a close function. Call it from an item so selecting dismisses the panel.' },
        { name: 'align', type: "'left' | 'right'", default: "'left'", note: 'Which edge to pin to.' },
        { name: 'width', type: 'string', default: "'w-56'", note: 'A utility class.' },
      ],
    },
    {
      title: 'MenuItem',
      rows: [
        { name: 'children', type: 'ReactNode', required: true, note: 'Truncates at one line.' },
        { name: 'onClick', type: '() => void', note: 'Usually the close function, or an action then close.' },
        { name: 'icon', type: 'ReactNode', note: 'Leading glyph at 70% opacity.' },
        { name: 'danger', type: 'boolean', default: 'false', note: 'Accent text and an accent-soft hover — note this is the accent, not danger-accent, inherited from AM Campaigns.' },
        { name: 'active', type: 'boolean', default: 'false', note: 'The currently-selected row: filled and medium weight.' },
      ],
    },
  ],
  notes: [
    'It is not portalled. Inside an overflow-hidden ancestor it will be clipped — that is what Menu is for.',
    'MenuItem’s danger styling uses accent-soft / accent-text rather than the danger role. It came from AM Campaigns, where the accent magenta is the destructive colour.',
  ],
  states: [
    {
      title: 'States',
      cols: 3,
      items: [
        { label: 'items only', node: (
          <Popover trigger={({ toggle }) => <Button size="sm" variant="secondary" onClick={toggle}>Open</Button>}>
            {(close) => <><MenuItem icon={<Pencil className="h-3.5 w-3.5" />} onClick={close}>Edit</MenuItem><MenuItem icon={<Copy className="h-3.5 w-3.5" />} onClick={close}>Duplicate</MenuItem></>}
          </Popover>
        ) },
        { label: 'labels + separators', node: (
          <Popover trigger={({ toggle }) => <Button size="sm" variant="secondary" onClick={toggle}>Grouped</Button>}>
            {(close) => (
              <>
                <MenuLabel>View as</MenuLabel>
                <MenuItem icon={<User className="h-3.5 w-3.5" />} active onClick={close}>Internal</MenuItem>
                <MenuItem icon={<Eye className="h-3.5 w-3.5" />} onClick={close}>Client</MenuItem>
                <MenuSeparator />
                <MenuLabel>Account</MenuLabel>
                <MenuItem icon={<Settings className="h-3.5 w-3.5" />} onClick={close}>Settings</MenuItem>
                <MenuItem danger onClick={close}>Sign out</MenuItem>
              </>
            )}
          </Popover>
        ) },
        { label: "align='right'", node: (
          <div className="flex w-full justify-end">
            <Popover align="right" trigger={({ toggle }) => <Button size="sm" variant="ghost" onClick={toggle}>Right-aligned</Button>}>
              {(close) => <><MenuItem onClick={close}>First</MenuItem><MenuItem onClick={close}>Second</MenuItem></>}
            </Popover>
          </div>
        ) },
        { label: 'custom trigger + open state', note: 'The trigger gets `open`, so it can reflect the state.', node: (
          <Popover trigger={({ open, toggle }) => (
            <button onClick={toggle} className={`border-line text-ink inline-flex h-[34px] items-center gap-2 rounded-[8px] border px-3 text-[13px] ${open ? 'bg-input' : ''}`}>
              <MoreHorizontal className="h-4 w-4" />
              {open ? 'Open' : 'Closed'}
            </button>
          )}>
            {(close) => <MenuItem onClick={close}>Close me</MenuItem>}
          </Popover>
        ) },
        { label: 'width="w-72"', node: (
          <Popover width="w-72" trigger={({ toggle }) => <Button size="sm" variant="secondary" onClick={toggle}>Wider</Button>}>
            {(close) => <><MenuLabel>A wider panel</MenuLabel><MenuItem onClick={close}>Room for a longer label than usual</MenuItem></>}
          </Popover>
        ) },
        { label: 'MenuItem states, flat', note: 'Default, active, danger — outside a popover so all three are visible at once.', node: (
          <div className="bg-surface border-hairline w-full rounded-[12px] border p-1.5">
            <MenuItem icon={<Pencil className="h-3.5 w-3.5" />}>Default</MenuItem>
            <MenuItem icon={<Eye className="h-3.5 w-3.5" />} active>Active</MenuItem>
            <MenuSeparator />
            <MenuItem danger>Danger</MenuItem>
          </div>
        ) },
      ],
    },
  ],
}
