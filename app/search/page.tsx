import { search } from "@/lib/services/search-service";
import { getHotelDisplayName } from "@/lib/mock/hotels";
import { searchParamsToQuery } from "@/lib/search/params";
import { formatCollectedAt, getProviderDisplayName } from "@/lib/search/format";
import { Container } from "@/components/layout/Container";
import { SearchSummaryBar } from "@/components/search/SearchSummaryBar";
import { MyBookingSummary } from "@/components/search/MyBookingSummary";
import { BrgSummaryCard } from "@/components/search/BrgSummaryCard";
import { ProviderRateCard } from "@/components/search/ProviderRateCard";
import { EmptyState } from "@/components/search/EmptyState";
import { PartialFailureNotice } from "@/components/search/PartialFailureNotice";
import { ConditionSummary } from "@/components/search/ConditionSummary";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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
        title="호텔을 찾을 수 없습니다"
        description="호텔명을 바꾸거나 예약 정보를 수정한 뒤 다시 검색해 보세요."
        showSearchLink
      />
    );
  }

  const highlightedOfferId = result.brgEvaluation?.comparisonOfferId ?? null;
  const offerByProvider = new Map(result.offers.map((offer) => [offer.providerId, offer]));
  const collectedAt = result.offers[0]
    ? formatCollectedAt(result.offers[0].collectedAt)
    : undefined;

  const hotelLocation = [
    result.hotel.city,
    result.hotel.country,
    result.hotel.brand,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="min-h-screen bg-wt-bg">
      <SearchSummaryBar
        query={result.query}
        hotelName={getHotelDisplayName(result.hotel)}
      />

      <Container size="xl" className="py-wt-6 md:py-wt-8">
        {/* 1. 내 예약 요약 */}
        <section className="mb-wt-6 md:mb-wt-8">
          <MyBookingSummary
            query={result.query}
            hotelName={getHotelDisplayName(result.hotel)}
            hotelLocation={hotelLocation || undefined}
          />
        </section>

        <PartialFailureNotice fetchStatuses={result.fetchStatuses} />

        {/* 2. 최적 후보 가격 · 차액 · 퍼센트 */}
        {result.brgEvaluation && (
          <section className="mb-wt-8">
            <BrgSummaryCard
              evaluation={result.brgEvaluation}
              currency={result.query.currency}
              collectedAt={collectedAt}
              bestOfferDeeplink={
                result.brgEvaluation.comparisonOfferId
                  ? result.offers.find(
                      (o) => o.id === result.brgEvaluation!.comparisonOfferId
                    )?.deeplink
                  : null
              }
              bestOfferProviderName={
                result.brgEvaluation.comparisonOfferId
                  ? getProviderDisplayName(
                      result.offers.find(
                        (o) => o.id === result.brgEvaluation!.comparisonOfferId
                      )?.providerId ?? ""
                    )
                  : null
              }
            />
          </section>
        )}

        {/* 3. 조건 매칭 요약 */}
        {result.brgEvaluation && (
          <section className="mb-wt-6 md:mb-wt-8">
            <ConditionSummary evaluation={result.brgEvaluation} />
          </section>
        )}

        {/* 4. 공급처별 비교 — 최적 후보 카드와 동일 카드 스타일 + 바로가기 */}
        <section className="mt-wt-8 md:mt-wt-10">
          <h2 className="font-display text-wt-h3 text-wt-text-primary">
            공급처별 비교
          </h2>
          <p className="mt-wt-1 text-wt-body-sm leading-relaxed text-wt-text-secondary">
            자동 수집된 요금과 내 예약가를 비교합니다.
          </p>
          <div className="mt-wt-4 grid grid-cols-1 gap-wt-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.providers.map((provider) => (
              <ProviderRateCard
                key={provider.id}
                variant="summary"
                offer={offerByProvider.get(provider.id) ?? null}
                providerId={provider.id}
                fetchStatus={result.fetchStatuses.find(
                  (status) => status.providerId === provider.id
                )}
                isBestCandidate={
                  offerByProvider.get(provider.id)?.id === highlightedOfferId
                }
                userBookedPrice={result.query.userBookedPrice}
                currency={result.query.currency}
              />
            ))}
          </div>
        </section>

        {/* 5. Fallback 링크 */}
        <section className="mt-wt-8 md:mt-wt-10 rounded-wt-xl border border-wt-border bg-wt-panel p-wt-6 shadow-wt-card md:p-wt-8">
          <h2 className="font-display text-wt-h3 text-wt-text-primary">
            직접 확인할 수 있는 사이트
          </h2>
          <p className="mt-wt-2 text-wt-body-sm leading-relaxed text-wt-text-secondary">
            자동 비교에 없는 후보는 아래 메타검색 사이트에서 직접 확인해 보세요.
          </p>
          <p className="mt-wt-1 text-wt-caption leading-relaxed text-wt-text-secondary">
            링크를 누르면 각 사이트 검색 화면이 열립니다. <strong className="font-semibold text-wt-text-primary">위와 같은 호텔·날짜·인원</strong>을 입력한 뒤 검색해 주세요.
          </p>
          <div className="mt-wt-4 flex flex-wrap gap-wt-2 sm:gap-wt-3">
            {result.fallbackLinks.map((link) => (
              <a
                key={link.providerId}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-wt-md border-2 border-wt-brand-700 px-wt-4 text-wt-body-sm font-medium text-wt-brand-700 transition-colors hover:bg-wt-info-bg focus-wt"
              >
                {link.name}
              </a>
            ))}
          </div>
        </section>

        <p className="mt-wt-8 font-body text-wt-body-sm leading-relaxed text-wt-text-secondary md:mt-wt-10">
          수집 시점과 실제 예약 시 가격·조건이 달라질 수 있습니다. 최종 객실 조건과 금액은 해당 사이트에서 반드시 확인하세요.
        </p>
      </Container>
    </div>
  );
}
