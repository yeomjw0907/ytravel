"use client";

import { type ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
  /** 호버 시 shadow 강화 (06-design-system 5.3) */
  hover?: boolean;
  /** 선택/강조 시 info 테두리 */
  selected?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-wt-4",
  md: "p-wt-6",
  lg: "p-wt-8",
};

/**
 * 디자인 시스템 5.3: white panel, shadow-card, 호버/선택 상태
 * 카드 내부 패딩 최소 20px 권장 (padding md 이상)
 */
export function Card({
  children,
  className = "",
  hover = false,
  selected = false,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`rounded-wt-xl border border-wt-border bg-wt-panel shadow-wt-card ${paddingClasses[padding]} ${
        hover ? "transition-shadow duration-200 hover:shadow-wt-soft" : ""
      } ${selected ? "ring-2 ring-wt-brand-500 ring-offset-2 ring-offset-wt-bg" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
