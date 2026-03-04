import type { RateOffer, ProviderFetchStatus } from "@/lib/types/schema";
import { formatPrice } from "@/lib/search/format";
import { getProviderDisplayName } from "@/lib/search/format";
import { CONDITION_LABELS } from "@/lib/search/format";
import { Card } from "@/components/ui";
import { ConditionBadge } from "@/components/ui";

interface ProviderDetailCardProps {
  offer: RateOffer | null;
  providerId: string;
  fetchStatus: ProviderFetchStatus | undefined;
  isOfficial: boolean;
  isLowestOta: boolean;
}

/**
 * 상세 페이지용 공급처 카드: 가격 + 조건 + 외부 링크 (15-page-wireframes §6)
 */
export function ProviderDetailCard({
  offer,
  providerId,
  fetchStatus,
  isOfficial,
  isLowestOta,
}: ProviderDetailCardProps) {
  const name = getProviderDisplayName(providerId);
  const isFailed = fetchStatus?.status === "failed" || fetchStatus?.status === "timeout";

  if (isFailed) {
    return (
      <Card padding="md" className="border-wt-danger-bg/40">
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
  const buttonLabel = isOfficial ? "공식 사이트 보기" : "가격 보기";

  return (
    <Card padding="md" hover>
      <div className="flex flex-wrap items-start justify-between gap-wt-2">
        <span className="font-body font-medium text-wt-text-primary">{name}</span>
        <div className="flex gap-wt-2">
          {isOfficial && (
            <span className="rounded-wt-pill bg-wt-info-bg px-wt-2 py-wt-0.5 text-wt-caption font-medium text-wt-info-text">
              공식가
            </span>
          )}
          {isLowestOta && (
            <span className="rounded-wt-pill bg-wt-success-bg px-wt-2 py-wt-0.5 text-wt-caption font-medium text-wt-success-text">
              최저가
            </span>
          )}
        </div>
      </div>
      <p className="mt-wt-3 font-body text-wt-body-lg font-semibold tabular-nums text-wt-text-primary">
        {formatPrice(offer.totalPrice, offer.currency)}
      </p>
      <div className="mt-wt-3 flex flex-wrap gap-wt-2">
        <ConditionBadge variant="neutral">
          {CONDITION_LABELS.cancellationType[c.cancellationType]}
        </ConditionBadge>
        <ConditionBadge variant="neutral">
          {c.taxIncluded === true ? "세금 포함" : c.taxIncluded === false ? "세금 미포함" : "—"}
        </ConditionBadge>
        <ConditionBadge variant="neutral">
          {CONDITION_LABELS.boardType[c.boardType]}
        </ConditionBadge>
        <ConditionBadge variant="neutral">
          {CONDITION_LABELS.paymentType[c.paymentType]}
        </ConditionBadge>
      </div>
      <a
        href={offer.deeplink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-wt-4 inline-flex h-11 items-center justify-center rounded-wt-md bg-wt-brand-700 px-wt-4 text-wt-body-sm font-medium text-white hover:bg-wt-brand-500 focus-wt"
      >
        {buttonLabel}
      </a>
    </Card>
  );
}
