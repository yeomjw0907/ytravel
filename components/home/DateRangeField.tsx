"use client";

import { useEffect, useRef, useState } from "react";
import {
  formatDateShort,
  nightsBetween,
  todayISO,
  tomorrowISO,
} from "@/lib/search/format";

interface DateRangeFieldProps {
  checkInName: string;
  checkOutName: string;
  defaultValueCheckIn?: string;
  defaultValueCheckOut?: string;
}

export function DateRangeField({
  checkInName,
  checkOutName,
  defaultValueCheckIn = "",
  defaultValueCheckOut = "",
}: DateRangeFieldProps) {
  const [checkIn, setCheckIn] = useState(defaultValueCheckIn || todayISO());
  const [checkOut, setCheckOut] = useState(
    defaultValueCheckOut || tomorrowISO()
  );
  const [open, setOpen] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const checkInMin = todayISO();
  const checkOutMin = checkIn || checkInMin;
  const nights = nightsBetween(checkIn, checkOut);

  const displayText =
    checkIn && checkOut
      ? `${formatDateShort(checkIn)} - ${formatDateShort(checkOut)}`
      : "날짜 선택";

  return (
    <div className="relative flex flex-col gap-wt-1" ref={popRef}>
      <label className="text-wt-body-sm font-medium text-wt-text-primary">
        체크인 / 체크아웃
      </label>
      <input type="hidden" name={checkInName} value={checkIn} readOnly />
      <input type="hidden" name={checkOutName} value={checkOut} readOnly />

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex min-h-[44px] w-full items-center justify-between gap-wt-2 rounded-wt-md border-2 border-wt-border bg-wt-panel px-wt-3 py-wt-2.5 text-left text-wt-body-md text-wt-text-primary transition-colors hover:border-wt-brand-300 focus-wt"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span>{displayText}</span>
        <span className="flex shrink-0 items-center gap-wt-1.5 text-wt-body-sm">
          {nights > 0 && (
            <span className="rounded bg-wt-surface px-wt-1.5 py-wt-0.5 text-wt-caption font-medium text-wt-text-secondary">
              {nights}박
            </span>
          )}
          <span className="text-wt-text-secondary" aria-hidden>
            {open ? "▲" : "▼"}
          </span>
        </span>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 z-20 mt-wt-1 w-full min-w-[280px] max-w-[calc(100vw-2.5rem)] rounded-wt-lg border border-wt-border bg-wt-panel shadow-wt-soft md:min-w-[320px]"
          role="dialog"
          aria-label="체크인 체크아웃 날짜 선택"
        >
          <div className="border-b border-wt-border px-wt-4 py-wt-3">
            <p className="text-wt-body-sm font-medium text-wt-text-primary">
              숙박 기간 선택
            </p>
            <p className="mt-wt-0.5 text-wt-caption text-wt-text-secondary">
              체크인과 체크아웃 날짜를 선택하세요.
            </p>
          </div>
          <div className="flex flex-col gap-wt-4 p-wt-4">
            <div className="grid grid-cols-2 gap-wt-4">
              <div>
                <label
                  htmlFor="date-range-checkin"
                  className="text-wt-caption font-medium text-wt-text-secondary"
                >
                  체크인
                </label>
                <input
                  id="date-range-checkin"
                  type="date"
                  min={checkInMin}
                  value={checkIn}
                  onChange={(e) => {
                    const nextCheckIn = e.target.value;
                    setCheckIn(nextCheckIn);

                    if (checkOut && nextCheckIn >= checkOut) {
                      const nextDate = new Date(nextCheckIn);
                      nextDate.setDate(nextDate.getDate() + 1);
                      setCheckOut(nextDate.toISOString().slice(0, 10));
                    }
                  }}
                  className="mt-wt-1.5 w-full rounded-wt-md border border-wt-border bg-wt-panel px-wt-3 py-wt-2 text-wt-body-md text-wt-text-primary focus-wt"
                />
              </div>
              <div>
                <label
                  htmlFor="date-range-checkout"
                  className="text-wt-caption font-medium text-wt-text-secondary"
                >
                  체크아웃
                </label>
                <input
                  id="date-range-checkout"
                  type="date"
                  min={checkOutMin}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="mt-wt-1.5 w-full rounded-wt-md border border-wt-border bg-wt-panel px-wt-3 py-wt-2 text-wt-body-md text-wt-text-primary focus-wt"
                />
              </div>
            </div>
            {nights > 0 && (
              <p className="text-wt-caption text-wt-text-secondary">
                숙박 일수: {nights}박
              </p>
            )}
            <div className="flex justify-end border-t border-wt-border pt-wt-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-wt-md bg-wt-brand-700 px-wt-4 py-wt-2 text-wt-body-sm font-medium text-white hover:bg-wt-brand-500 focus-wt"
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
