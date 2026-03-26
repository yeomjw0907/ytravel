import type {
  BoardType,
  CancellationType,
  PaymentType,
  SearchQuery,
} from "@/lib/types/schema";

export type SearchValidationError =
  | "INVALID_REQUEST"
  | "INVALID_DATE_RANGE"
  | "HOTEL_NOT_FOUND"
  | "NO_RESULTS";

export interface ValidationResult {
  ok: true;
  query: SearchQuery;
}

export interface ValidationError {
  ok: false;
  code: SearchValidationError;
  message: string;
}

function toBoardType(value: unknown): BoardType {
  if (value === "room_only") return "room_only";
  if (value === "breakfast_included") return "breakfast_included";
  if (value === "half_board") return "half_board";
  return "unknown";
}

function toCancellationType(value: unknown): CancellationType {
  if (value === "free_cancellation") return "free_cancellation";
  if (value === "non_refundable") return "non_refundable";
  if (value === "partial_refund") return "partial_refund";
  return "unknown";
}

function toPaymentType(value: unknown): PaymentType {
  if (value === "pay_now") return "pay_now";
  if (value === "pay_later") return "pay_later";
  if (value === "pay_at_hotel") return "pay_at_hotel";
  return "unknown";
}

function toNullableBoolean(value: unknown): boolean | null {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return null;
}

function toChildAges(value: unknown): number[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => Number(item))
      .filter((age) => Number.isInteger(age) && age >= 0);
  }

  if (typeof value !== "string") return [];

  return value
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((age) => Number.isInteger(age) && age >= 0);
}

export function validateSearchBody(
  body: unknown
): ValidationResult | ValidationError {
  if (body == null || typeof body !== "object") {
    return {
      ok: false,
      code: "INVALID_REQUEST",
      message: "요청 본문이 필요합니다.",
    };
  }

  const object = body as Record<string, unknown>;
  const hotelName =
    typeof object.hotelName === "string" ? object.hotelName.trim() : "";
  const checkIn = typeof object.checkIn === "string" ? object.checkIn : "";
  const checkOut = typeof object.checkOut === "string" ? object.checkOut : "";
  const roomName =
    typeof object.roomName === "string" ? object.roomName.trim() : "";
  const adults =
    typeof object.adults === "number" ? object.adults : Number(object.adults);
  const children =
    typeof object.children === "number"
      ? object.children
      : Number(object.children) || 0;
  const childAges = toChildAges(object.childAges);
  const rooms =
    typeof object.rooms === "number" ? object.rooms : Number(object.rooms);
  const userBookedPrice =
    typeof object.userBookedPrice === "number"
      ? object.userBookedPrice
      : Number(object.userBookedPrice);
  const currency =
    typeof object.currency === "string" ? object.currency : "KRW";
  const locale = typeof object.locale === "string" ? object.locale : "ko-KR";
  const destination =
    object.destination === null || object.destination === undefined
      ? null
      : typeof object.destination === "string"
        ? object.destination
        : null;

  if (!hotelName) {
    return {
      ok: false,
      code: "INVALID_REQUEST",
      message: "호텔명을 입력해 주세요.",
    };
  }

  if (!checkIn || !checkOut) {
    return {
      ok: false,
      code: "INVALID_REQUEST",
      message: "체크인과 체크아웃 날짜를 입력해 주세요.",
    };
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
    return {
      ok: false,
      code: "INVALID_DATE_RANGE",
      message: "날짜 형식이 올바르지 않습니다.",
    };
  }

  if (checkOutDate <= checkInDate) {
    return {
      ok: false,
      code: "INVALID_DATE_RANGE",
      message: "체크아웃 날짜는 체크인보다 뒤여야 합니다.",
    };
  }

  if (!Number.isInteger(adults) || adults < 1) {
    return {
      ok: false,
      code: "INVALID_REQUEST",
      message: "성인 인원은 1명 이상이어야 합니다.",
    };
  }

  if (!Number.isInteger(children) || children < 0) {
    return {
      ok: false,
      code: "INVALID_REQUEST",
      message: "아동 인원은 0명 이상이어야 합니다.",
    };
  }

  if (!Number.isInteger(rooms) || rooms < 1) {
    return {
      ok: false,
      code: "INVALID_REQUEST",
      message: "객실 수는 1개 이상이어야 합니다.",
    };
  }

  if (childAges.length > 0 && childAges.length !== children) {
    return {
      ok: false,
      code: "INVALID_REQUEST",
      message: "아동 인원과 나이 개수를 맞춰 주세요.",
    };
  }

  if (!Number.isFinite(userBookedPrice) || userBookedPrice <= 0) {
    return {
      ok: false,
      code: "INVALID_REQUEST",
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
      childAges,
      rooms,
      currency,
      locale,
      roomName,
      userBookedPrice,
      bookedBoardType: toBoardType(object.bookedBoardType),
      bookedCancellationType: toCancellationType(
        object.bookedCancellationType
      ),
      bookedTaxIncluded: toNullableBoolean(object.bookedTaxIncluded),
      bookedPaymentType: toPaymentType(object.bookedPaymentType),
    },
  };
}
