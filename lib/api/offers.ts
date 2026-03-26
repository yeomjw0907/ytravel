import type {
  Hotel,
  OfferDataMode,
  Provider,
  ProviderFetchStatus,
  RateOffer,
  SearchQuery,
} from "@/lib/types/schema";
import {
  amadeusHotelOffers,
  isAmadeusConfigured,
  isAmadeusOffersEnabled,
} from "@/lib/api/amadeus";
import { MOCK_FAILED_PROVIDER_IDS, getMockOffersForHotel } from "@/lib/mock/offers";
import {
  buildProviderSearchUrl,
  buildProviderOutboundLink,
  getAutomatedProviders,
  getProviderById,
  getReferenceProviders,
} from "@/lib/mock/providers";

const OFFERS_CACHE_TTL_MS = 15 * 60 * 1000;

type OfferCollectionResult = {
  providers: Provider[];
  offers: RateOffer[];
  fetchStatuses: ProviderFetchStatus[];
  dataMode: OfferDataMode;
};

const offersCache = new Map<
  string,
  {
    expiresAt: number;
    value: OfferCollectionResult;
  }
>();

function cacheKey(hotelId: string, query: SearchQuery): string {
  return [
    "offers",
    hotelId,
    query.checkIn,
    query.checkOut,
    String(query.adults),
    String(query.children),
    String(query.rooms),
    query.currency,
    query.locale,
    query.hotelName,
  ].join("|");
}

function toProviderId(value: string): string {
  const v = value.trim().toLowerCase();
  return v.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "amadeus";
}

function mapAmadeusRawPaymentType(
  raw: string | null
): "pay_now" | "pay_later" | "pay_at_hotel" | "unknown" {
  const v = (raw ?? "").toLowerCase();
  if (!v) return "unknown";
  if (v.includes("guarantee") || v.includes("prepay") || v.includes("deposit")) {
    return "pay_now";
  }
  if (v.includes("pay") && v.includes("hotel")) return "pay_at_hotel";
  if (v.includes("hold") || v.includes("later")) return "pay_later";
  return "unknown";
}

function mapAmadeusRawCancellationType(
  raw: string | null
): "free_cancellation" | "non_refundable" | "partial_refund" | "unknown" {
  const v = (raw ?? "").toLowerCase();
  if (!v) return "unknown";
  if (v.includes("non") && v.includes("refund")) return "non_refundable";
  if (v.includes("free")) return "free_cancellation";
  if (v.includes("refund") || v.includes("penalty") || v.includes("partial")) {
    return "partial_refund";
  }
  return "unknown";
}

function buildReferenceCollection(
  hotel: Hotel,
  query: SearchQuery,
  fetchedAt: string
): OfferCollectionResult {
  const providers = getReferenceProviders();
  const deeplinksByProvider = Object.fromEntries(
    providers.map((provider) => [
      provider.id,
      buildProviderOutboundLink(provider.id, hotel, {
        hotelId: hotel.id,
        hotelName: hotel.nameDisplay ?? hotel.name,
        destination: query.destination ?? hotel.city,
        checkIn: query.checkIn,
        checkOut: query.checkOut,
        adults: query.adults,
        children: query.children,
        rooms: query.rooms,
        locale: query.locale,
      }),
    ])
  );

  const offers = getMockOffersForHotel(hotel.id, deeplinksByProvider).filter(
    (offer) => !MOCK_FAILED_PROVIDER_IDS.has(offer.providerId)
  );

  return {
    providers,
    offers,
    fetchStatuses: providers.map((provider) => ({
      providerId: provider.id,
      status: MOCK_FAILED_PROVIDER_IDS.has(provider.id) ? "failed" : "reference",
      message: MOCK_FAILED_PROVIDER_IDS.has(provider.id)
        ? "이번 검색에서는 이 공급처의 참고 후보를 만들지 못했습니다."
        : "이번 주 오픈 버전에서는 실시간 API 대신 동일 조건 탐색용 참고 후보를 제공합니다.",
      latencyMs: null,
      fetchedAt,
    })),
    dataMode: "reference",
  };
}

