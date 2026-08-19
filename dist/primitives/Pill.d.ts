/**
 * Pill — a fully caller-styled chip.
 *
 * Distinct from `Badge`, and deliberately so: `Badge` is variant-driven with a
 * fixed 6px radius and owns its colours, which is right for a small closed set
 * of statuses. `Pill` owns only shape, spacing and the optional dot, and takes
 * its colours from `className` — which is what a domain-coloured set (campaign
 * stages, platform tags) needs. Extracted from AM Campaigns.
 *
 * Requires the `--radius-pill` token (see docs/TOKENS.md, tier 2).
 */
import type { ReactNode } from 'react';
export declare function Pill({ children, className, dot, size, }: {
    children: ReactNode;
    className?: string;
    /** Utility class for the leading dot's colour, e.g. `bg-ok`. */
    dot?: string;
    size?: 'sm' | 'md';
}): import("react").JSX.Element;
//# sourceMappingURL=Pill.d.ts.map