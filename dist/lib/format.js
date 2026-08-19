/**
 * The two number formatters both apps had written separately — `formatNumber`
 * in the CMS (`components/dashboard/primitives.tsx`) and `compactNumber` in AM
 * Campaigns (`src/lib/format.ts`), with the same thresholds and the same output.
 *
 * They live here because the data-display primitives below need them, and a
 * shared `BarList` that formats counts differently from the app around it is
 * worse than no shared BarList.
 */
/** 1234 → "1.2k", 1_200_000 → "1.2M". Extracted verbatim from the CMS. */
export function formatNumber(n) {
    if (n === null || n === undefined || Number.isNaN(n))
        return "0";
    const abs = Math.abs(n);
    if (abs >= 1_000_000)
        return `${(n / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M`;
    if (abs >= 1_000)
        return `${(n / 1_000).toFixed(abs >= 10_000 ? 0 : 1)}k`;
    return `${n}`;
}
/** 1536 → "1.5 KB". Extracted verbatim from the CMS. */
export function formatBytes(bytes) {
    if (!bytes)
        return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
    return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
//# sourceMappingURL=format.js.map