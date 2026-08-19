/**
 * Form Component System
 *
 * Inspired by Strapi's form patterns:
 * - Composable field components
 * - Automatic error handling
 * - Accessibility built-in
 * - Focus management
 */
import React, { ReactNode } from 'react';
interface FieldProps {
    children: ReactNode;
    error?: string;
    hint?: string;
    required?: boolean;
    className?: string;
}
declare function Field({ children, error, className }: FieldProps): React.JSX.Element;
interface LabelProps {
    children: ReactNode;
    htmlFor?: string;
    required?: boolean;
    action?: ReactNode;
    className?: string;
}
declare function Label({ children, htmlFor, required, action, className }: LabelProps): React.JSX.Element;
interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    error?: boolean;
    size?: 'sm' | 'md' | 'lg';
}
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    error?: boolean;
    size?: 'sm' | 'md' | 'lg';
}
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: boolean;
}
interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: boolean;
}
interface HintProps {
    children: ReactNode;
    className?: string;
}
declare function Hint({ children, className }: HintProps): React.JSX.Element;
interface ErrorProps {
    children: ReactNode;
    className?: string;
}
declare function FieldError({ children, className }: ErrorProps): React.JSX.Element;
interface InputGroupProps {
    children: ReactNode;
    startAddon?: ReactNode;
    endAddon?: ReactNode;
    className?: string;
}
declare function InputGroup({ children, startAddon, endAddon, className }: InputGroupProps): React.JSX.Element;
export declare const Form: {
    Field: typeof Field;
    Label: typeof Label;
    TextInput: React.ForwardRefExoticComponent<TextInputProps & React.RefAttributes<HTMLInputElement>>;
    Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
    Select: {
        ({ error, size, children, className, value, onChange, disabled, ...props }: SelectProps): React.JSX.Element;
        displayName: string;
    };
    Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;
    Radio: React.ForwardRefExoticComponent<RadioProps & React.RefAttributes<HTMLInputElement>>;
    Hint: typeof Hint;
    Error: typeof FieldError;
    InputGroup: typeof InputGroup;
};
export {};
//# sourceMappingURL=Form.d.ts.map