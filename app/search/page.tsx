import Link from "next/link";
import { search, evaluateBrgForOffers } from "@/lib/services/search-service";
import { getHotelDisplayName } from "@/lib/mock/hotels";
import { searchParamsToQuery } from "@/lib/search/params";
import { formatCollectedAt, formatPrice } from "@/lib/search/format";
import { toHotelQueryString } from "@/lib/search/queryString";
import { groupOffersByRoomName } from "@/lib/search/room-type";
import { Container } from "@/components/layout/Container";
import { SearchSummaryBar } from "@/components/search/SearchSummaryBar";
import { RoomTypeAccordion } from "@/components/search/RoomTypeAccordion";
import { BrgSummaryCard } from "@/components/search/BrgSummaryCard";
import { ProviderRateTable } from "@/components/search/ProviderRateTable";
import { ProviderRateCard } from "@/components/search/ProviderRateCard";
import { EmptyState } from "@/components/search/EmptyState";
import { PartialFailureNotice } from "@/components/search/PartialFailureNotice";
import { ConditionSummary } from "@/components/search/ConditionSummary";

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

/**
 * 검색 결과 페이지. searchParams → SearchQuery 검증 후 search-service 직접 호출.
 * 결과 없음/실패 시 EmptyState, 성공 시 요약 바 · BRG 카드 · 공급처 표/카드 · 조건 요약 · 면책.
 */
export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const paramsResult = searchParamsToQuery(params);

  if (!paramsResult.ok) {
    return (
      <EmptyState
        title="검색 조건을 확인해 주세요"
        description={paramsResult.message}
        showSearchLink
      />
    );
  }

  const result = await search(paramsResult.query);

  if (!result.hotel) {
    return (
      <EmptyState
        title="검색 결과를 찾지 못했습니다"
        description="날짜나 호텔명을 조정한 뒤 다시 검색해 보세요."
        showSearchLink
      />
    );
  }

  const hotel = result.hotel;
  const roomGroups = groupOffersByRoomName(result.offers);
  const getStatus = (id: string) => result.fetchStatuses.find((s) => s.providerId === id);

  return (
    <div className="min-h-screen bg-wt-bg">
      <SearchSummaryBar query={result.query} hotelName={getHotelDisplayName(hotel)} />

      <Container size="xl" className="py-wt-8 md:py-wt-10">
        {/* 호텔 요약 */}
        <section className="mb-wt-8">
          <h1 className="font-display text-wt-h2 text-wt-text-primary md:text-wt-h1">{getHotelDisplayName(hotel)}</h1>
          <p className="mt-wt-2 font-body text-wt-body-sm text-wt-text-secondary">
            {hotel.city}
            {hotel.country && `, ${hotel.country}`}
            {hotel.brand && ` · ${hotel.brand}`}
          </p>
          {hotel.officialSiteUrl && (
            <a
              href={hotel.officialSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-wt-2 inline-block text-wt-body-sm font-medium text-wt-brand-500 hover:underline focus-wt"
            >
              공식 사이트 보기
            </a>
          )}
        </section>

        <PartialFailureNotice fetchStatuses={result.fetchStatuses} />

        {/* 객실 타입별 아코디언: 접으면 예상 BRG가만, 펼치면 가격 비교 전체 */}
        <div className="mt-wt-10 flex flex-col gap-wt-4">
          {roomGroups.map((group, index) => {
            const brg = evaluateBrgForOffers(group.offers, result.generatedAt);
            const lowestOtaId = brg.lowestOtaOfferId ?? null;
            const offerByProvider = new Map(group.offers.map((o) => [o.providerId, o]));
            const collectedAt = group.offers[0]
              ? formatCollectedAt(group.offers[0].collectedAt)
              : undefined;
            const currency = group.offers[0]?.currency ?? result.query.currency;
            const summary =
              brg.estimatedBrgPrice != null
                ? `예상 BRG가 ${formatPrice(brg.estimatedBrgPrice, currency)}`
                : "예상 BRG가 없음";
            const officialOffer = group.offers.find((o) => o.providerType === "official");
            const officialLink = officialOffer?.deeplink ?? null;
            return (
              <RoomTypeAccordion
                key={group.roomName}
                title={group.roomName}
                summary={summary}
                officialLink={officialLink}
                defaultOpen={index === 0}
              >
                {brg && (
                  <div className="mb-wt-6">
                    <BrgSummaryCard
                      evaluation={brg}
                      currency={currency}
                      collectedAt={collectedAt}
                    />
                    {officialLink && (
                      <a
                        href={officialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-wt-4 inline-flex h-11 items-center justify-center rounded-wt-md bg-wt-brand-700 px-wt-4 text-wt-body-sm font-medium text-white hover:bg-wt-brand-500 focus-wt"
                      >
                        공식 홈페이지 바로가기
                      </a>
                    )}
                  </div>
                )}
                <div>
                  <h3 className="font-display text-wt-h4 text-wt-text-primary">공급처별 요금</h3>
                  <div className="mt-wt-4 hidden md:block">
                    <ProviderRateTable
                      offers={group.offers}
                      providers={result.providers}
                      fetchStatuses={result.fetchStatuses}
                      lowestOtaOfferId={lowestOtaId}
                    />
                  </div>
                  <div className="mt-wt-4 flex flex-col gap-wt-4 md:hidden">
                    {result.providers.map((p) => (
                      <ProviderRateCard
                        key={p.id}
                        offer={offerByProvider.get(p.id) ?? null}
                        providerId={p.id}
                        fetchStatus={getStatus(p.id)}
                        isLowestOta={offerByProvider.get(p.id)?.id === lowestOtaId}
                      />
                    ))}
                  </div>
                </div>
                {brg && (brg.matchedFields.length > 0 || brg.mismatchedFields.length > 0) && (
                  <div className="mt-wt-6">
                    <ConditionSummary evaluation={brg} />
                  </div>
                )}
              </RoomTypeAccordion>
            );
          })}
        </div>

        {/* 상세 비교 링크 — 검색 조건 유지 */}
        <section className="mt-wt-10">
          <Link
            href={`/hotel/${hotel.slug}?${toHotelQueryString(result.query)}`}
            className="inline-flex h-11 items-center justify-center rounded-wt-md border-2 border-wt-brand-700 px-wt-5 text-wt-body-sm font-medium text-wt-brand-700 hover:bg-wt-info-bg focus-wt"
          >
            상세 비교 보기
          </Link>
        </section>

        {/* 면책 문구 (11-operations-legal) */}
        <p className="mt-wt-10 font-body text-wt-body-sm text-wt-text-secondary">
          표시된 가격은 수집 시점 기준이며 실제 예약 화면과 다를 수 있습니다. 최종 예약 전 외부
          사이트에서 객실 조건을 다시 확인해 주세요.
        </p>
      </Container>
    </div>
  );
}
