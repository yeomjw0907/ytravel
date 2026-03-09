/**
 * Search service: user's booked price vs OTA candidates.
 * - Uses only automated providers (trip-com, traveloka, vio) for offers and fetch statuses.
 * - Fallback links are link-only sites (KAYAK, momondo, Wego, trivago) for manual check.
 * - Best candidate is chosen by match type (exact > close > reference_only) then by lowest price.
 */
import type {
  BrgConfidence,
  BrgEvaluation,
  MatchType,
  ProviderFetchStatus,
  RateOffer,
  SearchQuery,
  SearchResult,
} from "@/lib/types/schema";
import { resolveHotelForSearch } from "@/lib/api/hotels";
import { getOffersForHotel } from "@/lib/api/offers";
import { getFallbackLinks, getProviders } from "@/lib/mock/providers";
import { MOCK_FAILED_PROVIDER_IDS } from "@/lib/mock/offers";

interface OfferComparison {
  offer: RateOffer;
  matchType: MatchType;
  confidence: BrgConfidence;
  matchedFields: string[];
  mismatchedFields: string[];
  reasons: string[];
  priceGap: number;
  priceGapPercent: number;
}

export async function search(query: SearchQuery): Promise<SearchResult> {
  const now = new Date().toISOString();
  const providers = getProviders(); // automated only (trip-com, traveloka, vio)
  const hotel = await resolveHotelForSearch(query.hotelName, query.destination);
  // OTA 요금: lib/api/offers.ts에서 조회 (현재 mock, 실연동 시 getOffersForHotel 내부에서 API 호출)
  const offers = hotel ? await getOffersForHotel(hotel, query) : [];
  const fetchStatuses = buildFetchStatuses(
    providers.map((p) => p.id),
    now
  );
  const brgEvaluation =
    hotel && offers.length > 0
      ? evaluateBestCandidateAgainstUserBooking(offers, query)
      : null;

  const fallbackContext = {
    destination: hotel?.city ?? query.hotelName ?? "",
    checkIn: query.checkIn,
    checkOut: query.checkOut,
    adults: query.adults,
    rooms: query.rooms,
  };
  return {
    query,
    hotel,
    providers,
    offers,
    fetchStatuses,
    brgEvaluation,
    fallbackLinks: getFallbackLinks(fallbackContext),
    generatedAt: now,
  };
}

function buildFetchStatuses(
  providerIds: string[],
  fetchedAt: string
): ProviderFetchStatus[] {
  return providerIds.map((providerId) => {
    const isFailed = MOCK_FAILED_PROVIDER_IDS.has(providerId);
    return {
      providerId,
      status: isFailed ? "failed" : "success",
      message: isFailed ? "Provider fetch failed." : null,
      latencyMs: isFailed ? null : 500 + Math.floor(Math.random() * 300),
      fetchedAt,
    };
  });
}

export function evaluateBrgForOffers(
  offers: RateOffer[],
  query: SearchQuery
): BrgEvaluation {
  return evaluateBestCandidateAgainstUserBooking(offers, query);
}

/**
 * Compare user's booking to OTA offers and return the best candidate evaluation.
 * Match type: 0 mismatches = exact, 1 = close, 2+ = reference_only.
 * Confidence: exact → high, close → medium, reference_only → low.
 */
function evaluateBestCandidateAgainstUserBooking(
  offers: RateOffer[],
  query: SearchQuery
): BrgEvaluation {
  const otaOffers = offers.filter((o) => o.providerType === "ota");
  if (otaOffers.length === 0) {
    return {
      comparisonOfferId: null,
      comparisonProviderId: null,
      userBookedPrice: query.userBookedPrice,
      candidatePrice: null,
      priceGap: null,
      priceGapPercent: null,
      eligibility: "insufficient_data",
      confidence: "low",
      matchType: "none",
      matchedFields: [],
      mismatchedFields: [],
      reasons: ["No OTA candidates were found for this hotel."],
    };
  }

  const comparisons = otaOffers.map((offer) =>
    compareOfferAgainstUserBooking(offer, query)
  );
  const cheaper = comparisons.filter((c) => c.priceGap > 0);
  const ranked = (cheaper.length > 0 ? cheaper : comparisons).sort(
    compareRankedOffers
  );
  const best = ranked[0];

  if (!best) {
    return {
      comparisonOfferId: null,
      comparisonProviderId: null,
      userBookedPrice: query.userBookedPrice,
      candidatePrice: null,
      priceGap: null,
      priceGapPercent: null,
      eligibility: "insufficient_data",
      confidence: "low",
      matchType: "none",
      matchedFields: [],
      mismatchedFields: [],
      reasons: ["A candidate could not be ranked."],
    };
  }

  const eligibility =
    best.priceGap <= 0
      ? "not_eligible"
      : best.matchType === "exact"
        ? "likely"
        : "review";

  const reasons =
    best.priceGap > 0
      ? best.reasons
      : ["No cheaper candidate was found in supported automated sources."];

  return {
    comparisonOfferId: best.offer.id,
    comparisonProviderId: best.offer.providerId,
    userBookedPrice: query.userBookedPrice,
    candidatePrice: best.offer.totalPrice,
    priceGap: best.priceGap,
    priceGapPercent: best.priceGapPercent,
    eligibility,
    confidence: best.confidence,
    matchType: best.matchType,
    matchedFields: best.matchedFields,
    mismatchedFields: best.mismatchedFields,
    reasons,
  };
}

