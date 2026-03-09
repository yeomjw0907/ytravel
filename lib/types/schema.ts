/**
 * Shared domain types for the Ytravel MVP.
 * The current MVP compares OTA candidates against the user's booked price.
 */

export interface SearchQuery {
  hotelName: string;
  destination: string | null;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  currency: string;
  locale: string;
  roomName: string;
  userBookedPrice: number;
  bookedBoardType: BoardType;
  bookedCancellationType: CancellationType;
  bookedTaxIncluded: boolean | null;
  bookedPaymentType: PaymentType;
}

export interface Hotel {
  id: string;
  slug: string;
  name: string;
  nameDisplay?: string | null;
  brand: string | null;
  city: string;
  country: string;
  officialSiteUrl: string;
  stars: number | null;
  thumbnailUrl: string | null;
}

export type ProviderType = "official" | "ota";
export type ProviderStatus = "active" | "beta" | "disabled";
export type ProviderCapability = "automated" | "link_only";

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  capability: ProviderCapability;
  baseUrl: string;
  logoUrl: string | null;
  status: ProviderStatus;
}

export type BoardType =
  | "room_only"
  | "breakfast_included"
  | "half_board"
  | "unknown";

export type CancellationType =
  | "free_cancellation"
  | "non_refundable"
  | "partial_refund"
  | "unknown";

export type PaymentType =
  | "pay_now"
  | "pay_later"
  | "pay_at_hotel"
  | "unknown";

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
  collectedAt: string;
  condition: RateCondition;
  rawRoomName: string | null;
  available: boolean;
  disclaimer: string | null;
}

export type ProviderFetchStatusType =
  | "success"
  | "partial"
  | "failed"
  | "timeout";

export interface ProviderFetchStatus {
  providerId: string;
  status: ProviderFetchStatusType;
  message: string | null;
  latencyMs: number | null;
  fetchedAt: string;
}

export type BrgEligibility =
  | "likely"
  | "review"
  | "not_eligible"
  | "insufficient_data";

export type BrgConfidence = "high" | "medium" | "low";
export type MatchType = "exact" | "close" | "reference_only" | "none";

/**
 * User's booked price vs best OTA candidate comparison.
 * Baseline is always the user's booked price; candidate is the best offer from automated providers.
 * - exact: all core conditions match (room, board, cancellation, tax, occupancy).
 * - close: one condition differs.
 * - reference_only: multiple conditions differ or data missing.
 */
export interface BrgEvaluation {
  comparisonOfferId: string | null;
  comparisonProviderId: string | null;
  userBookedPrice: number | null;
  candidatePrice: number | null;
  priceGap: number | null;
  priceGapPercent: number | null;
  eligibility: BrgEligibility;
  confidence: BrgConfidence;
  matchType: MatchType;
  matchedFields: string[];
  mismatchedFields: string[];
  reasons: string[];
}

/** Link-only provider for manual check when automated comparison is unavailable or as fallback. */
export interface ProviderLink {
  providerId: string;
  name: string;
  url: string;
  note: string | null;
}

export interface SearchResult {
  query: SearchQuery;
  hotel: Hotel | null;
  providers: Provider[];
  offers: RateOffer[];
  fetchStatuses: ProviderFetchStatus[];
  brgEvaluation: BrgEvaluation | null;
  fallbackLinks: ProviderLink[];
  generatedAt: string;
}
