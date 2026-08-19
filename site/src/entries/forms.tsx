import { useState } from 'react'
import { Dropdown, Form } from '@am/ui'
import type { DocEntry } from '../types.ts'

/** Dropdown and Form.Select are controlled — the docs need real state to show them working. */
function LiveDropdown({ initial = 'b', ...rest }: { initial?: string } & Record<string, unknown>) {
  const [value, setValue] = useState(initial)
  return (
    <Dropdown value={value} onChange={(e) => setValue(e.target.value)} aria-label="Pick a stage" {...rest}>
      <option value="a">Awaiting upload</option>
      <option value="b">In review</option>
      <option value="c">Changes requested</option>
      <option value="d">Approved</option>
      <option value="e">Live</option>
    </Dropdown>
  )
}

function LiveSelect({ size = 'md', error }: { size?: 'sm' | 'md' | 'lg'; error?: boolean }) {
  const [value, setValue] = useState('b')
  return (
    <Form.Select size={size} error={error} value={value} onChange={(e) => setValue(e.target.value)} aria-label="Pick a client">
      <option value="a">Aurelia Skincare</option>
      <option value="b">Northbank Coffee</option>
      <option value="c">Vela Athletics</option>
    </Form.Select>
  )
}

function LiveCheckbox({ label }: { label: string }) {
  const [on, setOn] = useState(false)
  return <Form.Checkbox label={label} checked={on} onChange={(e) => setOn(e.target.checked)} />
}

