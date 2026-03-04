import type { RateOffer, RateCondition } from "@/lib/types/schema";

const COLLECTED_AT = "2026-03-04T12:00:00.000Z";

function condition(overrides: Partial<RateCondition> = {}): RateCondition {
  return {
    roomName: "King Room",
    boardType: "room_only",
    cancellationType: "free_cancellation",
    paymentType: "pay_now",
    taxIncluded: true,
    occupancy: 2,
    bedType: "king",
    viewType: null,
    notes: [],
    ...overrides,
  };
}

/** 그랜드 하얏트 서울 (KRW) */
const OFFERS_GH_SEOUL: RateOffer[] = [
  {
    id: "offer_official_1",
    hotelId: "hotel_gh_seoul",
    providerId: "official",
    providerType: "official",
    deeplink: "https://www.hyatt.com/ko-KR/hotel/korea/grand-hyatt-seoul/selhr",
    currency: "KRW",
    basePrice: 290_000,
    taxAmount: 30_000,
    totalPrice: 320_000,
    collectedAt: COLLECTED_AT,
    condition: condition(),
    rawRoomName: "1 King Bed Standard Room",
    available: true,
    disclaimer: null,
  },
  {
    id: "offer_trip_1",
    hotelId: "hotel_gh_seoul",
    providerId: "trip-com",
    providerType: "ota",
    deeplink: "https://www.trip.com/hotels/seoul-grand-hyatt-detail",
    currency: "KRW",
    basePrice: 248_000,
    taxAmount: 20_000,
    totalPrice: 268_000,
    collectedAt: COLLECTED_AT,
    condition: condition(),
    rawRoomName: "King Room - Free Cancellation",
    available: true,
    disclaimer: null,
  },
  {
    id: "offer_agoda_1",
    hotelId: "hotel_gh_seoul",
    providerId: "agoda",
    providerType: "ota",
    deeplink: "https://www.agoda.com/grand-hyatt-seoul",
    currency: "KRW",
    basePrice: 262_000,
    taxAmount: 23_000,
    totalPrice: 285_000,
    collectedAt: COLLECTED_AT,
    condition: condition({ paymentType: "pay_later" }),
    rawRoomName: "King Room - Pay at Hotel",
    available: true,
    disclaimer: null,
  },
  // 그랜드 하얏트 서울 - 트윈 룸 (룸타입별 비교 데모)
  {
    id: "offer_official_1_twin",
    hotelId: "hotel_gh_seoul",
    providerId: "official",
    providerType: "official",
    deeplink: "https://www.hyatt.com/ko-KR/hotel/korea/grand-hyatt-seoul/selhr",
    currency: "KRW",
    basePrice: 270_000,
    taxAmount: 28_000,
    totalPrice: 298_000,
    collectedAt: COLLECTED_AT,
    condition: condition({ roomName: "Twin Room", bedType: "twin" }),
    rawRoomName: "2 Twin Beds Standard Room",
    available: true,
    disclaimer: null,
  },
  {
    id: "offer_trip_1_twin",
    hotelId: "hotel_gh_seoul",
    providerId: "trip-com",
    providerType: "ota",
    deeplink: "https://www.trip.com/hotels/seoul-grand-hyatt-detail",
    currency: "KRW",
    basePrice: 232_000,
    taxAmount: 18_000,
    totalPrice: 250_000,
    collectedAt: COLLECTED_AT,
    condition: condition({ roomName: "Twin Room", bedType: "twin" }),
    rawRoomName: "Twin Room - Free Cancellation",
    available: true,
    disclaimer: null,
  },
  {
    id: "offer_agoda_1_twin",
    hotelId: "hotel_gh_seoul",
    providerId: "agoda",
    providerType: "ota",
    deeplink: "https://www.agoda.com/grand-hyatt-seoul",
    currency: "KRW",
    basePrice: 245_000,
    taxAmount: 21_000,
    totalPrice: 266_000,
    collectedAt: COLLECTED_AT,
    condition: condition({ roomName: "Twin Room", bedType: "twin", paymentType: "pay_later" }),
    rawRoomName: "Twin Room - Pay at Hotel",
    available: true,
    disclaimer: null,
  },
];

