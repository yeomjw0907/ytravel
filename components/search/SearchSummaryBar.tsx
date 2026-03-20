import Link from "next/link";
import type { SearchQuery } from "@/lib/types/schema";
import { formatDateRange, formatPrice } from "@/lib/search/format";
import { Button } from "@/components/ui";

interface SearchSummaryBarProps {
  query: SearchQuery;
  hotelName?: string;
}

export function SearchSummaryBar({ query, hotelName }: SearchSummaryBarProps) {
  const displayName = hotelName ?? query.hotelName;
  const dateRange = formatDateRange(query.checkIn, query.checkOut);

  return (
    <div className="flex flex-col gap-wt-3 border-b border-wt-border bg-wt-panel px-4 py-wt-5 shadow-[0_1px_0_0_var(--wt-color-border)] sm:px-5 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
      <div className="min-w-0 font-body text-wt-body-sm text-wt-text-primary md:text-wt-body-md">
        <span className="font-semibold text-wt-text-primary">{displayName}</span>
        <span className="mx-wt-2 text-wt-text-secondary">·</span>
        <span className="text-wt-text-secondary">{dateRange}</span>
        <span className="mx-wt-2 text-wt-text-secondary">·</span>
        <span className="text-wt-text-secondary">
          성인 {query.adults}명 · 객실 {query.rooms}실
        </span>
        <span className="mx-wt-2 text-wt-text-secondary">·</span>
        <span className="text-wt-text-secondary">
          예약가 {formatPrice(query.userBookedPrice, query.currency)}
        </span>
      </div>
      <Link href="/" className="shrink-0 self-start md:self-center">
        <Button type="button" variant="secondary" size="sm">
          검색 수정
        </Button>
      </Link>
    </div>
  );
}
