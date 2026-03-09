import Link from "next/link";
import { Container } from "./Container";
import { BrgLink } from "./BrgLink";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-wt-border bg-wt-surface">
      <Container size="lg" className="py-wt-10 md:py-wt-12">
        <div className="flex flex-col gap-wt-6 md:flex-row md:items-start md:justify-between md:gap-wt-10">
          <nav className="flex flex-wrap gap-x-wt-5 gap-y-wt-1" aria-label="하단 메뉴">
            <BrgLink className="wt-transition-base rounded-wt-sm py-wt-1 text-wt-body-sm text-wt-text-secondary hover:text-wt-text-primary focus-wt">
              BRG란?
            </BrgLink>
            <Link href="/guide" className="wt-transition-base rounded-wt-sm py-wt-1 text-wt-body-sm text-wt-text-secondary hover:text-wt-text-primary focus-wt">
              이용안내
            </Link>
            <Link href="/disclaimer" className="wt-transition-base rounded-wt-sm py-wt-1 text-wt-body-sm text-wt-text-secondary hover:text-wt-text-primary focus-wt">
              면책사항
            </Link>
            <Link href="/contact" className="wt-transition-base rounded-wt-sm py-wt-1 text-wt-body-sm text-wt-text-secondary hover:text-wt-text-primary focus-wt">
              문의
            </Link>
          </nav>
          <p className="max-w-sm text-wt-body-sm leading-relaxed text-wt-text-secondary md:max-w-md">
            Ytravel은 숙박 요금 비교 및 BRG 탐색을 돕는 정보 서비스입니다.
          </p>
        </div>
      </Container>
    </footer>
  );
}
