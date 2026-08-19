import { useState } from 'react'
import { Badge, SegmentedControl, Stepper, Tabs } from '@am/ui'
import { BarChart3, FileText, Image, Settings } from '@am/ui/icons'
import type { DocEntry } from '../types.ts'

type TabId = 'overview' | 'traffic' | 'content' | 'locked'

const TAB_ITEMS = [
  { id: 'overview' as TabId, label: 'Overview' },
  { id: 'traffic' as TabId, label: 'Traffic' },
  { id: 'content' as TabId, label: 'Content' },
  { id: 'locked' as TabId, label: 'Locked', disabled: true },
]

function LiveTabs(props: Partial<Parameters<typeof Tabs<TabId>>[0]>) {
  const [value, setValue] = useState<TabId>('overview')
  return <Tabs items={TAB_ITEMS} value={value} onChange={setValue} aria-label="Sections" {...props} />
}

function LiveSegmented(props: Partial<Parameters<typeof SegmentedControl<TabId>>[0]>) {
  const [value, setValue] = useState<TabId>('overview')
  return (
    <SegmentedControl
      items={TAB_ITEMS.slice(0, 3)}
      value={value}
      onChange={setValue}
      aria-label="Views"
      {...props}
    />
  )
}

export const tabsEntry: DocEntry = {
  id: 'tabs',
  name: 'Tabs & SegmentedControl',
  group: 'Navigation',
  origin: 'cms',
  covers: ['Tabs', 'SegmentedControl'],
  requires: ['--radius-pill'],
  imports: "import { Tabs, SegmentedControl } from '@am/ui'",
  summary:
    'Two ways to switch between sibling views, and they are not interchangeable. `Tabs` is the underline row for page-level sections. `SegmentedControl` is the pill group for switching a view inside a panel, where an underline would compete with the panel’s own borders. Underline to navigate a page, pills to filter a panel.',
  props: [
    {
      title: 'Both',
      rows: [
        { name: 'items', type: 'TabItem[]', required: true, note: '{ id, label, icon?, badge?, disabled? }. id is what onChange reports back.' },
        { name: 'value', type: 'string', required: true, note: 'Controlled. Neither component holds its own state — a tab that forgets which one is open on re-render is worse than no tabs.' },
        { name: 'onChange', type: '(id) => void', required: true, note: 'Receives the item’s id. Typed to the union of your ids, so a typo is a compile error.' },
        { name: 'aria-label', type: 'string', note: 'Names the tablist. Set it when a page has more than one.' },
        { name: 'size', type: "'sm' | 'md'", default: "'md'", note: 'Tabs: 13px/14px with tighter padding. SegmentedControl: 12px/12.5px.' },
      ],
    },
  ],
  notes: [
    'The CMS had this underline row written out by hand in four places — app/page.tsx, ProjectDashboardClient, ChatbotAdminClient and ComponentWorkbench — with small drifts. The version with role="tablist"/aria-selected and a focus ring won.',
    'Tabs widens its hit area with a ::before pseudo-element rather than padding, because padding would push the text away from the underline it is supposed to sit on.',
    'Neither implements arrow-key roving focus. They are tablists by role but tab-stops by behaviour, matching what both apps already ship. Worth revisiting before either grows past about six tabs.',
    'SegmentedControl’s active pill is `bg-ink text-canvas` — ink-on-canvas inverts with the theme, so it is near-black on light and near-white on dark. Check it in both.',
  ],
  states: [
    {
      title: 'Tabs',
      cols: 1,
      items: [
        { label: 'default', note: 'Click through them; the third is disabled.', wide: true, node: <div className="w-full"><LiveTabs /></div> },
        { label: 'size="sm"', wide: true, node: <div className="w-full"><LiveTabs size="sm" /></div> },
        { label: 'with icons', wide: true, node: <IconTabs /> },
        { label: 'with badges', note: 'A count that rides along with the label.', wide: true, node: <BadgeTabs /> },
        { label: 'overflows by scrolling', note: 'Narrow container — the row scrolls horizontally with the scrollbar hidden, rather than wrapping.', wide: true, node: <div className="w-full max-w-xs"><ManyTabs /></div> },
      ],
    },
    {
      title: 'SegmentedControl',
      cols: 1,
      items: [
        { label: 'default', wide: true, node: <div className="w-full"><LiveSegmented /></div> },
        { label: 'size="sm"', wide: true, node: <div className="w-full"><LiveSegmented size="sm" /></div> },
        { label: 'with a disabled item', wide: true, node: <div className="w-full"><LiveSegmented items={TAB_ITEMS} /></div> },
        { label: 'in a panel header', note: 'The context it exists for — an underline here would fight the panel border.', wide: true, node: (
          <div className="bg-surface border-hairline w-full rounded-[12px] border p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="text-ink text-[14px] font-semibold">Feedback</h4>
              <LiveSegmented />
            </div>
            <p className="text-ink-2 text-[13px]">Panel body.</p>
          </div>
        ) },
      ],
    },
  ],
}

