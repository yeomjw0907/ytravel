"use client";

import { forwardRef, useId, type SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: boolean;
  className?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error = false, className = "", id, ...rest }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-wt-1">
        {label && (
          <label htmlFor={selectId} className="text-wt-body-sm font-medium text-wt-text-primary">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full rounded-wt-md border-2 bg-wt-panel px-wt-3 py-wt-2.5 text-wt-body-md text-wt-text-primary transition-colors focus-wt disabled:bg-wt-surface disabled:text-wt-text-secondary ${
            error ? "border-wt-danger-text" : "border-wt-border hover:border-wt-brand-300"
          } ${className}`}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";