/** Park Plaza Westminster Bridge London (GBP) */
const OFFERS_PP_LONDON: RateOffer[] = [
  {
    id: "offer_pp_official_1",
    hotelId: "hotel_pp_westminster",
    providerId: "official",
    providerType: "official",
    deeplink: "https://www.parkplaza.com/london-hotels/park-plaza-westminster-bridge-london",
    currency: "GBP",
    basePrice: 220,
    taxAmount: 28,
    totalPrice: 248,
    collectedAt: COLLECTED_AT,
    condition: condition(),
    rawRoomName: "Superior Double Room",
    available: true,
    disclaimer: null,
  },
  {
    id: "offer_pp_trip_1",
    hotelId: "hotel_pp_westminster",
    providerId: "trip-com",
    providerType: "ota",
    deeplink: "https://www.trip.com/hotels/london-park-plaza-westminster-detail",
    currency: "GBP",
    basePrice: 198,
    taxAmount: 25,
    totalPrice: 223,
    collectedAt: COLLECTED_AT,
    condition: condition(),
    rawRoomName: "Superior Double - Free Cancellation",
    available: true,
    disclaimer: null,
  },
  {
    id: "offer_pp_agoda_1",
    hotelId: "hotel_pp_westminster",
    providerId: "agoda",
    providerType: "ota",
    deeplink: "https://www.agoda.com/park-plaza-westminster-bridge-london",
    currency: "GBP",
    basePrice: 205,
    taxAmount: 26,
    totalPrice: 231,
    collectedAt: COLLECTED_AT,
    condition: condition({ paymentType: "pay_later" }),
    rawRoomName: "Superior Double - Pay at Hotel",
    available: true,
    disclaimer: null,
  },
];

/** The Standard, High Line New York (USD) */
const OFFERS_STANDARD_NYC: RateOffer[] = [
  {
    id: "offer_std_official_1",
    hotelId: "hotel_standard_highline",
    providerId: "official",
    providerType: "official",
    deeplink: "https://www.standardhotels.com/hotels/new-york",
    currency: "USD",
    basePrice: 380,
    taxAmount: 52,
    totalPrice: 432,
    collectedAt: COLLECTED_AT,
    condition: condition(),
    rawRoomName: "Standard King",
    available: true,
    disclaimer: null,
  },
  {
    id: "offer_std_trip_1",
    hotelId: "hotel_standard_highline",
    providerId: "trip-com",
    providerType: "ota",
    deeplink: "https://www.trip.com/hotels/new-york-standard-high-line-detail",
    currency: "USD",
    basePrice: 342,
    taxAmount: 47,
    totalPrice: 389,
    collectedAt: COLLECTED_AT,
    condition: condition(),
    rawRoomName: "Standard King - Free Cancellation",
    available: true,
    disclaimer: null,
  },
  {
    id: "offer_std_agoda_1",
    hotelId: "hotel_standard_highline",
    providerId: "agoda",
    providerType: "ota",
    deeplink: "https://www.agoda.com/the-standard-high-line-new-york",
    currency: "USD",
    basePrice: 355,
    taxAmount: 49,
    totalPrice: 404,
    collectedAt: COLLECTED_AT,
    condition: condition({ paymentType: "pay_later" }),
    rawRoomName: "Standard King - Pay at Hotel",
    available: true,
    disclaimer: null,
  },
];

/**
 * Mock RateOffer: 국내(KRW)·해외(USD, GBP) 호텔별 공식 + OTA 요금.
 * Booking.com은 수집 실패 시나리오로 offer 없음 (fetchStatus에서 처리)
 */
export function getMockOffersForHotel(hotelId: string): RateOffer[] {
  if (hotelId === "hotel_gh_seoul") return [...OFFERS_GH_SEOUL];
  if (hotelId === "hotel_pp_westminster") return [...OFFERS_PP_LONDON];
  if (hotelId === "hotel_standard_highline") return [...OFFERS_STANDARD_NYC];
  return [];
}

/**
 * Mock: Booking.com 수집 실패 시뮬레이션용 (이 호텔에서는 offer 반환 안 함)
 */
export const MOCK_FAILED_PROVIDER_IDS = new Set(["booking-com"]);
