/**
 * Search service: user's booked price vs OTA candidates.
 * - Uses configured automated providers for offers and fetch statuses.
 * - Fallback links are link-only sites for manual verification.
 * - Best candidate is ranked by match quality first, then price.
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
  comparableFieldCount: number;
  reasons: string[];
  priceGap: number;
  priceGapPercent: number;
}

export async function search(query: SearchQuery): Promise<SearchResult> {
  const now = new Date().toISOString();
  const hotel = await resolveHotelForSearch(query.hotelName, query.destination);
  const offers = hotel ? await getOffersForHotel(hotel, query) : [];

  const providers = getProviders();
  const fetchStatuses = buildFetchStatuses(
    providers.map((provider) => provider.id),
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
      message: isFailed ? "현재 공급처 응답이 없습니다." : null,
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

function evaluateBestCandidateAgainstUserBooking(
  offers: RateOffer[],
  query: SearchQuery
): BrgEvaluation {
  const otaOffers = offers.filter((offer) => offer.providerType === "ota");

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
      reasons: ["지원 공급처에서 후보 요금을 찾지 못했습니다."],
    };
  }

  const comparisons = otaOffers.map((offer) =>
    compareOfferAgainstUserBooking(offer, query)
  );
  const cheaper = comparisons.filter((comparison) => comparison.priceGap > 0);
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
      reasons: ["후보를 정렬하지 못했습니다."],
    };
  }

  const eligibility =
    best.priceGap <= 0
      ? "not_eligible"
      : best.matchType === "exact"
        ? "likely"
        : "review";

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
    reasons:
      best.priceGap > 0
        ? best.reasons
        : ["현재 확인된 후보 중 내 예약가보다 더 저렴한 가격은 없습니다."],
  };
}

function compareOfferAgainstUserBooking(
  offer: RateOffer,
  query: SearchQuery
): OfferComparison {
  const matchedFields: string[] = [];
  const mismatchedFields: string[] = [];
  let comparableFieldCount = 0;

  const requestedRoomName = query.roomName.trim();
  if (requestedRoomName) {
    comparableFieldCount += 1;
    if (
      isSameRoomName(requestedRoomName, offer.condition.roomName, offer.rawRoomName)
    ) {
      matchedFields.push("roomName");
    } else {
      mismatchedFields.push("roomName");
    }
  }

  if (
    query.bookedBoardType !== "unknown" &&
    offer.condition.boardType !== "unknown"
  ) {
    comparableFieldCount += 1;
    if (query.bookedBoardType === offer.condition.boardType) {
      matchedFields.push("boardType");
    } else {
      mismatchedFields.push("boardType");
    }
  }

  if (
    query.bookedCancellationType !== "unknown" &&
    offer.condition.cancellationType !== "unknown"
  ) {
    comparableFieldCount += 1;
    if (query.bookedCancellationType === offer.condition.cancellationType) {
      matchedFields.push("cancellationType");
    } else {
      mismatchedFields.push("cancellationType");
    }
  }

  if (
    query.bookedPaymentType !== "unknown" &&
    offer.condition.paymentType !== "unknown"
  ) {
    comparableFieldCount += 1;
    if (query.bookedPaymentType === offer.condition.paymentType) {
      matchedFields.push("paymentType");
    } else {
      mismatchedFields.push("paymentType");
    }
  }

  if (query.bookedTaxIncluded != null && offer.condition.taxIncluded != null) {
    comparableFieldCount += 1;
    if (query.bookedTaxIncluded === offer.condition.taxIncluded) {
      matchedFields.push("taxIncluded");
    } else {
      mismatchedFields.push("taxIncluded");
    }
  }

  if (offer.condition.occupancy != null && query.adults > 0) {
    comparableFieldCount += 1;
    if (offer.condition.occupancy === query.adults) {
      matchedFields.push("occupancy");
    } else {
      mismatchedFields.push("occupancy");
    }
  }

  const matchType = deriveMatchType(mismatchedFields.length, comparableFieldCount);
  const confidence = deriveConfidence(matchType);
  const priceGap = query.userBookedPrice - offer.totalPrice;
  const priceGapPercent =
    query.userBookedPrice > 0
      ? (priceGap / query.userBookedPrice) * 100
      : 0;

  const reasons: string[] = [];

  if (comparableFieldCount < 2) {
    reasons.push("비교 가능한 조건 정보가 충분하지 않아 참고용으로만 보세요.");
  } else if (matchType === "exact") {
    reasons.push("핵심 조건이 대부분 일치합니다.");
  } else if (matchType === "close") {
    reasons.push("대체로 비슷하지만 일부 조건은 다시 확인해야 합니다.");
  } else {
    reasons.push("조건 차이가 있어 바로 비교하기 어렵습니다.");
  }

  reasons.push(
    priceGap > 0
      ? "현재 후보가 내 예약가보다 낮습니다."
      : "현재 후보가 내 예약가보다 낮지는 않습니다."
  );

  return {
    offer,
    matchType,
    confidence,
    matchedFields,
    mismatchedFields,
    comparableFieldCount,
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

function deriveMatchType(
  mismatchCount: number,
  comparableFieldCount: number
): MatchType {
  if (comparableFieldCount < 2) return "reference_only";
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
