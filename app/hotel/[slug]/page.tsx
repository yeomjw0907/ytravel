import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getHotelBySlug } from "@/lib/mock/hotels";
import { search } from "@/lib/services/search-service";
import { formatCollectedAt, formatDateRange, todayISO, tomorrowISO } from "@/lib/search/format";
import { toSearchQueryString } from "@/lib/search/queryString";
import { Container } from "@/components/layout/Container";
import { HotelHeader } from "@/components/hotel/HotelHeader";
import { BrgSummaryCard } from "@/components/search/BrgSummaryCard";
import { ProviderDetailCard } from "@/components/hotel/ProviderDetailCard";
import { ConditionComparisonTable } from "@/components/hotel/ConditionComparisonTable";
import { BrgGuidePanel } from "@/components/hotel/BrgGuidePanel";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const DEFAULT_CHECK_IN = "2026-05-10";
const DEFAULT_CHECK_OUT = "2026-05-12";

function getParam(sp: Record<string, string | string[] | undefined>, key: string, fallback: string): string {
  const v = sp[key];
  return typeof v === "string" ? v.trim() : fallback;
}
function getParamNum(sp: Record<string, string | string[] | undefined>, key: string, fallback: number): number {
  const v = sp[key];
  if (v == null) return fallback;
  const n = typeof v === "string" ? parseInt(v, 10) : Number(v);
  return Number.isInteger(n) && n >= 0 ? n : fallback;
}

/**
 * 호텔 상세: slug로 호텔 조회 후 search()로 동일 결과 구조 사용.
 * searchParams에서 checkIn, checkOut, adults, rooms 등 읽어 검색 컨텍스트 유지.
 */
export default async function HotelDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const checkIn = getParam(sp, "checkIn", DEFAULT_CHECK_IN);
  const checkOut = getParam(sp, "checkOut", DEFAULT_CHECK_OUT);
  const adults = getParamNum(sp, "adults", 2);
  const children = getParamNum(sp, "children", 0);
  const rooms = getParamNum(sp, "rooms", 1);
  const currency = getParam(sp, "currency", "KRW");
  const locale = getParam(sp, "locale", "ko-KR");
  const hotelName = getParam(sp, "hotelName", "");
  const destination = getParam(sp, "destination", "");

  const hotel = getHotelBySlug(slug);
  if (!hotel) {
    const decoded = decodeURIComponent(slug).trim() || slug;
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
      })}`
    );
  }

  const result = await search({
    hotelName: hotelName || hotel.name,
    destination: destination || hotel.city || null,
    checkIn,
    checkOut,
    adults,
    children,
    rooms,
    currency,
    locale,
  });

  if (!result.hotel) notFound();

  const brg = result.brgEvaluation;
  const lowestOtaId = brg?.lowestOtaOfferId ?? null;
  const offerByProvider = new Map(result.offers.map((o) => [o.providerId, o]));
  const getStatus = (id: string) => result.fetchStatuses.find((s) => s.providerId === id);
  const collectedAt = result.offers[0]
    ? formatCollectedAt(result.offers[0].collectedAt)
    : undefined;

  const searchSummary =
    formatDateRange(checkIn, checkOut) +
    ` · 성인 ${result.query.adults}명` +
    (result.query.children > 0 ? `, 어린이 ${result.query.children}명` : "") +
    `, 객실 ${result.query.rooms}개`;

  return (
    <div className="min-h-screen bg-wt-bg">
      <HotelHeader hotel={result.hotel} />

      <Container size="lg" className="py-wt-8 md:py-wt-10">
        <div className="mb-wt-8 flex flex-wrap items-center gap-wt-2 border-b border-wt-border pb-wt-5">
          <span className="text-wt-caption font-medium text-wt-text-secondary">현재 검색 조건</span>
          <span className="text-wt-body-sm text-wt-text-primary">{searchSummary}</span>
          <Link
            href={`/search?${toSearchQueryString(result.query)}`}
            className="ml-auto text-wt-body-sm font-medium text-wt-brand-700 hover:underline focus-wt"
          >
            검색 결과로 돌아가기
          </Link>
        </div>
        {brg && (
          <section>
            <BrgSummaryCard
              evaluation={brg}
              currency={result.offers[0]?.currency ?? result.query.currency}
              collectedAt={collectedAt}
            />
          </section>
        )}

        <section className="mt-wt-10">
          <h2 className="font-display text-wt-h3 text-wt-text-primary">공급처별 상세</h2>
          <div className="mt-wt-4 grid gap-wt-4 sm:grid-cols-2 lg:grid-cols-4">
            {result.providers.map((p) => (
              <ProviderDetailCard
                key={p.id}
                offer={offerByProvider.get(p.id) ?? null}
                providerId={p.id}
                fetchStatus={getStatus(p.id)}
                isOfficial={p.type === "official"}
                isLowestOta={offerByProvider.get(p.id)?.id === lowestOtaId}
              />
            ))}
          </div>
        </section>

        {result.offers.length > 0 && (
          <section className="mt-wt-10">
            <h2 className="font-display text-wt-h3 text-wt-text-primary">객실 조건 비교</h2>
            <div className="mt-wt-4 overflow-x-auto">
              <ConditionComparisonTable offers={result.offers} />
            </div>
          </section>
        )}

        <section className="mt-wt-10">
          <BrgGuidePanel />
        </section>

        <div className="mt-wt-10 flex flex-wrap gap-wt-4">
          <Link
            href={`/search?${toSearchQueryString(result.query)}`}
            className="inline-flex h-11 items-center justify-center rounded-wt-md border-2 border-wt-brand-700 px-wt-5 text-wt-body-sm font-medium text-wt-brand-700 hover:bg-wt-info-bg focus-wt"
          >
            검색 결과로 돌아가기
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-wt-md px-wt-5 text-wt-body-sm font-medium text-wt-text-secondary hover:bg-wt-surface focus-wt"
          >
            새 검색
          </Link>
        </div>

        <p className="mt-wt-12 font-body text-wt-body-sm text-wt-text-secondary">
          표시된 가격은 수집 시점 기준이며 실제 예약 화면과 다를 수 있습니다. 최종 예약 전 외부
          사이트에서 객실 조건을 다시 확인해 주세요.
        </p>
      </Container>
    </div>
  );
}
