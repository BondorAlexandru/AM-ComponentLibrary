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
export const H = {
    controlSm: 'h-[var(--am-h-control-sm,28px)]',
    controlMd: 'h-[var(--am-h-control-md,34px)]',
    controlLg: 'h-[var(--am-h-control-lg,40px)]',
    /** Square icon buttons. Larger than text controls — they need a touch target. */
    iconSm: 'h-[var(--am-h-icon-sm,32px)] w-[var(--am-h-icon-sm,32px)]',
    iconMd: 'h-[var(--am-h-icon-md,40px)] w-[var(--am-h-icon-md,40px)]',
    iconLg: 'h-[var(--am-h-icon-lg,44px)] w-[var(--am-h-icon-lg,44px)]',
    /** Form fields. Deliberately taller than buttons at the same name. */
    fieldSm: 'h-[var(--am-h-field-sm,32px)]',
    fieldMd: 'h-[var(--am-h-field-md,40px)]',
    fieldLg: 'h-[var(--am-h-field-lg,48px)]',
};
/** Corner radii. The card and pill entries chain to the app tokens that predate this. */
export const R = {
    chip: 'rounded-[var(--am-radius-chip,6px)]',
    control: 'rounded-[var(--am-radius-control,8px)]',
    /** Floating panels — menus, listboxes. */
    panel: 'rounded-[var(--am-radius-panel,10px)]',
    card: 'rounded-[var(--am-radius-card,var(--radius-card,12px))]',
    pill: 'rounded-[var(--am-radius-pill,var(--radius-pill,999px))]',
};
/**
 * Control type sizes, named by the control they belong to rather than by an
 * abstract scale — a `sm` that means 12.5px on a button and 14px on an input is
 * a scale that lies. Sizes that appear once (a chip label, a KPI figure) stay
 * literal; override those through the theme's per-component `className`.
 */
export const T = {
    // NOTE the `length:` hint. `text-[var(--x,13px)]` is ambiguous — Tailwind
    // cannot tell a font-size from a colour once the value is a var(), and
    // silently picks `color`. That shipped a broken font-size once; don't drop it.
    controlSm: 'text-[length:var(--am-text-control-sm,12.5px)]',
    controlMd: 'text-[length:var(--am-text-control-md,13px)]',
    controlLg: 'text-[length:var(--am-text-control-lg,14px)]',
    fieldSm: 'text-[length:var(--am-text-field-sm,14px)]',
    fieldMd: 'text-[length:var(--am-text-field-md,13.5px)]',
    fieldLg: 'text-[length:var(--am-text-field-lg,18px)]',
};
/** Every token this library reads, with the value it falls back to. For the docs. */
export const GEOMETRY_TOKENS = [
    { token: '--am-h-control-sm', fallback: '28px', role: 'Button height, sm' },
    { token: '--am-h-control-md', fallback: '34px', role: 'Button height, md — the shared bar-control height' },
    { token: '--am-h-control-lg', fallback: '40px', role: 'Button height, lg' },
    { token: '--am-h-icon-sm', fallback: '32px', role: 'IconButton square, sm' },
    { token: '--am-h-icon-md', fallback: '40px', role: 'IconButton square, md' },
    { token: '--am-h-icon-lg', fallback: '44px', role: 'IconButton square, lg' },
    { token: '--am-h-field-sm', fallback: '32px', role: 'Form control height, sm' },
    { token: '--am-h-field-md', fallback: '40px', role: 'Form control height, md' },
    { token: '--am-h-field-lg', fallback: '48px', role: 'Form control height, lg' },
    { token: '--am-radius-chip', fallback: '6px', role: 'Badge, Tag' },
    { token: '--am-radius-control', fallback: '8px', role: 'Button, input, menu item' },
    { token: '--am-radius-panel', fallback: '10px', role: 'Menu and Dropdown panels' },
    { token: '--am-radius-card', fallback: 'var(--radius-card, 12px)', role: 'Card, Modal, Popover' },
    { token: '--am-radius-pill', fallback: 'var(--radius-pill, 999px)', role: 'Pill, SegmentedControl, bars' },
    { token: '--am-text-control-sm', fallback: '12.5px', role: 'Button label, sm' },
    { token: '--am-text-control-md', fallback: '13px', role: 'Button label, md' },
    { token: '--am-text-control-lg', fallback: '14px', role: 'Button label, lg' },
    { token: '--am-text-field-sm', fallback: '14px', role: 'Form control text, sm' },
    { token: '--am-text-field-md', fallback: '13.5px', role: 'Form control text, md' },
    { token: '--am-text-field-lg', fallback: '18px', role: 'Form control text, lg' },
];
//# sourceMappingURL=geometry.js.map