import type { ProviderFetchStatus, ProviderLinkKind, RateOffer } from "@/lib/types/schema";
import {
  CONDITION_LABELS_KO,
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

function getPrimaryCtaLabel(linkKind: ProviderLinkKind, isOfficial: boolean): string {
  if (isOfficial) return "공식 홈페이지 보기";
  if (linkKind === "condition_search") return "같은 조건으로 다시 확인";
  if (linkKind === "hotel_detail") return "호텔 상세 보기";
  return "공급처 홈 보기";
}

function getLinkHint(linkKind: ProviderLinkKind): string {
  if (linkKind === "condition_search") {
    return "검색 조건이 유지된 공급처 페이지로 이동합니다.";
  }
  if (linkKind === "hotel_detail") {
    return "해당 공급처의 호텔 상세 페이지로 이동합니다.";
  }
  return "공급처 메인 페이지로 이동합니다.";
}

export function ProviderDetailCard({
  offer,
  providerId,
  fetchStatus,
  isOfficial,
  isBestCandidate,
}: ProviderDetailCardProps) {
  const name = getProviderDisplayName(providerId);
  const isFailed =
    fetchStatus?.status === "failed" || fetchStatus?.status === "timeout";
  const isReference = fetchStatus?.status === "reference";

  if (isFailed) {
    return (
      <Card padding="md" className="border-wt-danger-bg/40">
        <div className="flex items-center justify-between">
          <span className="font-body font-medium text-wt-text-primary">{name}</span>
          <span className="text-wt-caption text-wt-danger-text">가격 확인 실패</span>
        </div>
        <p className="mt-wt-2 text-wt-body-sm text-wt-text-secondary">
          {fetchStatus?.message ?? "이번 검색에서는 이 공급처 결과를 확인하지 못했습니다."}
        </p>
      </Card>
    );
  }

  if (!offer) return null;

  const condition = offer.condition;

  return (
    <Card padding="md" hover className="transition-shadow duration-200">
      <div className="flex flex-wrap items-start justify-between gap-wt-2">
        <span className="font-body font-medium text-wt-text-primary">{name}</span>
        <div className="flex gap-wt-2">
          {isOfficial && (
            <span className="rounded-wt-pill bg-wt-info-bg px-wt-2 py-wt-0.5 text-wt-caption font-medium text-wt-info-text">
              공식
            </span>
          )}
          {isReference && (
            <span className="rounded-wt-pill bg-wt-info-bg px-wt-2 py-wt-0.5 text-wt-caption font-medium text-wt-info-text">
              참고 후보
            </span>
          )}
          {isBestCandidate && (
            <span className="rounded-wt-pill bg-wt-success-bg px-wt-2 py-wt-0.5 text-wt-caption font-medium text-wt-success-text">
              가장 유력한 후보
            </span>
          )}
        </div>
      </div>

      <p className="mt-wt-3 font-body text-wt-body-lg font-semibold tabular-nums text-wt-text-primary">
        {formatPrice(offer.totalPrice, offer.currency)}
      </p>

      <div className="mt-wt-3 flex flex-wrap gap-wt-2">
        <ConditionBadge variant="neutral">
          {CONDITION_LABELS_KO.cancellationType[condition.cancellationType]}
        </ConditionBadge>
        <ConditionBadge variant="neutral">
          {condition.taxIncluded === true
            ? "세금 포함"
            : condition.taxIncluded === false
              ? "세금 별도"
              : "세금 정보 없음"}
        </ConditionBadge>
        <ConditionBadge variant="neutral">
          {CONDITION_LABELS_KO.boardType[condition.boardType]}
        </ConditionBadge>
        <ConditionBadge variant="neutral">
          {CONDITION_LABELS_KO.paymentType[condition.paymentType]}
        </ConditionBadge>
      </div>

      <p className="mt-wt-3 text-wt-caption leading-relaxed text-wt-text-secondary">
        {getLinkHint(offer.linkKind)}
      </p>

      {isReference && (
        <p className="mt-wt-2 text-wt-caption leading-relaxed text-wt-text-secondary">
          실시간 확정가가 아니라 사용자가 다시 확인할 수 있도록 정리한 참고 후보입니다.
        </p>
      )}

      <div className="mt-wt-4 flex flex-wrap gap-wt-3">
        <a
          href={offer.deeplink}
          target="_blank"
          rel="noopener noreferrer"
          data-track="external_link_click"
          data-track-location="hotel_detail_provider_card"
          data-track-provider={providerId}
          data-track-url={offer.deeplink}
          className="inline-flex h-11 items-center justify-center rounded-wt-md bg-wt-brand-700 px-wt-4 text-wt-body-sm font-medium text-white transition-colors hover:bg-wt-brand-500 focus-wt"
        >
          {getPrimaryCtaLabel(offer.linkKind, isOfficial)}
        </a>

        {offer.hotelDetailUrl && offer.hotelDetailUrl !== offer.deeplink && (
          <a
            href={offer.hotelDetailUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-track="external_link_click"
            data-track-location="hotel_detail_provider_card_detail"
            data-track-provider={providerId}
            data-track-url={offer.hotelDetailUrl}
            className="inline-flex h-11 items-center justify-center rounded-wt-md px-wt-1 text-wt-body-sm font-medium text-wt-text-secondary underline-offset-4 hover:underline focus-wt"
          >
            호텔 상세 페이지
          </a>
        )}
      </div>
    </Card>
  );
}
