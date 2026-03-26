/**
 * Search service: user's booked price vs OTA candidates.
 * - Uses live providers when available.
 * - Falls back to reference candidates for launch-safe outbound verification.
 * - Best candidate is ranked by match quality first, then price.
 */
import type {
  BrgConfidence,
  BrgEvaluation,
  MatchType,
  RateOffer,
  SearchQuery,
  SearchResult,
} from "@/lib/types/schema";
import { resolveHotelForSearch } from "@/lib/api/hotels";
import { getOfferCollection } from "@/lib/api/offers";
import { getFallbackLinks, getShortcutLinks } from "@/lib/mock/providers";

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
  const offerCollection = hotel
    ? await getOfferCollection(hotel, query)
    : {
        providers: [],
        offers: [],
        fetchStatuses: [],
        dataMode: "reference" as const,
      };

  const brgEvaluation =
    hotel && offerCollection.offers.length > 0
      ? evaluateBestCandidateAgainstUserBooking(offerCollection.offers, query)
      : null;

  const fallbackContext = {
    hotelId: hotel?.id,
    hotelName: hotel?.nameDisplay ?? hotel?.name ?? query.hotelName,
    destination: query.destination ?? hotel?.city ?? null,
    checkIn: query.checkIn,
    checkOut: query.checkOut,
    adults: query.adults,
    children: query.children,
    childAges: query.childAges,
    rooms: query.rooms,
    locale: query.locale,
  };

  return {
    query,
    hotel,
    providers: offerCollection.providers,
    offers: offerCollection.offers,
    fetchStatuses: offerCollection.fetchStatuses,
    brgEvaluation,
    fallbackLinks: getFallbackLinks(hotel, fallbackContext),
    shortcutLinks: getShortcutLinks(hotel, fallbackContext),
    generatedAt: now,
    offerDataMode: offerCollection.dataMode,
  };
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
      reasons: ["비교 가능한 후보 가격을 찾지 못했습니다."],
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
        : ["현재 확인된 후보 중 예약가보다 더 저렴한 가격은 없습니다."],
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
    reasons.push("비교 가능한 조건 정보가 부족해 참고 후보로만 봐야 합니다.");
  } else if (matchType === "exact") {
    reasons.push("주요 조건이 모두 일치합니다.");
  } else if (matchType === "close") {
    reasons.push("대체로 비슷하지만 일부 조건은 다시 확인해야 합니다.");
  } else {
    reasons.push("조건 차이가 있어 참고 후보로 보는 것이 안전합니다.");
  }

  reasons.push(
    priceGap > 0
      ? "현재 후보가 내 예약가보다 저렴합니다."
      : "현재 후보가 내 예약가보다 저렴하지 않습니다."
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
