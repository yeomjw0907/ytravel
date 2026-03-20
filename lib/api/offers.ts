import type { Hotel, RateOffer, SearchQuery } from "@/lib/types/schema";
import {
  amadeusHotelOffers,
  isAmadeusConfigured,
  isAmadeusOffersEnabled,
} from "@/lib/api/amadeus";
import { getMockOffersForHotel } from "@/lib/mock/offers";

const OFFERS_CACHE_TTL_MS = 15 * 60 * 1000;
const offersCache = new Map<
  string,
  {
    expiresAt: number;
    offers: RateOffer[];
  }
>();

function cacheKey(hotelId: string, query: SearchQuery): string {
  return [
    "offers",
    hotelId,
    query.checkIn,
    query.checkOut,
    String(query.adults),
    String(query.rooms),
    query.currency,
    query.locale,
  ].join("|");
}

function toProviderId(value: string): string {
  const v = value.trim().toLowerCase();
  return v.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "amadeus";
}

function mapAmadeusRawPaymentType(raw: string | null): "pay_now" | "pay_later" | "pay_at_hotel" | "unknown" {
  const v = (raw ?? "").toLowerCase();
  if (!v) return "unknown";
  if (v.includes("guarantee") || v.includes("prepay") || v.includes("deposit")) return "pay_now";
  if (v.includes("pay") && v.includes("hotel")) return "pay_at_hotel";
  if (v.includes("hold") || v.includes("later")) return "pay_later";
  return "unknown";
}

function mapAmadeusRawCancellationType(raw: string | null): "free_cancellation" | "non_refundable" | "partial_refund" | "unknown" {
  const v = (raw ?? "").toLowerCase();
  if (!v) return "unknown";
  if (v.includes("non") && v.includes("refund")) return "non_refundable";
  if (v.includes("free")) return "free_cancellation";
  if (v.includes("refund") || v.includes("penalty") || v.includes("partial")) return "partial_refund";
  return "unknown";
}

/**
 * 검색 조건에 맞는 OTA/공식 요금 목록 조회.
 * - 현재: mock만 사용.
 * - 실데이터 연동 시: Amadeus Hotel Search API 등 호출 후 RateOffer[] 변환, 실패 시 mock fallback.
 * @see docs/engineering/19-real-data-integration-guide.md
 */
export async function getOffersForHotel(
  hotel: Hotel,
  query: SearchQuery
): Promise<RateOffer[]> {
  const key = cacheKey(hotel.id, query);
  const cached = offersCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.offers;

  if (isAmadeusConfigured() && isAmadeusOffersEnabled()) {
    try {
      const raw = await amadeusHotelOffers(
        hotel.id,
        query.checkIn,
        query.checkOut,
        query.adults,
        query.rooms
      );

      if (raw.length > 0) {
        const collectedAt = raw[0]?.collectedAt ?? new Date().toISOString();
        const mapped: RateOffer[] = raw.map((o) => {
          const providerId = toProviderId("amadeus");
          const total = o.total;
          const base =
            o.base != null && o.base > 0 && o.base <= total ? o.base : total;
          const taxAmount = total - base;

          return {
            id: `amadeus_${o.offerId}`,
            hotelId: hotel.id,
            providerId,
            providerType: "ota",
            deeplink: o.deeplink ?? "",
            currency: o.currency,
            basePrice: base,
            taxAmount: taxAmount > 0 ? taxAmount : null,
            totalPrice: total,
            collectedAt: o.collectedAt ?? collectedAt,
            condition: {
              roomName: o.roomName || "Unknown room",
              boardType: "unknown",
              cancellationType: mapAmadeusRawCancellationType(o.cancellationTypeRaw),
              paymentType: mapAmadeusRawPaymentType(o.paymentTypeRaw),
              taxIncluded: null,
              occupancy: o.adults ?? query.adults,
              bedType: null,
              viewType: null,
              notes: [],
            },
            rawRoomName: o.rawRoomName,
            available: true,
            disclaimer: "Rates are provided by Amadeus and may change at booking time.",
          };
        });

        offersCache.set(key, {
          expiresAt: Date.now() + OFFERS_CACHE_TTL_MS,
          offers: mapped,
        });
        return mapped;
      }
    } catch {
      // ignore and fall back to mock
    }
  }

  const mock = getMockOffersForHotel(hotel.id);
  offersCache.set(key, { expiresAt: Date.now() + OFFERS_CACHE_TTL_MS, offers: mock });
  return mock;
}
