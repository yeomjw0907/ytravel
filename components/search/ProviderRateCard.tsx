import type { ProviderFetchStatus, ProviderLinkKind, RateOffer } from "@/lib/types/schema";
import {
  CONDITION_LABELS_KO,
  formatPrice,
  getProviderDisplayName,
} from "@/lib/search/format";
import { Card, ConditionBadge } from "@/components/ui";

const SUMMARY_CARD_CLASS =
  "rounded-wt-xl border border-wt-border bg-wt-panel p-wt-6 shadow-wt-card md:p-wt-8";

interface ProviderRateCardProps {
  offer: RateOffer | null;
  providerId: string;
  fetchStatus: ProviderFetchStatus | undefined;
  isBestCandidate: boolean;
  userBookedPrice?: number;
  currency?: string;
  variant?: "default" | "summary";
}

function getPrimaryCtaLabel(linkKind: ProviderLinkKind): string {
  if (linkKind === "condition_search") return "같은 조건으로 다시 확인";
  if (linkKind === "hotel_detail") return "호텔 상세 보기";
  return "공급처 홈 보기";
}

function getLinkHint(linkKind: ProviderLinkKind): string {
  if (linkKind === "condition_search") {
    return "검색 조건이 유지된 페이지로 이동합니다.";
  }
  if (linkKind === "hotel_detail") {
    return "해당 공급처의 호텔 상세 페이지로 이동합니다.";
  }
  return "공급처 메인 페이지로 이동합니다.";
}

export function ProviderRateCard({
  offer,
  providerId,
  fetchStatus,
  isBestCandidate,
  userBookedPrice,
  currency = "KRW",
  variant = "default",
}: ProviderRateCardProps) {
  const name = getProviderDisplayName(providerId);
  const isFailed =
    fetchStatus?.status === "failed" || fetchStatus?.status === "timeout";
  const isReference = fetchStatus?.status === "reference";
  const showVsUserPrice =
    offer && userBookedPrice != null && Number.isFinite(userBookedPrice);
  const priceGap = showVsUserPrice ? userBookedPrice! - offer.totalPrice : null;
  const isSummary = variant === "summary";

  if (isFailed) {
    const failureContent = (
      <>
        <div className="flex items-center justify-between">
          <span className="font-body font-medium text-wt-text-primary">{name}</span>
          <span className="text-wt-caption text-wt-danger-text">가격 확인 실패</span>
        </div>
        <p className="mt-wt-2 text-wt-body-sm text-wt-text-secondary">
          {fetchStatus?.message ?? "이번 검색에서는 이 공급처의 결과를 불러오지 못했습니다."}
        </p>
      </>
    );

    if (isSummary) {
      return (
        <div className={`${SUMMARY_CARD_CLASS} border-wt-danger-bg/50`}>
          {failureContent}
        </div>
      );
    }

    return (
      <Card padding="md" className="border-wt-danger-bg/50">
        {failureContent}
      </Card>
    );
  }

  if (!offer) return null;

  const condition = offer.condition;

  const content = (
    <>
      <div className="flex items-start justify-between gap-wt-2">
        <span className="font-body font-medium text-wt-text-primary">{name}</span>
        <div className="flex flex-wrap justify-end gap-wt-2">
          {isReference && (
            <span className="shrink-0 rounded-wt-pill bg-wt-info-bg px-wt-2 py-wt-0.5 text-wt-caption font-medium text-wt-info-text">
              참고 후보
            </span>
          )}
          {isBestCandidate && (
            <span className="shrink-0 rounded-wt-pill bg-wt-success-bg px-wt-2 py-wt-0.5 text-wt-caption font-medium text-wt-success-text">
              가장 유력한 후보
            </span>
          )}
        </div>
      </div>

      <p className="mt-wt-2 font-body text-wt-body-lg font-semibold tabular-nums text-wt-text-primary">
        {formatPrice(offer.totalPrice, offer.currency)}
      </p>

      {priceGap != null && (
        <p className="mt-wt-1 text-wt-body-sm tabular-nums text-wt-text-secondary">
          {priceGap > 0 ? (
            <span className="text-wt-success-text">
              내 예약가보다 {formatPrice(priceGap, currency)} 저렴
            </span>
          ) : priceGap < 0 ? (
            <span className="text-wt-danger-text">
              내 예약가보다 {formatPrice(-priceGap, currency)} 비쌈
            </span>
          ) : (
            <span>내 예약가와 동일</span>
          )}
        </p>
      )}

      <div className="mt-wt-3 flex flex-wrap gap-wt-2">
        <ConditionBadge variant="neutral">
          {CONDITION_LABELS_KO.cancellationType[condition.cancellationType]}
        </ConditionBadge>
        <ConditionBadge variant="neutral">
          {CONDITION_LABELS_KO.boardType[condition.boardType]}
        </ConditionBadge>
        {condition.taxIncluded === true && (
          <ConditionBadge variant="neutral">세금 포함</ConditionBadge>
        )}
      </div>

      <p className="mt-wt-3 text-wt-caption leading-relaxed text-wt-text-secondary">
        {getLinkHint(offer.linkKind)}
      </p>

      {isReference && (
        <p className="mt-wt-2 text-wt-caption leading-relaxed text-wt-text-secondary">
          이 카드는 실시간 확정가가 아니라 재확인용 참고 후보입니다.
        </p>
      )}

      <div className="mt-wt-4 flex flex-wrap gap-wt-3">
        <a
          href={offer.deeplink}
          target="_blank"
          rel="noopener noreferrer"
          data-track="external_link_click"
          data-track-location={isSummary ? "provider_summary_card" : "provider_card"}
          data-track-provider={providerId}
          data-track-url={offer.deeplink}
          className={`inline-flex items-center justify-center rounded-wt-md border-2 border-wt-brand-700 px-wt-4 text-wt-body-sm font-medium text-wt-brand-700 hover:bg-wt-info-bg focus-wt ${
            isSummary ? "h-11" : "h-10"
          }`}
        >
          {getPrimaryCtaLabel(offer.linkKind)}
        </a>

        {offer.hotelDetailUrl && offer.hotelDetailUrl !== offer.deeplink && (
          <a
            href={offer.hotelDetailUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track="external_link_click"
            data-track-location={
              isSummary ? "provider_summary_card_detail" : "provider_card_detail"
            }
            data-track-provider={providerId}
            data-track-url={offer.hotelDetailUrl}
            className={`inline-flex items-center justify-center rounded-wt-md px-wt-1 text-wt-body-sm font-medium text-wt-text-secondary underline-offset-4 hover:underline focus-wt ${
              isSummary ? "h-11" : "h-10"
            }`}
          >
            호텔 상세 페이지
          </a>
        )}
      </div>
    </>
  );

  if (isSummary) {
    return <div className={SUMMARY_CARD_CLASS}>{content}</div>;
  }

  return <Card padding="md" hover>{content}</Card>;
}
