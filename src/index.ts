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

export { cn, type ClassValue } from './lib/cn.js'

export {
  AmUiProvider,
  DefaultSpinner,
  Spinner,
  useAmUi,
  type AmUiContextValue,
  type SpinnerProps,
} from './provider.js'

// Canonical CMS primitives — class strings frozen, see docs/CONTRIBUTING.md.
export { Button, IconButton } from './primitives/Button.js'
export { Badge, Tag, Status } from './primitives/Badge.js'
export { Card, CardHeader, CardFooter, CardSection } from './primitives/Card.js'
export { ConfirmDialog } from './primitives/ConfirmDialog.js'
export { Dropdown, type DropdownOption, type DropdownChangeEvent } from './primitives/Dropdown.js'
export { EmptyState, EmptyDocumentsIcon, EmptySearchIcon, EmptyImageIcon } from './primitives/EmptyState.js'
export { Form } from './primitives/Form.js'
export { Menu, type MenuItem as MenuItemDescriptor } from './primitives/Menu.js'
export { MediaThumb, isVideoUrl, type MediaThumbProps } from './primitives/MediaThumb.js'
export { Skeleton } from './primitives/Skeleton.js'

// Primitives contributed from AM Campaigns — new to the CMS, which is unaffected.
export { Pill } from './primitives/Pill.js'
export { Modal, Drawer } from './primitives/Overlay.js'
export { Popover, MenuItem, MenuLabel, MenuSeparator } from './primitives/Popover.js'

export {
  TIER1_COLOR_TOKENS,
  TIER2_TOKENS,
  TIER2_ANIMATIONS,
  findMissingTokens,
  type Tier1ColorToken,
} from './tokens/contract.js'
