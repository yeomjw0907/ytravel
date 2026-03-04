import type { BrgEvaluation } from "@/lib/types/schema";
import { ConditionBadge } from "@/components/ui";

const FIELD_LABELS: Record<string, string> = {
  roomName: "객실명",
  boardType: "조식",
  cancellationType: "취소 정책",
  paymentType: "결제 방식",
  taxIncluded: "세금 포함",
};

interface ConditionSummaryProps {
  evaluation: BrgEvaluation;
}

/**
 * 조건 비교 요약: 일치/불일치 필드를 사용자 친화 라벨로 (15-page-wireframes §4)
 */
export function ConditionSummary({ evaluation }: ConditionSummaryProps) {
  const matched = evaluation.matchedFields.map(
    (f) => FIELD_LABELS[f] ?? f
  );
  const mismatched = evaluation.mismatchedFields.map(
    (f) => FIELD_LABELS[f] ?? f
  );

  if (matched.length === 0 && mismatched.length === 0) return null;

  return (
    <div className="rounded-wt-lg border border-wt-border bg-wt-panel p-wt-5 md:p-wt-6">
      <h3 className="font-display text-wt-h3 text-wt-text-primary">조건 비교 요약</h3>
      <div className="mt-wt-3 flex flex-wrap gap-wt-2">
        {matched.map((label) => (
          <ConditionBadge key={label} variant="success">
            {label} 일치
          </ConditionBadge>
        ))}
        {mismatched.map((label) => (
          <ConditionBadge key={label} variant="warning">
            {label} 확인
          </ConditionBadge>
        ))}
      </div>
    </div>
  );
}