async function buildLiveCollection(
  hotel: Hotel,
  query: SearchQuery,
  fetchedAt: string
): Promise<OfferCollectionResult | null> {
  if (!isAmadeusConfigured() || !isAmadeusOffersEnabled()) return null;

  try {
    const raw = await amadeusHotelOffers(
      hotel.id,
      query.checkIn,
      query.checkOut,
      query.adults,
      query.rooms
    );

    const providers = getAutomatedProviders();
    if (providers.length === 0) return null;

    const mapped: RateOffer[] = raw.map((offer) => {
      const providerId = toProviderId("amadeus");
      const total = offer.total;
      const base =
        offer.base != null && offer.base > 0 && offer.base <= total
          ? offer.base
          : total;
      const taxAmount = total - base;

      return {
        id: `amadeus_${offer.offerId}`,
        hotelId: hotel.id,
        providerId,
        providerType: "ota",
        deeplink:
          offer.deeplink ??
          buildProviderSearchUrl(providerId, {
            hotelName: hotel.nameDisplay ?? hotel.name,
            destination: query.destination ?? hotel.city,
            checkIn: query.checkIn,
            checkOut: query.checkOut,
            adults: query.adults,
            children: query.children,
            rooms: query.rooms,
            locale: query.locale,
          }),
        linkKind: offer.deeplink ? "hotel_detail" : "provider_home",
        hotelDetailUrl: offer.deeplink,
        currency: offer.currency,
        basePrice: base,
        taxAmount: taxAmount > 0 ? taxAmount : null,
        totalPrice: total,
        collectedAt: offer.collectedAt ?? fetchedAt,
        condition: {
          roomName: offer.roomName || "Unknown room",
          boardType: "unknown",
          cancellationType: mapAmadeusRawCancellationType(offer.cancellationTypeRaw),
          paymentType: mapAmadeusRawPaymentType(offer.paymentTypeRaw),
          taxIncluded: null,
          occupancy: offer.adults ?? query.adults,
          bedType: null,
          viewType: null,
          notes: [],
        },
        rawRoomName: offer.rawRoomName,
        available: true,
        disclaimer: "Rates are provided by Amadeus and may change at booking time.",
      };
    });

    return {
      providers,
      offers: mapped,
      fetchStatuses: [
        {
          providerId: "amadeus",
          status: mapped.length > 0 ? "success" : "partial",
          message:
            mapped.length > 0
              ? "실시간 요금을 확인했습니다."
              : "실시간 API는 연결되었지만 현재 조건과 일치하는 요금을 찾지 못했습니다.",
          latencyMs: null,
          fetchedAt,
        },
      ],
      dataMode: "live",
    };
  } catch {
    return null;
  }
}

/**
 * Returns normalized offers plus provider-level fetch results.
 * Live providers are preferred when enabled; otherwise we fall back to
 * launch-safe reference candidates with condition-preserving outbound links.
 */
export async function getOfferCollection(
  hotel: Hotel,
  query: SearchQuery
): Promise<OfferCollectionResult> {
  const key = cacheKey(hotel.id, query);
  const cached = offersCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const fetchedAt = new Date().toISOString();
  const live = await buildLiveCollection(hotel, query, fetchedAt);
  const value = live ?? buildReferenceCollection(hotel, query, fetchedAt);

  offersCache.set(key, {
    expiresAt: Date.now() + OFFERS_CACHE_TTL_MS,
    value,
  });

  return value;
}

export async function getOffersForHotel(
  hotel: Hotel,
  query: SearchQuery
): Promise<RateOffer[]> {
  const result = await getOfferCollection(hotel, query);
  return result.offers;
}

export function getProviderForOffer(providerId: string): Provider | undefined {
  return getProviderById(providerId);
}
