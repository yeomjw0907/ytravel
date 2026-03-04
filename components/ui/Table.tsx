"use client";

import { type ReactNode } from "react";

export interface TableProps {
  children: ReactNode;
  className?: string;
}

/**
 * 공급처별 비교 표 스타일 (06-design-system 9.2, 12-component-spec §5)
 * 첫 열 공급처, 둘째 열 총액, 이후 취소/조식/세금/결제, 마지막 열 액션
 */
export function Table({ children, className = "" }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-wt-lg border border-wt-border bg-wt-panel">
      <table className={`w-full border-collapse text-wt-body-sm ${className}`}>{children}</table>
    </div>
  );
}

export function TableHead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <thead className="border-b border-wt-border bg-wt-surface">
      <tr className={className}>{children}</tr>
    </thead>
  );
}

export function TableHeaderCell({
  children,
  align = "left",
  className = "",
}: {
  children: ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}) {
  const alignClass = align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
  return (
    <th
      className={`px-wt-3 py-wt-3 text-wt-caption font-medium text-wt-text-secondary ${alignClass} ${className}`}
      scope="col"
    >
      {children}
    </th>
  );
}

export function TableBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <tbody className={className}>{children}</tbody>;
}

export function TableRow({
  children,
  className = "",
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <tr
      className={`border-b border-wt-border last:border-b-0 ${hover ? "hover:bg-wt-info-bg/30" : ""} ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  align = "left",
  className = "",
}: {
  children: ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}) {
  const alignClass = align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
  return (
    <td className={`px-wt-3 py-wt-3 text-wt-text-primary ${alignClass} ${className}`}>{children}</td>
  );
}
