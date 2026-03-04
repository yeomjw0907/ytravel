"use client";

import { type ReactNode } from "react";

export type StatusPillVariant = "success" | "warning" | "danger" | "info" | "neutral";

const variantClasses: Record<StatusPillVariant, string> = {
  success: "wt-status-success",
  warning: "wt-status-warning",
  danger: "wt-status-danger",
  info: "wt-status-info",
  neutral: "wt-status-neutral",
};

export interface StatusPillProps {
  variant: StatusPillVariant;
  children: ReactNode;
  className?: string;
}

/**
 * BRG 상태·수집 상태·비교 가능 여부 등 (06-design-system 8.6, 12-component-spec §7)
 * 라벨 2~8자, 색상만이 아니라 명시적 텍스트 포함.
 */
export function StatusPill({ variant, children, className = "" }: StatusPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-wt-pill px-wt-3 py-wt-1 text-wt-caption font-medium ${variantClasses[variant]} ${className}`}
      role="status"
    >
      {children}
    </span>
  );
}
