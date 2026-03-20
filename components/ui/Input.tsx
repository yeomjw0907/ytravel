"use client";

import { forwardRef, useId, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error = false, className = "", id, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-wt-1">
        {label && (
          <label htmlFor={inputId} className="text-wt-body-sm font-medium text-wt-text-primary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-wt-md border bg-wt-panel px-wt-3 py-wt-2 text-wt-body-md text-wt-text-primary placeholder:text-wt-text-secondary transition-colors focus-wt disabled:bg-wt-surface disabled:text-wt-text-secondary ${
            error
              ? "border-wt-danger-text focus-visible:ring-wt-danger-text/30"
              : "border-wt-border hover:border-wt-brand-300 focus-visible:ring-wt-brand-500/20"
          } ${className}`}
          {...rest}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
