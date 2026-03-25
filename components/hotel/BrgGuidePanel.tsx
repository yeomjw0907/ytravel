import { Card } from "@/components/ui";

const STEPS = [
  "같은 객실명과 같은 일정인지 먼저 확인합니다.",
  "취소 규정, 조식 포함 여부, 세금 포함 여부를 다시 봅니다.",
  "외부 사이트에서 실제 총액과 예약 조건을 다시 확인합니다.",
  "리조트피, 서비스 수수료, 통화 차이를 확인합니다.",
  "호텔 브랜드의 BRG 정책을 마지막으로 직접 확인합니다.",
];

export function BrgGuidePanel() {
  return (
    <Card padding="md" className="border-wt-info-bg bg-wt-info-bg/30">
      <h3 className="font-display text-wt-h3 text-wt-text-primary">
        BRG 확인 체크리스트
      </h3>
      <p className="mt-wt-2 text-wt-body-sm leading-relaxed text-wt-text-secondary">
        BRG 가능성은 참고 정보일 뿐이며 실제 확인 여부는 호텔 브랜드 정책과 제출 시점
        조건에 따라 달라집니다.
      </p>
      <ol className="mt-wt-4 list-inside list-decimal space-y-wt-2 font-body text-wt-body-sm leading-relaxed text-wt-text-primary">
        {STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </Card>
  );
}
