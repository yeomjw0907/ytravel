import Link from "next/link";
import { Container } from "./Container";
import { BrgLink } from "./BrgLink";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-wt-border bg-wt-panel/95 backdrop-blur-sm">
      <Container size="lg" className="flex h-16 items-center justify-between md:h-[4.5rem]">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-wt-brand-700 focus-wt rounded-wt-sm md:text-2xl"
          aria-label="Ytravel 홈"
        >
          Ytravel
        </Link>
        <nav className="flex items-center gap-wt-8" aria-label="주요 메뉴">
          <Link
            href="/"
            className="wt-transition-base text-wt-body-sm font-medium text-wt-text-secondary hover:text-wt-text-primary focus-wt rounded-wt-sm"
          >
            검색
          </Link>
          <BrgLink className="wt-transition-base text-wt-body-sm font-medium text-wt-text-secondary hover:text-wt-text-primary focus-wt rounded-wt-sm">
            BRG란?
          </BrgLink>
        </nav>
      </Container>
    </header>
  );
}
