import type { Hotel } from "@/lib/types/schema";
import { amadeusResolveHotel } from "@/lib/api/amadeus";
import { findHotelByQuery } from "@/lib/mock/hotels";

export interface HotelsResponse {
  hotels: Hotel[];
}

/**
 * 클라이언트에서 호텔 목록을 조회할 때 사용하는 헬퍼입니다.
 */
export async function fetchHotels(): Promise<Hotel[]> {
  const res = await fetch("/api/hotels", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("호텔 목록을 불러오지 못했습니다.");
  }

  const data: HotelsResponse = await res.json();
  return data.hotels;
}

/**
 * 검색 시 호텔을 우선 실데이터로 맞춰 보고, 실패하면 로컬 목록으로 fallback 합니다.
 */
export async function resolveHotelForSearch(
  hotelName: string,
  destination: string | null
): Promise<Hotel | null> {
  const fromAmadeus = await amadeusResolveHotel(hotelName, destination ?? undefined);
  if (fromAmadeus) return fromAmadeus;
  return findHotelByQuery(hotelName, destination) ?? null;
}
