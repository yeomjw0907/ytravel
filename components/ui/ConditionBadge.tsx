"use client";

import { type ReactNode } from "react";

export type ConditionBadgeVariant = "neutral" | "success" | "warning" | "danger" | "info";

const variantClasses: Record<ConditionBadgeVariant, string> = {
  neutral: "wt-status-neutral",
  success: "wt-status-success",
  warning: "wt-status-warning",
  danger: "wt-status-danger",
  info: "wt-status-info",
};

export interface ConditionBadgeProps {
  variant?: ConditionBadgeVariant;
  children: ReactNode;
  className?: string;
}

/**
 * 객실 조건 요약용 캡슐 (06-design-system 8.5, 12-component-spec §8)
 * 예: 무료 취소, 조식 포함, 세금 포함, 선결제, 객실명 유사
 */
export function ConditionBadge({
  variant = "neutral",
  children,
  className = "",
}: ConditionBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-wt-pill px-wt-2 py-wt-1 text-wt-caption ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
