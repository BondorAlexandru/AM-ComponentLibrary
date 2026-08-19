'use client'

import * as React from 'react'
import { cn } from './cn.js'

/**
 * Renders the child element with our props merged in, instead of rendering a
 * wrapper. This is what `asChild` does — the escape hatch for "I need a Button
 * that is actually a link, or a router `<Link>`, without giving up the styling".
 *
 * Hand-rolled rather than pulling in `@radix-ui/react-slot`: it is ~30 lines and
 * this library ships to two apps that already carry enough dependencies.
 *
 * Merge rules, which matter:
 * - `className` is combined through `cn`, so the child's classes win conflicts.
 * - Event handlers are chained — ours first, then the child's — so `asChild`
 *   never silently swallows an `onClick` the caller put on the child.
 * - Everything else: the child's own props win, since they are more specific.
 */
export function Slot({
  children,
  ...slotProps
}: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) {
  if (!React.isValidElement(children)) return null

  const childProps = children.props as Record<string, unknown>
  const merged: Record<string, unknown> = { ...slotProps, ...childProps }

  for (const key of Object.keys(slotProps)) {
    const ours = (slotProps as Record<string, unknown>)[key]
    const theirs = childProps[key]
    if (/^on[A-Z]/.test(key) && typeof ours === 'function' && typeof theirs === 'function') {
      merged[key] = (...args: unknown[]) => {
        ;(ours as (...a: unknown[]) => void)(...args)
        ;(theirs as (...a: unknown[]) => void)(...args)
      }
    } else if (key === 'className') {
      merged.className = cn(ours as string, theirs as string)
    } else if (key === 'style') {
      merged.style = { ...(ours as object), ...(theirs as object) }
    }
  }

  return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, merged)
}
