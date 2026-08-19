import { useMemo, useState } from 'react'
import {
  AmUiProvider,
  Button,
  CAMPAIGNS_TOKEN_MAP,
  CMS_TOKEN_MAP,
  DefaultSpinner,
  Form,
  Spinner,
  TIER1_COLOR_TOKENS,
  TIER2_ANIMATIONS,
  TIER2_TOKENS,
  cn,
  findMissingTokens,
  useAmUi,
} from '@am/ui'
import * as Icons from '@am/ui/icons'
import type { DocEntry } from '../types.ts'
import { THEMES } from '../themes.ts'

/** A stand-in "brand" spinner, to show what the provider slot does. */
function BrandSpinner({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <span role="status" aria-label="Loading" className={cn('inline-block shrink-0', className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
        <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2.5" strokeDasharray="60" strokeDashoffset="20">
          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1.4s" repeatCount="indefinite" />
        </rect>
      </svg>
    </span>
  )
}

export const spinnerEntry: DocEntry = {
  id: 'spinner',
  name: 'Spinner & AmUiProvider',
  group: 'Foundations',
  origin: 'library',
  covers: ['Spinner', 'DefaultSpinner', 'AmUiProvider', 'useAmUi'],
  imports: "import { AmUiProvider, Spinner } from '@am/ui'",
  summary:
    'A slot, not a component. The CMS loading indicator is a WebGL SpaceBlock “B”; AM Campaigns must never render it, and the CMS must never lose it. So each app supplies its own through AmUiProvider and shared components render whatever they are given.',
  props: [
    {
      title: 'AmUiProvider',
      rows: [
        { name: 'spinner', type: 'ComponentType<{ size?, className? }>', note: 'The app’s brand loader. Omit it and DefaultSpinner is used.' },
        { name: 'children', type: 'ReactNode', required: true, note: 'Mount it high — above everything that can render a Button in a loading state.' },
      ],
    },
    {
      title: 'Spinner / DefaultSpinner',
      rows: [
        { name: 'size', type: 'number', default: '18', note: 'Pixels, applied to both dimensions.' },
        { name: 'className', type: 'string', note: 'Appended. The ring uses currentColor, so a text-* class recolours it.' },
      ],
    },
  ],
  notes: [
    'Spinner reads from context; DefaultSpinner is the fallback ring itself. Import Spinner in shared code, DefaultSpinner only if you want the ring specifically.',
    'The ring uses border-current, so it inherits the text colour of wherever it sits — white on a solid accent button, ink inline. Any brand spinner you plug in should honour the same contract.',
    'In Next.js the provider has to be a client component: `spinner` is a component reference, and a server component cannot serialise one across the boundary.',
  ],
  states: [
    {
      title: 'DefaultSpinner — sizes and colour',
      cols: 3,
      items: [
        { label: 'size=14 / 18 / 28', node: <><DefaultSpinner size={14} /><DefaultSpinner size={18} /><DefaultSpinner size={28} /></> },
        { label: 'inherits currentColor', node: <div className="text-accent-text flex items-center gap-3"><DefaultSpinner size={20} /><span className="text-[13px]">on accent-text</span></div> },
        { label: 'on a solid fill', node: <Button loading>Saving</Button> },
      ],
    },
    {
      title: 'The provider slot',
      note: 'Same Button, different provider. This is how the CMS keeps its WebGL loader while Campaigns gets the ring.',
      cols: 2,
      items: [
        { label: 'no provider → the ring', node: <Button variant="secondary" loading>Loading</Button> },
        {
          label: 'useAmUi — reading the slot',
          note: 'What a shared component does internally to find the app’s spinner.',
          node: <UseAmUiDemo />,
        },
        {
          label: 'with a brand spinner',
          note: 'A placeholder brand mark, injected through AmUiProvider.',
          node: (
            <AmUiProvider spinner={BrandSpinner}>
              <div className="flex items-center gap-3">
                <Button variant="secondary" loading>Loading</Button>
                <Spinner size={20} />
              </div>
            </AmUiProvider>
          ),
        },
      ],
    },
  ],
}

/** Shows what `useAmUi` returns, inside and outside a provider. */
function UseAmUiDemo() {
  return (
    <div className="flex flex-col gap-2 text-[12px]">
      <SlotReadout label="outside a provider" />
      <AmUiProvider spinner={BrandSpinner}>
        <SlotReadout label="inside AmUiProvider" />
      </AmUiProvider>
    </div>
  )
}

function SlotReadout({ label }: { label: string }) {
  const { Spinner: Impl } = useAmUi()
  return (
    <span className="text-ink-2 flex items-center gap-2">
      <Impl size={16} />
      <span className="font-mono">{Impl.name || 'anonymous'}</span>
      <span className="text-ink-3">— {label}</span>
    </span>
  )
}

function TokenTable() {
  const [themeFilter, setThemeFilter] = useState<'all' | string>('all')
  const shown = themeFilter === 'all' ? THEMES : THEMES.filter((t) => t.id === themeFilter)
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[12px] text-zinc-500">Show</span>
        <select
          value={themeFilter}
          onChange={(e) => setThemeFilter(e.target.value)}
          className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-[12px] text-zinc-200"
        >
          <option value="all">all three themes</option>
          {THEMES.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full min-w-[560px] border-collapse text-left text-[12.5px]">
          <thead className="bg-zinc-900/70 text-[11px] tracking-wide text-zinc-500 uppercase">
            <tr>
              <th className="px-3 py-2 font-medium">Role</th>
              {shown.map((t) => <th key={t.id} className="px-3 py-2 font-medium">{t.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {TIER1_COLOR_TOKENS.map((role) => (
              <tr key={role} className="border-t border-zinc-800">
                <td className="px-3 py-1.5 font-mono text-zinc-200">{role}</td>
                {shown.map((t) => (
                  <td key={t.id} className="px-3 py-1.5">
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block h-4 w-4 shrink-0 rounded ring-1 ring-zinc-700"
                        style={{ background: t.roles[role] }}
                      />
                      <span className="font-mono text-[11px] text-zinc-500">{t.roles[role]}</span>
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Tier2Table() {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full min-w-[560px] border-collapse text-left text-[12.5px]">
        <thead className="bg-zinc-900/70 text-[11px] tracking-wide text-zinc-500 uppercase">
          <tr>
            <th className="px-3 py-2 font-medium">Token</th>
            <th className="px-3 py-2 font-medium">CMS declares it?</th>
            <th className="px-3 py-2 font-medium">Campaigns declares it?</th>
          </tr>
        </thead>
        <tbody>
          {TIER2_TOKENS.map((token) => {
            const cms = THEMES[0].tier2[token]
            const camp = THEMES[2].tier2[token]
            const cell = (v?: { declared: boolean }) =>
              v?.declared ? <span className="text-emerald-400">yes</span> : <span className="text-amber-400">not yet</span>
            return (
              <tr key={token} className="border-t border-zinc-800">
                <td className="px-3 py-1.5 font-mono text-zinc-200">{token}</td>
                <td className="px-3 py-1.5">{cell(cms)}</td>
                <td className="px-3 py-1.5">{cell(camp)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function LiveTokenCheck() {
  const [map, setMap] = useState<'cms' | 'campaigns'>('cms')
  const missing = useMemo(
    () => findMissingTokens(map === 'cms' ? CMS_TOKEN_MAP : CAMPAIGNS_TOKEN_MAP),
    [map],
  )
  return (
    <div className="w-full">
      <p className="mb-2 text-[12.5px] leading-relaxed text-zinc-400">
        Run against <em>this page</em>, which maps roles through <code className="font-mono">--am-*</code> rather than
        either app’s names — so both maps correctly report everything missing. That is the check working, not failing:
        it is asserting that a specific app’s variables exist, and here they do not.
      </p>
      <div className="mb-3 flex gap-2">
        {(['cms', 'campaigns'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMap(m)}
            className={`rounded px-2 py-1 font-mono text-[11.5px] ${map === m ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-400'}`}
          >
            {m === 'cms' ? 'CMS_TOKEN_MAP' : 'CAMPAIGNS_TOKEN_MAP'}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-[11.5px] text-zinc-300">
        <code>{`findMissingTokens(${map === 'cms' ? 'CMS_TOKEN_MAP' : 'CAMPAIGNS_TOKEN_MAP'})\n// → ${JSON.stringify(missing)}`}</code>
      </pre>
    </div>
  )
}

export const tokensEntry: DocEntry = {
  id: 'tokens',
  name: 'Tokens',
  group: 'Foundations',
  origin: 'library',
  covers: ['TIER1_COLOR_TOKENS', 'TIER2_TOKENS', 'TIER2_ANIMATIONS', 'CMS_TOKEN_MAP', 'CAMPAIGNS_TOKEN_MAP', 'findMissingTokens'],
  imports: "import { TIER1_COLOR_TOKENS, findMissingTokens, CMS_TOKEN_MAP } from '@am/ui'",
  summary:
    'Components name a role, never a value. Each app maps the roles to its own palette, which is the whole reason one Button can be dark-first in the CMS and light-only in AM Campaigns. Tier 1 is required by every consumer; tier 2 only by the primitives that use it.',
  notes: [
    'The on-* roles are not decoration. on-ok is white in the CMS light theme and near-black in its dark theme, because the same green does not carry white text in both. A component writing text-white on bg-ok is AA in exactly one of them.',
    'Both apps declare their palettes with @theme inline, which substitutes values into utilities instead of emitting --color-* properties. That is why findMissingTokens needs the app’s own role → variable map rather than guessing a name.',
    'Adding a tier-1 token is a breaking change for both apps: define it in both stylesheets before any component uses it.',
  ],
  states: [
    {
      title: 'Tier 1 — the 18 required roles',
      note: 'Swatches are the real values from each app’s stylesheet. Compare the two CMS columns to see what a theme flip actually changes.',
      cols: 1,
      items: [{ label: 'the palette, per theme', wide: true, raw: true, node: <TokenTable /> }],
    },
    {
      title: 'Tier 2 — optional, per primitive',
      note: 'Which app actually declares each one today. “Not yet” means the primitives needing it would render wrong there — the CMS does not use Pill, Modal, Drawer or Popover, so nothing is broken, but adopting one means adding the token first.',
      cols: 1,
      items: [
        { label: 'declaration status', wide: true, raw: true, node: <Tier2Table /> },
        {
          label: 'required animations',
          note: 'Needed by Modal, Drawer and Popover. Both a keyframe and (in Tailwind v4) an --animate-* entry, or the keyframe is pruned from the build.',
          wide: true,
          raw: true,
          node: (
            <div className="flex flex-wrap gap-2 font-mono text-[11.5px]">
              {TIER2_ANIMATIONS.map((a) => (
                <span key={a} className="rounded bg-zinc-800 px-2 py-1 text-zinc-300">{a}</span>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      title: 'findMissingTokens, live',
      cols: 1,
      items: [{ label: 'the contract check', wide: true, raw: true, node: <LiveTokenCheck /> }],
    },
    {
      title: 'Roles in use',
      note: 'Every tier-1 role rendered as a fill with its matching on-* text where one exists — the fastest way to spot a contrast problem after a palette change.',
      cols: 1,
      items: [
        {
          label: 'fills and their text',
          wide: true,
          node: (
            <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="bg-accent text-on-accent rounded p-3 text-[12.5px]">accent / on-accent</div>
              <div className="bg-ok text-on-ok rounded p-3 text-[12.5px]">ok / on-ok</div>
              <div className="bg-danger-accent text-on-danger rounded p-3 text-[12.5px]">danger / on-danger</div>
              <div className="bg-surface text-ink border-hairline rounded border p-3 text-[12.5px]">surface / ink</div>
              <div className="bg-surface-2 text-ink-2 rounded p-3 text-[12.5px]">surface-2 / ink-2</div>
              <div className="bg-input text-ink-3 border-line rounded border p-3 text-[12.5px]">input / ink-3</div>
              <div className="bg-accent-soft text-accent-text rounded p-3 text-[12.5px]">accent-soft / accent-text</div>
              <div className="text-warn border-warn rounded border p-3 text-[12.5px]">warn (outline)</div>
              <div className="text-ink-3 border-hairline rounded border p-3 text-[12.5px]">hairline (border)</div>
            </div>
          ),
        },
      ],
    },
  ],
}

function IconGrid() {
  const [query, setQuery] = useState('')
  const names = useMemo(
    () => Object.keys(Icons).filter((k) => /^[A-Z]/.test(k) && k !== 'LucideIcon').sort(),
    [],
  )
  const filtered = names.filter((n) => n.toLowerCase().includes(query.toLowerCase()))
  const registry = Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter 146 icons…"
          className="border-line bg-input text-ink placeholder:text-ink-3 w-56 rounded border px-2 py-1 text-[12.5px]"
        />
        <span className="text-ink-3 text-[12px]">{filtered.length} shown</span>
      </div>
      <div className="text-ink grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {filtered.map((name) => {
          const Icon = registry[name]
          return (
            <div key={name} className="border-hairline flex flex-col items-center gap-1.5 rounded-lg border p-2">
              <Icon size={20} />
              <span className="text-ink-3 w-full truncate text-center font-mono text-[10px]" title={name}>{name}</span>
            </div>
          )
        })}
        {!filtered.length && <p className="text-ink-3 col-span-full py-4 text-center text-[12.5px]">No icon matches “{query}”.</p>}
      </div>
    </div>
  )
}

export const iconsEntry: DocEntry = {
  id: 'icons',
  name: 'Icons',
  group: 'Foundations',
  origin: 'cms',
  covers: [],
  imports: "import { Plus, Trash2 } from '@am/ui/icons'",
  summary:
    '146 Material Symbols (Rounded, weight 300, fill 1, 24dp) exported under lucide-compatible PascalCase names, so call sites written against lucide-react move over unchanged. Generated from @material-symbols/svg-300 — regenerate, never hand-edit.',
  props: [
    {
      rows: [
        { name: 'size', type: 'number | string', default: '24', note: 'Sets width and height. A w-/h- className still overrides it.' },
        { name: 'className', type: 'string', note: 'The usual sizing route in this codebase: className="h-4 w-4".' },
        { name: '…rest', type: 'SVGProps<SVGSVGElement>', note: 'Everything passes through. Fill is currentColor.' },
      ],
    },
  ],
  notes: [
    'The viewBox is cropped to "80 -880 800 800" — the 20dp live area rather than the full 24dp box. Material Symbols carry about 2dp of keyline padding, which made them read noticeably smaller than the lucide icons they replaced.',
    'The LucideIcon type alias is exported for source compatibility with code that typed icons as LucideIcon.',
  ],
  states: [
    {
      title: 'Sizing',
      cols: 3,
      items: [
        { label: 'size prop', node: <div className="text-ink flex items-end gap-3"><Icons.Plus size={14} /><Icons.Plus size={20} /><Icons.Plus size={28} /></div> },
        { label: 'className sizing', node: <div className="text-ink flex items-end gap-3"><Icons.Search className="h-3.5 w-3.5" /><Icons.Search className="h-5 w-5" /><Icons.Search className="h-7 w-7" /></div> },
        { label: 'inherits currentColor', node: <div className="flex items-center gap-3"><Icons.Check className="text-ok h-5 w-5" /><Icons.AlertTriangle className="text-warn h-5 w-5" /><Icons.XCircle className="text-danger-accent h-5 w-5" /></div> },
      ],
    },
    {
      title: 'The full set',
      cols: 1,
      items: [{ label: 'all 146, filterable', wide: true, node: <IconGrid /> }],
    },
  ],
}

export const utilsEntry: DocEntry = {
  id: 'cn',
  name: 'cn',
  group: 'Foundations',
  origin: 'library',
  covers: ['cn'],
  imports: "import { cn } from '@am/ui'",
  summary:
    'The class-name joiner, hand-rolled rather than depending on clsx — a design system should not hand every consumer a transitive dependency for thirty lines. It accepts the same argument shapes, so it is a drop-in.',
  props: [
    {
      rows: [
        { name: '…inputs', type: 'ClassValue[]', note: 'Strings, numbers, arrays (nested), conditional objects, and any falsy value, which is skipped.' },
      ],
    },
  ],
  notes: [
    'It does not merge conflicting Tailwind classes the way tailwind-merge does. Ordering still decides — put the caller’s className last, which is what every primitive here does.',
  ],
  states: [
    {
      title: 'Argument shapes',
      cols: 1,
      items: [
        {
          label: 'what it accepts',
          wide: true,
          node: (
            <div className="w-full font-mono text-[11.5px]">
              {[
                [`cn('a', 'b')`, cn('a', 'b')],
                [`cn('a', false && 'b')`, cn('a', false && 'b')],
                [`cn(['c', ['d']])`, cn(['c', ['d']])],
                [`cn({ e: true, f: false })`, cn({ e: true, f: false })],
                [`cn('a', null, undefined, 0)`, cn('a', null, undefined, 0)],
              ].map(([expr, result]) => (
                <div key={String(expr)} className="border-hairline flex items-center justify-between gap-4 border-b py-1 last:border-0">
                  <span className="text-ink-2">{expr}</span>
                  <span className="text-ok">"{result}"</span>
                </div>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      title: 'In practice',
      cols: 2,
      items: [
        { label: 'conditional variant', node: <ToggleDemo /> },
      ],
    },
  ],
}

function ToggleDemo() {
  const [active, setActive] = useState(false)
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setActive((a) => !a)}
        className={cn(
          'rounded-[8px] border px-3 py-1.5 text-[13px] transition-colors',
          active ? 'bg-accent text-on-accent border-transparent' : 'border-line text-ink-2 hover:bg-input',
        )}
      >
        {active ? 'Active' : 'Inactive'}
      </button>
      <Form.Hint>Click it — cn picks the branch.</Form.Hint>
    </div>
  )
}
