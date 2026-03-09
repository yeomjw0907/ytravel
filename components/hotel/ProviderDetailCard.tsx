import type { ProviderFetchStatus, RateOffer } from "@/lib/types/schema";
import {
  CONDITION_LABELS,
  formatPrice,
  getProviderDisplayName,
} from "@/lib/search/format";
import { Card, ConditionBadge } from "@/components/ui";

interface ProviderDetailCardProps {
  offer: RateOffer | null;
  providerId: string;
  fetchStatus: ProviderFetchStatus | undefined;
  isOfficial: boolean;
  isBestCandidate: boolean;
}

export function ProviderDetailCard({
  offer,
  providerId,
  fetchStatus,
  isOfficial,
  isBestCandidate,
}: ProviderDetailCardProps) {
  const name = getProviderDisplayName(providerId);
  const isFailed = fetchStatus?.status === "failed" || fetchStatus?.status === "timeout";

  if (isFailed) {
    return (
      <Card padding="md" className="border-wt-danger-bg/40">
        <div className="flex items-center justify-between">
          <span className="font-body font-medium text-wt-text-primary">{name}</span>
          <span className="text-wt-caption text-wt-danger-text">Fetch failed</span>
        </div>
        <p className="mt-wt-2 text-wt-body-sm text-wt-text-secondary">
          {fetchStatus?.message ?? "This provider could not be fetched."}
        </p>
      </Card>
    );
  }

  if (!offer) return null;

  const condition = offer.condition;
  const buttonLabel = isOfficial ? "View official site" : "View rate";

  return (
    <Card padding="md" hover>
      <div className="flex flex-wrap items-start justify-between gap-wt-2">
        <span className="font-body font-medium text-wt-text-primary">{name}</span>
        <div className="flex gap-wt-2">
          {isOfficial && (
            <span className="rounded-wt-pill bg-wt-info-bg px-wt-2 py-wt-0.5 text-wt-caption font-medium text-wt-info-text">
              Official
            </span>
          )}
          {isBestCandidate && (
            <span className="rounded-wt-pill bg-wt-success-bg px-wt-2 py-wt-0.5 text-wt-caption font-medium text-wt-success-text">
              Best
            </span>
          )}
        </div>
      </div>
      <p className="mt-wt-3 font-body text-wt-body-lg font-semibold tabular-nums text-wt-text-primary">
        {formatPrice(offer.totalPrice, offer.currency)}
      </p>
      <div className="mt-wt-3 flex flex-wrap gap-wt-2">
        <ConditionBadge variant="neutral">
          {CONDITION_LABELS.cancellationType[condition.cancellationType]}
        </ConditionBadge>
        <ConditionBadge variant="neutral">
          {condition.taxIncluded === true
            ? "Tax included"
            : condition.taxIncluded === false
              ? "Tax excluded"
              : "Tax unknown"}
        </ConditionBadge>
        <ConditionBadge variant="neutral">
          {CONDITION_LABELS.boardType[condition.boardType]}
        </ConditionBadge>
        <ConditionBadge variant="neutral">
          {CONDITION_LABELS.paymentType[condition.paymentType]}
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
