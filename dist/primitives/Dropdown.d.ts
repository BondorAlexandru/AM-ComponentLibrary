/**
 * Dropdown — fully custom, token-styled replacement for native <select>.
 *
 * Native selects render an OS popup that can't be themed; this renders its own
 * listbox (same portal/flip logic as ui/Menu). Drop-in friendly: it accepts
 * <option> children like a real select and calls onChange with a synthetic
 * { target: { value } }, so existing `(e) => e.target.value` handlers work.
 */
import React, { ReactNode } from 'react';
export interface DropdownOption {
    value: string;
    label: ReactNode;
    disabled?: boolean;
}
export interface DropdownChangeEvent {
    target: {
        value: string;
    };
}
interface DropdownProps {
    value: string | undefined;
    onChange: (e: DropdownChangeEvent) => void;
    /** Either pass options, or <option> children (parsed like a native select). */
    options?: DropdownOption[];
    children?: ReactNode;
    placeholder?: string;
    disabled?: boolean;
    /** Trigger styling. Overrides the default field look entirely when set. */
    className?: string;
    'aria-label'?: string;
    title?: string;
}
export declare function Dropdown({ value, onChange, options, children, placeholder, disabled, className, 'aria-label': ariaLabel, title, }: DropdownProps): React.JSX.Element;
export {};
//# sourceMappingURL=Dropdown.d.ts.map