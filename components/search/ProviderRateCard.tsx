import type { RateOffer, ProviderFetchStatus } from "@/lib/types/schema";
import { formatPrice } from "@/lib/search/format";
import { getProviderDisplayName } from "@/lib/search/format";
import { CONDITION_LABELS } from "@/lib/search/format";
import { Card } from "@/components/ui";
import { ConditionBadge } from "@/components/ui";

interface ProviderRateCardProps {
  offer: RateOffer | null;
  providerId: string;
  fetchStatus: ProviderFetchStatus | undefined;
  isLowestOta: boolean;
}

/**
 * 모바일: 공급처별 카드 (12-component-spec §6, 15-page-wireframes §5)
 */
export function ProviderRateCard({
  offer,
  providerId,
  fetchStatus,
  isLowestOta,
}: ProviderRateCardProps) {
  const name = getProviderDisplayName(providerId);
  const isFailed = fetchStatus?.status === "failed" || fetchStatus?.status === "timeout";

  if (isFailed) {
    return (
      <Card padding="md" className="border-wt-danger-bg/50">
        <div className="flex items-center justify-between">
          <span className="font-body font-medium text-wt-text-primary">{name}</span>
          <span className="text-wt-caption text-wt-danger-text">수집 실패</span>
        </div>
        <p className="mt-wt-2 text-wt-body-sm text-wt-text-secondary">
          {fetchStatus?.message ?? "일시적으로 수집할 수 없습니다."}
        </p>
      </Card>
    );
  }

  if (!offer) return null;

  const c = offer.condition;

  return (
    <Card padding="md" hover>
      <div className="flex items-start justify-between gap-wt-2">
        <span className="font-body font-medium text-wt-text-primary">{name}</span>
        {isLowestOta && (
          <span className="shrink-0 rounded-wt-pill bg-wt-success-bg px-wt-2 py-wt-0.5 text-wt-caption font-medium text-wt-success-text">
            최저가
          </span>
        )}
      </div>
      <p className="mt-wt-2 font-body text-wt-body-lg font-semibold tabular-nums text-wt-text-primary">
        {formatPrice(offer.totalPrice, offer.currency)}
      </p>
      <div className="mt-wt-3 flex flex-wrap gap-wt-2">
        <ConditionBadge variant="neutral">
          {CONDITION_LABELS.cancellationType[c.cancellationType]}
        </ConditionBadge>
        <ConditionBadge variant="neutral">
          {CONDITION_LABELS.boardType[c.boardType]}
        </ConditionBadge>
        {c.taxIncluded === true && (
          <ConditionBadge variant="neutral">세금 포함</ConditionBadge>
        )}
      </div>
      <a
        href={offer.deeplink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-wt-4 inline-flex h-10 items-center justify-center rounded-wt-md border-2 border-wt-brand-700 px-wt-4 text-wt-body-sm font-medium text-wt-brand-700 hover:bg-wt-info-bg focus-wt"
      >
        가격 보기
      </a>
    </Card>
  );
}
