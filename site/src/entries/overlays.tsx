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
  ToastContainer,
  useToast,
} from '@am/ui'
import { Archive, Copy, Eye, MoreHorizontal, Pencil, Settings, Trash2, User } from '@am/ui/icons'
import type { DocEntry } from '../types.ts'

/**
 * Overlays are open/closed by definition, so each specimen is a real trigger.
 * A screenshot of an open modal would not show that Escape closes it, that body
 * scroll locks, or that it now animates *out* as well as in — the point of a
 * live docs site is that you can check.
 *
 * Every one of these has an exit animation, which is the part a screenshot can
 * never document and the part that used to be missing: the panels carried CSS
 * `animate-*` classes with `animation-fill-mode: both`, so even where the app
 * had declared the keyframes at all, the finished animation pinned opacity at 1
 * and no exit was ever visible. Watch them close, not just open.
 */

/** An external open/close switch, so an exit can be replayed without chasing a
 *  close button inside the panel that is currently sliding away. */
function ExitWatch({ label, children }: { label: string; children: (open: boolean, close: () => void) => React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="w-full">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setOpen((v) => !v)}
          className={`rounded px-2 py-1 text-[11.5px] font-medium ${open ? 'bg-zinc-600 text-zinc-50' : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'}`}
        >
          {open ? `Close ${label}` : `Open ${label}`}
        </button>
        <span className="text-[11.5px] text-zinc-500">open={String(open)}</span>
      </div>
      {children(open, () => setOpen(false))}
    </div>
  )
}

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
  covers: ['Modal', 'Drawer', 'useDialogA11y'],
  requires: ['--radius-card', '--shadow-overlay'],
  imports: "import { Modal, Drawer } from '@am/ui'",
  summary:
    'Two portalled overlays sharing one behaviour hook: Escape closes, body scroll locks while open, focus lands inside, and the previous overflow value is restored the moment open flips back. Modal centres and pops from 0.96; Drawer slides off its own right edge. Both animate out as well as in, and neither needs a keyframe or a token to do it. Tab stays inside the panel and focus returns to the opener on close; that behaviour is exported as useDialogA11y for a dialog an app still builds by hand.',
  props: [
    {
      title: 'Modal',
      rows: [
        { name: 'open', type: 'boolean', required: true, note: 'Controlled. Flipping it to false starts the exit; the panel unmounts once that finishes, so there are no hidden focus targets left behind — but there is a short window where it is still in the DOM.' },
        { name: 'onClose', type: '() => void', required: true, note: 'Called by Escape, the backdrop, and the header close button.' },
        { name: 'title', type: 'string', required: true, note: 'Rendered as the h2, and it names the dialog (aria-labelledby). Modal always has a visible title.' },
        { name: 'description', type: 'string', note: 'A line under the title, in ink-2. Wired as the dialog’s aria-describedby.' },
        { name: 'children', type: 'ReactNode', note: 'The scrolling body. Capped at 88vh total height.' },
        { name: 'footer', type: 'ReactNode', note: 'Right-aligned action row above a hairline rule. Omit it and no footer renders.' },
        { name: 'width', type: 'string', default: "'max-w-[520px]'", note: 'A utility class, so you can pass any max-width.' },
        { name: 'className', type: 'string', note: 'Appended to the panel, last. For surface and layout tweaks; the header and footer are not reachable from here.' },
      ],
    },
    {
      title: 'Drawer',
      rows: [
        { name: 'open', type: 'boolean', required: true, note: 'As Modal — including the exit window, during which the panel is still mounted.' },
        { name: 'onClose', type: '() => void', required: true, note: 'As Modal — but there is no built-in close button, so provide one.' },
        { name: 'children', type: 'ReactNode', required: true, note: 'The whole panel. Drawer adds no header or padding.' },
        { name: 'width', type: 'string', default: "'max-w-[min(1120px,94vw)]'", note: 'Wide by default — drawers here hold a record, not a form.' },
        { name: 'label', type: 'string', note: 'aria-label on the dialog. Set it: Drawer has no title to name it.' },
        { name: 'className', type: 'string', note: 'Appended to the panel, last, e.g. bg-surface border-l border-hairline for the CMS surface-coloured side panels.' },
      ],
    },
    {
      title: 'useDialogA11y(ref, isOpen, onClose, options?)',
      rows: [
        { name: 'ref', type: 'RefObject<HTMLElement>', required: true, note: 'The dialog panel. Tab is trapped inside it; Escape anywhere calls onClose.' },
        { name: 'isOpen', type: 'boolean', required: true, note: 'Keyed on this, not on mount, so focus returns the moment the state flips, before an exit animation ends.' },
        { name: 'options.initialFocus', type: 'RefObject<HTMLElement>', note: 'Where focus lands on open. Default: the first focusable control, else the panel. Ignored when an autoFocus control inside the dialog already has focus — that wins, and focus still returns to the opener on close.' },
        { name: 'options.closeOnEscape', type: 'boolean', default: 'true', note: 'Set false while saving, so Escape cannot abandon a half-applied action.' },
      ],
    },
  ],
  notes: [
    'Both animate in *and* out. The scrim crossfades (fade) while the panel pops from 0.96 (popCentered, Modal) or slides off its own right edge (slideFrom(\'right\'), Drawer). AnimatePresence wraps the conditional rather than sitting inside it — with the old `if (!open) return null` shape the element was gone before anything could animate it away.',
    'They used to carry animate-fade-in / animate-slide-in / animate-pop-in. Those had to go, not merely be joined: the CMS never declared the keyframes at all, so there was no enter animation there; and AM Campaigns declares them with animation-fill-mode: both, and a finished CSS animation outranks inline style, which pins opacity at 1 and makes any JS exit invisible. Nothing needs a token now.',
    'The exit keeps the panel mounted for a couple of hundred milliseconds after open goes false, so the scroll lock and focus restore fire on the state change rather than on unmount. Cleaning them up on unmount instead would freeze the page for the length of the animation, which reads as the app hanging.',
    'Open dialogs form a stack and only the topmost one answers Escape and traps Tab, so a Modal opened from inside a Drawer (or a picker opened from inside a settings modal) closes on its own and keeps focus to itself. Open the nested example and press Escape twice. Before 0.4.1 both document listeners fired, so one Escape closed everything.',
    'Body scroll lock captures and restores the previous overflow value rather than clearing it, so two overlays closing out of order do not leave the page unscrollable.',
    'The backdrop is a hardcoded rgba(10,10,15,0.4) rather than a token — inherited from AM Campaigns, and the one literal colour left in the library.',
  ],
  states: [
    {
      title: 'Modal',
      note: 'Every specimen is live. Open one, press Escape, click the backdrop, try scrolling the page behind it — and watch it leave, which is the half a screenshot cannot show.',
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
      title: 'Modal — watching the exit',
      note: 'The switch is outside the overlay, so you can toggle it repeatedly and watch the panel scale back to 0.96 and the scrim fade under it. Toggle fast: an interrupted exit reverses rather than restarting.',
      cols: 1,
      items: [
        {
          label: 'an external open/close switch',
          wide: true,
          node: (
            <ExitWatch label="the modal">
              {(open, close) => (
                <Modal open={open} onClose={close} title="Rename campaign" description="Close it from the switch above and watch it go.">
                  <p className="text-ink-2 text-[13px] leading-relaxed">
                    popCentered on the panel, fade on the scrim. The panel is still mounted for the
                    length of the exit — the scroll lock releases the moment open flips, not when it
                    finally unmounts.
                  </p>
                </Modal>
              )}
            </ExitWatch>
          ),
        },
      ],
    },
    {
      title: 'Drawer',
      note: 'The panel slides off its own right edge on the way out, so the distance is a percentage of its width — one variant serves the 380px filter panel and the 1120px record.',
      cols: 2,
      items: [
        { label: 'default', node: <DrawerDemo /> },
        { label: 'narrow', node: <NarrowDrawerDemo /> },
        {
          label: 'watching the exit',
          note: 'External switch again. Toggle it a few times — a wide panel makes the slow (0.36s) enter and base (0.24s) exit easy to tell apart.',
          wide: true,
          node: (
            <ExitWatch label="the drawer">
              {(open, close) => (
                <Drawer open={open} onClose={close} label="Exit demo" width="max-w-[420px]">
                  <div className="px-6 py-5">
                    <h2 className="text-ink mb-2 text-[15px] font-semibold">Watch it leave</h2>
                    <p className="text-ink-2 text-[13px] leading-relaxed">
                      slideFrom(&apos;right&apos;) on the panel, fade on the scrim.
                    </p>
                  </div>
                </Drawer>
              )}
            </ExitWatch>
          ),
        },
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
        { name: 'onClose', type: '() => void', required: true, note: 'Cancel, and Escape unless isLoading. There is still no backdrop click: deliberate friction on a destructive path.' },
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
    'It animates in and out — the same fade scrim and popCentered panel as Modal. That is the only thing about it that has changed: the markup and every class string are still the CMS’s, which is what keeps it inside the frozen-class rule.',
    'It carries `use client` now. The directive was previously omitted on purpose — both apps only ever import it from a client component, and the CMS original had none — but AnimatePresence and motion are hook-bearing client components, so the file cannot be a server component any more. Nothing regresses at today’s call sites; a future server-component one is now ruled out rather than merely unlikely.',
    'The enter and exit are kept at or under ~260ms deliberately: the CMS Playwright suite has 23 hardcoded waitForTimeout calls with retries: 0, several of them on the confirm-delete path.',
    'Its Cancel and Confirm are type="button", so a ConfirmDialog rendered inside a <form> never submits it (before 0.4.2 Cancel did). The same goes for the Modal close button, the Toast dismiss and Popover MenuItem.',
    'It is a real dialog: role="alertdialog" labelled by the title and described by the message, focus lands on Cancel (the safe choice), Tab is trapped inside, and focus returns on close. Escape cancels unless isLoading. This came from the CMS, which had wrapped the library version to add exactly this. It still ignores backdrop clicks and does not lock body scroll.',
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
    {
      title: 'Watching the exit',
      note: 'Cancel and Confirm both close it, and both play the same way out. The external switch lets you replay it without aiming at a button on a panel that is already leaving.',
      cols: 1,
      items: [
        {
          label: 'an external open/close switch',
          wide: true,
          node: (
            <ExitWatch label="the dialog">
              {(open, close) => (
                <ConfirmDialog
                  isOpen={open}
                  onClose={close}
                  onConfirm={close}
                  title="Delete this page?"
                  message="Close it from the switch above and watch the panel scale back down while the scrim fades."
                  confirmText="Delete"
                />
              )}
            </ExitWatch>
          ),
        },
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
    'The panel opens and closes on the pop variant: opacity, a 0.96 scale and a 4px drop, on the snappy spring. transformOrigin follows align, so a right-aligned menu grows from its top-right corner rather than from the middle. The scale floor is 0.96 rather than something more dramatic because the panel is full of text — below about 0.94 the type visibly reflows.',
    'The measure-then-show pass and the animation are separate steps: it is positioned while hidden, then the pop plays from the right place. Nothing animates from 0,0 to the trigger.',
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
        { label: 'the exit', note: 'Open it, then click away or press Escape. The panel scales back to 0.97 and fades rather than vanishing — hold the kebab and open/close it a few times to see it.', node: <Menu items={MENU_ITEMS} /> },
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
    'Same pop variant as Menu and Dropdown, in and out — a menu, a dropdown and a popover are the same gesture at three sizes, and they should not each invent their own numbers. transformOrigin follows align, so the panel grows from the corner nearest its trigger.',
    'It used to carry animate-pop-in. That class is gone: AM Campaigns declares it with animation-fill-mode: both, and a finished CSS animation outranks inline style — which pinned opacity at 1 and made every exit invisible. The two could not coexist.',
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
        { label: 'the exit', note: 'Open it and click the trigger again rather than an item. The panel scales back and fades out; it is not removed on the frame the state flips.', node: (
          <Popover trigger={({ open, toggle }) => <Button size="sm" variant="secondary" onClick={toggle}>{open ? 'Close it' : 'Open it'}</Button>}>
            {(close) => <><MenuItem onClick={close}>Watch it leave</MenuItem><MenuItem onClick={close}>Second row</MenuItem></>}
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

function ToastDemo({ type }: { type: 'success' | 'error' | 'info' | 'warning' }) {
  const t = useToast()
  const copy = {
    success: 'Page published',
    error: 'Couldn’t save. Try again',
    info: 'Draft restored from a minute ago',
    warning: 'Unsaved changes on this page',
  }[type]
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => t[type](copy)}>{type}</Button>
      <ToastContainer toasts={t.toasts} onClose={t.remove} />
    </>
  )
}

function ToastStackDemo() {
  const t = useToast()
  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          t.success('Saved')
          setTimeout(() => t.info('Cache cleared for 3 pages'), 250)
          setTimeout(() => t.warning('One image is still uploading', 8000), 500)
        }}
      >
        Fire three
      </Button>
      <ToastContainer toasts={t.toasts} onClose={t.remove} />
    </>
  )
}

export const toastEntry: DocEntry = {
  id: 'toast',
  name: 'Toast',
  group: 'Overlays',
  origin: 'cms',
  frozen: true,
  covers: ['Toast', 'ToastContainer', 'useToast'],
  imports: "import { ToastContainer, useToast } from '@am/ui'",
  summary:
    'A transient notification stack in the top-right corner. useToast owns the queue, ToastContainer renders it as a polite live region, and each Toast slides in from the right and dismisses itself after five seconds. Use it to confirm something that already happened; use Form.Error when the user has to act.',
  props: [
    {
      title: 'useToast()',
      rows: [
        { name: 'toasts', type: 'ToastItem[]', note: 'The live queue. Hand it to ToastContainer.' },
        { name: 'success / error / info / warning', type: '(message, duration?) => id', note: 'Enqueue one. duration is milliseconds, default 5000.' },
        { name: 'add', type: '(message, type?, duration?) => id', note: 'The general form of the four above.' },
        { name: 'remove', type: '(id) => void', note: 'Dismiss early. ToastContainer calls it for the × and the timer.' },
      ],
    },
    {
      title: 'ToastContainer',
      rows: [
        { name: 'toasts', type: 'ToastItem[]', required: true, note: 'From useToast.' },
        { name: 'onClose', type: '(id) => void', required: true, note: 'useToast’s remove.' },
        { name: 'className', type: 'string', note: 'Appended to the fixed container: move the corner or change the z-index.' },
      ],
    },
    {
      title: 'Toast',
      rows: [
        { name: 'toast', type: 'ToastItem', required: true, note: '{ id, type, message, duration? }. Exported for a custom container; most apps never render it directly.' },
        { name: 'onClose', type: '(id) => void', required: true, note: 'Called by the × and the auto-dismiss timer.' },
      ],
    },
  ],
  notes: [
    'The container is pointer-events-none and each toast pointer-events-auto, so an empty stack never blocks the corner it sits over.',
    'aria-live="polite" is on the container, so each arrival is announced without interrupting; role="status" on each toast keeps it discoverable.',
    'Colour is on the icon only, so a run of mixed toasts reads as one stack, not a traffic light.',
    'Enter and exit use slideFrom(\'right\'); the reflow when one leaves is the smooth spring on layout. Fire three and dismiss the middle one to watch the gap close.',
    'useToast keeps the queue in component state, so each screen that mounts a ToastContainer has its own stack. Nothing is global.',
  ],
  states: [
    {
      title: 'Types',
      note: 'Each button fires a real toast into the top-right corner. Wait five seconds or click the ×.',
      cols: 4,
      items: (['success', 'error', 'info', 'warning'] as const).map((type) => ({
        label: `type="${type}"`,
        node: <ToastDemo type={type} />,
      })),
    },
    {
      title: 'Stacking and reflow',
      cols: 1,
      items: [
        { label: 'three at once', note: 'The third stays eight seconds. Dismiss the middle one and the last slides up.', wide: true, node: <ToastStackDemo /> },
      ],
    },
  ],
}
