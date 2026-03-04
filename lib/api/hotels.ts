import type { Hotel } from "@/lib/types/schema";

export interface HotelsResponse {
  hotels: Hotel[];
}

/**
 * GET /api/hotels - 등록된 호텔 목록 조회 (클라이언트용).
 * 자동완성·유효 slug 검증 등에서 사용. 서버에서는 getHotels() 직접 사용.
 */
export async function fetchHotels(): Promise<Hotel[]> {
  const res = await fetch("/api/hotels", { cache: "no-store" });
  if (!res.ok) throw new Error("호텔 목록을 불러올 수 없습니다.");
  const data: HotelsResponse = await res.json();
  return data.hotels;
}
