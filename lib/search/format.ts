/**
 * 검색 결과 UI용 포맷 (한국 원화 우선, 13-copywriting-guide)
 */

export function formatPrice(amount: number, currency: string): string {
  if (currency === "KRW") return `₩${amount.toLocaleString("ko-KR")}`;
  if (currency === "USD") return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  if (currency === "GBP") return `£${amount.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  if (currency === "EUR") return `€${amount.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  return `${currency} ${amount.toLocaleString()}`;
}

/** YYYY-MM-DD → "2026년 5월 10일" */
export function formatDateRange(checkIn: string, checkOut: string): string {
  const fmt = (s: string) => {
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
  };
  return `${fmt(checkIn)} - ${fmt(checkOut)}`;
}

/** YYYY-MM-DD → "2026. 5. 10." (캘린더 트리거 등 짧은 표시) */
export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "numeric", day: "numeric" });
}

/** 오늘 날짜 YYYY-MM-DD */
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** 내일 날짜 YYYY-MM-DD */
export function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

/** 체크인·체크아웃 사이 숙박 일수 (정수, 0 이상) */
export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;
  const diff = b.getTime() - a.getTime();
  return Math.max(0, Math.round(diff / (24 * 60 * 60 * 1000)));
}

/** 공급처 id → 표시명 (12-component-spec, 13-copywriting) */
export function getProviderDisplayName(providerId: string): string {
  const names: Record<string, string> = {
    official: "공식 홈페이지",
    "trip-com": "Trip.com",
    agoda: "Agoda",
    "booking-com": "Booking.com",
  };
  return names[providerId] ?? providerId;
}

/** 수집 시각 ISO → "3월 4일 21:00" 등 */
export function formatCollectedAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("ko-KR", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

/** 조건 라벨 (12-component-spec §8) */
export const CONDITION_LABELS = {
  boardType: {
    room_only: "조식 없음",
    breakfast_included: "조식 포함",
    half_board: "하프보드",
    unknown: "—",
  },
  cancellationType: {
    free_cancellation: "무료 취소",
    non_refundable: "환불 불가",
    partial_refund: "부분 환불",
    unknown: "—",
  },
  paymentType: {
    pay_now: "선결제",
    pay_later: "현장 결제",
    pay_at_hotel: "현장 결제",
    unknown: "—",
  },
} as const;
