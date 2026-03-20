import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <Container size="md" className="py-wt-16 md:py-wt-20">
      <div className="rounded-wt-xl border border-wt-border bg-wt-panel p-wt-8 text-center shadow-wt-card md:p-wt-10">
        <h1 className="font-display text-wt-h1 text-wt-text-primary">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-wt-4 text-wt-body-md leading-relaxed text-wt-text-secondary">
          주소가 잘못되었거나 더 이상 제공되지 않는 페이지입니다. 홈으로 돌아가
          다시 검색해 주세요.
        </p>
        <Link
          href="/"
          className="mt-wt-6 inline-flex h-11 items-center justify-center rounded-wt-md bg-wt-brand-700 px-wt-5 text-wt-body-sm font-medium text-white hover:bg-wt-brand-500 focus-wt"
        >
          홈으로 이동
        </Link>
      </div>
    </Container>
  );
}
