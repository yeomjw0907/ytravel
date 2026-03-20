import type { ProviderFetchStatus, RateOffer } from "@/lib/types/schema";
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
  const showVsUserPrice =
    offer && userBookedPrice != null && Number.isFinite(userBookedPrice);
  const priceGap = showVsUserPrice ? userBookedPrice! - offer.totalPrice : null;
  const isSummary = variant === "summary";

  if (isFailed) {
    const failureContent = (
      <>
        <div className="flex items-center justify-between">
          <span className="font-body font-medium text-wt-text-primary">{name}</span>
          <span className="text-wt-caption text-wt-danger-text">
            요금 확인 실패
          </span>
        </div>
        <p className="mt-wt-2 text-wt-body-sm text-wt-text-secondary">
          {fetchStatus?.message ?? "현재 이 공급처의 요금을 확인하지 못했습니다."}
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
        {isBestCandidate && (
          <span className="shrink-0 rounded-wt-pill bg-wt-success-bg px-wt-2 py-wt-0.5 text-wt-caption font-medium text-wt-success-text">
            가장 저렴한 후보
          </span>
        )}
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
              내 예약가보다 {formatPrice(-priceGap, currency)} 높음
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
      <a
        href={offer.deeplink}
        target="_blank"
        rel="noopener noreferrer"
        data-track="external_link_click"
        data-track-location={isSummary ? "provider_summary_card" : "provider_card"}
        data-track-provider={providerId}
        data-track-url={offer.deeplink}
        className={`mt-wt-4 inline-flex items-center justify-center rounded-wt-md border-2 border-wt-brand-700 px-wt-4 text-wt-body-sm font-medium text-wt-brand-700 hover:bg-wt-info-bg focus-wt ${
          isSummary ? "h-11" : "h-10"
        }`}
      >
        {isSummary ? "외부 사이트에서 확인" : "요금 다시 확인"}
      </a>
    </>
  );

  if (isSummary) {
    return <div className={SUMMARY_CARD_CLASS}>{content}</div>;
  }

  return <Card padding="md" hover>{content}</Card>;
}
