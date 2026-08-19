import { useEffect, useState } from 'react'
import { ENTRIES, groupedEntries } from './registry.ts'
import { DEFAULT_THEME, THEMES, applyTheme, themeById, type ThemeId } from './themes.ts'
import type { DocEntry } from './types.ts'
import { Chip, Code, Note, Snippet } from './ui/chrome.tsx'
import { OriginBadges, PropsTable, StateGroupView } from './ui/Specimen.tsx'

const THEME_KEY = 'am-ui-docs-theme'

export default function App() {
  const [theme, setTheme] = useState<ThemeId>(
    () => (localStorage.getItem(THEME_KEY) as ThemeId | null) ?? DEFAULT_THEME,
  )
  const [activeId, setActiveId] = useState<string>(
    () => location.hash.slice(1) || ENTRIES[0].id,
  )

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    const onHash = () => setActiveId(location.hash.slice(1) || ENTRIES[0].id)
    addEventListener('hashchange', onHash)
    return () => removeEventListener('hashchange', onHash)
  }, [])

  const entry = ENTRIES.find((e) => e.id === activeId) ?? ENTRIES[0]
  const active = themeById(theme)

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar activeId={entry.id} />
      <main className="min-w-0 flex-1">
        <TopBar theme={theme} onTheme={setTheme} />
        <div className="mx-auto max-w-5xl px-5 pt-6 pb-24 sm:px-8">
          <p className="mb-4 text-[12px] text-zinc-500">
            Previewing in <span className="text-zinc-300">{active.label}</span> — {active.note}
          </p>
          <EntryView entry={entry} />
        </div>
      </main>
    </div>
  )
}

function Sidebar({ activeId }: { activeId: string }) {
  const groups = groupedEntries()
  return (
    <aside className="border-b border-zinc-800 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0">
      <div className="px-5 py-5">
        <a href="#tokens" className="block">
          <p className="font-mono text-[15px] font-semibold text-zinc-100">@am/ui</p>
          <p className="mt-0.5 text-[11.5px] leading-snug text-zinc-500">
            The shared design system behind SpaceBlock CMS and AM Campaigns.
          </p>
        </a>
      </div>
      <nav className="px-3 pb-6">
        {groups.map(({ group, entries }) => (
          <div key={group} className="mb-4">
            <p className="px-2 pb-1 text-[10.5px] font-semibold tracking-wider text-zinc-600 uppercase">{group}</p>
            {entries.map((e) => (
              <a
                key={e.id}
                href={`#${e.id}`}
                className={`block rounded px-2 py-1.5 text-[13px] transition-colors ${
                  e.id === activeId ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                {e.name}
              </a>
            ))}
          </div>
        ))}
        <a
          href="https://github.com/BondorAlexandru/AM-ComponentLibrary"
          className="block px-2 py-1.5 text-[12px] text-zinc-500 hover:text-zinc-300"
        >
          Source on GitHub →
        </a>
      </nav>
    </aside>
  )
}

function TopBar({ theme, onTheme }: { theme: ThemeId; onTheme: (t: ThemeId) => void }) {
  return (
    <div className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-5 py-3 sm:px-8">
        <span className="text-[11.5px] text-zinc-500">Preview theme</span>
        <div className="flex gap-1 rounded-lg bg-zinc-900 p-1">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => onTheme(t.id)}
              title={t.note}
              className={`rounded px-2.5 py-1 text-[12px] transition-colors ${
                theme === t.id ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-[11.5px] text-zinc-600">
          A component has to survive all three.
        </span>
      </div>
    </div>
  )
}

function EntryView({ entry }: { entry: DocEntry }) {
  return (
    <article>
      <header className="border-b border-zinc-800 pb-5">
        <h1 className="text-[26px] font-semibold tracking-tight text-zinc-100">{entry.name}</h1>
        <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-zinc-400">{entry.summary}</p>
        <OriginBadges origin={entry.origin} frozen={entry.frozen} requires={entry.requires} />
        {entry.imports && (
          <div className="mt-4 max-w-2xl">
            <Snippet>{entry.imports}</Snippet>
          </div>
        )}
      </header>

      {entry.frozen && (
        <div className="mt-5 rounded-lg border border-sky-900/60 bg-sky-950/30 px-4 py-3">
          <p className="text-[12.5px] leading-relaxed text-sky-200">
            <strong className="font-semibold">Frozen classes.</strong> This came from the CMS, which is a shipped app
            whose design must not move. Its class strings are pinned by <Code>frozen-classes.test.tsx</Code>. Additive
            change is fine — a new variant, or a new optional prop that defaults to current behaviour. Anything else is
            a CMS design change: stop and ask.
          </p>
        </div>
      )}

      {entry.notes?.length ? (
        <section className="mt-6">
          <h3 className="mb-2 text-[13px] font-semibold tracking-wide text-zinc-400 uppercase">Worth knowing</h3>
          <ul className="max-w-3xl list-disc space-y-1.5 pl-5 text-[13.5px] leading-relaxed text-zinc-400">
            {entry.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {entry.states.map((group) => (
        <StateGroupView key={group.title} group={group} />
      ))}

      {entry.props?.length ? (
        <section className="mt-12">
          <h3 className="mb-1 text-[13px] font-semibold tracking-wide text-zinc-400 uppercase">Props</h3>
          <Note>
            <Chip>*</Chip> marks a required prop. <Code>className</Code> is appended last everywhere, so it wins —
            reach for it for layout, not to recolour a variant.
          </Note>
          {entry.props.map((table, i) => (
            <PropsTable key={table.title ?? i} title={table.title} rows={table.rows} />
          ))}
        </section>
      ) : null}
    </article>
  )
}
