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
export { cn, type ClassValue } from './lib/cn.js';
export { formatNumber, formatBytes } from './lib/format.js';
export { AmUiProvider, DefaultSpinner, Spinner, useAmUi, type AmUiContextValue, type SpinnerProps, } from './provider.js';
export { Button, IconButton } from './primitives/Button.js';
export { Badge, Tag, Status } from './primitives/Badge.js';
export { Card, CardHeader, CardFooter, CardSection } from './primitives/Card.js';
export { ConfirmDialog } from './primitives/ConfirmDialog.js';
export { Dropdown, type DropdownOption, type DropdownChangeEvent } from './primitives/Dropdown.js';
export { EmptyState, EmptyDocumentsIcon, EmptySearchIcon, EmptyImageIcon } from './primitives/EmptyState.js';
export { Form } from './primitives/Form.js';
export { Menu, type MenuItem as MenuItemDescriptor } from './primitives/Menu.js';
export { MediaThumb, isVideoUrl, type MediaThumbProps } from './primitives/MediaThumb.js';
export { Skeleton } from './primitives/Skeleton.js';
export { Delta, KpiCard, BarList, ScoreGauge, SectionCard, EmptyHint, type CountRow, } from './primitives/Metrics.js';
export { Pill } from './primitives/Pill.js';
export { Modal, Drawer } from './primitives/Overlay.js';
export { Popover, MenuItem, MenuLabel, MenuSeparator } from './primitives/Popover.js';
export { Stat, ProgressBar, SegmentedBar, type BarSegment } from './primitives/Metrics.js';
export { Tabs, SegmentedControl, type TabItem } from './primitives/Tabs.js';
export { Stepper, type Step } from './primitives/Stepper.js';
export { TIER1_COLOR_TOKENS, TIER2_TOKENS, TIER2_ANIMATIONS, CMS_TOKEN_MAP, CAMPAIGNS_TOKEN_MAP, findMissingTokens, type Tier1ColorToken, type TokenMap, } from './tokens/contract.js';
//# sourceMappingURL=index.d.ts.map