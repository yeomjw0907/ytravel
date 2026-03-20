import { Container } from "@/components/layout/Container";
import { ConditionBadge } from "@/components/ui";

const ITEMS = [
  { label: "객실명", variant: "info" as const },
  { label: "취소 정책", variant: "info" as const },
  { label: "조식 포함", variant: "info" as const },
  { label: "세금 포함", variant: "info" as const },
  { label: "결제 방식", variant: "info" as const },
];

export function DifferentiatorSection() {
  return (
    <section className="bg-wt-surface pt-wt-16 pb-wt-14 md:pt-wt-24 md:pb-wt-20">
      <Container size="lg">
        <h2 className="font-display text-wt-h2 text-wt-text-primary md:text-wt-h1">
          가격만 보지 않습니다
        </h2>
        <p className="mt-wt-3 max-w-2xl font-body text-wt-body-md leading-relaxed text-wt-text-secondary">
          예약가를 다시 점검할 때는 숫자보다 조건 차이가 더 중요합니다. Ytravel은
          핵심 조건을 같이 보여줘서 실제로 비교 가능한 후보만 빠르게 가려냅니다.
        </p>
        <div className="mt-wt-6 flex flex-wrap gap-wt-2 sm:gap-wt-3">
          {ITEMS.map(({ label, variant }) => (
            <ConditionBadge key={label} variant={variant}>
              {label}
            </ConditionBadge>
          ))}
        </div>
      </Container>
    </section>
  );
}
