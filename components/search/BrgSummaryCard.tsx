import type { BrgEvaluation, OfferDataMode } from "@/lib/types/schema";
import { formatPrice } from "@/lib/search/format";
import { StatusPill } from "@/components/ui";

interface BrgSummaryCardProps {
  evaluation: BrgEvaluation;
  currency: string;
  collectedAt?: string;
  bestOfferDeeplink?: string | null;
  bestOfferProviderName?: string | null;
  dataMode?: OfferDataMode;
}

const ELIGIBILITY_VARIANT: Record<
  BrgEvaluation["eligibility"],
  "success" | "warning" | "danger" | "neutral"
> = {
  likely: "success",
  review: "warning",
  not_eligible: "danger",
  insufficient_data: "neutral",
};

const ELIGIBILITY_LABEL: Record<BrgEvaluation["eligibility"], string> = {
  likely: "조건이 잘 맞는 후보",
  review: "수동 확인 필요",
  not_eligible: "더 싼 후보 없음",
  insufficient_data: "비교 데이터 부족",
};

const MATCH_LABEL: Record<BrgEvaluation["matchType"], string> = {
  exact: "조건 일치",
  close: "유사 조건",
  reference_only: "참고용 후보",
  none: "비교 불가",
};

const CONFIDENCE_LABEL: Record<string, string> = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

export function BrgSummaryCard({
  evaluation,
  currency,
  collectedAt,
  bestOfferDeeplink,
  bestOfferProviderName,
  dataMode = "live",
}: BrgSummaryCardProps) {
  const variant = ELIGIBILITY_VARIANT[evaluation.eligibility];
  const statusLabel = ELIGIBILITY_LABEL[evaluation.eligibility];
  const reason = evaluation.reasons[0] ?? null;

  return (
    <div className="rounded-wt-xl border border-wt-border bg-wt-panel p-wt-6 shadow-wt-card md:p-wt-8">
      <div className="flex flex-wrap items-start justify-between gap-wt-3">
        <div>
          <h2 className="font-display text-wt-h3 text-wt-text-primary">
            예약가 점검 요약
          </h2>
          <p className="mt-wt-1.5 text-wt-body-sm leading-relaxed text-wt-text-secondary">
            {MATCH_LABEL[evaluation.matchType]} · 신뢰도{" "}
            {CONFIDENCE_LABEL[evaluation.confidence] ?? evaluation.confidence}
          </p>
        </div>
        <StatusPill variant={variant}>{statusLabel}</StatusPill>
      </div>

      <div className="mt-wt-5 grid grid-cols-1 gap-wt-4 sm:grid-cols-3">
        <div>
          <p className="text-wt-caption font-medium text-wt-text-secondary">
            내 예약가
          </p>
          <p className="mt-wt-1 font-body text-wt-body-lg font-semibold tabular-nums text-wt-text-primary">
            {evaluation.userBookedPrice != null
              ? formatPrice(evaluation.userBookedPrice, currency)
              : "-"}
          </p>
        </div>
        <div>
          <p className="text-wt-caption font-medium text-wt-text-secondary">
            현재 후보가
          </p>
          <p className="mt-wt-1 font-body text-wt-body-lg font-semibold tabular-nums text-wt-text-primary">
            {evaluation.candidatePrice != null
              ? formatPrice(evaluation.candidatePrice, currency)
              : "-"}
          </p>
        </div>
        <div>
          <p className="text-wt-caption font-medium text-wt-text-secondary">
            차액
          </p>
          <p className="mt-wt-1 font-body text-wt-body-lg font-semibold tabular-nums text-wt-brand-700">
            {evaluation.priceGap != null
              ? `${formatPrice(Math.abs(evaluation.priceGap), currency)} ${
                  evaluation.priceGap > 0 ? "저렴" : "비쌈"
                }`
              : "-"}
          </p>
          {evaluation.priceGapPercent != null && (
            <p className="mt-wt-1 text-wt-caption text-wt-text-secondary">
              {Math.abs(evaluation.priceGapPercent).toFixed(1)}%
            </p>
          )}
        </div>
      </div>

      {reason && (
        <p className="mt-wt-4 font-body text-wt-body-sm leading-relaxed text-wt-text-secondary">
          {reason}
        </p>
      )}
      {collectedAt && (
        <p className="mt-wt-2 text-wt-caption text-wt-text-secondary">
          수집 시각: {collectedAt}
        </p>
      )}
      <p className="mt-wt-2 text-wt-caption leading-relaxed text-wt-text-secondary">
        {dataMode === "reference"
          ? "이번 결과는 실시간 확정가가 아니라 같은 조건으로 다시 확인하기 위한 참고 후보입니다."
          : "이 결과는 수집 시점 기준 정보이며 실제 예약 직전 다시 확인하는 것이 안전합니다."}{" "}
        BRG 승인 여부는 호텔 정책에 따라 달라질 수 있습니다.
      </p>
      {bestOfferDeeplink && (
        <a
          href={bestOfferDeeplink}
          target="_blank"
          rel="noopener noreferrer"
          data-track="external_link_click"
          data-track-location="summary_card"
          data-track-provider={bestOfferProviderName ?? "candidate"}
          data-track-url={bestOfferDeeplink}
          className="mt-wt-6 inline-flex h-11 items-center justify-center rounded-wt-md border-2 border-wt-brand-700 bg-wt-brand-700 px-wt-5 text-wt-body-sm font-semibold text-white transition-colors hover:border-wt-brand-800 hover:bg-wt-brand-800 focus-wt"
        >
          {bestOfferProviderName
            ? `${bestOfferProviderName}에서 다시 확인`
            : "외부 사이트에서 다시 확인"}
        </a>
      )}
    </div>
  );
}
