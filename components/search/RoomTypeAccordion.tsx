"use client";

import { useState } from "react";

interface RoomTypeAccordionProps {
  title: string;
  /** 접혀 있을 때 헤더에 보여줄 문구 (예: "예상 BRG가 ₩240,000") */
  summary: string;
  /** 접힌 헤더에 표시할 공식 홈페이지 링크 (객실별 공식 오퍼 deeplink) */
  officialLink?: string | null;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/**
 * 객실 타입별 아코디언. 접혀 있으면 객실명 + 예상 BRG가 + 공식 바로가기, 펼치면 가격 비교 전체 표시.
 */
export function RoomTypeAccordion({
  title,
  summary,
  officialLink,
  defaultOpen = false,
  children,
}: RoomTypeAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border border-wt-border rounded-wt-xl overflow-hidden bg-wt-panel shadow-wt-card">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((prev) => !prev);
          }
        }}
        className="flex w-full flex-wrap items-center gap-wt-3 px-wt-5 py-wt-4 text-left hover:bg-wt-bg/60 focus-wt transition-colors cursor-pointer"
        aria-expanded={open}
        aria-controls={`room-content-${title.replace(/\s/g, "-")}`}
        id={`room-trigger-${title.replace(/\s/g, "-")}`}
      >
        <span className="font-display text-wt-h4 text-wt-text-primary">{title}</span>
        <span className="font-body text-wt-body-sm font-medium tabular-nums text-wt-brand-700">
          {summary}
        </span>
        {officialLink && !open && (
          <a
            href={officialLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            className="shrink-0 inline-flex h-9 items-center justify-center rounded-wt-md bg-wt-brand-700 px-wt-3 text-wt-body-sm font-medium text-white hover:bg-wt-brand-500 focus-wt"
          >
            공식 홈페이지 바로가기
          </a>
        )}
        <span
          className={`ml-auto shrink-0 text-wt-text-secondary transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <div
        id={`room-content-${title.replace(/\s/g, "-")}`}
        role="region"
        aria-labelledby={`room-trigger-${title.replace(/\s/g, "-")}`}
        hidden={!open}
        className="border-t border-wt-border"
      >
        {open && <div className="p-wt-5 md:p-wt-6">{children}</div>}
      </div>
    </section>
  );
}
