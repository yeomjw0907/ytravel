import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui";

const STEPS = [
  {
    step: 1,
    title: "예약 정보를 입력합니다",
    description:
      "호텔명, 날짜, 객실, 예약가를 입력하면 비교 기준이 되는 예약 정보를 정리합니다.",
  },
  {
    step: 2,
    title: "지원 사이트를 확인합니다",
    description:
      "지원 공급처에서 자동으로 후보 요금을 확인하고, 자동 비교가 어려운 경우에는 수동 확인 링크를 함께 제공합니다.",
  },
  {
    step: 3,
    title: "조건 차이를 같이 봅니다",
    description:
      "객실명, 취소 정책, 조식, 세금 포함 여부 같은 핵심 조건을 함께 비교해 과장된 최저가처럼 보이지 않게 안내합니다.",
  },
];

export function BrgExplainSection() {
  return (
    <section className="bg-wt-bg pt-wt-16 pb-wt-14 md:pt-wt-24 md:pb-wt-20">
      <Container size="lg">
        <h2 className="font-display text-wt-h2 text-wt-text-primary md:text-wt-h1">
          어떻게 비교하나요
        </h2>
        <p className="mt-wt-3 max-w-2xl font-body text-wt-body-md leading-relaxed text-wt-text-secondary">
          Ytravel은 예약가 자체보다 조건이 얼마나 비슷한지 먼저 확인합니다.
          같은 기준으로 보지 못하면 더 싸 보이는 후보도 보수적으로 해석합니다.
        </p>
        <div className="mt-wt-10 grid gap-wt-5 sm:gap-wt-6 md:grid-cols-3">
          {STEPS.map(({ step, title, description }) => (
            <Card
              key={step}
              padding="lg"
              hover
              className="flex flex-col transition-shadow duration-200"
            >
              <span className="text-wt-caption font-semibold uppercase tracking-wider text-wt-brand-500">
                0{step}
              </span>
              <h3 className="mt-wt-3 font-body text-wt-body-lg font-semibold text-wt-text-primary">
                {title}
              </h3>
              <p className="mt-wt-3 flex-1 font-body text-wt-body-sm leading-relaxed text-wt-text-secondary">
                {description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
