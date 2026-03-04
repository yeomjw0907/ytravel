import type { SearchQuery } from "@/lib/types/schema";

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

export function validateSearchBody(body: unknown): ValidationResult | ValidationError {
  if (body == null || typeof body !== "object") {
    return { ok: false, code: "INVALID_REQUEST", message: "요청 본문이 필요합니다." };
  }

  const o = body as Record<string, unknown>;
  const hotelName = typeof o.hotelName === "string" ? o.hotelName.trim() : "";
  const checkIn = typeof o.checkIn === "string" ? o.checkIn : "";
  const checkOut = typeof o.checkOut === "string" ? o.checkOut : "";
  const adults = typeof o.adults === "number" ? o.adults : Number(o.adults);
  const children = typeof o.children === "number" ? o.children : Number(o.children) || 0;
  const rooms = typeof o.rooms === "number" ? o.rooms : Number(o.rooms);
  const currency = typeof o.currency === "string" ? o.currency : "KRW";
  const locale = typeof o.locale === "string" ? o.locale : "ko-KR";
  const destination =
    o.destination === null || o.destination === undefined
      ? null
      : typeof o.destination === "string"
        ? o.destination
        : null;

  if (!hotelName) {
    return { ok: false, code: "INVALID_REQUEST", message: "호텔명을 입력해 주세요." };
  }
  if (!checkIn || !checkOut) {
    return { ok: false, code: "INVALID_REQUEST", message: "체크인·체크아웃 날짜가 필요합니다." };
  }
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
    return { ok: false, code: "INVALID_DATE_RANGE", message: "날짜 형식이 올바르지 않습니다." };
  }
  if (checkOutDate <= checkInDate) {
    return { ok: false, code: "INVALID_DATE_RANGE", message: "체크아웃은 체크인 이후여야 합니다." };
  }
  if (!Number.isInteger(adults) || adults < 1) {
    return { ok: false, code: "INVALID_REQUEST", message: "투숙 인원은 1명 이상이어야 합니다." };
  }
  if (!Number.isInteger(rooms) || rooms < 1) {
    return { ok: false, code: "INVALID_REQUEST", message: "객실 수는 1개 이상이어야 합니다." };
  }

  const query: SearchQuery = {
    hotelName,
    destination,
    checkIn,
    checkOut,
    adults,
    children,
    rooms,
    currency,
    locale,
  };

  return { ok: true, query };
}
