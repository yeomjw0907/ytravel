import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { BrgLink } from "@/components/layout/BrgLink";

const linkButtonBase =
  "inline-flex h-11 min-w-[88px] items-center justify-center rounded-wt-md px-wt-4 text-wt-body-sm font-medium transition-colors focus-wt";

/**
 * 하단 CTA·신뢰 안내 (15-page-wireframes, 11-operations-legal)
 * 면책 톤 유지.
 */
export function TrustCtaSection() {
  return (
    <section className="border-t border-wt-border bg-wt-surface pt-wt-16 pb-wt-14 md:pt-wt-24 md:pb-wt-18">
      <Container size="lg">
        <p className="max-w-2xl font-body text-wt-body-sm leading-relaxed text-wt-text-secondary">
          현재 수집 기준 결과이며, 실제 예약 전 외부 사이트에서 객실 조건과 총액을 다시 확인해 주세요.
          BRG 적용 여부는 호텔 브랜드 정책에 따라 달라질 수 있습니다.
        </p>
        <div className="mt-wt-6 flex flex-wrap gap-wt-3 sm:gap-wt-4">
          <Link
            href="/search"
            className={`${linkButtonBase} rounded-wt-md bg-wt-brand-700 text-white hover:bg-wt-brand-500 focus-wt`}
          >
            검색 시작
          </Link>
          <BrgLink
            className={`${linkButtonBase} rounded-wt-md border-2 border-wt-brand-700 text-wt-brand-700 hover:bg-wt-info-bg focus-wt`}
          >
            BRG란?
          </BrgLink>
        </div>
      </Container>
    </section>
  );
}
