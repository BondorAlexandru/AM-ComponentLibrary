import { useState } from 'react'
import {
  BarList,
  Card,
  Delta,
  EmptyHint,
  KpiCard,
  ProgressBar,
  ScoreGauge,
  SectionCard,
  SegmentedBar,
  Stat,
  Button,
  formatBytes,
  formatNumber,
} from '@am/ui'
import type { DocEntry } from '../types.ts'

/**
 * Every figure on this page animates: the gauge sweeps, the bars grow, the
 * numbers count. All of it is invisible in a screenshot and most of it is
 * invisible the second time you look at a static specimen, so the demos below
 * all carry a control that changes the value.
 */

/** Docs-chrome control — zinc, never a token role, so it survives all three canvases. */
function Ctl({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded bg-zinc-800 px-2 py-1 text-[11.5px] font-medium text-zinc-200 hover:bg-zinc-700"
    >
      {children}
    </button>
  )
}

const rand = (min: number, max: number) => Math.round(min + Math.random() * (max - min))

function LiveStats() {
  const [v, setV] = useState({ impressions: 128400, reach: 94100, engagements: 8200, run: 0 })
  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap gap-2">
        <Ctl onClick={() => setV((s) => ({ impressions: rand(20000, 300000), reach: rand(10000, 200000), engagements: rand(500, 40000), run: s.run }))}>
          New figures
        </Ctl>
        <Ctl onClick={() => setV((s) => ({ ...s, run: s.run + 1 }))}>Replay from zero</Ctl>
      </div>
      <div className="bg-surface border-hairline grid w-full grid-cols-2 gap-4 rounded-[12px] border p-4 sm:grid-cols-3">
        <Stat key={`a${v.run}`} label="Impressions" value={v.impressions} delta={12} />
        <Stat key={`b${v.run}`} label="Reach" value={v.reach} delta={4} />
        <Stat key={`c${v.run}`} label="Engagements" value={v.engagements} delta={-3} />
      </div>
      <p className="text-ink-3 mt-2 text-[11.5px]">
        Press “New figures” twice: the first count runs from zero, the rest tick from wherever the
        number already is.
      </p>
    </div>
  )
}

function LiveKpis() {
  const [v, setV] = useState({ sessions: 12400, views: 48900, run: 0 })
  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap gap-2">
        <Ctl onClick={() => setV((s) => ({ sessions: rand(1000, 40000), views: rand(5000, 120000), run: s.run }))}>New figures</Ctl>
        <Ctl onClick={() => setV((s) => ({ ...s, run: s.run + 1 }))}>Replay from zero</Ctl>
      </div>
      <div className="grid w-full grid-cols-2 gap-3">
        <KpiCard key={`k${v.run}`} label="Sessions" value={v.sessions} delta={8} />
        <KpiCard key={`p${v.run}`} label="Page views" value={v.views} delta={12} />
      </div>
      <p className="text-ink-3 mt-2 text-[11.5px]">
        Only whole numbers count up — an interpolated 2.4 would round to a different string than the
        one you passed, and a figure that changes because you animated it is worse than one that
        does not move.
      </p>
    </div>
  )
}

function LiveGauge() {
  const [score, setScore] = useState<number | null>(96)
  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap gap-2">
        <Ctl onClick={() => setScore(rand(0, 100))}>New score</Ctl>
        <Ctl onClick={() => setScore(0)}>0</Ctl>
        <Ctl onClick={() => setScore(100)}>100</Ctl>
        <Ctl onClick={() => setScore(null)}>null</Ctl>
      </div>
      <div className="flex items-center gap-6">
        <ScoreGauge score={score} label={score === null ? 'Not run' : 'SEO health'} size={110} />
        <p className="text-ink-3 max-w-[22ch] text-[11.5px] leading-relaxed">
          The arc sweeps from where it was to where it is, on the slower duration — this is the one
          figure on an SEO page anyone actually waits to read. The number inside counts with it.
        </p>
      </div>
    </div>
  )
}

