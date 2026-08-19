import type { PropDoc, StateGroup } from '../types.ts'
import { Chip, Code, Note, SectionTitle } from './chrome.tsx'

/**
 * One state, on the active theme's canvas, with its label and reason attached.
 * The point of a docs site is that you can see the state — so every state gets
 * its own framed cell rather than a paragraph describing it.
 */
export function StateCell({
  label,
  note,
  checker,
  raw,
  children,
}: {
  label: string
  note?: string
  checker?: boolean
  raw?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/40">
      <div className="border-b border-zinc-800 px-3 py-1.5">
        <p className="font-mono text-[11.5px] text-zinc-300">{label}</p>
        {note && <p className="mt-0.5 text-[11.5px] leading-snug text-zinc-500">{note}</p>}
      </div>
      <div
        className={
          raw
            ? 'flex min-h-[68px] flex-wrap items-center gap-3 bg-zinc-950 p-4'
            : `am-canvas flex min-h-[68px] flex-wrap items-center gap-3 p-4 ${checker ? 'am-checker' : ''}`
        }
      >
        {children}
      </div>
    </div>
  )
}

export function StateGroupView({ group }: { group: StateGroup }) {
  const cols = group.cols ?? 3
  const gridCols = { 1: 'grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[cols]
  return (
    <section>
      <SectionTitle>{group.title}</SectionTitle>
      {group.note && <Note>{group.note}</Note>}
      <div className={`grid gap-3 ${gridCols}`}>
        {group.items.map((item) => (
          <div key={item.label} className={item.wide ? `col-span-full` : ''}>
            <StateCell label={item.label} note={item.note} checker={item.checker} raw={item.raw}>
              {item.node}
            </StateCell>
          </div>
        ))}
      </div>
    </section>
  )
}

export function PropsTable({ title, rows }: { title?: string; rows: PropDoc[] }) {
  return (
    <div className="mb-6">
      {title && <p className="mb-2 font-mono text-[12px] text-zinc-400">{title}</p>}
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full min-w-[640px] border-collapse text-left text-[12.5px]">
          <thead className="bg-zinc-900/70 text-[11px] tracking-wide text-zinc-500 uppercase">
            <tr>
              <th className="px-3 py-2 font-medium">Prop</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Default</th>
              <th className="px-3 py-2 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-zinc-800 align-top">
                <td className="px-3 py-2 font-mono whitespace-nowrap text-zinc-200">
                  {r.name}
                  {r.required && <span className="ml-1 text-rose-400" title="required">*</span>}
                </td>
                <td className="px-3 py-2 font-mono text-[11.5px] text-sky-300">{r.type}</td>
                <td className="px-3 py-2 font-mono text-[11.5px] text-zinc-500">{r.default ?? '—'}</td>
                <td className="px-3 py-2 leading-relaxed text-zinc-400">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function OriginBadges({
  origin,
  frozen,
  requires,
}: {
  origin: 'cms' | 'campaigns' | 'library'
  frozen?: boolean
  requires?: string[]
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {origin === 'cms' && <Chip tone="cms">from the CMS</Chip>}
      {origin === 'campaigns' && <Chip tone="campaigns">from AM Campaigns</Chip>}
      {origin === 'library' && <Chip>library-native</Chip>}
      {frozen && <Chip tone="frozen">frozen classes</Chip>}
      {requires?.length ? (
        <span className="text-[11.5px] text-zinc-500">
          needs tier 2:{' '}
          {requires.map((t, i) => (
            <span key={t}>
              {i > 0 && ', '}
              <Code>{t}</Code>
            </span>
          ))}
        </span>
      ) : null}
    </div>
  )
}