function compareOfferAgainstUserBooking(
  offer: RateOffer,
  query: SearchQuery
): OfferComparison {
  const matchedFields: string[] = [];
  const mismatchedFields: string[] = [];

  if (isSameRoomName(query.roomName, offer.condition.roomName, offer.rawRoomName)) {
    matchedFields.push("roomName");
  } else {
    mismatchedFields.push("roomName");
  }

  if (query.bookedBoardType === offer.condition.boardType) {
    matchedFields.push("boardType");
  } else if (
    query.bookedBoardType !== "unknown" &&
    offer.condition.boardType !== "unknown"
  ) {
    mismatchedFields.push("boardType");
  }

  if (query.bookedCancellationType === offer.condition.cancellationType) {
    matchedFields.push("cancellationType");
  } else if (
    query.bookedCancellationType !== "unknown" &&
    offer.condition.cancellationType !== "unknown"
  ) {
    mismatchedFields.push("cancellationType");
  }

  if (query.bookedPaymentType === offer.condition.paymentType) {
    matchedFields.push("paymentType");
  } else if (
    query.bookedPaymentType !== "unknown" &&
    offer.condition.paymentType !== "unknown"
  ) {
    mismatchedFields.push("paymentType");
  }

  if (query.bookedTaxIncluded == null || offer.condition.taxIncluded == null) {
    // ignore unknown tax information
  } else if (query.bookedTaxIncluded === offer.condition.taxIncluded) {
    matchedFields.push("taxIncluded");
  } else {
    mismatchedFields.push("taxIncluded");
  }

  if (offer.condition.occupancy == null || offer.condition.occupancy === query.adults) {
    matchedFields.push("occupancy");
  } else {
    mismatchedFields.push("occupancy");
  }

  const matchType = deriveMatchType(mismatchedFields.length);
  const confidence = deriveConfidence(matchType);
  const priceGap = query.userBookedPrice - offer.totalPrice;
  const priceGapPercent =
    query.userBookedPrice > 0
      ? (priceGap / query.userBookedPrice) * 100
      : 0;

  const reasons = [
    `${offer.providerId}: ${matchType.replace("_", " ")} match.`,
    priceGap > 0
      ? "Candidate is cheaper than your booked price."
      : "Candidate is not cheaper than your booked price.",
  ];

  return {
    offer,
    matchType,
    confidence,
    matchedFields,
    mismatchedFields,
    reasons,
    priceGap,
    priceGapPercent,
  };
}

function compareRankedOffers(a: OfferComparison, b: OfferComparison): number {
  const matchRank = getMatchRank(a.matchType) - getMatchRank(b.matchType);
  if (matchRank !== 0) return matchRank;

  if (a.offer.totalPrice !== b.offer.totalPrice) {
    return a.offer.totalPrice - b.offer.totalPrice;
  }

  return b.priceGap - a.priceGap;
}

function getMatchRank(matchType: MatchType): number {
  if (matchType === "exact") return 0;
  if (matchType === "close") return 1;
  if (matchType === "reference_only") return 2;
  return 3;
}

/** exact: all core conditions match; close: one differs; reference_only: two or more differ. */
function deriveMatchType(mismatchCount: number): MatchType {
  if (mismatchCount === 0) return "exact";
  if (mismatchCount === 1) return "close";
  return "reference_only";
}

function deriveConfidence(matchType: MatchType): BrgConfidence {
  if (matchType === "exact") return "high";
  if (matchType === "close") return "medium";
  return "low";
}

function isSameRoomName(
  inputRoomName: string,
  normalizedRoomName: string,
  rawRoomName: string | null
): boolean {
  const input = normalizeRoomName(inputRoomName);
  const normalized = normalizeRoomName(normalizedRoomName);
  const raw = normalizeRoomName(rawRoomName ?? "");

  if (!input) return false;
  if (input === normalized || input === raw) return true;
  if (normalized.includes(input) || input.includes(normalized)) return true;

  const inputTokens = new Set(input.split(" ").filter(Boolean));
  const compareTokens = (normalized || raw).split(" ").filter(Boolean);
  const overlap = compareTokens.filter((token) => inputTokens.has(token)).length;
  return overlap >= Math.max(1, Math.floor(inputTokens.size / 2));
}

function normalizeRoomName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
