import type { SearchQuery } from "@/lib/types/schema";
import {
  CONDITION_LABELS_KO,
  formatDateRange,
  formatPrice,
} from "@/lib/search/format";
import { ConditionBadge } from "@/components/ui";

interface MyBookingSummaryProps {
  query: SearchQuery;
  hotelName?: string;
  hotelLocation?: string;
}

function formatGuestLine(query: SearchQuery): string {
  const parts = [`성인 ${query.adults}명`];

  if (query.children > 0) {
    const ageText =
      query.childAges.length > 0 ? ` (${query.childAges.join(", ")}세)` : "";
    parts.push(`아동 ${query.children}명${ageText}`);
  }

  parts.push(`객실 ${query.rooms}개`);
  return parts.join(" · ");
}

export function MyBookingSummary({
  query,
  hotelName,
  hotelLocation,
}: MyBookingSummaryProps) {
  const displayName = hotelName ?? query.hotelName;
  const dateRange = formatDateRange(query.checkIn, query.checkOut);

  return (
    <section className="rounded-wt-xl border border-wt-border bg-wt-panel p-wt-6 shadow-wt-card md:p-wt-8">
      <h2 className="font-display text-wt-h3 text-wt-text-primary">
        내 예약 정보
      </h2>
      <div className="mt-wt-5 grid grid-cols-1 gap-wt-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-wt-caption font-medium text-wt-text-secondary">호텔</p>
          <p className="mt-wt-1 font-body text-wt-body-md font-medium text-wt-text-primary">
            {displayName}
          </p>
          {hotelLocation && (
            <p className="mt-wt-0.5 text-wt-caption text-wt-text-secondary">
              {hotelLocation}
            </p>
          )}
        </div>
        <div>
          <p className="text-wt-caption font-medium text-wt-text-secondary">
            객실 · 일정
          </p>
          <p className="mt-wt-1 font-body text-wt-body-md text-wt-text-primary">
            {query.roomName.trim() || "객실명 미입력"}
          </p>
          <p className="mt-wt-0.5 text-wt-caption text-wt-text-secondary">
            {dateRange}
          </p>
        </div>
        <div>
          <p className="text-wt-caption font-medium text-wt-text-secondary">
            인원 · 객실 수
          </p>
          <p className="mt-wt-1 font-body text-wt-body-md text-wt-text-primary">
            {formatGuestLine(query)}
          </p>
        </div>
        <div>
          <p className="text-wt-caption font-medium text-wt-text-secondary">예약가</p>
          <p className="mt-wt-1 font-body text-wt-body-lg font-semibold tabular-nums text-wt-text-primary">
            {formatPrice(query.userBookedPrice, query.currency)}
          </p>
        </div>
      </div>
      <div className="mt-wt-4 flex flex-wrap gap-wt-2">
        {query.roomName.trim() && (
          <ConditionBadge variant="neutral">{query.roomName.trim()}</ConditionBadge>
        )}
        <ConditionBadge variant="neutral">
          {CONDITION_LABELS_KO.boardType[query.bookedBoardType]}
        </ConditionBadge>
        <ConditionBadge variant="neutral">
          {CONDITION_LABELS_KO.cancellationType[query.bookedCancellationType]}
        </ConditionBadge>
        {query.bookedTaxIncluded === true && (
          <ConditionBadge variant="neutral">세금 포함</ConditionBadge>
        )}
        {query.bookedTaxIncluded === false && (
          <ConditionBadge variant="neutral">세금 별도</ConditionBadge>
        )}
        <ConditionBadge variant="neutral">
          {CONDITION_LABELS_KO.paymentType[query.bookedPaymentType]}
        </ConditionBadge>
      </div>
    </section>
  );
}
