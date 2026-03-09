import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui";

const STEPS = [
  { step: 1, title: "공식 홈페이지 요금 확인", description: "호텔 공식 사이트의 해당 일정·객실 요금을 확인합니다." },
  { step: 2, title: "OTA 최저가 비교", description: "Trip.com, Agoda, Booking.com 등 주요 예약 플랫폼 요금을 비교합니다." },
  { step: 3, title: "동일 조건 여부 검토", description: "객실 타입, 취소 정책, 조식·세금 포함 여부가 같은지 확인합니다." },
];

/**
 * BRG는 이렇게 확인합니다 (15-page-wireframes §3)
 */
export function BrgExplainSection() {
  return (
    <section className="bg-wt-bg pt-wt-16 pb-wt-14 md:pt-wt-24 md:pb-wt-20">
      <Container size="lg">
        <h2 className="font-display text-wt-h2 text-wt-text-primary md:text-wt-h1">
          BRG는 이렇게 확인합니다
        </h2>
        <p className="mt-wt-3 max-w-2xl font-body text-wt-body-md leading-relaxed text-wt-text-secondary">
          Best Rate Guarantee(BRG) 탐색을 위해 공식가와 OTA를 같은 기준으로 비교합니다.
        </p>
        <div className="mt-wt-10 grid gap-wt-5 sm:gap-wt-6 md:grid-cols-3">
          {STEPS.map(({ step, title, description }) => (
            <Card key={step} padding="lg" hover className="flex flex-col transition-shadow duration-200">
              <span className="text-wt-caption font-semibold uppercase tracking-wider text-wt-brand-500">0{step}</span>
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
