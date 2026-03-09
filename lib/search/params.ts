import type {
  BoardType,
  CancellationType,
  PaymentType,
  SearchQuery,
} from "@/lib/types/schema";

export type ParamsResult =
  | { ok: true; query: SearchQuery }
  | {
      ok: false;
      reason: "missing" | "invalid_dates" | "invalid_numbers";
      message: string;
    };

function getString(
  params: Record<string, string | string[] | undefined>,
  key: string
): string {
  const value = params[key];
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0].trim();
  }
  return "";
}

function getNumber(
  params: Record<string, string | string[] | undefined>,
  key: string,
  fallback: number
): number {
  const value = params[key];
  if (value === undefined || value === null) return fallback;
  const parsed = typeof value === "string" ? Number(value) : Number(value[0]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getBoardType(value: string): BoardType {
  if (value === "room_only") return "room_only";
  if (value === "breakfast_included") return "breakfast_included";
  if (value === "half_board") return "half_board";
  return "unknown";
}

function getCancellationType(value: string): CancellationType {
  if (value === "free_cancellation") return "free_cancellation";
  if (value === "non_refundable") return "non_refundable";
  if (value === "partial_refund") return "partial_refund";
  return "unknown";
}

function getPaymentType(value: string): PaymentType {
  if (value === "pay_now") return "pay_now";
  if (value === "pay_later") return "pay_later";
  if (value === "pay_at_hotel") return "pay_at_hotel";
  return "unknown";
}

function getNullableBoolean(value: string): boolean | null {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

export function searchParamsToQuery(
  params: Record<string, string | string[] | undefined>
): ParamsResult {
  const hotelName = getString(params, "hotelName");
  const checkIn = getString(params, "checkIn");
  const checkOut = getString(params, "checkOut");
  const roomName = getString(params, "roomName").trim() || "";
  const adults = getNumber(params, "adults", 2);
  const children = getNumber(params, "children", 0);
  const rooms = getNumber(params, "rooms", 1);
  const userBookedPrice = getNumber(params, "userBookedPrice", 0);
  const currency = getString(params, "currency") || "KRW";
  const locale = getString(params, "locale") || "ko-KR";
  const destination = getString(params, "destination") || null;
  const bookedBoardType = getBoardType(getString(params, "bookedBoardType"));
  const bookedCancellationType = getCancellationType(
    getString(params, "bookedCancellationType")
  );
  const bookedTaxIncluded = getNullableBoolean(
    getString(params, "bookedTaxIncluded")
  );
  const bookedPaymentType = getPaymentType(
    getString(params, "bookedPaymentType")
  );

  if (!hotelName) {
    return {
      ok: false,
      reason: "missing",
      message: "호텔명을 입력해 주세요.",
    };
  }

  if (!checkIn || !checkOut) {
    return {
      ok: false,
      reason: "missing",
      message: "체크인·체크아웃 날짜를 입력해 주세요.",
    };
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
    return {
      ok: false,
      reason: "invalid_dates",
      message: "날짜 형식이 올바르지 않습니다.",
    };
  }

  if (checkOutDate <= checkInDate) {
    return {
      ok: false,
      reason: "invalid_dates",
      message: "체크아웃은 체크인보다 이후여야 합니다.",
    };
  }

  if (!Number.isInteger(adults) || adults < 1) {
    return {
      ok: false,
      reason: "invalid_numbers",
      message: "성인 인원은 1명 이상이어야 합니다.",
    };
  }

  if (!Number.isInteger(rooms) || rooms < 1) {
    return {
      ok: false,
      reason: "invalid_numbers",
      message: "객실 수는 1실 이상이어야 합니다.",
    };
  }

  if (!Number.isFinite(userBookedPrice) || userBookedPrice <= 0) {
    return {
      ok: false,
      reason: "invalid_numbers",
      message: "예약가는 0보다 커야 합니다.",
    };
  }

  return {
    ok: true,
    query: {
      hotelName,
      destination,
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
      currency,
      locale,
      roomName: roomName || "",
      userBookedPrice,
      bookedBoardType,
      bookedCancellationType,
      bookedTaxIncluded,
      bookedPaymentType,
    },
  };
}
