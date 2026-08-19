import { useState } from 'react'
import {
  AmUiProvider,
  Badge,
  Button,
  Card,
  GEOMETRY_TOKENS,
  IconButton,
  Slot,
  buttonVariants,
  cn,
  type AmUiTheme,
} from '@am/ui'
import { ArrowUpRight, Plus } from '@am/ui/icons'
import type { DocEntry } from '../types.ts'

/**
 * Live proof of each layer. These are not illustrations — the specimens below
 * really are wrapped in a provider, or really do define the CSS variable.
 */

/** Layer 1 — set the geometry tokens on a wrapper; everything inside reshapes. */
function TokenDemo() {
  const [preset, setPreset] = useState<'default' | 'rounded' | 'compact' | 'chunky'>('default')
  const styles: Record<string, React.CSSProperties> = {
    default: {},
    rounded: { ['--am-radius-control' as string]: '999px', ['--am-radius-card' as string]: '20px' },
    compact: {
      ['--am-h-control-md' as string]: '28px',
      ['--am-text-control-md' as string]: '12px',
      ['--am-radius-control' as string]: '5px',
    },
    chunky: {
      ['--am-h-control-md' as string]: '46px',
      ['--am-text-control-md' as string]: '15px',
      ['--am-radius-control' as string]: '14px',
    },
  }
  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap gap-1">
        {(['default', 'rounded', 'compact', 'chunky'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPreset(p)}
            className={`rounded px-2 py-1 font-mono text-[11.5px] ${preset === p ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-400'}`}
          >
            {p}
          </button>
        ))}
      </div>
      <div style={styles[preset]} className="flex flex-wrap items-center gap-3">
        <Button>Publish</Button>
        <Button variant="secondary">Cancel</Button>
        <IconButton aria-label="Add" variant="secondary" icon={<Plus className="h-4 w-4" />} />
        <Badge variant="primary">Live</Badge>
      </div>
      <pre className="mt-3 overflow-x-auto rounded border border-zinc-800 bg-zinc-950 p-2 font-mono text-[11px] text-zinc-400">
        <code>
          {preset === 'default'
            ? '/* nothing defined — the fallbacks apply */'
            : Object.entries(styles[preset])
                .map(([k, v]) => `${k}: ${v};`)
                .join('\n')}
        </code>
      </pre>
    </div>
  )
}

/** Layer 2 — a theme object with per-component defaults and classes. */
function ThemeDemo() {
  const [on, setOn] = useState(true)
  const theme: AmUiTheme = {
    components: {
      Button: {
        defaultProps: { variant: 'secondary', size: 'sm' },
        className: 'uppercase tracking-[0.08em] font-semibold',
      },
      Badge: { className: 'rounded-full' },
    },
  }
  const body = (
    <div className="flex flex-wrap items-center gap-3">
      <Button>no variant set</Button>
      <Button variant="primary">variant=primary</Button>
      <Badge variant="primary">Live</Badge>
    </div>
  )
  return (
    <div className="w-full">
      <label className="mb-3 flex items-center gap-2 text-[12px] text-zinc-400">
        <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} />
        wrap in <code className="font-mono text-zinc-300">AmUiProvider theme=…</code>
      </label>
      {on ? <AmUiProvider theme={theme}>{body}</AmUiProvider> : body}
      <pre className="mt-3 overflow-x-auto rounded border border-zinc-800 bg-zinc-950 p-2 font-mono text-[11px] text-zinc-400">
        <code>{`components: {
  Button: {
    defaultProps: { variant: 'secondary', size: 'sm' },
    className: 'uppercase tracking-[0.08em] font-semibold',
  },
  Badge: { className: 'rounded-full' },
}`}</code>
      </pre>
    </div>
  )
}

