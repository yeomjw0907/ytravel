import { Container } from "@/components/layout/Container";
import { ConditionBadge } from "@/components/ui";

const ITEMS = [
  { label: "객실 타입", variant: "info" as const },
  { label: "취소 정책", variant: "info" as const },
  { label: "조식 포함", variant: "info" as const },
  { label: "세금 포함", variant: "info" as const },
  { label: "결제 방식", variant: "info" as const },
];

/**
 * Ytravel이 함께 보는 항목 (15-page-wireframes §3)
 */
export function DifferentiatorSection() {
  return (
    <section className="bg-wt-surface py-wt-16 md:py-wt-20">
      <Container size="lg">
        <h2 className="font-display text-wt-h2 text-wt-text-primary md:text-wt-h1">
          Ytravel이 함께 보는 항목
        </h2>
        <p className="mt-wt-4 max-w-2xl font-body text-wt-body-md text-wt-text-secondary">
          가격만이 아니라 객실 조건과 취소 정책까지 같은 기준으로 비교합니다.
        </p>
        <div className="mt-wt-8 flex flex-wrap gap-wt-3">
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
