/**
 * Formatting helpers used by the search and detail pages.
 */

export function formatPrice(amount: number, currency: string): string {
  if (currency === "KRW") return `KRW ${amount.toLocaleString("ko-KR")}`;
  if (currency === "USD") {
    return `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }
  if (currency === "GBP") {
    return `GBP ${amount.toLocaleString("en-GB", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }
  if (currency === "EUR") {
    return `EUR ${amount.toLocaleString("de-DE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
}

export function formatDateRange(checkIn: string, checkOut: string): string {
  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return `${formatDate(checkIn)} - ${formatDate(checkOut)}`;
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function tomorrowISO(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  const diff = end.getTime() - start.getTime();
  return Math.max(0, Math.round(diff / (24 * 60 * 60 * 1000)));
}

export function getProviderDisplayName(providerId: string): string {
  const names: Record<string, string> = {
    "trip-com": "Trip.com",
    traveloka: "Traveloka",
    vio: "Vio.com",
    kayak: "KAYAK",
    momondo: "momondo",
    wego: "Wego",
    trivago: "trivago",
    official: "Official site",
  };

  return names[providerId] ?? providerId;
}

export function formatCollectedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const CONDITION_LABELS = {
  boardType: {
    room_only: "Room only",
    breakfast_included: "Breakfast included",
    half_board: "Half board",
    unknown: "Unknown",
  },
  cancellationType: {
    free_cancellation: "Free cancellation",
    non_refundable: "Non-refundable",
    partial_refund: "Partial refund",
    unknown: "Unknown",
  },
  paymentType: {
    pay_now: "Pay now",
    pay_later: "Pay later",
    pay_at_hotel: "Pay at hotel",
    unknown: "Unknown",
  },
} as const;

/** UI용 한국어 조건 라벨 */
export const CONDITION_LABELS_KO = {
  boardType: {
    room_only: "객실만",
    breakfast_included: "조식 포함",
    half_board: "하프보드",
    unknown: "모름",
  },
  cancellationType: {
    free_cancellation: "무료 취소",
    non_refundable: "환불 불가",
    partial_refund: "부분 환불",
    unknown: "모름",
  },
  paymentType: {
    pay_now: "즉시 결제",
    pay_later: "나중에 결제",
    pay_at_hotel: "현장 결제",
    unknown: "모름",
  },
} as const;