export const formEntry: DocEntry = {
  id: 'form',
  name: 'Form',
  group: 'Forms',
  origin: 'cms',
  frozen: true,
  covers: ['Form'],
  requires: ['--font-display'],
  imports: "import { Form } from '@am/ui'   // Form.Field, Form.Label, Form.TextInput, …",
  summary:
    'A namespace, not a component: Form.Field wraps, Form.Label captions, and the controls fill in. Labels are uppercase tracked micro-captions rather than sentence-case text, which keeps a dense settings panel readable when every row has one.',
  props: [
    {
      title: 'Form.TextInput',
      rows: [
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", note: '32 / 40 / 48px. Note md is 40px — taller than a md Button (34px), so they do not align in a row by default.' },
        { name: 'error', type: 'boolean', default: 'false', note: 'Switches the border and focus ring to danger. Pair it with Form.Error for the message.' },
        { name: '…rest', type: 'InputHTMLAttributes', note: 'Everything else passes through — id, name, required, placeholder, type, disabled.' },
      ],
    },
    {
      title: 'Form.Label',
      rows: [
        { name: 'children', type: 'ReactNode', required: true, note: 'The caption. Rendered uppercase with 1.2px tracking.' },
        { name: 'htmlFor', type: 'string', note: 'Associate it with the control’s id. Do this — the label is not nested.' },
        { name: 'required', type: 'boolean', default: 'false', note: 'Appends a danger-coloured asterisk.' },
        { name: 'action', type: 'ReactNode', note: 'Right-aligned slot on the label row — a "Reset" or "Learn more" link.' },
      ],
    },
    {
      title: 'Form.Textarea',
      rows: [
        { name: 'resize', type: "'none' | 'vertical' | 'horizontal' | 'both'", default: "'vertical'", note: 'Vertical by default, which is almost always what you want.' },
        { name: 'error', type: 'boolean', default: 'false', note: 'As TextInput.' },
      ],
    },
    {
      title: 'Form.Select',
      rows: [
        { name: 'children', type: '<option> elements', note: 'Parsed like a native select. It renders the custom Dropdown underneath.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", note: 'Matches TextInput heights.' },
        { name: 'onChange', type: '(e: { target: { value } }) => void', note: 'Shaped like a native change event so existing e.target.value handlers keep working.' },
      ],
    },
    {
      title: 'Form.Checkbox / Form.Radio',
      rows: [
        { name: 'label', type: 'string', note: 'A string, not a ReactNode. It generates its own id via useId and wires htmlFor.' },
        { name: 'error', type: 'boolean', default: 'false', note: 'Danger border and focus ring.' },
      ],
    },
  ],
  notes: [
    'Form.Select forwards only value, onChange, disabled, aria-label and title to the Dropdown — id, name and required are dropped. That means no native validation and no <Label htmlFor> association. If you need either, use a native select for now.',
    'Form.Checkbox takes a string label and no indeterminate state. AM Campaigns keeps a local checkbox for its select-all header for exactly that reason.',
    'Form.Label uses font-display. If an app has not mapped --font-display the utility is simply never emitted and labels fall back to the body font — no error, just a quiet difference.',
  ],
  states: [
    {
      title: 'TextInput — sizes',
      cols: 3,
      items: (['sm', 'md', 'lg'] as const).map((s) => ({
        label: `size="${s}"`,
        node: <div className="w-full"><Form.TextInput size={s} placeholder={`Size ${s}`} /></div>,
      })),
    },
    {
      title: 'TextInput — states',
      cols: 3,
      items: [
        { label: 'empty (placeholder)', node: <div className="w-full"><Form.TextInput placeholder="hello@example.com" /></div> },
        { label: 'filled', node: <div className="w-full"><Form.TextInput defaultValue="hello@accessmemory.co" /></div> },
        { label: ':focus', note: 'Click in — border thickens to 1.5px accent with a 2px ring.', node: <div className="w-full"><Form.TextInput placeholder="Click me" /></div> },
        { label: 'error', node: <div className="w-full"><Form.TextInput error defaultValue="not-an-email" /></div> },
        { label: 'disabled', node: <div className="w-full"><Form.TextInput disabled defaultValue="Locked" /></div> },
        { label: 'type="password"', node: <div className="w-full"><Form.TextInput type="password" defaultValue="hunter2hunter2" /></div> },
      ],
    },
    {
      title: 'Label',
      cols: 3,
      items: [
        { label: 'plain', node: <div className="w-full"><Form.Label>Email address</Form.Label></div> },
        { label: 'required', node: <div className="w-full"><Form.Label required>Email address</Form.Label></div> },
        { label: 'with action', node: <div className="w-full"><Form.Label action={<a href="#form" className="text-accent-text">Reset</a>}>Slug</Form.Label></div> },
      ],
    },
    {
      title: 'Textarea',
      cols: 3,
      items: [
        { label: 'default (resize vertical)', node: <div className="w-full"><Form.Textarea rows={3} placeholder="Write the brief…" /></div> },
        { label: "resize='none'", node: <div className="w-full"><Form.Textarea rows={3} resize="none" defaultValue="Fixed size." /></div> },
        { label: 'error', node: <div className="w-full"><Form.Textarea rows={3} error defaultValue="Too short" /></div> },
      ],
    },
    {
      title: 'Select',
      note: 'A custom listbox, not a native select — OS popups cannot be themed. Click one open and check it in the CMS dark theme.',
      cols: 3,
      items: [
        { label: 'size="sm"', node: <div className="w-full"><LiveSelect size="sm" /></div> },
        { label: 'size="md"', node: <div className="w-full"><LiveSelect /></div> },
        { label: 'error', node: <div className="w-full"><LiveSelect error /></div> },
      ],
    },
    {
      title: 'Checkbox and Radio',
      cols: 3,
      items: [
        { label: 'checkbox', node: <LiveCheckbox label="Notify the client" /> },
        { label: 'checkbox checked + disabled', node: <Form.Checkbox label="Locked on" checked disabled /> },
        { label: 'checkbox error', node: <Form.Checkbox label="You must agree" error /> },
        { label: 'radio group', wide: true, node: (
          <div className="flex flex-col gap-1.5">
            <Form.Radio name="docs-visibility" label="Internal only" defaultChecked />
            <Form.Radio name="docs-visibility" label="Shared with the client" />
            <Form.Radio name="docs-visibility" label="Public" />
          </div>
        ) },
      ],
    },
    {
      title: 'Hint, Error and InputGroup',
      cols: 2,
      items: [
        { label: 'Form.Hint', node: <div className="w-full"><Form.TextInput placeholder="my-page" /><div className="h-1" /><Form.Hint>Lowercase letters, numbers and hyphens.</Form.Hint></div> },
        { label: 'Form.Error', note: 'role="alert", so it is announced when it appears.', node: <div className="w-full"><Form.TextInput error defaultValue="" /><div className="h-1" /><Form.Error>An email address is required.</Form.Error></div> },
        { label: 'startAddon', node: <div className="w-full"><Form.InputGroup startAddon="https://"><Form.TextInput placeholder="example.com" className="rounded-l-none" /></Form.InputGroup></div> },
        { label: 'endAddon', node: <div className="w-full"><Form.InputGroup endAddon=".myshop.com"><Form.TextInput placeholder="store" className="rounded-r-none" /></Form.InputGroup></div> },
      ],
    },
    {
      title: 'A whole field, composed',
      cols: 1,
      items: [
        {
          label: 'Field + Label + TextInput + Hint',
          wide: true,
          node: (
            <div className="w-full max-w-md">
              <Form.Field>
                <Form.Label htmlFor="docs-name" required>Campaign name</Form.Label>
                <Form.TextInput id="docs-name" placeholder="Autumn skincare launch" />
                <Form.Hint>Shown to the client in their review portal.</Form.Hint>
              </Form.Field>
              <div className="h-4" />
              <Form.Field error="Pick a client">
                <Form.Label htmlFor="docs-client" required>Client</Form.Label>
                <LiveSelect />
                <Form.Error>Pick a client before saving.</Form.Error>
              </Form.Field>
            </div>
          ),
        },
      ],
    },
  ],
}

export const dropdownEntry: DocEntry = {
  id: 'dropdown',
  name: 'Dropdown',
  group: 'Forms',
  origin: 'cms',
  frozen: true,
  covers: ['Dropdown'],
  imports: "import { Dropdown } from '@am/ui'",
  summary:
    'A fully custom replacement for a native <select>, because an OS popup cannot be themed and looks wrong on the CMS’s dark canvas. Drop-in friendly: it accepts <option> children and calls onChange with a { target: { value } } shape, so existing handlers keep working.',
  props: [
    {
      rows: [
        { name: 'value', type: 'string | undefined', required: true, note: 'Controlled. undefined shows the placeholder.' },
        { name: 'onChange', type: '(e: { target: { value: string } }) => void', required: true, note: 'Deliberately shaped like a native change event.' },
        { name: 'options', type: 'DropdownOption[]', note: 'Alternative to <option> children, when the label is a ReactNode.' },
        { name: 'children', type: '<option> / <optgroup>', note: 'Parsed recursively. optgroup labels are flattened away.' },
        { name: 'placeholder', type: 'string', default: "'Select…'", note: 'Shown in ink-3 when nothing matches value.' },
        { name: 'className', type: 'string', note: 'Replaces the default field look entirely when set — it is not appended.' },
        { name: 'disabled', type: 'boolean', default: 'false', note: '60% opacity, not-allowed cursor.' },
      ],
    },
  ],
  notes: [
    'The listbox is portalled to document.body with position: fixed, so it is never clipped by a scrollable ancestor, and it flips above the trigger when there is not room below. Scroll the page with one open to see it track.',
    'Keyboard: ArrowDown/ArrowUp/Enter/Space open and move; Escape closes and returns focus to the trigger. The selected option carries aria-selected.',
    'It does not forward id, name or required — so no native form validation and no <Label htmlFor> association.',
  ],
  states: [
    {
      title: 'States',
      cols: 3,
      items: [
        { label: 'closed with a value', node: <div className="w-full"><LiveDropdown /></div> },
        { label: 'placeholder (no value)', node: <div className="w-full"><Dropdown value={undefined} onChange={() => {}} placeholder="Choose a stage…" aria-label="Stage"><option value="a">Awaiting upload</option></Dropdown></div> },
        { label: 'disabled', node: <div className="w-full"><Dropdown value="a" disabled onChange={() => {}} aria-label="Stage"><option value="a">Awaiting upload</option></Dropdown></div> },
        { label: 'open — click it', note: 'Selected row is accent-soft with a check; hover moves the active row.', node: <div className="w-full"><LiveDropdown /></div> },
        { label: 'custom trigger via className', note: 'className replaces the field look rather than adding to it.', node: <div className="w-full"><LiveDropdown className="text-ink-2 hover:text-ink text-[12.5px]" /></div> },
        { label: 'a long list', note: 'Caps at 280px and scrolls, with the scrollbar hidden.', node: <div className="w-full"><LongDropdown /></div> },
      ],
    },
  ],
}

function LongDropdown() {
  const [value, setValue] = useState('opt-3')
  return (
    <Dropdown value={value} onChange={(e) => setValue(e.target.value)} aria-label="Long list">
      {Array.from({ length: 24 }, (_, i) => (
        <option key={i} value={`opt-${i}`}>
          Option {i + 1}
        </option>
      ))}
    </Dropdown>
  )
}
