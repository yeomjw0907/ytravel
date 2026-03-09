import type { Hotel } from "@/lib/types/schema";
import { amadeusResolveHotel } from "@/lib/api/amadeus";
import { findHotelByQuery } from "@/lib/mock/hotels";

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

/**
 * 검색 시 호텔 1건 해상도. 실제 데이터 우선, 없으면 mock.
 * 1) Amadeus 설정 시: by-keyword API로 해상도 시도
 * 2) 실패/미설정: mock 목록에서 호텔명·목적지로 검색
 */
export async function resolveHotelForSearch(
  hotelName: string,
  destination: string | null
): Promise<Hotel | null> {
  const fromAmadeus = await amadeusResolveHotel(hotelName, destination ?? undefined);
  if (fromAmadeus) return fromAmadeus;
  return findHotelByQuery(hotelName, destination) ?? null;
}
