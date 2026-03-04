import type {
  SearchQuery,
  SearchResult,
  BrgEvaluation,
  RateOffer,
  ProviderFetchStatus,
} from "@/lib/types/schema";
import { findHotelByQuery } from "@/lib/mock/hotels";
import { getProviders } from "@/lib/mock/providers";
import { getMockOffersForHotel, MOCK_FAILED_PROVIDER_IDS } from "@/lib/mock/offers";

/**
 * 검색 서비스 진입점.
 * 현재: mock 데이터 기반. 실제 연동 시 여기서 공급처 어댑터를 호출하고
 * 각 어댑터는 RateOffer[] 및 ProviderFetchStatus를 반환하도록 확장.
 */
export async function search(query: SearchQuery): Promise<SearchResult> {
  const now = new Date().toISOString();
  const providers = getProviders();

  const hotel = findHotelByQuery(query.hotelName, query.destination) ?? null;
  const offers = hotel ? getMockOffersForHotel(hotel.id) : [];
  const fetchStatuses = buildFetchStatuses(providers.map((p) => p.id), now);

  const brgEvaluation =
    hotel && offers.length > 0 ? evaluateBrg(offers, now) : null;

  return {
    query,
    hotel,
    providers,
    offers,
    fetchStatuses,
    brgEvaluation,
    generatedAt: now,
  };
}

/** 공급처별 수집 상태 생성 (실패한 공급처는 failed) */
function buildFetchStatuses(providerIds: string[], fetchedAt: string): ProviderFetchStatus[] {
  return providerIds.map((providerId) => {
    const isFailed = MOCK_FAILED_PROVIDER_IDS.has(providerId);
    return {
      providerId,
      status: isFailed ? "failed" : "success",
      message: isFailed ? "일시적으로 수집할 수 없습니다." : null,
      latencyMs: isFailed ? null : 800 + Math.floor(Math.random() * 400),
      fetchedAt,
    };
  });
}

/**
 * BRG 평가 (참고용 추정. 확정 아님 - 11-operations-legal 준수)
 * MVP: 공식가·최저 OTA가·차액·예상 BRG가(최저 OTA의 25% 할인)
 * 객실별 평가 시 evaluateBrgForOffers(offers, generatedAt) 사용.
 */
export function evaluateBrgForOffers(
  offers: RateOffer[],
  generatedAt: string
): BrgEvaluation {
  return evaluateBrg(offers, generatedAt);
}

function evaluateBrg(offers: RateOffer[], generatedAt: string): BrgEvaluation {
  const official = offers.find((o) => o.providerType === "official");
  const otaOffers = offers.filter((o) => o.providerType === "ota");
  const byPrice = [...otaOffers].sort((a, b) => a.totalPrice - b.totalPrice);
  const lowestOta = byPrice[0] ?? null;

  const officialPrice = official?.totalPrice ?? null;
  const lowestOtaPrice = lowestOta?.totalPrice ?? null;

  if (officialPrice == null || lowestOtaPrice == null) {
    return {
      officialOfferId: official?.id ?? null,
      lowestOtaOfferId: lowestOta?.id ?? null,
      officialPrice,
      lowestOtaPrice,
      priceGap: null,
      priceGapPercent: null,
      eligibility: "insufficient_data",
      confidence: "low",
      estimatedBrgPrice: null,
      matchedFields: [],
      mismatchedFields: [],
      reasons: ["공식가 또는 OTA 요금 데이터가 부족합니다."],
    };
  }

  if (!official) {
    return {
      officialOfferId: null,
      lowestOtaOfferId: lowestOta?.id ?? null,
      officialPrice,
      lowestOtaPrice,
      priceGap: null,
      priceGapPercent: null,
      eligibility: "insufficient_data" as const,
      confidence: "low" as const,
      estimatedBrgPrice: null,
      matchedFields: [],
      mismatchedFields: [],
      reasons: ["공식가 데이터가 없습니다."],
    };
  }

  const priceGap = lowestOtaPrice < officialPrice ? officialPrice - lowestOtaPrice : 0;
  const priceGapPercent =
    officialPrice > 0 ? (priceGap / officialPrice) * 100 : 0;

  // MVP: 예상 BRG가 = 최저 OTA의 25% 추가 할인 (02-mvp-spec)
  const estimatedBrgPrice =
    lowestOtaPrice > 0 ? Math.round(lowestOtaPrice * 0.75) : null;

  const { eligibility, confidence, matchedFields, mismatchedFields, reasons } =
    deriveEligibilityAndReasons(official, lowestOta, priceGap);

  return {
    officialOfferId: official.id,
    lowestOtaOfferId: lowestOta?.id ?? null,
    officialPrice,
    lowestOtaPrice,
    priceGap,
    priceGapPercent,
    eligibility,
    confidence,
    estimatedBrgPrice,
    matchedFields,
    mismatchedFields,
    reasons,
  };
}

function deriveEligibilityAndReasons(
  official: RateOffer,
  lowestOta: RateOffer | null,
  priceGap: number
): Pick<
  BrgEvaluation,
  "eligibility" | "confidence" | "matchedFields" | "mismatchedFields" | "reasons"
> {
  const reasons: string[] = [];
  const matchedFields: string[] = [];
  const mismatchedFields: string[] = [];

  if (lowestOta == null) {
    return {
      eligibility: "not_eligible",
      confidence: "high",
      matchedFields: [],
      mismatchedFields: [],
      reasons: ["공식가보다 낮은 OTA 요금이 없습니다."],
    };
  }

  if (priceGap <= 0) {
    return {
      eligibility: "not_eligible",
      confidence: "high",
      matchedFields: [],
      mismatchedFields: [],
      reasons: ["공식 홈페이지가 최저가이거나 동일합니다."],
    };
  }

  const c1 = official.condition;
  const c2 = lowestOta.condition;

  if (c1.roomName !== c2.roomName) mismatchedFields.push("roomName");
  else matchedFields.push("roomName");
  if (c1.boardType !== c2.boardType) mismatchedFields.push("boardType");
  else matchedFields.push("boardType");
  if (c1.cancellationType !== c2.cancellationType)
    mismatchedFields.push("cancellationType");
  else matchedFields.push("cancellationType");
  if (c1.paymentType !== c2.paymentType) mismatchedFields.push("paymentType");
  else matchedFields.push("paymentType");
  if (c1.taxIncluded !== c2.taxIncluded) mismatchedFields.push("taxIncluded");
  else if (c1.taxIncluded != null && c2.taxIncluded != null)
    matchedFields.push("taxIncluded");

  if (mismatchedFields.length > 0) {
    reasons.push("일부 객실·결제 조건이 다릅니다. 실제 예약 화면에서 확인하세요.");
  } else {
    reasons.push("동일 조건으로 판단된 OTA 요금이 공식가보다 낮습니다.");
  }

  let eligibility: BrgEvaluation["eligibility"] = "likely";
  let confidence: BrgEvaluation["confidence"] = "high";
  if (mismatchedFields.length > 1) {
    eligibility = "review";
    confidence = "medium";
  } else if (mismatchedFields.length === 1) {
    eligibility = "review";
    confidence = "medium";
  }

  return {
    eligibility,
    confidence,
    matchedFields,
    mismatchedFields,
    reasons,
  };
}
