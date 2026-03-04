/**
 * Ytravel 데이터 스키마 (docs/engineering/09-data-schema.md, 10-api-spec.md 기준)
 * 공급처 원본과 내부 공통 구조 분리, UI·BRG 계산은 정규화 모델만 사용.
 * 숫자 가격은 number, 시간은 ISO 문자열.
 */

/** 사용자 검색 조건 */
export interface SearchQuery {
  hotelName: string;
  destination: string | null;
  checkIn: string; // ISO date YYYY-MM-DD
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  currency: string;
  locale: string;
}

/** 내부 호텔 정보 */
export interface Hotel {
  id: string;
  slug: string;
  name: string;
  /** 외국 호텔용 한글/현지어 표기. 있으면 UI에 "nameDisplay (name)" 형태로 표시 */
  nameDisplay?: string | null;
  brand: string | null;
  city: string;
  country: string;
  officialSiteUrl: string;
  stars: number | null;
  thumbnailUrl: string | null;
}

/** 공급처 타입 */
export type ProviderType = "official" | "ota";

/** 공급처 상태 */
export type ProviderStatus = "active" | "beta" | "disabled";

/** 가격 공급처 */
export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  baseUrl: string;
  logoUrl: string | null;
  status: ProviderStatus;
}

/** 조식/식사 조건 */
export type BoardType = "room_only" | "breakfast_included" | "half_board" | "unknown";

/** 취소 정책 */
export type CancellationType = "free_cancellation" | "non_refundable" | "partial_refund" | "unknown";

/** 결제 시점 */
export type PaymentType = "pay_now" | "pay_later" | "pay_at_hotel" | "unknown";

/** 동일 조건 비교용 메타데이터 */
export interface RateCondition {
  roomName: string;
  boardType: BoardType;
  cancellationType: CancellationType;
  paymentType: PaymentType;
  taxIncluded: boolean | null;
  occupancy: number | null;
  bedType: string | null;
  viewType: string | null;
  notes: string[];
}

/** 공급처별 정규화된 가격 제안 (공홈·OTA 공통) */
export interface RateOffer {
  id: string;
  hotelId: string;
  providerId: string;
  providerType: ProviderType;
  deeplink: string;
  currency: string;
  basePrice: number;
  taxAmount: number | null;
  totalPrice: number;
  collectedAt: string; // ISO datetime
  condition: RateCondition;
  rawRoomName: string | null;
  available: boolean;
  disclaimer: string | null;
}

/** 공급처별 수집 결과 상태 */
export type ProviderFetchStatusType = "success" | "partial" | "failed" | "timeout";

export interface ProviderFetchStatus {
  providerId: string;
  status: ProviderFetchStatusType;
  message: string | null;
  latencyMs: number | null;
  fetchedAt: string; // ISO datetime
}

/** BRG 가능성 (참고용, 확정 아님) */
export type BrgEligibility = "likely" | "review" | "not_eligible" | "insufficient_data";

export type BrgConfidence = "high" | "medium" | "low";

export interface BrgEvaluation {
  officialOfferId: string | null;
  lowestOtaOfferId: string | null;
  officialPrice: number | null;
  lowestOtaPrice: number | null;
  priceGap: number | null;
  priceGapPercent: number | null;
  eligibility: BrgEligibility;
  confidence: BrgConfidence;
  estimatedBrgPrice: number | null;
  matchedFields: string[];
  mismatchedFields: string[];
  reasons: string[];
}

/** 검색 결과 집계 (부분 성공 허용) */
export interface SearchResult {
  query: SearchQuery;
  hotel: Hotel | null;
  providers: Provider[];
  offers: RateOffer[];
  fetchStatuses: ProviderFetchStatus[];
  brgEvaluation: BrgEvaluation | null;
  generatedAt: string; // ISO datetime
}
