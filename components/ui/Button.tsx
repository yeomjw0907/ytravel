"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-wt-brand-700 text-wt-bg hover:bg-wt-brand-500 active:bg-wt-brand-800 disabled:bg-wt-brand-100 disabled:text-wt-text-secondary",
  secondary:
    "bg-transparent text-wt-brand-700 border-2 border-wt-brand-700 hover:bg-wt-info-bg active:border-wt-brand-800 disabled:border-wt-border disabled:text-wt-border",
  ghost:
    "bg-transparent text-wt-text-primary hover:bg-wt-surface active:bg-wt-border disabled:text-wt-text-secondary",
  danger:
    "bg-wt-danger-text text-wt-bg hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 min-w-[72px] px-wt-3 text-wt-body-sm",
  md: "h-11 min-w-[88px] px-wt-4 text-wt-body-sm",
  lg: "h-[52px] min-w-[100px] px-wt-5 text-wt-body-md",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

/**
 * 디자인 시스템 8.1: primary / secondary / ghost / danger, sm·md·lg
 * 한 화면 주 CTA는 하나만 primary. danger는 위험 동작에만.
 */
export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-wt-md font-medium transition-colors duration-200 focus-wt disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
