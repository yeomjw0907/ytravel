import Link from "next/link";
import { Container } from "./Container";
import { BrgLink } from "./BrgLink";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-wt-border bg-wt-panel/98 shadow-[0_1px_0_0_var(--wt-color-border)] backdrop-blur-md">
      <Container size="lg" className="flex h-14 items-center justify-between md:h-16">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-wt-brand-700 focus-wt rounded-wt-sm py-wt-1 md:text-xl"
          aria-label="Ytravel 홈"
        >
          Ytravel
        </Link>
        <nav className="flex items-center gap-wt-6 md:gap-wt-8" aria-label="주요 메뉴">
          <Link
            href="/"
            className="wt-transition-base rounded-wt-sm px-wt-2 py-wt-2 text-wt-body-sm font-medium text-wt-text-secondary hover:text-wt-text-primary focus-wt"
          >
            검색
          </Link>
          <BrgLink className="wt-transition-base rounded-wt-sm px-wt-2 py-wt-2 text-wt-body-sm font-medium text-wt-text-secondary hover:text-wt-text-primary focus-wt">
            BRG란?
          </BrgLink>
        </nav>
      </Container>
    </header>
  );
}
