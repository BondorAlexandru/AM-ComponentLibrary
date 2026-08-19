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
export declare function formatNumber(n: number): string;
/** 1536 → "1.5 KB". Extracted verbatim from the CMS. */
export declare function formatBytes(bytes: number): string;
//# sourceMappingURL=format.d.ts.map