import * as React from 'react';
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
export declare function Slot({ children, ...slotProps }: React.HTMLAttributes<HTMLElement> & {
    children: React.ReactNode;
}): React.ReactElement<Record<string, unknown>, string | React.JSXElementConstructor<any>> | null;
//# sourceMappingURL=Slot.d.ts.map