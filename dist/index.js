/**
 * @am/ui — the AM shared design system.
 *
 * Consumers MUST point Tailwind at this package's built output, or every class
 * string below is purged and the components render unstyled:
 *
 *   @source "../node_modules/@am/ui/dist";
 *
 * See docs/TOKENS.md for the token contract and README.md for setup.
 */
export { cn } from './lib/cn.js';
export { formatNumber, formatBytes } from './lib/format.js';
export { AmUiProvider, DefaultSpinner, Spinner, useAmUi, useComponentTheme, } from './theme.js';
// The `asChild` implementation, exported so an app can build its own polymorphic
// component on the same merge rules.
export { Slot } from './lib/Slot.js';
// The geometry scale. Every value is a CSS var with today's rendering as its
// fallback, so defining one restyles the library and defining none changes nothing.
export { H, R, T, GEOMETRY_TOKENS } from './tokens/geometry.js';
// Canonical CMS primitives — class strings frozen, see docs/CONTRIBUTING.md.
export { Button, IconButton, buttonVariants, iconButtonVariants, } from './primitives/Button.js';
export { Badge, Tag, Status } from './primitives/Badge.js';
export { Card, CardHeader, CardFooter, CardSection } from './primitives/Card.js';
export { ConfirmDialog } from './primitives/ConfirmDialog.js';
export { Dropdown } from './primitives/Dropdown.js';
export { EmptyState, EmptyDocumentsIcon, EmptySearchIcon, EmptyImageIcon } from './primitives/EmptyState.js';
export { Form } from './primitives/Form.js';
export { Menu } from './primitives/Menu.js';
export { MediaThumb, isVideoUrl } from './primitives/MediaThumb.js';
export { Skeleton } from './primitives/Skeleton.js';
export { Delta, KpiCard, BarList, ScoreGauge, SectionCard, EmptyHint, } from './primitives/Metrics.js';
// Primitives contributed from AM Campaigns — new to the CMS, which is unaffected.
export { Pill } from './primitives/Pill.js';
export { Modal, Drawer } from './primitives/Overlay.js';
export { Popover, MenuItem, MenuLabel, MenuSeparator } from './primitives/Popover.js';
export { Stat, ProgressBar, SegmentedBar } from './primitives/Metrics.js';
export { Tabs, SegmentedControl } from './primitives/Tabs.js';
export { Stepper } from './primitives/Stepper.js';
export { TIER1_COLOR_TOKENS, TIER2_TOKENS, TIER2_ANIMATIONS, CMS_TOKEN_MAP, CAMPAIGNS_TOKEN_MAP, findMissingTokens, } from './tokens/contract.js';
//# sourceMappingURL=index.js.map