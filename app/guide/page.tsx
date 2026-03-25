import Link from "next/link";
import { Container } from "@/components/layout/Container";

const GUIDE_STEPS = [
  "호텔명, 날짜, 객실 수, 예약가를 입력합니다.",
  "지원 공급처 기준으로 더 저렴한 후보와 조건 차이를 확인합니다.",
  "참고 후보가 보이면 외부 사이트에서 객실 조건과 총액을 다시 확인합니다.",
  "BRG를 검토한다면 마지막으로 호텔 브랜드 정책을 직접 확인합니다.",
];

export default function GuidePage() {
  return (
    <Container size="md" className="py-wt-12 md:py-wt-16">
      <div className="rounded-wt-xl border border-wt-border bg-wt-panel p-wt-8 shadow-wt-card md:p-wt-10">
        <p className="text-wt-caption font-semibold uppercase tracking-wider text-wt-brand-500">
          Guide
        </p>
        <h1 className="mt-wt-3 font-display text-wt-h1 text-wt-text-primary">
          Ytravel 이용 안내
        </h1>
        <p className="mt-wt-4 text-wt-body-md leading-relaxed text-wt-text-secondary">
          Ytravel은 예약가를 기준으로 더 저렴한 후보를 빠르게 탐색하도록 돕는 정보
          서비스입니다. 예약 대행이나 가격 보장 서비스가 아니며, 검색 결과는 지원 사이트
          기준의 참고 정보입니다.
        </p>

        <section className="mt-wt-8">
          <h2 className="font-display text-wt-h3 text-wt-text-primary">사용 순서</h2>
          <ol className="mt-wt-4 list-inside list-decimal space-y-wt-2 text-wt-body-sm leading-relaxed text-wt-text-primary">
            {GUIDE_STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="mt-wt-8">
          <h2 className="font-display text-wt-h3 text-wt-text-primary">지원 범위</h2>
          <p className="mt-wt-3 text-wt-body-sm leading-relaxed text-wt-text-secondary">
            현재는 제한된 공급처 기준으로 자동 비교 또는 참고 후보를 제공합니다. 자동
            비교가 어려운 경우에는 같은 조건으로 다시 확인할 수 있는 링크를 함께
            보여드립니다. 공급처 구조 변경이나 정책에 따라 일부 결과는 일시적으로
            제공되지 않을 수 있습니다.
          </p>
        </section>

        <section className="mt-wt-8">
          <h2 className="font-display text-wt-h3 text-wt-text-primary">
            BRG는 어떻게 보나요?
          </h2>
          <p className="mt-wt-3 text-wt-body-sm leading-relaxed text-wt-text-secondary">
            Ytravel은 BRG 적용 여부를 확정하지 않습니다. 객실, 취소 규정, 조식, 세금,
            결제 조건이 얼마나 비슷한지 먼저 보여주고, 실제 BRG 가능성 판단은 호텔
            브랜드 정책을 직접 확인하도록 안내합니다.
          </p>
        </section>

        <div className="mt-wt-8 flex flex-wrap gap-wt-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-wt-md bg-wt-brand-700 px-wt-5 text-wt-body-sm font-medium text-white hover:bg-wt-brand-500 focus-wt"
          >
            검색 시작
          </Link>
          <Link
            href="/disclaimer"
            className="inline-flex h-11 items-center justify-center rounded-wt-md border-2 border-wt-brand-700 px-wt-5 text-wt-body-sm font-medium text-wt-brand-700 hover:bg-wt-info-bg focus-wt"
          >
            면책 및 운영 기준
          </Link>
        </div>
      </div>
    </Container>
  );
}
