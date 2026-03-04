import type { SearchQuery } from "@/lib/types/schema";

/**
 * SearchQuery를 /search 또는 /hotel/[slug] 링크용 쿼리 스트링으로 변환.
 * 검색 결과 ↔ 호텔 상세 이동 시 컨텍스트 보존용.
 */
export function toSearchQueryString(query: SearchQuery): string {
  const p = new URLSearchParams();
  p.set("hotelName", query.hotelName);
  p.set("checkIn", query.checkIn);
  p.set("checkOut", query.checkOut);
  p.set("adults", String(query.adults));
  p.set("children", String(query.children));
  p.set("rooms", String(query.rooms));
  p.set("currency", query.currency);
  p.set("locale", query.locale);
  if (query.destination) p.set("destination", query.destination);
  return p.toString();
}

/**
 * 호텔 상세 페이지로 갈 때 검색 조건 유지 (slug 제외한 쿼리만)
 */
export function toHotelQueryString(query: SearchQuery): string {
  return toSearchQueryString(query);
}
