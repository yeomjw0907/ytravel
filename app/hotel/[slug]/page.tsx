import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getHotelBySlug } from "@/lib/mock/hotels";
import { resolveHotelForSearch } from "@/lib/api/hotels";
import { search } from "@/lib/services/search-service";
import {
  formatCollectedAt,
  formatDateRange,
  todayISO,
  tomorrowISO,
} from "@/lib/search/format";
import { toSearchQueryString } from "@/lib/search/queryString";
import { Container } from "@/components/layout/Container";
import { HotelHeader } from "@/components/hotel/HotelHeader";
import { ProviderDetailCard } from "@/components/hotel/ProviderDetailCard";
import { ConditionComparisonTable } from "@/components/hotel/ConditionComparisonTable";
import { BrgGuidePanel } from "@/components/hotel/BrgGuidePanel";
import { BrgSummaryCard } from "@/components/search/BrgSummaryCard";
import { MyBookingSummary } from "@/components/search/MyBookingSummary";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const DEFAULT_CHECK_IN = "2026-05-10";
const DEFAULT_CHECK_OUT = "2026-05-12";

function getParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
  fallback: string
): string {
  const value = searchParams[key];
  return typeof value === "string" ? value.trim() : fallback;
}

function getParamNum(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
  fallback: number
): number {
  const value = searchParams[key];
  if (value == null) return fallback;
  const parsed = typeof value === "string" ? Number(value) : Number(value[0]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getParamBoolean(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
  fallback: boolean | null
): boolean | null {
  const value = getParam(searchParams, key, "");
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

export default async function HotelDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  let hotel = getHotelBySlug(slug);
  if (!hotel) {
    const resolved = await resolveHotelForSearch(slug.replace(/-/g, " "), null);
    hotel = resolved?.slug === slug ? resolved : undefined;
  }

  if (!hotel) {
    const decoded = decodeURIComponent(slug).trim().replace(/-/g, " ") || slug;
    redirect(
      `/search?${toSearchQueryString({
        hotelName: decoded,
        destination: null,
        checkIn: todayISO(),
        checkOut: tomorrowISO(),
        adults: 2,
        children: 0,
        rooms: 1,
        currency: "KRW",
        locale: "ko-KR",
        roomName: "Standard Room",
        userBookedPrice: 300000,
        bookedBoardType: "room_only",
        bookedCancellationType: "free_cancellation",
        bookedTaxIncluded: true,
        bookedPaymentType: "pay_now",
      })}`
    );
  }

  const result = await search({
    hotelName: getParam(sp, "hotelName", hotel.name),
    destination: getParam(sp, "destination", hotel.city),
    checkIn: getParam(sp, "checkIn", DEFAULT_CHECK_IN),
    checkOut: getParam(sp, "checkOut", DEFAULT_CHECK_OUT),
    adults: getParamNum(sp, "adults", 2),
    children: getParamNum(sp, "children", 0),
    rooms: getParamNum(sp, "rooms", 1),
    currency: getParam(sp, "currency", "KRW"),
    locale: getParam(sp, "locale", "ko-KR"),
    roomName: getParam(sp, "roomName", "Standard Room"),
    userBookedPrice: getParamNum(sp, "userBookedPrice", 300000),
    bookedBoardType: getParam(sp, "bookedBoardType", "room_only") as
      | "room_only"
      | "breakfast_included"
      | "half_board"
      | "unknown",
    bookedCancellationType: getParam(
      sp,
      "bookedCancellationType",
      "free_cancellation"
    ) as "free_cancellation" | "non_refundable" | "partial_refund" | "unknown",
    bookedTaxIncluded: getParamBoolean(sp, "bookedTaxIncluded", true),
    bookedPaymentType: getParam(sp, "bookedPaymentType", "pay_now") as
      | "pay_now"
      | "pay_later"
      | "pay_at_hotel"
      | "unknown",
  });

  if (!result.hotel) notFound();

  const highlightedOfferId = result.brgEvaluation?.comparisonOfferId ?? null;
  const offerByProvider = new Map(result.offers.map((offer) => [offer.providerId, offer]));
  const collectedAt = result.offers[0]
    ? formatCollectedAt(result.offers[0].collectedAt)
    : undefined;

  const searchSummary =
    `${formatDateRange(result.query.checkIn, result.query.checkOut)} · ` +
    `성인 ${result.query.adults}명, 객실 ${result.query.rooms}실 · ` +
    (result.query.roomName?.trim() || "객실 미지정");

  return (
    <div className="min-h-screen bg-wt-bg">
      <HotelHeader hotel={result.hotel} />

      <Container size="lg" className="py-wt-6 md:py-wt-8">
        <section className="mb-wt-6 md:mb-wt-8">
          <MyBookingSummary
            query={result.query}
            hotelName={result.hotel.nameDisplay ?? result.hotel.name}
            hotelLocation={[result.hotel.city, result.hotel.country]
              .filter(Boolean)
              .join(", ")}
          />
        </section>

        <div className="mb-wt-6 flex flex-wrap items-center gap-wt-2 border-b border-wt-border pb-wt-4 md:mb-wt-8">
          <span className="text-wt-caption font-medium text-wt-text-secondary">
            검색 요약
          </span>
          <span className="text-wt-body-sm text-wt-text-primary">
            {searchSummary}
          </span>
          <Link
            href={`/search?${toSearchQueryString(result.query)}`}
            className="ml-auto rounded-wt-sm text-wt-body-sm font-medium text-wt-brand-700 hover:underline focus-wt"
          >
            결과로 돌아가기
          </Link>
        </div>

        {result.brgEvaluation && (
          <section className="mb-wt-6 md:mb-wt-8">
            <BrgSummaryCard
              evaluation={result.brgEvaluation}
              currency={result.query.currency}
              collectedAt={collectedAt}
            />
          </section>
        )}

        <section className="mt-wt-8 md:mt-wt-10">
          <h2 className="font-display text-wt-h3 text-wt-text-primary">
            공급처별 상세
          </h2>
          <p className="mt-wt-1 text-wt-body-sm text-wt-text-secondary">
            자동 수집된 요금과 조건을 확인하세요.
          </p>
          <div className="mt-wt-4 grid gap-wt-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.providers.map((provider) => (
              <ProviderDetailCard
                key={provider.id}
                offer={offerByProvider.get(provider.id) ?? null}
                providerId={provider.id}
                fetchStatus={result.fetchStatuses.find(
                  (status) => status.providerId === provider.id
                )}
                isOfficial={provider.type === "official"}
                isBestCandidate={
                  offerByProvider.get(provider.id)?.id === highlightedOfferId
                }
              />
            ))}
          </div>
        </section>

        {result.offers.length > 0 && (
          <section className="mt-wt-8 md:mt-wt-10">
            <h2 className="font-display text-wt-h3 text-wt-text-primary">
              조건 비교
            </h2>
            <div className="mt-wt-4 overflow-x-auto">
              <ConditionComparisonTable offers={result.offers} />
            </div>
          </section>
        )}

        <section className="mt-wt-8 md:mt-wt-10">
          <BrgGuidePanel />
        </section>

        <div className="mt-wt-8 flex flex-wrap gap-wt-3 sm:gap-wt-4 md:mt-wt-10">
          <Link
            href={`/search?${toSearchQueryString(result.query)}`}
            className="inline-flex h-11 items-center justify-center rounded-wt-md border-2 border-wt-brand-700 px-wt-5 text-wt-body-sm font-medium text-wt-brand-700 transition-colors hover:bg-wt-info-bg focus-wt"
          >
            결과로 돌아가기
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-wt-md px-wt-5 text-wt-body-sm font-medium text-wt-text-secondary transition-colors hover:bg-wt-surface focus-wt"
          >
            새 검색
          </Link>
        </div>
      </Container>
    </div>
  );
}
