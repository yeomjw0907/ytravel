"use client";

import { Button, Input, Select } from "@/components/ui";
import { DateRangeField } from "./DateRangeField";
import { HotelAutocomplete } from "./HotelAutocomplete";

const ADULT_OPTIONS = Array.from({ length: 6 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}`,
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
  { value: "pay_later", label: "나중에 결제" },
  { value: "pay_at_hotel", label: "현장 결제" },
  { value: "unknown", label: "모름" },
];

export function SearchForm() {
  return (
    <form
      action="/search"
      method="get"
      className="hero-search-form flex w-full flex-col gap-wt-5"
    >
      <input type="hidden" name="locale" value="ko-KR" />
      <input type="hidden" name="children" value="0" />
      <input type="hidden" name="destination" value="" />

      {/* 4열 그리드로 통일: 같은 열(날짜↔통화, 내 예약가↔성인/객실) 정렬 */}
      <div className="grid grid-cols-1 gap-wt-4 sm:grid-cols-4 sm:gap-wt-4">
        <div className="sm:col-span-4">
          <HotelAutocomplete
            name="hotelName"
            label="호텔"
            placeholder="예: 그랜드 하얏트 서울"
            required
          />
        </div>
        <div className="flex flex-col justify-end sm:col-span-2 sm:min-h-[4.5rem]">
          <DateRangeField checkInName="checkIn" checkOutName="checkOut" />
        </div>
        <div className="flex flex-col justify-end sm:col-span-2 sm:min-h-[4.5rem]">
          <Input
            label="내 예약가"
            name="userBookedPrice"
            type="number"
            min="1"
            step="1"
            placeholder="320000"
            required
          />
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
            label="객실 수"
            name="rooms"
            options={ROOM_OPTIONS}
            defaultValue="1"
          />
        </div>
      </div>

      {/* 선택: 예약 조건 (접이식) — 눈에 띄는 블록 + 설명 제목 */}
      <details className="hero-form-details group rounded-wt-md border-2 border-wt-border bg-wt-surface">
        <summary className="flex cursor-pointer list-none items-center gap-wt-2 px-wt-4 py-wt-3 [&::-webkit-details-marker]:hidden">
          <span
            className="inline-block shrink-0 text-wt-text-secondary transition-transform group-open:rotate-90"
            aria-hidden
          >
            ▶
          </span>
          <span>예약 조건 (선택)</span>
          <span className="text-wt-caption font-normal text-wt-text-secondary">
            — 매칭 정확도 향상
          </span>
        </summary>
        <div className="border-t border-wt-border px-wt-4 pb-wt-4 pt-wt-3">
          <p className="hero-form-details__title">조식·취소·세금·결제 등 입력 시 더 정확한 비교가 가능합니다.</p>
          <div className="grid grid-cols-2 gap-wt-4 sm:grid-cols-4">
          <Input
            label="객실명 (선택)"
            name="roomName"
            placeholder="비우면 전체 비교"
            className="sm:col-span-2"
          />
          <Select
            label="조식"
            name="bookedBoardType"
            options={BOARD_OPTIONS}
            defaultValue="room_only"
          />
          <Select
            label="취소 규정"
            name="bookedCancellationType"
            options={CANCELLATION_OPTIONS}
            defaultValue="free_cancellation"
          />
          <Select
            label="세금"
            name="bookedTaxIncluded"
            options={TAX_OPTIONS}
            defaultValue="true"
          />
          <Select
            label="결제"
            name="bookedPaymentType"
            options={PAYMENT_OPTIONS}
            defaultValue="pay_now"
          />
          </div>
        </div>
      </details>

      <Button type="submit" variant="primary" size="lg" className="h-12 w-full">
        내 예약가 비교하기
      </Button>
    </form>
  );
}
