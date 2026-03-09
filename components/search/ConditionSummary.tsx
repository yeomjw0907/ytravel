import type { BrgEvaluation } from "@/lib/types/schema";
import { ConditionBadge } from "@/components/ui";

const FIELD_LABELS: Record<string, string> = {
  roomName: "객실명",
  boardType: "조식",
  cancellationType: "취소",
  paymentType: "결제",
  taxIncluded: "세금",
  occupancy: "인원",
};

interface ConditionSummaryProps {
  evaluation: BrgEvaluation;
}

export function ConditionSummary({ evaluation }: ConditionSummaryProps) {
  const matched = evaluation.matchedFields.map((field) => FIELD_LABELS[field] ?? field);
  const mismatched = evaluation.mismatchedFields.map(
    (field) => FIELD_LABELS[field] ?? field
  );

  if (matched.length === 0 && mismatched.length === 0) return null;

  return (
    <div className="rounded-wt-lg border border-wt-border bg-wt-panel p-wt-5 md:p-wt-6">
      <h3 className="font-display text-wt-h3 text-wt-text-primary">
        조건 매칭 (내 예약 대비)
      </h3>
      <div className="mt-wt-3 flex flex-wrap gap-wt-2">
        {matched.map((label) => (
          <ConditionBadge key={`matched-${label}`} variant="success">
            {label} 일치
          </ConditionBadge>
        ))}
        {mismatched.map((label) => (
          <ConditionBadge key={`mismatch-${label}`} variant="warning">
            {label} 검토
          </ConditionBadge>
        ))}
      </div>
    </div>
  );
}
