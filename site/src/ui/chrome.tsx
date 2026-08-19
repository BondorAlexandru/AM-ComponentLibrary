import type { ReactNode } from 'react'

/**
 * Docs chrome. Built from Tailwind's built-in palette only — never the token
 * roles under test, so switching preview theme (or breaking a token) can't take
 * the navigation with it.
 */

export function Chip({ tone = 'neutral', children }: { tone?: 'neutral' | 'frozen' | 'cms' | 'campaigns' | 'warn'; children: ReactNode }) {
  const tones = {
    neutral: 'bg-zinc-800 text-zinc-300 ring-zinc-700',
    frozen: 'bg-sky-950 text-sky-300 ring-sky-800',
    cms: 'bg-fuchsia-950 text-fuchsia-300 ring-fuchsia-800',
    campaigns: 'bg-emerald-950 text-emerald-300 ring-emerald-800',
    warn: 'bg-amber-950 text-amber-300 ring-amber-800',
  }
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10.5px] font-medium tracking-wide uppercase ring-1 ring-inset ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function Code({ children }: { children: ReactNode }) {
  return <code className="rounded bg-zinc-800/80 px-1 py-0.5 font-mono text-[12px] text-zinc-200">{children}</code>
}

export function Snippet({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-[12px] leading-relaxed text-zinc-300">
      <code>{children}</code>
    </pre>
  )
}

export function SectionTitle({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h3 id={id} className="mt-10 mb-1 text-[13px] font-semibold tracking-wide text-zinc-400 uppercase">
      {children}
    </h3>
  )
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="mb-4 max-w-3xl text-[13.5px] leading-relaxed text-zinc-400">{children}</p>
}
