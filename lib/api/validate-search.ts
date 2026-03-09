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

export function validateSearchBody(
  body: unknown
): ValidationResult | ValidationError {
  if (body == null || typeof body !== "object") {
    return {
      ok: false,
      code: "INVALID_REQUEST",
      message: "Request body is required.",
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
      message: "Check-in and check-out dates are required.",
    };
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
    return {
      ok: false,
      code: "INVALID_DATE_RANGE",
      message: "Dates are invalid.",
    };
  }

  if (checkOutDate <= checkInDate) {
    return {
      ok: false,
      code: "INVALID_DATE_RANGE",
      message: "Check-out must be later than check-in.",
    };
  }

  if (!Number.isInteger(adults) || adults < 1) {
    return {
      ok: false,
      code: "INVALID_REQUEST",
      message: "Adults must be at least 1.",
    };
  }

  if (!Number.isInteger(rooms) || rooms < 1) {
    return {
      ok: false,
      code: "INVALID_REQUEST",
      message: "Rooms must be at least 1.",
    };
  }

  if (!Number.isFinite(userBookedPrice) || userBookedPrice <= 0) {
    return {
      ok: false,
      code: "INVALID_REQUEST",
      message: "Booked price must be greater than 0.",
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
