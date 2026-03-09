import { Card } from "@/components/ui";

const STEPS = [
  "동일 객실·동일 날짜·동일 인원인지 확인",
  "취소 정책과 조식 포함 여부가 같은지 확인",
  "외부 사이트에서 실제 총액을 다시 확인",
  "세금·봉사료 포함 여부 확인",
  "해당 호텔 브랜드의 BRG 정책을 확인",
];

/**
 * BRG 진행 전 확인 패널 (12-component-spec §14, 15-page-wireframes §6)
 * 설명형·확정 금지 톤 유지
 */
export function BrgGuidePanel() {
  return (
    <Card padding="md" className="border-wt-info-bg bg-wt-info-bg/30">
      <h3 className="font-display text-wt-h3 text-wt-text-primary">
        BRG 진행 전 확인 항목
      </h3>
      <p className="mt-wt-2 text-wt-body-sm leading-relaxed text-wt-text-secondary">
        BRG 가능성은 참고 정보이며, 실제 승인 여부는 호텔 브랜드 정책에 따라 달라질 수 있습니다.
      </p>
      <ol className="mt-wt-4 list-inside list-decimal space-y-wt-2 font-body text-wt-body-sm leading-relaxed text-wt-text-primary">
        {STEPS.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </Card>
  );
}
