/**
 * The geometry scale — heights, radii, type sizes and the spacing the controls
 * depend on.
 *
 * Colour was always configurable: components name a role and each app maps it.
 * Geometry was not — sizes were baked in as `h-[34px]`, `rounded-[8px]` and so
 * on, so an app could not make its controls taller or rounder without fighting
 * every call site. This is the same indirection for shape.
 *
 * Each entry is a literal class string of the form:
 *
 *     h-[var(--am-h-control-md,34px)]
 *
 * The fallback is the value the component rendered before this existed, so
 * **an app that defines nothing renders exactly as it did**. Define
 * `--am-h-control-md` anywhere in scope and every md control resizes.
 *
 * Two rules make this work, and both are easy to break:
 *
 * 1. These must be *literal strings*. Tailwind scans source text for class
 *    names — it cannot evaluate `` `h-[${x}]` ``, so a constructed class emits
 *    no CSS at all (§C.3). That is why they live here as constants rather than
 *    being assembled from the token name and default.
 * 2. Where an app-level token already exists (`--radius-card`, `--radius-pill`),
 *    the fallback chains to it before the literal, so those keep working.
 */
/** Control heights — Button and anything that must line up with it in a bar. */
export declare const H: {
    readonly controlSm: "h-[var(--am-h-control-sm,28px)]";
    readonly controlMd: "h-[var(--am-h-control-md,34px)]";
    readonly controlLg: "h-[var(--am-h-control-lg,40px)]";
    /** Square icon buttons. Larger than text controls — they need a touch target. */
    readonly iconSm: "h-[var(--am-h-icon-sm,32px)] w-[var(--am-h-icon-sm,32px)]";
    readonly iconMd: "h-[var(--am-h-icon-md,40px)] w-[var(--am-h-icon-md,40px)]";
    readonly iconLg: "h-[var(--am-h-icon-lg,44px)] w-[var(--am-h-icon-lg,44px)]";
    /** Form fields. Deliberately taller than buttons at the same name. */
    readonly fieldSm: "h-[var(--am-h-field-sm,32px)]";
    readonly fieldMd: "h-[var(--am-h-field-md,40px)]";
    readonly fieldLg: "h-[var(--am-h-field-lg,48px)]";
};
/** Corner radii. The card and pill entries chain to the app tokens that predate this. */
export declare const R: {
    readonly chip: "rounded-[var(--am-radius-chip,6px)]";
    readonly control: "rounded-[var(--am-radius-control,8px)]";
    /** Floating panels — menus, listboxes. */
    readonly panel: "rounded-[var(--am-radius-panel,10px)]";
    readonly card: "rounded-[var(--am-radius-card,var(--radius-card,12px))]";
    readonly pill: "rounded-[var(--am-radius-pill,var(--radius-pill,999px))]";
};
/**
 * Control type sizes, named by the control they belong to rather than by an
 * abstract scale — a `sm` that means 12.5px on a button and 14px on an input is
 * a scale that lies. Sizes that appear once (a chip label, a KPI figure) stay
 * literal; override those through the theme's per-component `className`.
 */
export declare const T: {
    readonly controlSm: "text-[var(--am-text-control-sm,12.5px)]";
    readonly controlMd: "text-[var(--am-text-control-md,13px)]";
    readonly controlLg: "text-[var(--am-text-control-lg,14px)]";
    readonly fieldSm: "text-[var(--am-text-field-sm,14px)]";
    readonly fieldMd: "text-[var(--am-text-field-md,13.5px)]";
    readonly fieldLg: "text-[var(--am-text-field-lg,18px)]";
};
/** Every token this library reads, with the value it falls back to. For the docs. */
export declare const GEOMETRY_TOKENS: {
    token: string;
    fallback: string;
    role: string;
}[];
//# sourceMappingURL=geometry.d.ts.map