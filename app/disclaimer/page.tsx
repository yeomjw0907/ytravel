import { Container } from "@/components/layout/Container";

export default function DisclaimerPage() {
  return (
    <Container size="md" className="py-wt-12 md:py-wt-16">
      <div className="rounded-wt-xl border border-wt-border bg-wt-panel p-wt-8 shadow-wt-card md:p-wt-10">
        <p className="text-wt-caption font-semibold uppercase tracking-wider text-wt-brand-500">
          Disclaimer
        </p>
        <h1 className="mt-wt-3 font-display text-wt-h1 text-wt-text-primary">
          면책 및 운영 기준
        </h1>

        <section className="mt-wt-8 space-y-wt-6 text-wt-body-sm leading-relaxed text-wt-text-secondary">
          <div>
            <h2 className="font-display text-wt-h3 text-wt-text-primary">
              서비스 성격
            </h2>
            <p className="mt-wt-3">
              Ytravel은 숙박 요금을 비교해 보여주는 정보 서비스이며 실제 예약
              계약의 당사자가 아닙니다. 예약, 결제, 환불, BRG 승인 여부는 각 호텔
              브랜드와 외부 사이트 정책을 따릅니다.
            </p>
          </div>

          <div>
            <h2 className="font-display text-wt-h3 text-wt-text-primary">
              가격 정보
            </h2>
            <p className="mt-wt-3">
              표시 가격은 수집 시점 기준이며 이후 변경될 수 있습니다. 세금,
              수수료, 회원가, 앱 전용가, 지역가, 프로모션 적용 여부에 따라 실제
              결제 금액과 차이가 날 수 있습니다.
            </p>
          </div>

          <div>
            <h2 className="font-display text-wt-h3 text-wt-text-primary">
              BRG 관련 안내
            </h2>
            <p className="mt-wt-3">
              Ytravel은 BRG 승인 여부나 할인 결과를 보장하지 않습니다. BRG
              가능성, 예상 차액, 조건 일치 수준은 정보 제공을 위한 참고값이며 실제
              적용 여부는 호텔 브랜드 정책과 제출 시점 조건에 따라 달라집니다.
            </p>
          </div>

          <div>
            <h2 className="font-display text-wt-h3 text-wt-text-primary">
              운영 원칙
            </h2>
            <p className="mt-wt-3">
              Ytravel은 실시간성보다 정확성을 우선합니다. 일부 공급처는 일시적으로
              수집에 실패할 수 있으며, 비교 불확실성이 높을 때는 자동으로 보수적인
              상태로 안내합니다.
            </p>
          </div>
        </section>
      </div>
    </Container>
  );
}
