/**
 * Data-display primitives — the "what is this number doing" family.
 *
 * `Delta`, `KpiCard`, `BarList`, `ScoreGauge`, `SectionCard` and `EmptyHint` are
 * extracted from the CMS's `components/dashboard/primitives.tsx`. `Stat` and the
 * two bars come from AM Campaigns, which had written the same tile four times
 * (`PerformancePanel`'s Metric, `CreatorDrawer`'s Stat, and two `Kpi`s) and the
 * same fill bar twice.
 */
import type { ReactNode } from 'react';
/** A row in a `BarList` — the shape the CMS's analytics layer already returns. */
export interface CountRow {
    label: string;
    count: number;
}
export declare function Delta({ value }: {
    value: number;
}): import("react").JSX.Element;
export declare function KpiCard({ label, value, delta, hint, }: {
    label: string;
    value: string | number;
    delta?: number;
    hint?: string;
}): import("react").JSX.Element;
/**
 * The bare metric tile: label, value, optional hint. No card of its own, because
 * these almost always sit in a grid *inside* one — which is exactly why AM
 * Campaigns ended up with four copies rather than reaching for `KpiCard`.
 *
 * Values are `tabular-nums` so a column of them does not shimmy as it updates.
 */
export declare function Stat({ label, value, hint, delta, size, className, }: {
    label: ReactNode;
    value: ReactNode;
    hint?: ReactNode;
    delta?: number;
    /** sm 15px · md 17px · lg 22px. Match it to how much room the tile has. */
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}): import("react").JSX.Element;
/** Horizontal "bar list" — a labelled ranking with proportional fill bars. */
export declare function BarList({ title, rows, emptyText, formatLabel, hrefBase, }: {
    title: string;
    rows: CountRow[];
    emptyText?: string;
    formatLabel?: (label: string) => string;
    hrefBase?: (label: string) => string | undefined;
}): import("react").JSX.Element;
/**
 * Circular 0-100 score gauge (the CMS's SEO health score).
 *
 * The CMS original painted the arc with inline `var(--sb-ok)` etc. Those are the
 * CMS's own variable names and would resolve to nothing in AM Campaigns, so the
 * arc uses `stroke-*` utilities instead — same resolved colour, and §C.2-clean.
 */
export declare function ScoreGauge({ score, label, size, }: {
    score: number | null;
    label?: string;
    size?: number;
}): import("react").JSX.Element;
export declare function SectionCard({ title, action, variant, children, }: {
    title: string;
    action?: ReactNode;
    variant?: "eyebrow" | "heading";
    children: ReactNode;
}): import("react").JSX.Element;
export declare function EmptyHint({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
/**
 * A single proportional fill. Both apps had written this by hand five times
 * between them — a rounded track with an inline `style={{ width: 'NN%' }}`.
 *
 * The width has to stay an inline style: Tailwind cannot emit a class for a
 * runtime percentage (see §C.3), so `w-[${pct}%]` would silently produce nothing.
 */
export declare function ProgressBar({ value, max, tone, size, label, showValue, className, }: {
    value: number;
    max?: number;
    tone?: 'accent' | 'ok' | 'warn' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    /** Caption above the bar. Renders a label row with the value on the right. */
    label?: ReactNode;
    showValue?: boolean;
    className?: string;
}): import("react").JSX.Element;
export interface BarSegment {
    key: string;
    value: number;
    /** Utility classes for this segment's fill, e.g. `bg-ok`. */
    className?: string;
    label?: string;
    onClick?: () => void;
    /** Dim the segment — for a filter that excludes it. */
    muted?: boolean;
}
/**
 * A stacked composition bar: one track, many proportional segments. Campaigns
 * uses it for "how is this campaign distributed across stages", where each
 * segment is also a filter toggle.
 *
 * Segments carry their own colour class rather than a variant, for the same
 * reason `Pill` does — a domain set has more states than a union should hold.
 */
export declare function SegmentedBar({ segments, size, className, }: {
    segments: BarSegment[];
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}): import("react").JSX.Element;
//# sourceMappingURL=Metrics.d.ts.map