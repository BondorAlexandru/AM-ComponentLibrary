import { Badge, Pill, Status, Tag } from '@am/ui'
import type { DocEntry } from '../types.ts'

const BADGE_VARIANTS = ['primary', 'secondary', 'success', 'danger', 'warning', 'neutral'] as const

export const badgeEntry: DocEntry = {
  id: 'badge',
  name: 'Badge, Tag & Status',
  group: 'Status',
  origin: 'cms',
  frozen: true,
  covers: ['Badge', 'Tag', 'Status'],
  imports: "import { Badge, Tag, Status } from '@am/ui'",
  summary:
    'Three readings of the same idea, and the difference matters. Badge is a static chip for a closed set of states. Tag is a Badge you can remove. Status is a bare dot plus a label with no chrome at all, for a table cell where a chip would be noise.',
  props: [
    {
      title: 'Badge',
      rows: [
        { name: 'variant', type: "'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'neutral'", default: "'neutral'", note: 'primary and neutral are filled; success, danger and warning are outline-only so a row of them does not read as a row of buttons.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", note: 'Only the padding changes — the font stays 12px at every size, on purpose.' },
        { name: 'dot', type: 'boolean', default: 'false', note: 'Prepends a 6px dot in the variant colour. Useful when the label alone is ambiguous.' },
        { name: 'className', type: 'string', note: 'Appended last.' },
      ],
    },
    {
      title: 'Tag',
      rows: [
        { name: 'variant', type: 'BadgeVariant', default: "'neutral'", note: 'Same palette as Badge.' },
        { name: 'onRemove', type: '() => void', note: 'Renders the × affordance. Omit it and Tag is a fixed-size Badge.' },
      ],
    },
    {
      title: 'Status',
      rows: [
        { name: 'variant', type: "'success' | 'danger' | 'warning' | 'neutral' | 'active'", default: "'neutral'", note: 'active is the accent dot — "currently doing something", distinct from success.' },
        { name: 'size', type: "'sm' | 'md'", default: "'md'", note: 'Dot 8px/10px, label text-xs/text-sm.' },
      ],
    },
  ],
  notes: [
    'Badge is 6px radius, not a pill. If you want a pill, that is the Pill component — and it exists precisely because these two are different jobs.',
    'Badge owns its own colours via variant. Pill does not. Passing a background class to Badge fights the variant; pass it to Pill instead.',
  ],
  states: [
    {
      title: 'Badge — variants',
      cols: 3,
      items: BADGE_VARIANTS.map((v) => ({
        label: `variant="${v}"`,
        node: <Badge variant={v}>Published</Badge>,
      })),
    },
    {
      title: 'Badge — sizes and the dot',
      cols: 3,
      items: [
        { label: 'size="sm"', node: <><Badge size="sm" variant="primary">New</Badge><Badge size="sm" variant="success">Live</Badge></> },
        { label: 'size="md"', node: <><Badge size="md" variant="primary">New</Badge><Badge size="md" variant="success">Live</Badge></> },
        { label: 'size="lg"', node: <><Badge size="lg" variant="primary">New</Badge><Badge size="lg" variant="success">Live</Badge></> },
        { label: 'dot', note: 'Every variant, with its dot.', wide: true, node: <>{BADGE_VARIANTS.map((v) => <Badge key={v} variant={v} dot>{v}</Badge>)}</> },
      ],
    },
    {
      title: 'Tag',
      cols: 2,
      items: [
        { label: 'without onRemove', node: <><Tag>design-system</Tag><Tag variant="primary">brand</Tag></> },
        { label: 'with onRemove', note: 'The × is a real button with aria-label="Remove tag".', node: <><Tag onRemove={() => {}}>beauty</Tag><Tag variant="primary" onRemove={() => {}}>skincare</Tag></> },
        { label: 'a full tag row', wide: true, node: <>{['fashion', 'beauty', 'lifestyle', 'fitness', 'travel'].map((t) => <Tag key={t} onRemove={() => {}}>{t}</Tag>)}</> },
      ],
    },
    {
      title: 'Status',
      note: 'No border, no fill — just a dot and a label, so it disappears into a table row instead of competing with it.',
      cols: 2,
      items: [
        { label: 'all variants, md', wide: true, node: <div className="flex flex-wrap gap-5"><Status variant="success">Approved</Status><Status variant="danger">Failed</Status><Status variant="warning">Needs review</Status><Status variant="neutral">Draft</Status><Status variant="active">Publishing</Status></div> },
        { label: 'size="sm"', node: <><Status size="sm" variant="success">Approved</Status><Status size="sm" variant="neutral">Draft</Status></> },
        { label: 'size="md"', node: <><Status size="md" variant="success">Approved</Status><Status size="md" variant="neutral">Draft</Status></> },
      ],
    },
  ],
}

export const pillEntry: DocEntry = {
  id: 'pill',
  name: 'Pill',
  group: 'Status',
  origin: 'campaigns',
  covers: ['Pill'],
  requires: ['--radius-pill'],
  imports: "import { Pill } from '@am/ui'",
  summary:
    'A fully caller-styled chip. It owns shape, spacing and the optional dot; you own the colours. That inversion is the whole point — a domain-coloured set like campaign stages has more states than a variant union should carry, and each one needs its own hue.',
  props: [
    {
      rows: [
        { name: 'children', type: 'ReactNode', required: true, note: 'The label.' },
        { name: 'className', type: 'string', note: 'Where the colours go: background, text and border. Without it a Pill is an outline in the inherited border colour.' },
        { name: 'dot', type: 'string', note: 'A utility class for the leading dot’s colour, e.g. bg-ok. A class, not a boolean — the dot often differs from the text.' },
        { name: 'size', type: "'sm' | 'md'", default: "'md'", note: '11px/12px text. sm is for inside a dense card; md for a header.' },
      ],
    },
  ],
  notes: [
    'Reach for Badge instead when the states are a small fixed set and you want the design system to pick the colours. Reach for Pill when the caller genuinely knows better.',
    'Requires --radius-pill. AM Campaigns declares it; the CMS does not yet, so a Pill there would render with a 0 radius until the token is added.',
  ],
  states: [
    {
      title: 'Shape and size',
      cols: 3,
      items: [
        { label: 'bare', note: 'No className — just the pill outline.', node: <Pill>Untinted</Pill> },
        { label: 'size="sm"', node: <Pill size="sm" className="bg-accent-soft text-accent-text border-transparent">Small</Pill> },
        { label: 'size="md"', node: <Pill size="md" className="bg-accent-soft text-accent-text border-transparent">Medium</Pill> },
      ],
    },
    {
      title: 'Tinted, with dots',
      note: 'This is roughly how AM Campaigns colours its campaign stages: one hue per stage, dot and text picked independently.',
      cols: 2,
      items: [
        { label: 'a pipeline', wide: true, node: (
          <div className="flex flex-wrap gap-2">
            <Pill className="bg-input text-ink-2 border-line" dot="bg-ink-3">Awaiting upload</Pill>
            <Pill className="bg-accent-soft text-accent-text border-transparent" dot="bg-accent">Changes requested</Pill>
            <Pill className="border-warn/30 text-warn bg-transparent" dot="bg-warn">In review</Pill>
            <Pill className="border-ok/30 text-ok bg-transparent" dot="bg-ok">Approved</Pill>
            <Pill className="bg-ok text-on-ok border-transparent" dot="bg-on-ok">Live</Pill>
          </div>
        ) },
        { label: 'dot without tint', node: <Pill dot="bg-danger-accent">Overdue</Pill> },
        { label: 'solid fill', note: 'On a solid fill the dot needs the on-* role, not the hue.', node: <Pill className="bg-danger-accent text-on-danger border-transparent" dot="bg-on-danger">Rejected</Pill> },
      ],
    },
  ],
}
