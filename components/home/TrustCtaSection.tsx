import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { BrgLink } from "@/components/layout/BrgLink";

const linkButtonBase =
  "inline-flex h-11 min-w-[88px] items-center justify-center rounded-wt-md px-wt-4 text-wt-body-sm font-medium transition-colors focus-wt";

export function TrustCtaSection() {
  return (
    <section className="border-t border-wt-border bg-wt-surface pb-wt-14 pt-wt-16 md:pb-wt-18 md:pt-wt-24">
      <Container size="lg">
        <p className="max-w-2xl font-body text-wt-body-sm leading-relaxed text-wt-text-secondary">
          표시된 가격은 수집 시점 기준이며 실제 예약 화면과 다를 수 있습니다. 최종 예약
          전에는 외부 사이트에서 객실 조건과 총액을 다시 확인해 주세요. BRG 적용 여부는
          호텔 브랜드 정책에 따라 달라질 수 있습니다.
        </p>
        <div className="mt-wt-6 flex flex-wrap gap-wt-3 sm:gap-wt-4">
          <Link
            href="/search"
            className={`${linkButtonBase} bg-wt-brand-700 text-white hover:bg-wt-brand-500`}
          >
            검색 시작
          </Link>
          <Link
            href="/disclaimer"
            className={`${linkButtonBase} border-2 border-wt-brand-700 text-wt-brand-700 hover:bg-wt-info-bg`}
          >
            운영 기준 보기
          </Link>
          <BrgLink
            className={`${linkButtonBase} border-2 border-wt-border text-wt-text-primary hover:bg-wt-surface`}
          >
            BRG 가이드
          </BrgLink>
        </div>
      </Container>
    </section>
  );
}
