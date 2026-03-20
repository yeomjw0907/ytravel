import Link from "next/link";
import { Container } from "@/components/layout/Container";

interface EmptyStateProps {
  title: string;
  description: string;
  showSearchLink?: boolean;
}

export function EmptyState({
  title,
  description,
  showSearchLink = true,
}: EmptyStateProps) {
  return (
    <Container size="md" className="py-wt-16 md:py-wt-20">
      <div className="rounded-wt-xl border border-wt-border bg-wt-panel p-wt-8 text-center shadow-wt-card md:p-wt-10">
        <h2 className="font-display text-wt-h2 text-wt-text-primary">{title}</h2>
        <p className="mt-wt-4 font-body text-wt-body-md leading-relaxed text-wt-text-secondary">
          {description}
        </p>
        {showSearchLink && (
          <Link
            href="/"
            className="mt-wt-6 inline-flex h-11 items-center justify-center rounded-wt-md bg-wt-brand-700 px-wt-5 text-wt-body-sm font-medium text-white transition-colors hover:bg-wt-brand-500 focus-wt md:mt-wt-8"
          >
            다시 검색
          </Link>
        )}
      </div>
    </Container>
  );
}
