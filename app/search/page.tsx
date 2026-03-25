import { PageAnalytics } from "@/components/analytics/PageAnalytics";
import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/search/EmptyState";
import { MyBookingSummary } from "@/components/search/MyBookingSummary";
import { BrgSummaryCard } from "@/components/search/BrgSummaryCard";
import { ConditionSummary } from "@/components/search/ConditionSummary";
import { PartialFailureNotice } from "@/components/search/PartialFailureNotice";
import { ProviderRateCard } from "@/components/search/ProviderRateCard";
import { SearchSummaryBar } from "@/components/search/SearchSummaryBar";
import { getHotelDisplayName } from "@/lib/mock/hotels";
import { formatCollectedAt, getProviderDisplayName } from "@/lib/search/format";
import { searchParamsToQuery } from "@/lib/search/params";
import { search } from "@/lib/services/search-service";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const paramsResult = searchParamsToQuery(params);

  if (!paramsResult.ok) {
    return (
      <>
        <PageAnalytics
          event="no_result"
          properties={{ reason: paramsResult.reason }}
        />
        <EmptyState
          title="검색 조건을 다시 확인해 주세요"
          description={paramsResult.message}
          showSearchLink
        />
      </>
    );
  }

  const result = await search(paramsResult.query);

  if (!result.hotel) {
    return (
      <>
        <PageAnalytics event="no_result" properties={{ reason: "hotel_not_found" }} />
        <EmptyState
          title="호텔을 찾지 못했습니다"
          description="호텔명을 다시 입력하거나 영문 호텔명을 함께 적어 다시 검색해 주세요."
          showSearchLink
        />
      </>
    );
  }

  const highlightedOfferId = result.brgEvaluation?.comparisonOfferId ?? null;
  const offerByProvider = new Map(
    result.offers.map((offer) => [offer.providerId, offer])
  );
  const collectedAt = result.offers[0]
    ? formatCollectedAt(result.offers[0].collectedAt)
    : undefined;
  const hotelLocation = [result.hotel.city, result.hotel.country, result.hotel.brand]
    .filter(Boolean)
    .join(" · ");
  const hasPartialFailure = result.fetchStatuses.some(
    (status) => status.status === "failed" || status.status === "timeout"
  );
  const hasReferenceMode = result.offerDataMode === "reference";
  const hasCandidate =
    result.brgEvaluation?.comparisonOfferId != null &&
    (result.brgEvaluation.priceGap ?? 0) > 0;

  return (
    <div className="min-h-screen bg-wt-bg">
      <PageAnalytics
        event="search_success"
        properties={{
          hotel: result.hotel.slug,
          offer_count: result.offers.length,
          provider_count: result.providers.length,
          data_mode: result.offerDataMode,
        }}
      />
      {hasCandidate && (
        <PageAnalytics
          event="candidate_found"
          properties={{
            provider: result.brgEvaluation?.comparisonProviderId ?? null,
            match_type: result.brgEvaluation?.matchType ?? null,
            data_mode: result.offerDataMode,
          }}
        />
      )}
      {hasPartialFailure && (
        <PageAnalytics event="partial_failure" properties={{ hotel: result.hotel.slug }} />
      )}

      <SearchSummaryBar
        query={result.query}
        hotelName={getHotelDisplayName(result.hotel)}
      />

      <Container size="xl" className="py-wt-6 md:py-wt-8">
        <section className="mb-wt-6 md:mb-wt-8">
          <MyBookingSummary
            query={result.query}
            hotelName={getHotelDisplayName(result.hotel)}
            hotelLocation={hotelLocation || undefined}
          />
        </section>

        {hasReferenceMode && (
          <section className="mb-wt-6 rounded-wt-lg border border-wt-info-bg bg-wt-info-bg px-wt-4 py-wt-3 md:mb-wt-8">
            <p className="font-body text-wt-body-sm font-semibold text-wt-info-text">
              이번 검색은 참고 후보 모드입니다
            </p>
            <p className="mt-wt-1 text-wt-body-sm leading-relaxed text-wt-text-secondary">
              현재는 실시간 확정가 대신 같은 조건으로 다시 확인할 수 있는 공급처 기준
              참고 후보를 보여주고 있습니다. 가격과 조건은 외부 사이트에서 최종 확인해
              주세요.
            </p>
          </section>
        )}

        <PartialFailureNotice fetchStatuses={result.fetchStatuses} />

        {result.brgEvaluation && (
          <section className="mb-wt-8">
            <BrgSummaryCard
              evaluation={result.brgEvaluation}
              currency={result.query.currency}
              collectedAt={collectedAt}
              dataMode={result.offerDataMode}
              bestOfferDeeplink={
                result.brgEvaluation.comparisonOfferId
                  ? result.offers.find(
                      (offer) => offer.id === result.brgEvaluation?.comparisonOfferId
                    )?.deeplink
                  : null
              }
              bestOfferProviderName={
                result.brgEvaluation.comparisonOfferId
                  ? getProviderDisplayName(
                      result.offers.find(
                        (offer) => offer.id === result.brgEvaluation?.comparisonOfferId
                      )?.providerId ?? ""
                    )
                  : null
              }
            />
          </section>
        )}

        {result.brgEvaluation && (
          <section className="mb-wt-6 md:mb-wt-8">
            <ConditionSummary evaluation={result.brgEvaluation} />
          </section>
        )}

        {result.providers.length > 0 && (
          <section className="mt-wt-8 md:mt-wt-10">
            <div className="flex flex-col gap-wt-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-wt-h3 text-wt-text-primary">
                  {hasReferenceMode ? "공급처별 참고 후보" : "자동 확인된 공급처 비교"}
                </h2>
                <p className="mt-wt-1 text-wt-body-sm leading-relaxed text-wt-text-secondary">
                  {hasReferenceMode
                    ? "외부 사이트로 이동하기 전 어떤 공급처가 더 유력해 보이는지 빠르게 확인하는 영역입니다."
                    : "자동으로 확인된 공급처 기준의 비교 결과입니다. 수집 시점 이후 가격은 달라질 수 있습니다."}
                </p>
              </div>
              <p className="text-wt-caption leading-relaxed text-wt-text-secondary">
                최종 예약 전에는 외부 사이트에서 객실 조건과 총액을 다시 확인해 주세요.
              </p>
            </div>
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
        )}

        <section className="mt-wt-8 rounded-wt-xl border border-wt-border bg-wt-panel p-wt-6 shadow-wt-card md:mt-wt-10 md:p-wt-8">
          <h2 className="font-display text-wt-h3 text-wt-text-primary">
            직접 다시 확인할 사이트
          </h2>
          <p className="mt-wt-2 text-wt-body-sm leading-relaxed text-wt-text-secondary">
            아래 링크는 가능한 범위에서 같은 호텔명, 같은 날짜, 같은 인원 조건으로
            검색 결과 페이지에 이동합니다.
          </p>
          <p className="mt-wt-1 text-wt-caption leading-relaxed text-wt-text-secondary">
            일부 공급처는 최종 상세 페이지 대신 검색 결과 목록으로 이동할 수 있습니다.
            이동 후 조건이 유지되는지 한 번 더 확인해 주세요.
          </p>
          <div className="mt-wt-4 flex flex-wrap gap-wt-2 sm:gap-wt-3">
            {result.fallbackLinks.map((link) => (
              <a
                key={link.providerId}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                data-track="external_link_click"
                data-track-location="fallback_links"
                data-track-provider={link.providerId}
                data-track-url={link.url}
                className="inline-flex h-11 items-center justify-center rounded-wt-md border-2 border-wt-brand-700 px-wt-4 text-wt-body-sm font-medium text-wt-brand-700 transition-colors hover:bg-wt-info-bg focus-wt"
              >
                {link.name}
              </a>
            ))}
          </div>
        </section>

        <div className="mt-wt-8 rounded-wt-lg border border-wt-border bg-wt-surface p-wt-4 md:mt-wt-10">
          <p className="text-wt-body-sm leading-relaxed text-wt-text-secondary">
            표시된 가격은 수집 시점 기준 참고 정보이며 실제 예약 화면과 다를 수 있습니다.
            세금, 수수료, 프로모션, 결제 방식, 객실 조건에 따라 총액이 달라질 수 있습니다.
            BRG 가능성은 참고 정보이며 승인 여부를 보장하지 않습니다.
          </p>
        </div>
      </Container>
    </div>
  );
}
