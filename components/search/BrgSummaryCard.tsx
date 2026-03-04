import type { BrgEvaluation } from "@/lib/types/schema";
import { formatPrice } from "@/lib/search/format";
import { StatusPill } from "@/components/ui";

interface BrgSummaryCardProps {
  evaluation: BrgEvaluation;
  currency: string;
  collectedAt?: string;
}

const ELIGIBILITY_VARIANT: Record<BrgEvaluation["eligibility"], "success" | "warning" | "danger" | "neutral"> = {
  likely: "success",
  review: "warning",
  not_eligible: "danger",
  insufficient_data: "neutral",
};

const ELIGIBILITY_LABEL: Record<BrgEvaluation["eligibility"], string> = {
  likely: "가능성 높음",
  review: "검토 필요",
  not_eligible: "조건 불일치",
  insufficient_data: "데이터 부족",
};

/**
 * BRG 요약: 공식가 / OTA 최저가 / 예상 BRG가 + 상태 (12-component-spec §4, 15-page-wireframes)
 */
export function BrgSummaryCard({ evaluation, currency, collectedAt }: BrgSummaryCardProps) {
  const variant = ELIGIBILITY_VARIANT[evaluation.eligibility];
  const statusLabel = ELIGIBILITY_LABEL[evaluation.eligibility];
  const reason = evaluation.reasons[0] ?? null;

  return (
    <div className="rounded-wt-xl border border-wt-border bg-wt-panel p-wt-6 shadow-wt-card md:p-wt-8">
      <div className="flex flex-wrap items-start justify-between gap-wt-3">
        <h2 className="font-display text-wt-h3 text-wt-text-primary">BRG 요약</h2>
        <StatusPill variant={variant}>{statusLabel}</StatusPill>
      </div>

      <div className="mt-wt-5 grid grid-cols-1 gap-wt-4 sm:grid-cols-3">
        <div>
          <p className="text-wt-caption font-medium text-wt-text-secondary">공식 홈페이지</p>
          <p className="mt-wt-1 font-body text-wt-body-lg font-semibold tabular-nums text-wt-text-primary">
            {evaluation.officialPrice != null
              ? formatPrice(evaluation.officialPrice, currency)
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-wt-caption font-medium text-wt-text-secondary">OTA 최저가</p>
          <p className="mt-wt-1 font-body text-wt-body-lg font-semibold tabular-nums text-wt-text-primary">
            {evaluation.lowestOtaPrice != null
              ? formatPrice(evaluation.lowestOtaPrice, currency)
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-wt-caption font-medium text-wt-text-secondary">예상 BRG가</p>
          <p className="mt-wt-1 font-body text-wt-body-lg font-semibold tabular-nums text-wt-brand-700">
            {evaluation.estimatedBrgPrice != null
              ? formatPrice(evaluation.estimatedBrgPrice, currency)
              : "—"}
          </p>
        </div>
      </div>

      {reason && (
        <p className="mt-wt-4 font-body text-wt-body-sm text-wt-text-secondary">{reason}</p>
      )}
      {collectedAt && (
        <p className="mt-wt-2 text-wt-caption text-wt-text-secondary">수집 시각: {collectedAt}</p>
      )}
    </div>
  );
}
