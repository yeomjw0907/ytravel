import Link from "next/link";
import { Container } from "@/components/layout/Container";

interface EmptyStateProps {
  title: string;
  description: string;
  showSearchLink?: boolean;
}

/**
 * 검색 결과 없음 / 조건 오류 시 안내 (12-component-spec §12, 13-copywriting §6.4)
 */
export function EmptyState({ title, description, showSearchLink = true }: EmptyStateProps) {
  return (
    <Container size="md" className="py-wt-20">
      <div className="rounded-wt-xl border border-wt-border bg-wt-panel p-wt-10 text-center shadow-wt-card">
        <h2 className="font-display text-wt-h3 text-wt-text-primary">{title}</h2>
        <p className="mt-wt-4 font-body text-wt-body-md leading-relaxed text-wt-text-secondary">{description}</p>
        {showSearchLink && (
          <Link
            href="/"
            className="mt-wt-8 inline-flex h-11 items-center justify-center rounded-wt-md bg-wt-brand-700 px-wt-5 text-wt-body-sm font-medium text-white transition-colors duration-200 hover:bg-wt-brand-500 focus-wt"
          >
            다시 검색
          </Link>
        )}
      </div>
    </Container>
  );
}
