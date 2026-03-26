"use client";

import { useId, useMemo, useState } from "react";
import { Button, Input, Select } from "@/components/ui";
import { trackEvent } from "@/lib/analytics/client";
import { DateRangeField } from "./DateRangeField";
import { HotelAutocomplete } from "./HotelAutocomplete";

function formatWithComma(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits === "") return "";
  return Number(digits).toLocaleString("ko-KR");
}

function normalizeChildAges(value: string): string {
  return value
    .split(",")
    .map((part) => part.replace(/\D/g, "").trim())
    .filter(Boolean)
    .join(",");
}

function UserBookedPriceInput() {
  const id = useId();
  const [raw, setRaw] = useState("");
  const display = raw === "" ? "" : formatWithComma(raw);

  return (
    <div className="flex flex-col gap-wt-1">
      <label
        htmlFor={id}
        className="text-wt-body-sm font-medium text-wt-text-primary"
      >
        예약가
      </label>
      <input
        type="hidden"
        name="userBookedPrice"
        value={raw.replace(/\D/g, "")}
        readOnly
      />
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="320,000"
        required
        minLength={1}
        value={display}
        onChange={(e) => {
          const next = e.target.value.replace(/\D/g, "");
          setRaw(next);
        }}
        className="min-h-[44px] w-full rounded-wt-md border-2 border-wt-border bg-wt-panel px-wt-3 py-wt-2.5 text-wt-body-md text-wt-text-primary placeholder:text-wt-text-secondary transition-colors hover:border-wt-brand-300 focus-wt focus-visible:ring-wt-brand-500/20 disabled:bg-wt-surface disabled:text-wt-text-secondary"
      />
    </div>
  );
}

const ADULT_OPTIONS = Array.from({ length: 6 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}`,
}));

const CHILD_OPTIONS = Array.from({ length: 5 }, (_, i) => ({
  value: String(i),
  label: `${i}`,
}));

const ROOM_OPTIONS = Array.from({ length: 3 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}`,
}));

const CURRENCY_OPTIONS = [
  { value: "KRW", label: "KRW" },
  { value: "USD", label: "USD" },
  { value: "GBP", label: "GBP" },
];

const BOARD_OPTIONS = [
  { value: "room_only", label: "객실만" },
  { value: "breakfast_included", label: "조식 포함" },
  { value: "half_board", label: "하프보드" },
  { value: "unknown", label: "모름" },
];

const CANCELLATION_OPTIONS = [
  { value: "free_cancellation", label: "무료 취소" },
  { value: "non_refundable", label: "환불 불가" },
  { value: "partial_refund", label: "부분 환불" },
  { value: "unknown", label: "모름" },
];

const TAX_OPTIONS = [
  { value: "true", label: "세금 포함" },
  { value: "false", label: "세금 별도" },
  { value: "", label: "모름" },
];

const PAYMENT_OPTIONS = [
  { value: "pay_now", label: "즉시 결제" },
  { value: "pay_later", label: "나중 결제" },
  { value: "pay_at_hotel", label: "현장 결제" },
  { value: "unknown", label: "모름" },
];

export function SearchForm() {
  const [children, setChildren] = useState("0");
  const [childAgeInput, setChildAgeInput] = useState("");
  const normalizedChildAges = useMemo(
    () => normalizeChildAges(childAgeInput),
    [childAgeInput]
  );
  const childCount = Number(children) || 0;

  return (
    <form
      action="/search"
      method="get"
      className="hero-search-form flex w-full flex-col gap-wt-5"
      onSubmit={() => {
        trackEvent("search_start", { surface: "hero_form" });
      }}
    >
      <input type="hidden" name="locale" value="ko-KR" />
      <input type="hidden" name="children" value={children} />
      <input type="hidden" name="childAges" value={normalizedChildAges} />
      <input type="hidden" name="destination" value="" />

      <div className="grid grid-cols-1 gap-wt-4 sm:grid-cols-4 sm:gap-wt-4">
        <div className="sm:col-span-4">
          <HotelAutocomplete
            name="hotelName"
            label="호텔"
            placeholder="예: Grand Hyatt Seoul"
            required
          />
        </div>
        <div className="flex flex-col justify-end sm:col-span-2 sm:min-h-[4.5rem]">
          <DateRangeField checkInName="checkIn" checkOutName="checkOut" />
        </div>
        <div className="flex flex-col justify-end sm:col-span-2 sm:min-h-[4.5rem]">
          <UserBookedPriceInput />
        </div>
        <div className="sm:col-span-1">
          <Select
            label="통화"
            name="currency"
            options={CURRENCY_OPTIONS}
            defaultValue="KRW"
          />
        </div>
        <div className="sm:col-span-1">
          <Select
            label="성인"
            name="adults"
            options={ADULT_OPTIONS}
            defaultValue="2"
          />
        </div>
        <div className="sm:col-span-1">
          <Select
            label="아동"
            name="children_visible"
            options={CHILD_OPTIONS}
            value={children}
            onChange={(e) => setChildren(e.target.value)}
          />
        </div>
        <div className="sm:col-span-1">
          <Select
            label="객실 수"
            name="rooms"
            options={ROOM_OPTIONS}
            defaultValue="1"
          />
        </div>
        {childCount > 0 && (
          <div className="sm:col-span-2">
            <Input
              label="아동 나이"
              placeholder="예: 6,3"
              value={childAgeInput}
              onChange={(e) => setChildAgeInput(e.target.value)}
            />
            <p className="mt-wt-1 text-wt-caption text-wt-text-secondary">
              쉼표로 구분해 입력해 주세요. 예: 6,3
            </p>
          </div>
        )}
      </div>

      <details className="hero-form-details group rounded-wt-md border-2 border-wt-border bg-wt-surface">
        <summary className="flex cursor-pointer list-none items-center gap-wt-2 px-wt-4 py-wt-3 [&::-webkit-details-marker]:hidden">
          <span
            className="inline-block shrink-0 text-wt-text-secondary transition-transform group-open:rotate-90"
            aria-hidden
          >
            ▶
          </span>
          <span>예약 조건 더 입력하기</span>
          <span className="text-wt-caption font-normal text-wt-text-secondary">
            정확한 비교를 원할 때
          </span>
        </summary>
        <div className="border-t border-wt-border px-wt-4 pb-wt-4 pt-wt-3">
          <p className="hero-form-details__title">
            객실명, 조식, 취소, 세금, 결제 조건을 입력하면 더 보수적으로 비교합니다.
          </p>
          <div className="grid grid-cols-2 gap-wt-4 sm:grid-cols-4">
            <Input
              label="객실명(선택)"
              name="roomName"
              placeholder="예: King Room"
              className="sm:col-span-2"
            />
            <Select
              label="조식"
              name="bookedBoardType"
              options={BOARD_OPTIONS}
              defaultValue="unknown"
            />
            <Select
              label="취소 규정"
              name="bookedCancellationType"
              options={CANCELLATION_OPTIONS}
              defaultValue="unknown"
            />
            <Select
              label="세금"
              name="bookedTaxIncluded"
              options={TAX_OPTIONS}
              defaultValue=""
            />
            <Select
              label="결제"
              name="bookedPaymentType"
              options={PAYMENT_OPTIONS}
              defaultValue="unknown"
            />
          </div>
        </div>
      </details>

      <Button type="submit" variant="primary" size="lg" className="h-12 w-full">
        예약가 다시 비교하기
      </Button>
    </form>
  );
}
