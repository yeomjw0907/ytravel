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
import type { ProviderLinkKind } from "@/lib/types/schema";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function getLinkKindBadge(kind: ProviderLinkKind): string {
  if (kind === "hotel_detail") return "호텔 상세";
  if (kind === "condition_search") return "검색 랜딩";
  return "일반 바로가기";
}

function getDeepLinkDescription(kind: ProviderLinkKind): string {
  if (kind === "hotel_detail") {
    return "해당 공급처의 호텔 상세 페이지로 바로 이동합니다.";
  }

  if (kind === "condition_search") {
    return "같은 일정과 인원 조건을 최대한 유지한 검색 결과로 이동합니다.";
  }

  return "해당 공급처로 바로 이동해 같은 호텔을 다시 확인할 수 있습니다.";
}

function getShortcutDescription(kind: ProviderLinkKind): string {
  if (kind === "condition_search") {
    return "가능한 경우 현재 조건을 담아 검색 결과로 이동합니다.";
  }

  return "딥링크는 아니지만 바로 이동 가능한 공급처 링크입니다.";
}

function getCtaLabel(kind: ProviderLinkKind, isShortcut: boolean): string {
  if (isShortcut) {
    return kind === "condition_search" ? "검색 결과로 이동" : "사이트로 이동";
  }

  if (kind === "hotel_detail") return "호텔 상세에서 확인";
  if (kind === "condition_search") return "같은 조건으로 확인";
  return "사이트에서 확인";
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const paramsResult = searchParamsToQuery(params);

  if (!paramsResult.ok) {
    return (
      <>
        <PageAnalytics event="no_result" properties={{ reason: paramsResult.reason }} />
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
          description="호텔명을 다시 입력하거나 영문 호텔명으로 검색해 주세요."
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
  const deepLinkCount = result.fallbackLinks.length;
  const shortcutLinkCount = result.shortcutLinks.length;

  return (
    <div className="min-h-screen bg-wt-bg">
      <PageAnalytics
        event="search_success"
        properties={{
          hotel: result.hotel.slug,
          offer_count: result.offers.length,
          provider_count: result.providers.length,
          data_mode: result.offerDataMode,
          deep_link_count: deepLinkCount,
          shortcut_link_count: shortcutLinkCount,
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

        {result.providers.length > 0 && (
          <section className="mt-wt-8 md:mt-wt-10">
            <div className="flex flex-col gap-wt-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-wt-h3 text-wt-text-primary">
                  추천 후보
                </h2>
                <p className="mt-wt-1 text-wt-body-sm leading-relaxed text-wt-text-secondary">
                  {hasReferenceMode
                    ? "자동 비교 기준으로 추린 참고 후보입니다. 실제 예약 화면은 위 딥링크에서 다시 확인할 수 있습니다."
                    : "자동으로 확인한 공급처 기준 추천 후보입니다. 실제 가격과 조건은 외부 사이트에서 다시 확인해 주세요."}
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

        {result.fallbackLinks.length > 0 && (
          <section className="mt-wt-8 md:mt-wt-10">
            <div className="flex flex-col gap-wt-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-wt-h3 text-wt-text-primary">
                  딥링크 바로가기
                </h2>
                <p className="mt-wt-1 text-wt-body-sm leading-relaxed text-wt-text-secondary">
                  체크인, 체크아웃, 인원 조건을 최대한 유지한 링크입니다. 외부 사이트로
                  이동한 뒤 최종 조건을 한 번 더 확인해 주세요.
                </p>
              </div>
              <span className="inline-flex h-8 items-center rounded-full bg-wt-info-bg px-wt-3 text-wt-caption font-medium text-wt-info-text">
                {deepLinkCount}개 사이트
              </span>
            </div>
            <div className="mt-wt-4 space-y-wt-4">
              {result.fallbackLinks.map((link) => (
                <a
                  key={link.providerId}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="external_link_click"
                  data-track-location="deep_links"
                  data-track-provider={link.providerId}
                  data-track-url={link.url}
                  className="block rounded-wt-xl border border-wt-border bg-wt-panel p-wt-5 shadow-wt-card transition-all hover:border-wt-brand-300 hover:shadow-wt-soft focus-wt md:p-wt-6"
                >
                  <div className="flex flex-col gap-wt-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-wt-2">
                        <span className="font-body text-wt-body-md font-medium text-wt-text-primary">
                          {link.name}
                        </span>
                        <span className="shrink-0 rounded-wt-pill bg-wt-info-bg px-wt-2 py-wt-0.5 text-wt-caption font-medium text-wt-info-text">
                          {getLinkKindBadge(link.linkKind)}
                        </span>
                      </div>
                      <p className="mt-wt-3 text-wt-body-sm leading-relaxed text-wt-text-secondary">
                        {getDeepLinkDescription(link.linkKind)}
                      </p>
                      {link.note && (
                        <p className="mt-wt-2 text-wt-caption leading-relaxed text-wt-text-secondary">
                          {link.note}
                        </p>
                      )}
                    </div>
                    <div className="inline-flex h-11 items-center justify-center rounded-wt-md border-2 border-wt-brand-700 px-wt-4 text-wt-body-sm font-medium text-wt-brand-700 transition-colors hover:bg-wt-info-bg">
                      {getCtaLabel(link.linkKind, false)}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {result.brgEvaluation && (
          <section className="mt-wt-8 md:mt-wt-10">
            <ConditionSummary evaluation={result.brgEvaluation} />
          </section>
        )}

        {result.shortcutLinks.length > 0 && (
          <section className="mt-wt-8 md:mt-wt-10">
            <div className="flex flex-col gap-wt-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-wt-h3 text-wt-text-primary">
                  추가 바로가기 사이트
                </h2>
                <p className="mt-wt-1 text-wt-body-sm leading-relaxed text-wt-text-secondary">
                  딥링크는 아니지만 바로 이동 가능한 공급처입니다. 일부 사이트는
                  호텔명이나 조건을 다시 선택해야 할 수 있습니다.
                </p>
              </div>
              <span className="inline-flex h-8 items-center rounded-full bg-wt-surface px-wt-3 text-wt-caption font-medium text-wt-text-secondary">
                {shortcutLinkCount}개 사이트
              </span>
            </div>
            <div className="mt-wt-4 space-y-wt-4">
              {result.shortcutLinks.map((link) => (
                <a
                  key={link.providerId}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="external_link_click"
                  data-track-location="shortcut_links"
                  data-track-provider={link.providerId}
                  data-track-url={link.url}
                  className="block rounded-wt-xl border border-wt-border bg-wt-panel p-wt-5 shadow-wt-card transition-all hover:border-wt-brand-300 hover:shadow-wt-soft focus-wt md:p-wt-6"
                >
                  <div className="flex flex-col gap-wt-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-wt-2">
                        <span className="font-body text-wt-body-md font-medium text-wt-text-primary">
                          {link.name}
                        </span>
                        <span className="shrink-0 rounded-wt-pill bg-wt-surface px-wt-2 py-wt-0.5 text-wt-caption font-medium text-wt-text-secondary">
                          {getLinkKindBadge(link.linkKind)}
                        </span>
                      </div>
                      <p className="mt-wt-3 text-wt-body-sm leading-relaxed text-wt-text-secondary">
                        {getShortcutDescription(link.linkKind)}
                      </p>
                      {link.note && (
                        <p className="mt-wt-2 text-wt-caption leading-relaxed text-wt-text-secondary">
                          {link.note}
                        </p>
                      )}
                    </div>
                    <div className="inline-flex h-11 items-center justify-center rounded-wt-md border-2 border-wt-brand-700 px-wt-4 text-wt-body-sm font-medium text-wt-brand-700 transition-colors hover:bg-wt-info-bg">
                      {getCtaLabel(link.linkKind, true)}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

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