export const customisingEntry: DocEntry = {
  id: 'customising',
  name: 'Customising',
  group: 'Foundations',
  origin: 'library',
  covers: ['buttonVariants', 'iconButtonVariants', 'useComponentTheme', 'Slot', 'H', 'R', 'T', 'GEOMETRY_TOKENS'],
  imports: "import { AmUiProvider, buttonVariants, cn } from '@am/ui'",
  summary:
    'Four layers, weakest to strongest: CSS tokens, the theme object, the call site’s className, and composing the exported variant functions. Anything those four cannot express is a gap in the library — not a reason to fork a component.',
  props: [
    {
      title: 'The layers',
      rows: [
        { name: '1. Tokens', type: 'CSS custom properties', note: 'Colour roles and the geometry scale. Restyle everything from your stylesheet, touching no component.' },
        { name: '2. Theme', type: 'AmUiTheme', note: 'Per-component defaultProps and className, applied to every instance. MUI’s defaultProps + styleOverrides.' },
        { name: '3. className', type: 'string', note: 'Per call site. Wins over 1 and 2 because cn runs tailwind-merge.' },
        { name: '4. Variants', type: 'buttonVariants(…)', note: 'The cva functions are exported. Build your own component on the same classes.' },
      ],
    },
    {
      title: 'AmUiProvider',
      rows: [
        { name: 'theme', type: 'AmUiTheme', note: '{ components: { Button: { defaultProps, className } } }. Only the components you name are affected.' },
        { name: 'spinner', type: 'ComponentType', note: 'The app’s brand loading indicator, used by Button’s loading state.' },
      ],
    },
  ],
  notes: [
    'Geometry tokens are CSS vars with the previous hardcoded value as the fallback — `h-[var(--am-h-control-md,34px)]`. An app that defines nothing renders exactly as before; define the var anywhere in scope and everything inside reshapes.',
    'That fallback is why this was safe to land on a shipped app: the CMS defines none of these and its rendering is byte-identical.',
    'tailwind-merge is what makes className an override rather than a suggestion. Two utilities of the same kind have identical specificity, so without it the winner is whichever Tailwind happened to emit later — not the one you wrote last.',
    'You cannot build a class name at runtime. `` `rounded-[${r}]` `` emits no CSS, because Tailwind scans source text and never sees it (§C.3). Tokens exist precisely because they are the version of that idea which works.',
    'Order is fixed: variant classes, then theme className, then call-site className. There is no way for the theme to beat a call site, by design.',
  ],
  states: [
    {
      title: 'Layer 1 — tokens reshape everything',
      note: 'Each preset sets two or three CSS variables on a wrapper div. No component prop changes.',
      cols: 1,
      items: [{ label: 'try a preset', wide: true, node: <TokenDemo /> }],
    },
    {
      title: 'Layer 2 — the theme object',
      note: 'Toggle the provider. Note the first button changes variant *and* picks up the extra classes, while the second keeps its explicit variant.',
      cols: 1,
      items: [{ label: 'AmUiProvider theme', wide: true, node: <ThemeDemo /> }],
    },
    {
      title: 'Layer 3 — className wins',
      note: 'These would previously have left both classes on the element and let Tailwind’s emission order decide.',
      cols: 3,
      items: [
        { label: 'default', node: <Button>Default</Button> },
        { label: 'className="h-12 rounded-full px-8"', node: <Button className="h-12 rounded-full px-8">Overridden</Button> },
        { label: 'className="bg-ok text-on-ok"', node: <Button className="bg-ok text-on-ok">Recoloured</Button> },
      ],
    },
    {
      title: 'Layer 4 — compose, don’t fork',
      note: 'buttonVariants is the cva function behind Button. Feed it to your own element when you need something the props cannot express.',
      cols: 2,
      items: [
        {
          label: 'a custom link-button',
          node: (
            <a href="#customising" className={cn(buttonVariants({ variant: 'tertiary', size: 'sm' }), 'gap-1')}>
              Read more <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ),
        },
        {
          label: 'asChild does the same, typed',
          note: 'Renders the child element with the button’s classes and merged handlers.',
          node: (
            <Button asChild variant="secondary" size="sm">
              <a href="#customising">I am an anchor</a>
            </Button>
          ),
        },
        {
          label: 'Slot directly',
          note: 'The primitive behind asChild, exported for your own polymorphic components.',
          wide: true,
          node: (
            <Slot className="border-line text-ink rounded-[8px] border px-3 py-1.5 text-[13px]">
              <button>Slotted</button>
            </Slot>
          ),
        },
      ],
    },
    {
      title: 'The geometry scale',
      note: 'Every token the library reads, and the value it falls back to. Define any of them to change the shape of the system.',
      cols: 1,
      items: [
        {
          label: 'tokens and fallbacks',
          wide: true,
          raw: true,
          node: (
            <div className="w-full overflow-x-auto rounded-lg border border-zinc-800">
              <table className="w-full min-w-[560px] border-collapse text-left text-[12.5px]">
                <thead className="bg-zinc-900/70 text-[11px] tracking-wide text-zinc-500 uppercase">
                  <tr>
                    <th className="px-3 py-2 font-medium">Token</th>
                    <th className="px-3 py-2 font-medium">Falls back to</th>
                    <th className="px-3 py-2 font-medium">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {GEOMETRY_TOKENS.map((t) => (
                    <tr key={t.token} className="border-t border-zinc-800">
                      <td className="px-3 py-1.5 font-mono text-zinc-200">{t.token}</td>
                      <td className="px-3 py-1.5 font-mono text-[11px] text-emerald-400">{t.fallback}</td>
                      <td className="px-3 py-1.5 text-zinc-400">{t.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
        },
      ],
    },
    {
      title: 'A whole-app restyle',
      note: 'One wrapper, six variables — buttons, cards and chips all follow. This is what an app would put on :root.',
      cols: 1,
      items: [
        {
          label: 'a softer, rounder system',
          wide: true,
          node: (
            <div
              className="w-full"
              style={
                {
                  '--am-radius-control': '999px',
                  '--am-radius-card': '22px',
                  '--am-radius-chip': '999px',
                  '--am-h-control-md': '38px',
                  '--am-text-control-md': '13.5px',
                } as React.CSSProperties
              }
            >
              <Card>
                <div className="flex flex-wrap items-center gap-3">
                  <Button leftIcon={<Plus size={14} />}>New campaign</Button>
                  <Button variant="secondary">Cancel</Button>
                  <Badge variant="primary">Live</Badge>
                  <Badge variant="success">Approved</Badge>
                </div>
              </Card>
            </div>
          ),
        },
      ],
    },
  ],
}
