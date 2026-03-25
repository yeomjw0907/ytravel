import Link from "next/link";
import { Container } from "./Container";
import { BrgLink } from "./BrgLink";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-wt-border bg-wt-surface">
      <Container size="lg" className="py-wt-10 md:py-wt-12">
        <div className="flex flex-col gap-wt-6 md:flex-row md:items-start md:justify-between md:gap-wt-10">
          <nav className="flex flex-wrap gap-x-wt-5 gap-y-wt-1" aria-label="하단 메뉴">
            <Link
              href="/guide"
              className="wt-transition-base rounded-wt-sm py-wt-1 text-wt-body-sm text-wt-text-secondary hover:text-wt-text-primary focus-wt"
            >
              이용 안내
            </Link>
            <Link
              href="/disclaimer"
              className="wt-transition-base rounded-wt-sm py-wt-1 text-wt-body-sm text-wt-text-secondary hover:text-wt-text-primary focus-wt"
            >
              면책 및 운영 기준
            </Link>
            <Link
              href="/contact"
              className="wt-transition-base rounded-wt-sm py-wt-1 text-wt-body-sm text-wt-text-secondary hover:text-wt-text-primary focus-wt"
            >
              문의
            </Link>
            <BrgLink className="wt-transition-base rounded-wt-sm py-wt-1 text-wt-body-sm text-wt-text-secondary hover:text-wt-text-primary focus-wt">
              BRG 가이드
            </BrgLink>
          </nav>
          <p className="max-w-md text-wt-body-sm leading-relaxed text-wt-text-secondary">
            Ytravel은 예약한 호텔 가격을 다시 점검하고, 지원 사이트 기준으로 더 저렴한
            후보를 탐색하도록 돕는 정보 서비스입니다. 표시된 가격은 수집 시점 기준이며
            실제 예약 화면과 다를 수 있습니다.
          </p>
        </div>
      </Container>
    </footer>
  );
}
