/**
 * Form Component System
 *
 * Inspired by Strapi's form patterns:
 * - Composable field components
 * - Automatic error handling
 * - Accessibility built-in
 * - Focus management
 */

'use client'

import React, { ReactNode, forwardRef, useId } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Dropdown } from './Dropdown.js'
import { cn } from '../lib/cn.js'
import { collapse } from '../motion/variants.js'
import { useVariants } from '../motion/components.js'

// ==========================================
// Field Root (Container)
// ==========================================

interface FieldProps {
  children: ReactNode
  error?: string
  hint?: string
  required?: boolean
  className?: string
}

function Field({ children, error, className = '' }: FieldProps) {
  return (
    <div className={cn(`space-y-1`, className)} data-field-error={error ? 'true' : undefined}>
      {children}
    </div>
  )
}

// ==========================================
// Field Label
// ==========================================

interface LabelProps {
  children: ReactNode
  htmlFor?: string
  required?: boolean
  action?: ReactNode
  className?: string
}

function Label({ children, htmlFor, required, action, className = '' }: LabelProps) {
  return (
    <div className="flex items-center justify-between">
      <label
        htmlFor={htmlFor}
        className={cn(`font-display uppercase text-[12px] font-normal tracking-[1.2px] text-ink-3`, className)}
      >
        {children}
        {required && <span className="text-danger-accent ml-1">*</span>}
      </label>
      {action && <div className="text-xs">{action}</div>}
    </div>
  )
}

// ==========================================
// Text Input
// ==========================================

interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ error, size = 'md', className = '', ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-[var(--am-h-field-sm,32px)] px-2 text-sm',
      md: 'h-[var(--am-h-field-md,40px)] px-[13px] text-[length:var(--am-text-field-md,13.5px)]',
      lg: 'h-[var(--am-h-field-lg,48px)] px-4 text-lg',
    }

    const errorClasses = error
      ? 'border-danger-accent focus:border-[1.5px] focus:border-danger-accent focus:ring-danger-accent/30'
      : 'border-line focus:border-[1.5px] focus:border-accent focus:ring-accent/30'

    return (
      <input
        ref={ref}
        className={cn(`
          w-full rounded-[var(--am-radius-control,8px)]
          ${sizeClasses[size]}
          ${errorClasses}
          border bg-input text-ink
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:opacity-60 disabled:cursor-not-allowed
          placeholder:text-ink-3`, className)}
        {...props}
      />
    )
  }
)
TextInput.displayName = 'TextInput'

// ==========================================
// Textarea
// ==========================================

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, resize = 'vertical', className = '', ...props }, ref) => {
    const errorClasses = error
      ? 'border-danger-accent focus:border-[1.5px] focus:border-danger-accent focus:ring-danger-accent/30'
      : 'border-line focus:border-[1.5px] focus:border-accent focus:ring-accent/30'

    const resizeClass = resize === 'none' ? 'resize-none' : `resize-${resize}`

    return (
      <textarea
        ref={ref}
        className={cn(`
          w-full rounded-[var(--am-radius-control,8px)] px-[13px] py-[10px] text-[length:var(--am-text-field-md,13.5px)]
          ${errorClasses}
          ${resizeClass}
          border bg-input text-ink
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:opacity-60 disabled:cursor-not-allowed
          placeholder:text-ink-3`, className)}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

// ==========================================
// Select
// ==========================================

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
}

// Renders the custom themed Dropdown (native <select> popups can't be styled)
// while keeping the old Form.Select API: <option> children + e.target.value.
const Select = ({ error, size = 'md', children, className = '', value, onChange, disabled, ...props }: SelectProps) => {
  const sizeClasses = {
    sm: 'h-[var(--am-h-field-sm,32px)] pl-2 pr-[8px] text-sm',
    md: 'h-[var(--am-h-field-md,40px)] pl-[13px] pr-[10px] text-[length:var(--am-text-field-md,13.5px)]',
    lg: 'h-[var(--am-h-field-lg,48px)] pl-4 pr-[12px] text-lg',
  }

  const errorClasses = error ? 'border-danger-accent' : 'border-line hover:border-accent/60 focus-visible:border-accent'

  return (
    <Dropdown
      value={value === undefined || value === null ? undefined : String(value)}
      onChange={(e) =>
        onChange?.({ target: { value: e.target.value } } as unknown as React.ChangeEvent<HTMLSelectElement>)
      }
      disabled={disabled}
      aria-label={props['aria-label']}
      title={props.title}
      id={props.id}
      name={props.name}
      required={props.required}
      form={props.form}
      className={cn(`
        w-full rounded-[var(--am-radius-control,8px)]
        ${sizeClasses[size]}
        ${errorClasses}
        border bg-input text-ink
        transition-colors
        focus-visible:outline-none`, className)}
    >
      {children}
    </Dropdown>
  )
}
Select.displayName = 'Select'

// ==========================================
// Checkbox
// ==========================================

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** The caption. A node, so it can carry a hint or an inline link. */
  label?: ReactNode
  error?: boolean
  /**
   * "Some of them". A DOM property, not an attribute, so it is set in an
   * effect; the box shows a dash and reports `aria-checked="mixed"`. Clicking
   * it reports `checked` as the browser decides, as a native checkbox does.
   */
  indeterminate?: boolean
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, indeterminate, className = '', ...props }, ref) => {
    const autoId = useId()
    // A caller's id wins, and the label follows it — otherwise `htmlFor`
    // would point at the generated id the input no longer carries.
    const id = props.id ?? autoId
    const inner = React.useRef<HTMLInputElement | null>(null)
    const setRef = React.useCallback(
      (el: HTMLInputElement | null) => {
        inner.current = el
        if (typeof ref === 'function') ref(el)
        else if (ref) ref.current = el
      },
      [ref],
    )
    React.useEffect(() => {
      if (inner.current) inner.current.indeterminate = !!indeterminate
    }, [indeterminate])

    const errorClasses = error
      ? 'border-danger-accent text-danger-accent focus:ring-danger-accent'
      : 'border-line text-accent focus:ring-accent'

    return (
      <div className="flex items-center gap-2">
        <input
          ref={setRef}
          type="checkbox"
          aria-checked={indeterminate ? 'mixed' : undefined}
          className={cn(`
            h-4 w-4 rounded
            ${errorClasses}
            border-2
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:cursor-not-allowed disabled:opacity-50`, className)}
          {...props}
          id={id}
        />
        {label && (
          <label htmlFor={id} className="text-sm text-ink-2 cursor-pointer">
            {label}
          </label>
        )}
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'

// ==========================================
// Switch
// ==========================================

interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type'> {
  checked: boolean
  onChange: (checked: boolean) => void
  /** Required unless `aria-label` is supplied some other way — a bare toggle has no name. */
  'aria-label'?: string
  /** Visible text label to the right; also names the control when aria-label is absent. */
  label?: string
}

/**
 * On/off toggle (CMS-canonical — the chatbot enable switch). A button with
 * role="switch", not a checkbox: it flips immediately and never sits in a form.
 */
const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onChange, label, className = '', disabled, 'aria-label': ariaLabel, ...props }, ref) => {
    const id = useId()
    const control = (
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-[44px] shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:opacity-50 disabled:cursor-not-allowed',
          checked ? 'bg-accent' : 'bg-input border border-line',
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            'absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-on-accent shadow-sm transition-[left] duration-200 ease-out',
            checked ? 'left-[22px]' : 'left-0.5',
          )}
        />
      </button>
    )
    if (!label) return control
    return (
      <div className="flex items-center gap-2.5">
        {control}
        <label htmlFor={id} className="text-sm text-ink-2 cursor-pointer">
          {label}
        </label>
      </div>
    )
  }
)
Switch.displayName = 'Switch'

