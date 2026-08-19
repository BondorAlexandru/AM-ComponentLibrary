/**
 * Moved to `./theme.tsx`, which grew the per-component theme config alongside
 * the spinner slot. Kept as a re-export rather than deleted so any deep import
 * of this path keeps resolving.
 */
export {
  AmUiProvider,
  DefaultSpinner,
  Spinner,
  useAmUi,
  useComponentTheme,
  type AmUiContextValue,
  type AmUiTheme,
  type ComponentConfig,
  type ComponentName,
  type SpinnerProps,
} from './theme.js'
