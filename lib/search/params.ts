import type { SearchQuery } from "@/lib/types/schema";

export type ParamsResult =
  | { ok: true; query: SearchQuery }
  | { ok: false; reason: "missing" | "invalid_dates" | "invalid_numbers"; message: string };

function getString(
  params: Record<string, string | string[] | undefined>,
  key: string
): string {
  const v = params[key];
  if (typeof v === "string") return v.trim();
  if (Array.isArray(v) && v.length > 0 && typeof v[0] === "string") return v[0].trim();
  return "";
}

function getNumber(params: Record<string, string | string[] | undefined>, key: string, fallback: number): number {
  const v = params[key];
  if (v === undefined || v === null) return fallback;
  const n = typeof v === "string" ? parseInt(v, 10) : Number(v);
  return Number.isInteger(n) && n >= 0 ? n : fallback;
}

/**
 * searchParams를 SearchQuery로 변환하고 유효성 검사.
 * 필수: hotelName, checkIn, checkOut. checkOut > checkIn, adults >= 1, rooms >= 1.
 */
export function searchParamsToQuery(
  params: Record<string, string | string[] | undefined>
): ParamsResult {
  const hotelName = getString(params, "hotelName");
  const checkIn = getString(params, "checkIn");
  const checkOut = getString(params, "checkOut");
  const adults = getNumber(params, "adults", 2);
  const children = getNumber(params, "children", 0);
  const rooms = getNumber(params, "rooms", 1);
  const currency = getString(params, "currency") || "KRW";
  const locale = getString(params, "locale") || "ko-KR";
  const destination = getString(params, "destination") || null;

  if (!hotelName) {
    return { ok: false, reason: "missing", message: "호텔명을 입력해 주세요." };
  }
  if (!checkIn || !checkOut) {
    return { ok: false, reason: "missing", message: "체크인·체크아웃 날짜를 입력해 주세요." };
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
    return { ok: false, reason: "invalid_dates", message: "날짜 형식이 올바르지 않습니다." };
  }
  if (checkOutDate <= checkInDate) {
    return { ok: false, reason: "invalid_dates", message: "체크아웃은 체크인 이후여야 합니다." };
  }
  if (adults < 1) {
    return { ok: false, reason: "invalid_numbers", message: "투숙 인원은 1명 이상이어야 합니다." };
  }
  if (rooms < 1) {
    return { ok: false, reason: "invalid_numbers", message: "객실 수는 1개 이상이어야 합니다." };
  }

  const query: SearchQuery = {
    hotelName,
    destination: destination || null,
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
