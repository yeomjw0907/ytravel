import Link from "next/link";
import type { SearchQuery } from "@/lib/types/schema";
import { formatDateRange } from "@/lib/search/format";
import { Button } from "@/components/ui";

interface SearchSummaryBarProps {
  query: SearchQuery;
  hotelName?: string;
}

/**
 * 현재 검색 조건 표시 + 다시 검색 (12-component-spec §11, 15-page-wireframes §4)
 */
export function SearchSummaryBar({ query, hotelName }: SearchSummaryBarProps) {
  const displayName = hotelName ?? query.hotelName;
  const dateRange = formatDateRange(query.checkIn, query.checkOut);

  return (
    <div className="flex flex-col gap-wt-3 border-b border-wt-border bg-wt-panel px-wt-5 py-wt-6 md:flex-row md:items-center md:justify-between md:px-wt-8 md:py-wt-6">
      <div className="font-body text-wt-body-sm text-wt-text-primary md:text-wt-body-md">
        <span className="font-medium">{displayName}</span>
        <span className="mx-wt-2 text-wt-text-secondary">|</span>
        <span className="text-wt-text-secondary">{dateRange}</span>
        <span className="mx-wt-2 text-wt-text-secondary">|</span>
        <span className="text-wt-text-secondary">성인 {query.adults}명, 객실 {query.rooms}개</span>
      </div>
      <Link href="/" className="shrink-0">
        <Button type="button" variant="secondary" size="sm">
          다시 검색
        </Button>
      </Link>
    </div>
  );
}