function LiveProgress() {
  const [v, setV] = useState(62)
  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap gap-2">
        <Ctl onClick={() => setV(rand(0, 100))}>New value</Ctl>
        <Ctl onClick={() => setV(0)}>0%</Ctl>
        <Ctl onClick={() => setV(100)}>100%</Ctl>
      </div>
      <div className="flex w-full flex-col gap-3">
        <ProgressBar value={v} label="Storage used" showValue />
        <ProgressBar value={v} tone={v > 90 ? 'danger' : v > 70 ? 'warn' : 'ok'} label="Quota" showValue size="lg" />
      </div>
      <p className="text-ink-3 mt-2 text-[11.5px]">
        The fill animates its width rather than scaleX — a scaled fill would squash its own pill
        radius on the way out. BarList does the opposite, and for a reason: see its page.
      </p>
    </div>
  )
}

function LiveBarList() {
  const [run, setRun] = useState(0)
  const [rows, setRows] = useState(TOP_PAGES)
  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap gap-2">
        <Ctl onClick={() => setRun((r) => r + 1)}>Replay the grow</Ctl>
        <Ctl onClick={() => { setRows(TOP_PAGES.map((r) => ({ ...r, count: rand(200, 14000) }))); setRun((r) => r + 1) }}>
          New counts
        </Ctl>
      </div>
      <div className="w-full max-w-md">
        <BarList key={run} title="Top pages" rows={rows} />
      </div>
      <p className="text-ink-3 mt-2 text-[11.5px]">
        Each bar grows on scaleX from its left edge, stepped by the stagger, so the ranking reads
        top-down rather than arriving all at once. The settled percentage stays in the inline width —
        scaleX is what moves, which is what keeps the frozen-class assertion honest.
      </p>
    </div>
  )
}

