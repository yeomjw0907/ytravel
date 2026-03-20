import type { RateCondition, RateOffer } from "@/lib/types/schema";

const COLLECTED_AT = "2026-03-09T10:00:00.000Z";

/** Optional: add provider IDs here to simulate fetch failure. */
export const MOCK_FAILED_PROVIDER_IDS = new Set<string>();

function buildCondition(
  overrides: Partial<RateCondition> = {}
): RateCondition {
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

function withDeeplink(
  offers: RateOffer[],
  deeplinksByProvider: Partial<Record<string, string>>
): RateOffer[] {
  return offers.map((offer) => ({
    ...offer,
    deeplink: deeplinksByProvider[offer.providerId] ?? offer.deeplink,
  }));
}

const OFFERS_GH_SEOUL: RateOffer[] = [
  {
    id: "offer_trip_gh_1",
    hotelId: "hotel_gh_seoul",
    providerId: "trip-com",
    providerType: "ota",
    deeplink: "https://www.trip.com/hotels/",
    currency: "KRW",
    basePrice: 248000,
    taxAmount: 20000,
    totalPrice: 268000,
    collectedAt: COLLECTED_AT,
    condition: buildCondition(),
    rawRoomName: "King Room - Free Cancellation",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
  {
    id: "offer_traveloka_gh_1",
    hotelId: "hotel_gh_seoul",
    providerId: "traveloka",
    providerType: "ota",
    deeplink: "https://www.traveloka.com/en-en/hotel",
    currency: "KRW",
    basePrice: 255000,
    taxAmount: 18000,
    totalPrice: 273000,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({ paymentType: "pay_later" }),
    rawRoomName: "King Room - Pay Later",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
  {
    id: "offer_vio_gh_1",
    hotelId: "hotel_gh_seoul",
    providerId: "vio",
    providerType: "ota",
    deeplink: "https://www.vio.com/",
    currency: "KRW",
    basePrice: 238000,
    taxAmount: 17000,
    totalPrice: 255000,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({ boardType: "breakfast_included" }),
    rawRoomName: "King Room with Breakfast",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
];

const OFFERS_PP_LONDON: RateOffer[] = [
  {
    id: "offer_trip_pp_1",
    hotelId: "hotel_pp_westminster",
    providerId: "trip-com",
    providerType: "ota",
    deeplink: "https://www.trip.com/hotels/",
    currency: "GBP",
    basePrice: 198,
    taxAmount: 25,
    totalPrice: 223,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({
      roomName: "Superior Double Room",
      occupancy: 2,
    }),
    rawRoomName: "Superior Double - Free Cancellation",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
  {
    id: "offer_traveloka_pp_1",
    hotelId: "hotel_pp_westminster",
    providerId: "traveloka",
    providerType: "ota",
    deeplink: "https://www.traveloka.com/en-en/hotel",
    currency: "GBP",
    basePrice: 205,
    taxAmount: 21,
    totalPrice: 226,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({
      roomName: "Superior Double Room",
      paymentType: "pay_later",
    }),
    rawRoomName: "Superior Double - Pay Later",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
  {
    id: "offer_vio_pp_1",
    hotelId: "hotel_pp_westminster",
    providerId: "vio",
    providerType: "ota",
    deeplink: "https://www.vio.com/",
    currency: "GBP",
    basePrice: 190,
    taxAmount: 24,
    totalPrice: 214,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({
      roomName: "Superior Twin Room",
      bedType: "twin",
    }),
    rawRoomName: "Superior Twin Room",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
];

const OFFERS_STANDARD_NYC: RateOffer[] = [
  {
    id: "offer_trip_std_1",
    hotelId: "hotel_standard_highline",
    providerId: "trip-com",
    providerType: "ota",
    deeplink: "https://www.trip.com/hotels/",
    currency: "USD",
    basePrice: 342,
    taxAmount: 47,
    totalPrice: 389,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({
      roomName: "Standard King",
    }),
    rawRoomName: "Standard King - Free Cancellation",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
  {
    id: "offer_traveloka_std_1",
    hotelId: "hotel_standard_highline",
    providerId: "traveloka",
    providerType: "ota",
    deeplink: "https://www.traveloka.com/en-en/hotel",
    currency: "USD",
    basePrice: 355,
    taxAmount: 49,
    totalPrice: 404,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({
      roomName: "Standard King",
      paymentType: "pay_later",
    }),
    rawRoomName: "Standard King - Pay Later",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
  {
    id: "offer_vio_std_1",
    hotelId: "hotel_standard_highline",
    providerId: "vio",
    providerType: "ota",
    deeplink: "https://www.vio.com/",
    currency: "USD",
    basePrice: 334,
    taxAmount: 45,
    totalPrice: 379,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({
      roomName: "Standard King",
      boardType: "breakfast_included",
    }),
    rawRoomName: "Standard King with Breakfast",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
];

export function getMockOffersForHotel(
  hotelId: string,
  deeplinksByProvider: Partial<Record<string, string>> = {}
): RateOffer[] {
  if (hotelId === "hotel_gh_seoul") {
    return withDeeplink(OFFERS_GH_SEOUL, deeplinksByProvider);
  }
  if (hotelId === "hotel_pp_westminster") {
    return withDeeplink(OFFERS_PP_LONDON, deeplinksByProvider);
  }
  if (hotelId === "hotel_standard_highline") {
    return withDeeplink(OFFERS_STANDARD_NYC, deeplinksByProvider);
  }
  return [];
}