function IconTabs() {
  const [value, setValue] = useState('overview')
  return (
    <div className="w-full">
      <Tabs
        items={[
          { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
          { id: 'content', label: 'Content', icon: <FileText className="h-4 w-4" /> },
          { id: 'media', label: 'Media', icon: <Image className="h-4 w-4" /> },
          { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
        ]}
        value={value}
        onChange={setValue}
        aria-label="With icons"
      />
    </div>
  )
}

function BadgeTabs() {
  const [value, setValue] = useState('open')
  return (
    <div className="w-full">
      <Tabs
        items={[
          { id: 'open', label: 'Open', badge: <Badge size="sm" variant="primary">4</Badge> },
          { id: 'resolved', label: 'Resolved', badge: <Badge size="sm">18</Badge> },
        ]}
        value={value}
        onChange={setValue}
        aria-label="With badges"
      />
    </div>
  )
}

function ManyTabs() {
  const [value, setValue] = useState('t0')
  return (
    <Tabs
      items={Array.from({ length: 8 }, (_, i) => ({ id: `t${i}`, label: `Section ${i + 1}` }))}
      value={value}
      onChange={setValue}
      aria-label="Many"
    />
  )
}

const STEPS = [
  { label: 'Method', hint: 'How it arrives' },
  { label: 'Details', hint: 'Brief and deadline' },
  { label: 'Review', hint: 'Check and send' },
]

function LiveStepper({ size }: { size?: 'sm' | 'md' }) {
  const [current, setCurrent] = useState(1)
  return (
    <div className="w-full">
      <Stepper steps={STEPS} current={current} onGo={setCurrent} size={size} />
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          className="rounded bg-zinc-800 px-2 py-1 text-[11.5px] text-zinc-200"
        >
          Back
        </button>
        <button
          onClick={() => setCurrent((c) => Math.min(STEPS.length - 1, c + 1))}
          className="rounded bg-zinc-800 px-2 py-1 text-[11.5px] text-zinc-200"
        >
          Next
        </button>
        <span className="self-center text-[11.5px] text-zinc-500">current={current}</span>
      </div>
    </div>
  )
}

export const stepperEntry: DocEntry = {
  id: 'stepper',
  name: 'Stepper',
  group: 'Navigation',
  origin: 'campaigns',
  covers: ['Stepper'],
  imports: "import { Stepper } from '@am/ui'",
  summary:
    'Linear progress through a multi-step flow. Completed steps are clickable to go back; future steps are not. That asymmetry is the whole component — a stepper you can skip forward in is a set of tabs wearing a costume.',
  props: [
    {
      rows: [
        { name: 'steps', type: 'Step[]', required: true, note: '{ label, hint? }. The hint is a second line, shown at size md only.' },
        { name: 'current', type: 'number', required: true, note: 'Zero-based index of the active step. Everything before it counts as done.' },
        { name: 'onGo', type: '(index: number) => void', note: 'Called only for a completed step. Omit it entirely and the stepper is a read-only indicator.' },
        { name: 'size', type: "'sm' | 'md'", default: "'md'", note: 'sm drops to a 20px marker and hides hints.' },
      ],
    },
  ],
  notes: [
    'Both apps had one of these — AM Campaigns in AddContentModal, the CMS in ComponentImportClient — with the same back-only rule.',
    'Completed and active share the accent fill, so "done" and "here" read as one continuous bar rather than three separate states. The label colour is what distinguishes them.',
    'Without onGo every step renders disabled, including completed ones. That is the read-only mode, not a bug — it keeps a decorative stepper out of the tab order.',
  ],
  states: [
    {
      title: 'Progress',
      cols: 1,
      items: [
        { label: 'current={0} — nothing done yet', wide: true, node: <div className="w-full"><Stepper steps={STEPS} current={0} onGo={() => {}} /></div> },
        { label: 'current={1} — one done', wide: true, node: <div className="w-full"><Stepper steps={STEPS} current={1} onGo={() => {}} /></div> },
        { label: 'current={2} — on the last step', wide: true, node: <div className="w-full"><Stepper steps={STEPS} current={2} onGo={() => {}} /></div> },
        { label: 'current={3} — all complete', wide: true, node: <div className="w-full"><Stepper steps={STEPS} current={3} onGo={() => {}} /></div> },
      ],
    },
    {
      title: 'Interaction',
      cols: 1,
      items: [
        { label: 'live — back only', note: 'Step forward with the buttons, then try clicking ahead. Only completed steps respond.', wide: true, node: <LiveStepper /> },
        { label: 'read-only (no onGo)', note: 'Every step disabled — an indicator, not a control.', wide: true, node: <div className="w-full"><Stepper steps={STEPS} current={1} /></div> },
      ],
    },
    {
      title: 'Sizes and shapes',
      cols: 1,
      items: [
        { label: 'size="md" with hints', wide: true, node: <div className="w-full"><Stepper steps={STEPS} current={1} onGo={() => {}} /></div> },
        { label: 'size="sm" — hints suppressed', wide: true, node: <div className="w-full"><Stepper steps={STEPS} current={1} onGo={() => {}} size="sm" /></div> },
        { label: 'without hints', wide: true, node: <div className="w-full"><Stepper steps={[{ label: 'One' }, { label: 'Two' }, { label: 'Three' }]} current={1} onGo={() => {}} /></div> },
        { label: 'two steps', wide: true, node: <div className="w-full"><Stepper steps={[{ label: 'Upload' }, { label: 'Confirm' }]} current={1} onGo={() => {}} /></div> },
        { label: 'five steps', wide: true, node: <div className="w-full"><Stepper steps={['Method', 'Details', 'Creators', 'Schedule', 'Review'].map((label) => ({ label }))} current={2} onGo={() => {}} size="sm" /></div> },
      ],
    },
  ],
}
