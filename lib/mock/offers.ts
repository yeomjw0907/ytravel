import type {
  ProviderLinkKind,
  RateCondition,
  RateOffer,
} from "@/lib/types/schema";

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
  deeplinksByProvider: Partial<
    Record<
      string,
      {
        url: string;
        linkKind: ProviderLinkKind;
        hotelDetailUrl: string | null;
      }
    >
  >
): RateOffer[] {
  return offers.map((offer) => ({
    ...offer,
    deeplink: deeplinksByProvider[offer.providerId]?.url ?? offer.deeplink,
    linkKind:
      deeplinksByProvider[offer.providerId]?.linkKind ?? offer.linkKind,
    hotelDetailUrl:
      deeplinksByProvider[offer.providerId]?.hotelDetailUrl ??
      offer.hotelDetailUrl,
  }));
}

const OFFERS_GH_SEOUL: RateOffer[] = [
  {
    id: "offer_trip_gh_1",
    hotelId: "hotel_gh_seoul",
    providerId: "trip-com",
    providerType: "ota",
    deeplink: "https://www.trip.com/hotels/",
    linkKind: "provider_home",
    hotelDetailUrl: null,
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
    linkKind: "provider_home",
    hotelDetailUrl: null,
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
    linkKind: "provider_home",
    hotelDetailUrl: null,
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
    linkKind: "provider_home",
    hotelDetailUrl: null,
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
    linkKind: "provider_home",
    hotelDetailUrl: null,
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
    linkKind: "provider_home",
    hotelDetailUrl: null,
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
    linkKind: "provider_home",
    hotelDetailUrl: null,
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
    linkKind: "provider_home",
    hotelDetailUrl: null,
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
    linkKind: "provider_home",
    hotelDetailUrl: null,
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

const OFFERS_PHUKET_MARRIOTT: RateOffer[] = [
  {
    id: "offer_booking_phuket_1",
    hotelId: "hotel_phuket_marriott_merlin_beach",
    providerId: "booking",
    providerType: "ota",
    deeplink: "https://www.booking.com/",
    linkKind: "provider_home",
    hotelDetailUrl: null,
    currency: "THB",
    basePrice: 13280,
    taxAmount: 2260,
    totalPrice: 15540,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({
      roomName: "Deluxe Room",
      occupancy: 2,
    }),
    rawRoomName: "Deluxe Room - Free Cancellation",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
  {
    id: "offer_expedia_phuket_1",
    hotelId: "hotel_phuket_marriott_merlin_beach",
    providerId: "expedia",
    providerType: "ota",
    deeplink: "https://www.expedia.com/",
    linkKind: "provider_home",
    hotelDetailUrl: null,
    currency: "THB",
    basePrice: 13720,
    taxAmount: 2360,
    totalPrice: 16080,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({
      roomName: "Deluxe Room",
      occupancy: 2,
    }),
    rawRoomName: "Deluxe Room - Pay Now",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
  {
    id: "offer_hotels_com_phuket_1",
    hotelId: "hotel_phuket_marriott_merlin_beach",
    providerId: "hotels-com",
    providerType: "ota",
    deeplink: "https://www.hotels.com/",
    linkKind: "provider_home",
    hotelDetailUrl: null,
    currency: "THB",
    basePrice: 13540,
    taxAmount: 2350,
    totalPrice: 15890,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({
      roomName: "Deluxe Room",
      occupancy: 2,
    }),
    rawRoomName: "Deluxe Room - Free Cancellation",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
  {
    id: "offer_travelocity_phuket_1",
    hotelId: "hotel_phuket_marriott_merlin_beach",
    providerId: "travelocity",
    providerType: "ota",
    deeplink: "https://www.travelocity.com/",
    linkKind: "provider_home",
    hotelDetailUrl: null,
    currency: "THB",
    basePrice: 13610,
    taxAmount: 2310,
    totalPrice: 15920,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({
      roomName: "Deluxe Room",
      occupancy: 2,
    }),
    rawRoomName: "Deluxe Room - Free Cancellation",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
  {
    id: "offer_stayforlong_phuket_1",
    hotelId: "hotel_phuket_marriott_merlin_beach",
    providerId: "stayforlong",
    providerType: "ota",
    deeplink: "https://www.stayforlong.com/",
    linkKind: "provider_home",
    hotelDetailUrl: null,
    currency: "THB",
    basePrice: 13860,
    taxAmount: 2370,
    totalPrice: 16230,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({
      roomName: "Deluxe Room",
      occupancy: 2,
    }),
    rawRoomName: "Deluxe Room",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
  {
    id: "offer_trip_phuket_1",
    hotelId: "hotel_phuket_marriott_merlin_beach",
    providerId: "trip-com",
    providerType: "ota",
    deeplink: "https://www.trip.com/hotels/",
    linkKind: "provider_home",
    hotelDetailUrl: null,
    currency: "THB",
    basePrice: 13470,
    taxAmount: 2310,
    totalPrice: 15780,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({
      roomName: "Deluxe Room",
      occupancy: 2,
    }),
    rawRoomName: "Deluxe Room - Free Cancellation",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
  {
    id: "offer_traveloka_phuket_1",
    hotelId: "hotel_phuket_marriott_merlin_beach",
    providerId: "traveloka",
    providerType: "ota",
    deeplink: "https://www.traveloka.com/en-th/hotel",
    linkKind: "provider_home",
    hotelDetailUrl: null,
    currency: "THB",
    basePrice: 14020,
    taxAmount: 2330,
    totalPrice: 16350,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({
      roomName: "Deluxe Room",
      occupancy: 2,
      paymentType: "pay_later",
    }),
    rawRoomName: "Deluxe Room - Pay Later",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
  {
    id: "offer_webjet_phuket_1",
    hotelId: "hotel_phuket_marriott_merlin_beach",
    providerId: "webjet",
    providerType: "ota",
    deeplink: "https://www.webjet.com.au/",
    linkKind: "provider_home",
    hotelDetailUrl: null,
    currency: "THB",
    basePrice: 13790,
    taxAmount: 2320,
    totalPrice: 16110,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({
      roomName: "Deluxe Room",
      occupancy: 2,
    }),
    rawRoomName: "Deluxe Room",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
  {
    id: "offer_interpark_phuket_1",
    hotelId: "hotel_phuket_marriott_merlin_beach",
    providerId: "interpark",
    providerType: "ota",
    deeplink: "https://travel.interpark.com/",
    linkKind: "provider_home",
    hotelDetailUrl: null,
    currency: "THB",
    basePrice: 13680,
    taxAmount: 2310,
    totalPrice: 15990,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({
      roomName: "Deluxe Room",
      occupancy: 2,
    }),
    rawRoomName: "Deluxe Room - Instant Confirmation",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
  {
    id: "offer_almosafer_phuket_1",
    hotelId: "hotel_phuket_marriott_merlin_beach",
    providerId: "almosafer",
    providerType: "ota",
    deeplink: "https://global.almosafer.com/",
    linkKind: "provider_home",
    hotelDetailUrl: null,
    currency: "THB",
    basePrice: 14110,
    taxAmount: 2330,
    totalPrice: 16440,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({
      roomName: "Deluxe Room",
      occupancy: 2,
    }),
    rawRoomName: "Deluxe Room",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
  {
    id: "offer_sms_phuket_1",
    hotelId: "hotel_phuket_marriott_merlin_beach",
    providerId: "smshoteldeals",
    providerType: "ota",
    deeplink: "https://smshoteldeals.com/",
    linkKind: "provider_home",
    hotelDetailUrl: null,
    currency: "THB",
    basePrice: 13510,
    taxAmount: 2310,
    totalPrice: 15820,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({
      roomName: "Deluxe Room",
      occupancy: 2,
    }),
    rawRoomName: "Deluxe Room",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
  {
    id: "offer_hotelsugogo_phuket_1",
    hotelId: "hotel_phuket_marriott_merlin_beach",
    providerId: "hotelsugogo",
    providerType: "ota",
    deeplink: "https://hotelsugogo.com/",
    linkKind: "provider_home",
    hotelDetailUrl: null,
    currency: "THB",
    basePrice: 13530,
    taxAmount: 2320,
    totalPrice: 15850,
    collectedAt: COLLECTED_AT,
    condition: buildCondition({
      roomName: "Deluxe Room",
      occupancy: 2,
    }),
    rawRoomName: "Deluxe Room",
    available: true,
    disclaimer: "Reference data. Recheck the same conditions on the provider site.",
  },
];

export function getMockOffersForHotel(
  hotelId: string,
  deeplinksByProvider: Partial<
    Record<
      string,
      {
        url: string;
        linkKind: ProviderLinkKind;
        hotelDetailUrl: string | null;
      }
    >
  > = {}
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
  if (hotelId === "hotel_phuket_marriott_merlin_beach") {
    return withDeeplink(OFFERS_PHUKET_MARRIOTT, deeplinksByProvider);
  }
  return [];
}
