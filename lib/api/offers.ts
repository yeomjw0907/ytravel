import type { Hotel, RateOffer, SearchQuery } from "@/lib/types/schema";
import { getMockOffersForHotel } from "@/lib/mock/offers";

/**
 * 검색 조건에 맞는 OTA/공식 요금 목록 조회.
 * - 현재: mock만 사용.
 * - 실데이터 연동 시: Amadeus Hotel Search API 등 호출 후 RateOffer[] 변환, 실패 시 mock fallback.
 * @see docs/engineering/19-real-data-integration-guide.md
 */
export async function getOffersForHotel(
  hotel: Hotel,
  _query: SearchQuery
): Promise<RateOffer[]> {
  // TODO: Amadeus Hotel Search API 등 연동 시 여기서 호출 후 변환, 실패 시 아래 mock 사용
  // const fromAmadeus = await amadeusHotelOffers(hotel.id, query.checkIn, query.checkOut, query.adults, query.rooms);
  // if (fromAmadeus.length > 0) return fromAmadeus;
  return getMockOffersForHotel(hotel.id);
}
