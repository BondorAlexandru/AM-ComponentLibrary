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
import { Dropdown } from './Dropdown.js'
import { cn } from '../lib/cn.js'

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
      md: 'h-[var(--am-h-field-md,40px)] px-[13px] text-[var(--am-text-field-md,13.5px)]',
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
          w-full rounded-[var(--am-radius-control,8px)] px-[13px] py-[10px] text-[var(--am-text-field-md,13.5px)]
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
    md: 'h-[var(--am-h-field-md,40px)] pl-[13px] pr-[10px] text-[var(--am-text-field-md,13.5px)]',
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
  label?: string
  error?: boolean
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const id = useId()

    const errorClasses = error
      ? 'border-danger-accent text-danger-accent focus:ring-danger-accent'
      : 'border-line text-accent focus:ring-accent'

    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          className={cn(`
            h-4 w-4 rounded
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
Checkbox.displayName = 'Checkbox'

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

function Hint({ children, className = '' }: HintProps) {
  return (
    <p className={cn(`text-xs text-ink-2`, className)}>
      {children}
    </p>
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
    <p className={cn(`text-xs text-danger-accent`, className)} role="alert">
      {children}
    </p>
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
  Hint,
  Error: FieldError,
  InputGroup,
}