export const statEntry: DocEntry = {
  id: 'stat',
  name: 'Stat & KpiCard',
  group: 'Data',
  origin: 'campaigns',
  covers: ['Stat', 'KpiCard', 'Delta'],
  imports: "import { Stat, KpiCard, Delta } from '@am/ui'",
  summary:
    'A labelled number. `Stat` is the bare tile for a grid inside a panel you already have; `KpiCard` is the same idea with its own card and the CMS’s display type. `Delta` is the up/down/flat change indicator both use.',
  props: [
    {
      title: 'Stat',
      rows: [
        { name: 'label', type: 'ReactNode', required: true, note: 'Truncates — a stat grid should not reflow because one label is long.' },
        { name: 'value', type: 'ReactNode', required: true, note: 'Rendered tabular-nums, so a column of live figures does not shimmy as it updates.' },
        { name: 'hint', type: 'ReactNode', note: 'The small line under the value — a comparison, a unit, a date range.' },
        { name: 'delta', type: 'number', note: 'A percentage change. Renders a Delta before the hint.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", note: '15 / 17 / 22px. Match it to the room the tile has, not to importance.' },
      ],
    },
    {
      title: 'KpiCard',
      rows: [
        { name: 'label', type: 'string', required: true, note: 'Rendered as a display-font eyebrow: uppercase, 1.4px tracking.' },
        { name: 'value', type: 'string | number', required: true, note: 'The 27px figure.' },
        { name: 'delta', type: 'number', note: 'Percentage change, shown next to the value.' },
        { name: 'hint', type: 'string', note: 'Alternative to delta when there is nothing to compare against.' },
      ],
    },
    {
      title: 'Delta',
      rows: [
        { name: 'value', type: 'number', required: true, note: 'A percentage. Sign picks the arrow and the colour; the label always shows the absolute value, because the arrow already carries the direction.' },
      ],
    },
  ],
  notes: [
    'Whole-number values count up. A fraction does not: AnimatedNumber interpolates and rounds, so 12.5 would land on "13" — a figure that changes because you animated it is worse than one that does not animate at all. Strings pass through untouched, which is why "128.4k" and "£4,120" sit still.',
    'The count is not gated on the viewport (countOnView={false}). A KPI tile has to reach its real value even where nothing reports visibility — a headless render, a stubbed observer, a tile inside a modal — and "counted up early, off screen" is a far cheaper failure than "shows zero forever".',
    'The running number is written straight to the DOM node by a motion value, so a dashboard of these costs one render rather than sixty per second per tile.',
    'AM Campaigns had written this tile four times — PerformancePanel’s Metric, CreatorDrawer’s Stat, and two different Kpi components — differing only in font size. `Stat`’s size prop is that difference, made explicit.',
    'Delta treats down as danger and up as ok. That is wrong for a metric where down is good (cost, bounce rate, time-to-publish) — invert the number at the call site rather than reading the colour as neutral.',
    'KpiCard uses `font-display`, so an app that has not mapped that token gets the body font. Nothing breaks; the eyebrow just looks less distinct.',
  ],
  states: [
    {
      title: 'Counting up, live',
      note: 'The figures animate. Press the buttons more than once — the first arrival counts from zero, every later change ticks from wherever the number currently is, which is what makes a live dashboard readable rather than flickery.',
      cols: 1,
      items: [
        { label: 'Stat — a grid of live figures', wide: true, node: <LiveStats /> },
        { label: 'KpiCard — same behaviour, its own card', wide: true, node: <LiveKpis /> },
        {
          label: 'numbers vs strings',
          note: 'Left counts, right does not. Only integers are animated; anything pre-formatted is rendered exactly as given.',
          wide: true,
          node: (
            <div className="flex w-full flex-wrap gap-8">
              <Stat label="Impressions (number)" value={128400} size="lg" />
              <Stat label="Impressions (string)" value="128.4k" size="lg" />
              <Stat label="Fraction (2.4)" value={2.4} size="lg" />
            </div>
          ),
        },
      ],
    },
    {
      title: 'Stat — sizes',
      cols: 3,
      items: (['sm', 'md', 'lg'] as const).map((s) => ({
        label: `size="${s}"`,
        node: <Stat size={s} label="Impressions" value="128.4k" />,
      })),
    },
    {
      title: 'Stat — content combinations',
      cols: 3,
      items: [
        { label: 'label + value', node: <Stat label="Reach" value="94.1k" /> },
        { label: '+ hint', node: <Stat label="Reach" value="94.1k" hint="last 30 days" /> },
        { label: '+ delta', node: <Stat label="Reach" value="94.1k" delta={12} hint="vs last month" /> },
        { label: 'negative delta', node: <Stat label="Cost per engagement" value="£0.42" delta={-8} hint="vs last month" /> },
        { label: 'long label truncates', node: <div className="w-40"><Stat label="An extremely long metric name that will not fit" value="12" /></div> },
        { label: 'a grid, as used', wide: true, node: (
          <div className="bg-surface border-hairline grid w-full grid-cols-2 gap-4 rounded-[12px] border p-4 sm:grid-cols-4">
            <Stat label="Impressions" value="128.4k" delta={12} />
            <Stat label="Reach" value="94.1k" delta={4} />
            <Stat label="Engagements" value="8.2k" delta={-3} />
            <Stat label="EMV" value="£4,120" hint="earned media" />
          </div>
        ) },
      ],
    },
    {
      title: 'KpiCard',
      cols: 3,
      items: [
        { label: 'value only', node: <div className="w-full"><KpiCard label="Sessions" value="12.4k" /></div> },
        { label: '+ delta', node: <div className="w-full"><KpiCard label="Sessions" value="12.4k" delta={8} /></div> },
        { label: '+ hint', node: <div className="w-full"><KpiCard label="Avg. session" value="2m 14s" hint="all pages" /></div> },
        { label: 'negative delta', node: <div className="w-full"><KpiCard label="Bounce rate" value="42%" delta={-6} /></div> },
        { label: 'flat delta', node: <div className="w-full"><KpiCard label="Signups" value="311" delta={0} /></div> },
        { label: 'a KPI row', wide: true, node: (
          <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-4">
            <KpiCard label="Sessions" value="12.4k" delta={8} />
            <KpiCard label="Page views" value="48.9k" delta={12} />
            <KpiCard label="Bounce rate" value="42%" delta={-6} />
            <KpiCard label="Avg. session" value="2m 14s" delta={0} />
          </div>
        ) },
      ],
    },
    {
      title: 'Delta on its own',
      cols: 3,
      items: [
        { label: 'up', node: <Delta value={24} /> },
        { label: 'flat', note: 'A dash, not an arrow — zero has no direction.', node: <Delta value={0} /> },
        { label: 'down', note: 'Shows 12%, not -12% — the arrow is the sign.', node: <Delta value={-12} /> },
      ],
    },
  ],
}

export const barsEntry: DocEntry = {
  id: 'bars',
  name: 'ProgressBar & SegmentedBar',
  group: 'Data',
  origin: 'campaigns',
  covers: ['ProgressBar', 'SegmentedBar'],
  requires: ['--radius-pill'],
  imports: "import { ProgressBar, SegmentedBar } from '@am/ui'",
  summary:
    'One proportional fill, or many. `ProgressBar` is a single value against a maximum; `SegmentedBar` is a composition — how a total splits across categories, where each slice can also be a filter.',
  props: [
    {
      title: 'ProgressBar',
      rows: [
        { name: 'value', type: 'number', required: true, note: 'Clamped to 0…max, so a bad number cannot overflow the track.' },
        { name: 'max', type: 'number', default: '100', note: 'max={0} yields 0%, not a divide-by-zero.' },
        { name: 'tone', type: "'accent' | 'ok' | 'warn' | 'danger'", default: "'accent'", note: 'Semantic only. A quota bar going red at 90% means something; a red bar for decoration does not.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", note: '6 / 8 / 12px track.' },
        { name: 'label', type: 'ReactNode', note: 'Caption above the bar, left-aligned.' },
        { name: 'showValue', type: 'boolean', default: 'false', note: 'Adds the rounded percentage to the right of the label row.' },
      ],
    },
    {
      title: 'SegmentedBar',
      rows: [
        { name: 'segments', type: 'BarSegment[]', required: true, note: '{ key, value, className?, label?, onClick?, muted? }. Widths are computed against the sum, so you pass counts, not percentages.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", note: 'Same track heights as ProgressBar.' },
      ],
    },
  ],
  notes: [
    'The ProgressBar fill animates its width from 0 on mount, and from its old value to its new one on every change, at the slow duration. Width rather than scaleX here — unlike BarList — because a scaled fill would squash its own pill radius on the way out.',
    'The width is an inline style, not a class, and has to be: Tailwind cannot emit a rule for a runtime percentage, so `w-[${pct}%]` produces nothing at all (§C.3).',
    'A segment carries its own colour class rather than a variant, for the same reason Pill does — a domain set (campaign stages, content types) has more states than a union should hold.',
    'A segment is only focusable and clickable when it has an onClick. Without one it renders disabled, so keyboard users do not tab through a decorative chart.',
    'Zero-value segments are skipped entirely rather than rendered at 0% width, which would otherwise show as a hairline sliver.',
  ],
  states: [
    {
      title: 'ProgressBar — animating to a new value',
      note: 'Change the value repeatedly. The fill travels from where it was, so a bar that updates on a poll reads as a measurement moving rather than a bar being repainted.',
      cols: 1,
      items: [{ label: 'live', wide: true, node: <LiveProgress /> }],
    },
    {
      title: 'ProgressBar — values',
      cols: 3,
      items: [
        { label: 'value={0}', node: <div className="w-full"><ProgressBar value={0} /></div> },
        { label: 'value={35}', node: <div className="w-full"><ProgressBar value={35} /></div> },
        { label: 'value={100}', node: <div className="w-full"><ProgressBar value={100} /></div> },
        { label: 'clamped (value={250})', note: 'Out-of-range input cannot overflow the track.', node: <div className="w-full"><ProgressBar value={250} /></div> },
        { label: 'custom max', note: 'value={5} max={20} → 25%.', node: <div className="w-full"><ProgressBar value={5} max={20} /></div> },
        { label: 'max={0}', note: 'Renders 0% rather than dividing by zero.', node: <div className="w-full"><ProgressBar value={5} max={0} /></div> },
      ],
    },
    {
      title: 'ProgressBar — tones and sizes',
      cols: 2,
      items: [
        { label: 'tones', wide: true, node: (
          <div className="flex w-full flex-col gap-3">
            <ProgressBar value={30} tone="accent" label="accent" showValue />
            <ProgressBar value={55} tone="ok" label="ok" showValue />
            <ProgressBar value={78} tone="warn" label="warn" showValue />
            <ProgressBar value={94} tone="danger" label="danger — a quota about to bite" showValue />
          </div>
        ) },
        { label: 'sizes', wide: true, node: (
          <div className="flex w-full flex-col gap-3">
            <ProgressBar value={60} size="sm" />
            <ProgressBar value={60} size="md" />
            <ProgressBar value={60} size="lg" />
          </div>
        ) },
      ],
    },
    {
      title: 'ProgressBar — with a caption',
      cols: 2,
      items: [
        { label: 'label only', node: <div className="w-full"><ProgressBar value={62} label="Storage used" /></div> },
        { label: 'label + showValue', node: <div className="w-full"><ProgressBar value={62} label="Storage used" showValue /></div> },
      ],
    },
    {
      title: 'SegmentedBar',
      cols: 1,
      items: [
        { label: 'a composition', wide: true, node: (
          <div className="w-full">
            <SegmentedBar
              segments={[
                { key: 'draft', value: 8, className: 'bg-ink-3', label: '8 drafts' },
                { key: 'review', value: 5, className: 'bg-warn', label: '5 in review' },
                { key: 'approved', value: 11, className: 'bg-ok', label: '11 approved' },
                { key: 'live', value: 3, className: 'bg-accent', label: '3 live' },
              ]}
            />
          </div>
        ) },
        { label: 'clickable, with one filtered out', note: 'Hover a slice; the muted one is excluded by the current filter.', wide: true, node: <FilterableBar /> },
        { label: 'zero-value segments are skipped', wide: true, node: (
          <div className="w-full">
            <SegmentedBar segments={[{ key: 'a', value: 4, className: 'bg-ok', label: 'Four' }, { key: 'b', value: 0, className: 'bg-warn', label: 'None' }]} />
          </div>
        ) },
        { label: 'all zero renders an empty track', wide: true, node: (
          <div className="w-full"><SegmentedBar segments={[{ key: 'a', value: 0 }, { key: 'b', value: 0 }]} /></div>
        ) },
      ],
    },
  ],
}

function FilterableBar() {
  const [excluded, setExcluded] = useState<string[]>(['review'])
  const toggle = (k: string) => setExcluded((x) => (x.includes(k) ? x.filter((i) => i !== k) : [...x, k]))
  const segs = [
    { key: 'draft', value: 8, className: 'bg-ink-3', label: '8 drafts' },
    { key: 'review', value: 5, className: 'bg-warn', label: '5 in review' },
    { key: 'approved', value: 11, className: 'bg-ok', label: '11 approved' },
  ]
  return (
    <div className="w-full">
      <SegmentedBar segments={segs.map((s) => ({ ...s, onClick: () => toggle(s.key), muted: excluded.includes(s.key) }))} />
      <p className="text-ink-3 mt-2 text-[11.5px]">Click a slice to toggle it. Excluded: {excluded.join(', ') || 'none'}</p>
    </div>
  )
}

const TOP_PAGES = [
  { label: '/blog/how-we-build', count: 12400 },
  { label: '/pricing', count: 9400 },
  { label: '/', count: 6100 },
  { label: '/docs/getting-started', count: 2300 },
  { label: '/about', count: 890 },
]

export const barListEntry: DocEntry = {
  id: 'bar-list',
  name: 'BarList',
  group: 'Data',
  origin: 'cms',
  frozen: true,
  // CountRow is a type-only export, so it is erased at runtime and needs no cover.
  covers: ['BarList'],
  imports: "import { BarList } from '@am/ui'",
  summary:
    'A labelled ranking with proportional fill bars behind each row — top pages, referrers, tags. Bars scale to the largest row rather than the total, so the leader always fills the width and the shape of the tail is readable.',
  props: [
    {
      rows: [
        { name: 'title', type: 'string', required: true, note: 'Rendered as a display eyebrow.' },
        { name: 'rows', type: 'CountRow[]', required: true, note: '{ label, count }. Order is yours — BarList does not sort.' },
        { name: 'emptyText', type: 'string', default: "'No data yet'", note: 'Shown instead of the list when rows is empty.' },
        { name: 'formatLabel', type: '(label: string) => string', note: 'For trimming a path or prettifying a slug before display. The raw label stays in the title attribute.' },
        { name: 'hrefBase', type: '(label: string) => string | undefined', note: 'Return a URL to make a row a link (opens in a new tab); return undefined to leave that row inert.' },
      ],
    },
  ],
  notes: [
    'The bars grow on scaleX from their left edge, stepped by the stagger so the ranking reads top-down. scaleX rather than width, unlike ProgressBar: the settled percentage has to stay in the inline width attribute, because that is what a caller — and the frozen-class test — reads to know how big the bar actually is.',
    'The grow runs on mount only. A BarList whose rows change in place will not replay it; remount it with a key if you want the new ranking to animate in.',
    'Counts are run through formatNumber, so 12_400 reads as “12k”. Above 10k the decimal is dropped — see the formatters below.',
    'It does not sort. Pass rows in the order you want them, because the “top” in “top pages” is usually decided by the query, not the component.',
  ],
  states: [
    {
      title: 'The bars growing',
      note: 'On mount each bar scales out from its left edge, one stagger step behind the row above it. Press “Replay the grow” — this is the whole reason the list reads as a ranking rather than as five bars appearing at once.',
      cols: 1,
      items: [{ label: 'live', wide: true, node: <LiveBarList /> }],
    },
    {
      title: 'States',
      cols: 2,
      items: [
        { label: 'a ranking', wide: true, node: <div className="w-full max-w-md"><BarList title="Top pages" rows={TOP_PAGES} /></div> },
        { label: 'empty', node: <div className="w-full"><BarList title="Top referrers" rows={[]} /></div> },
        { label: 'custom emptyText', node: <div className="w-full"><BarList title="Top tags" rows={[]} emptyText="No tags used yet" /></div> },
        { label: 'formatLabel', note: 'Display shortened, full value kept in the tooltip.', wide: true, node: (
          <div className="w-full max-w-md">
            <BarList title="Top pages" rows={TOP_PAGES} formatLabel={(l) => (l.length > 18 ? `${l.slice(0, 18)}…` : l)} />
          </div>
        ) },
        { label: 'a single row fills the width', node: <div className="w-full"><BarList title="One" rows={[{ label: '/only', count: 3 }]} /></div> },
      ],
    },
  ],
}

export const gaugeEntry: DocEntry = {
  id: 'score-gauge',
  name: 'ScoreGauge',
  group: 'Data',
  origin: 'cms',
  covers: ['ScoreGauge'],
  imports: "import { ScoreGauge } from '@am/ui'",
  summary:
    'A circular 0–100 dial, built for the CMS’s SEO health score. The arc colour is the grade: green from 90, amber from 50, red below — so the number and the colour say the same thing.',
  props: [
    {
      rows: [
        { name: 'score', type: 'number | null', required: true, note: 'null renders an em-dash and a neutral arc — “not measured” rather than “zero”, which are very different answers.' },
        { name: 'label', type: 'string', note: 'Caption under the dial. Also becomes the SVG’s accessible name.' },
        { name: 'size', type: 'number', default: '110', note: 'Pixels. The 9px stroke is fixed, so a very small gauge reads as heavy.' },
      ],
    },
  ],
  notes: [
    'The CMS original painted the arc with inline var(--sb-ok) and friends — its own variable names, which resolve to nothing in AM Campaigns. The library version uses stroke-* utilities instead: same colour, and no app-specific token in a shared component (§C.2).',
    'The arc sweeps. It is drawn by hiding the whole dash and revealing score% of it, at the slower duration (0.6s) — the one figure on an SEO page anyone actually waits to read. Changing the score animates from the old arc to the new one rather than from zero.',
    'The number in the middle counts with the arc, but only because it is a whole number: ScoreGauge rounds before rendering it. score={null} shows an em-dash and never counts.',
    'score={null} is deliberately distinct from score={0}. Rendering a missing measurement as zero tells the user they failed at something they have not run yet.',
  ],
  states: [
    {
      title: 'The sweep',
      note: 'Change the score and watch the arc travel between grades — including the colour change at the 50 and 90 boundaries, which is instant while the arc itself is not.',
      cols: 1,
      items: [{ label: 'live', wide: true, node: <LiveGauge /> }],
    },
    {
      title: 'Grades',
      cols: 4,
      items: [
        { label: 'score={96}', note: '≥90 — ok.', node: <ScoreGauge score={96} label="Excellent" size={90} /> },
        { label: 'score={72}', note: '50–89 — warn.', node: <ScoreGauge score={72} label="Needs work" size={90} /> },
        { label: 'score={31}', note: '<50 — danger.', node: <ScoreGauge score={31} label="Poor" size={90} /> },
        { label: 'score={null}', note: 'Not measured.', node: <ScoreGauge score={null} label="Not run" size={90} /> },
      ],
    },
    {
      title: 'Edges and sizes',
      cols: 3,
      items: [
        { label: 'score={0}', node: <ScoreGauge score={0} size={90} /> },
        { label: 'score={100}', node: <ScoreGauge score={100} size={90} /> },
        { label: 'no label', node: <ScoreGauge score={64} size={90} /> },
        { label: 'size={60}', note: 'The 9px stroke does not scale — small gauges read heavy.', node: <ScoreGauge score={78} size={60} /> },
        { label: 'size={110} (default)', node: <ScoreGauge score={78} /> },
        { label: 'size={150}', node: <ScoreGauge score={78} size={150} /> },
      ],
    },
  ],
}

export const layoutEntry: DocEntry = {
  id: 'section-card',
  name: 'SectionCard & EmptyHint',
  group: 'Data',
  origin: 'cms',
  frozen: true,
  covers: ['SectionCard', 'EmptyHint'],
  imports: "import { SectionCard, EmptyHint } from '@am/ui'",
  summary:
    'The two wrappers a dashboard section needs. `SectionCard` is a Card with a titled header row and an optional action; `EmptyHint` is the dashed inset panel that says a section has nothing in it yet — quieter than a full EmptyState, because a dashboard has several.',
  props: [
    {
      title: 'SectionCard',
      rows: [
        { name: 'title', type: 'string', required: true, note: 'Rendered per the variant.' },
        { name: 'variant', type: "'eyebrow' | 'heading'", default: "'eyebrow'", note: 'eyebrow is the uppercase tracked micro-label for a dashboard tile; heading is sentence case for a section a user reads as a title.' },
        { name: 'action', type: 'ReactNode', note: 'Right of the title — a Menu, a range picker, a link.' },
      ],
    },
    {
      title: 'EmptyHint',
      rows: [
        { name: 'children', type: 'ReactNode', required: true, note: 'One sentence. If it needs an action and an icon, use EmptyState instead.' },
      ],
    },
  ],
  notes: [
    'EmptyHint vs EmptyState: EmptyHint is for one empty section among several on a dashboard — dashed, inset, no action. EmptyState is for a whole view that is empty, and it should offer a way out.',
  ],
  states: [
    {
      title: 'SectionCard',
      cols: 2,
      items: [
        { label: "variant='eyebrow'", node: <div className="w-full"><SectionCard title="Traffic sources"><p className="text-ink-2 text-[13px]">Body content.</p></SectionCard></div> },
        { label: "variant='heading'", node: <div className="w-full"><SectionCard title="Traffic sources" variant="heading"><p className="text-ink-2 text-[13px]">Body content.</p></SectionCard></div> },
        { label: 'with an action', wide: true, node: (
          <div className="w-full max-w-lg">
            <SectionCard title="Recent activity" action={<Button size="sm" variant="ghost">View all</Button>}>
              <p className="text-ink-2 text-[13px]">Body content.</p>
            </SectionCard>
          </div>
        ) },
      ],
    },
    {
      title: 'EmptyHint',
      cols: 1,
      items: [
        { label: 'on its own', wide: true, node: <div className="w-full"><EmptyHint>No traffic recorded in this range.</EmptyHint></div> },
        { label: 'inside a SectionCard', note: 'The pairing it was written for.', wide: true, node: (
          <div className="w-full max-w-lg">
            <SectionCard title="Top referrers">
              <EmptyHint>Nothing yet — referrers appear once the site has external traffic.</EmptyHint>
            </SectionCard>
          </div>
        ) },
      ],
    },
  ],
}

export const formattersEntry: DocEntry = {
  id: 'formatters',
  name: 'formatNumber & formatBytes',
  group: 'Data',
  origin: 'library',
  covers: ['formatNumber', 'formatBytes'],
  imports: "import { formatNumber, formatBytes } from '@am/ui'",
  summary:
    'Compact number and byte formatting. They ship here because the data primitives use them, and a shared BarList that formats counts differently from the app around it is worse than no shared BarList.',
  props: [
    {
      rows: [
        { name: 'formatNumber(n)', type: '(n: number) => string', note: 'Thousands and millions. Drops the decimal above 10k / 10M, so a column of values stays the same width.' },
        { name: 'formatBytes(bytes)', type: '(bytes: number) => string', note: 'B through TB, one decimal except for bytes.' },
      ],
    },
  ],
  notes: [
    'Both apps had written this: formatNumber in the CMS, compactNumber in AM Campaigns, same thresholds and same output.',
    'formatNumber(NaN) returns "0" rather than "NaN". That is a deliberate display choice — it keeps a broken metric from shouting — so validate upstream if a missing value should be visible as missing.',
  ],
  states: [
    {
      title: 'formatNumber',
      cols: 1,
      items: [
        {
          label: 'across the thresholds',
          note: 'Watch 9_400 → 9.4k but 12_400 → 12k: the decimal is dropped above 10k.',
          wide: true,
          raw: true,
          node: (
            <div className="w-full font-mono text-[11.5px]">
              {[0, 999, 1000, 1234, 9400, 12400, 999_999, 1_200_000, 12_000_000, -1234, NaN].map((n, i) => (
                <div key={i} className="flex items-center justify-between gap-4 border-b border-zinc-800 py-1 last:border-0">
                  <span className="text-zinc-400">formatNumber({Number.isNaN(n) ? 'NaN' : n})</span>
                  <span className="text-emerald-400">"{formatNumber(n)}"</span>
                </div>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      title: 'formatBytes',
      cols: 1,
      items: [
        {
          label: 'across the units',
          wide: true,
          raw: true,
          node: (
            <div className="w-full font-mono text-[11.5px]">
              {[0, 512, 1536, 1_048_576, 5_368_709_120].map((n) => (
                <div key={n} className="flex items-center justify-between gap-4 border-b border-zinc-800 py-1 last:border-0">
                  <span className="text-zinc-400">formatBytes({n})</span>
                  <span className="text-emerald-400">"{formatBytes(n)}"</span>
                </div>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      title: 'In place',
      cols: 1,
      items: [
        {
          label: 'a media summary',
          wide: true,
          node: (
            <div className="w-full max-w-sm">
              <Card>
                <div className="flex items-center justify-between">
                  <Stat label="Assets" value={formatNumber(12400)} />
                  <Stat label="Storage" value={formatBytes(5_368_709_120)} />
                </div>
              </Card>
            </div>
          ),
        },
      ],
    },
  ],
}