// ==========================================
// Radio
// ==========================================

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: boolean
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const id = useId()

    const errorClasses = error
      ? 'border-danger-accent text-danger-accent focus:ring-danger-accent'
      : 'border-line text-accent focus:ring-accent'

    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="radio"
          id={id}
          className={cn(`
            h-4 w-4
            ${errorClasses}
            border-2
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:cursor-not-allowed disabled:opacity-50`, className)}
          {...props}
        />
        {label && (
          <label htmlFor={id} className="text-sm text-ink-2 cursor-pointer">
            {label}
          </label>
        )}
      </div>
    )
  }
)
Radio.displayName = 'Radio'

// ==========================================
// Field Hint
// ==========================================

interface HintProps {
  children: ReactNode
  className?: string
}

/**
 * Both `Hint` and `Error` collapse rather than appearing: a validation message
 * that pops into existence shoves the rest of the form down a line with no
 * indication of where it came from, which is how a user loses their place in a
 * long form the moment they mistype something.
 *
 * The exit only plays if the caller keeps the component mounted and empties its
 * children. `{error && <Form.Error>…}` unmounts the whole thing, so it enters
 * but cannot leave — which is why the message is keyed on its own text: a
 * *changed* message still re-animates.
 *
 * `onMount` is the difference between the two: an error is something that
 * *arrives*, so it earns an entrance wherever it turns up. A hint is usually
 * printed with the field, and eight hints unfolding on page load is a form
 * that looks like it is still loading.
 */
function Message({
  children,
  className,
  onMount = false,
  ...rest
}: { children: ReactNode; className: string; onMount?: boolean } & React.ComponentProps<
  typeof motion.p
>) {
  const variants = useVariants(collapse)

  return (
    <AnimatePresence initial={onMount} mode="wait">
      {children ? (
        <motion.p
          key={typeof children === 'string' ? children : 'message'}
          className={className}
          variants={variants}
          initial="hidden"
          animate="show"
          exit="hidden"
          // Inline so a caller's className cannot remove the clip the height
          // animation depends on.
          style={{ overflow: 'hidden' }}
          {...rest}
        >
          {children}
        </motion.p>
      ) : null}
    </AnimatePresence>
  )
}

function Hint({ children, className = '' }: HintProps) {
  return (
    <Message className={cn(`text-xs text-ink-2`, className)}>
      {children}
    </Message>
  )
}

// ==========================================
// Field Error
// ==========================================

interface ErrorProps {
  children: ReactNode
  className?: string
}

function FieldError({ children, className = '' }: ErrorProps) {
  return (
    <Message className={cn(`text-xs text-danger-accent`, className)} role="alert" onMount>
      {children}
    </Message>
  )
}

// ==========================================
// Input Group (with addons)
// ==========================================

interface InputGroupProps {
  children: ReactNode
  startAddon?: ReactNode
  endAddon?: ReactNode
  className?: string
}

function InputGroup({ children, startAddon, endAddon, className = '' }: InputGroupProps) {
  return (
    <div className={cn(`flex items-stretch`, className)}>
      {startAddon && (
        <div className="flex items-center px-3 bg-input border border-r-0 border-line rounded-l-[8px] text-sm text-ink-2">
          {startAddon}
        </div>
      )}
      <div className="flex-1">{children}</div>
      {endAddon && (
        <div className="flex items-center px-3 bg-input border border-l-0 border-line rounded-r-[8px] text-sm text-ink-2">
          {endAddon}
        </div>
      )}
    </div>
  )
}

// ==========================================
// Export as namespace
// ==========================================

export const Form = {
  Field,
  Label,
  TextInput,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Switch,
  Hint,
  Error: FieldError,
  InputGroup,
}
