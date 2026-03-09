import type { Hotel } from "@/lib/types/schema";
import { getHotelDisplayName } from "@/lib/mock/hotels";

interface HotelHeaderProps {
  hotel: Hotel;
}

/**
 * 호텔 상세 상단 헤더 (12-component-spec §10, 15-page-wireframes §6)
 */
export function HotelHeader({ hotel }: HotelHeaderProps) {
  return (
    <header className="border-b border-wt-border bg-wt-panel px-4 py-wt-5 sm:px-5 md:px-6 md:py-wt-6 lg:px-8">
      <h1 className="font-display text-wt-h2 text-wt-text-primary md:text-wt-h1">
        {getHotelDisplayName(hotel)}
      </h1>
      <p className="mt-wt-1.5 font-body text-wt-body-md text-wt-text-secondary">
        {hotel.city}
        {hotel.country && `, ${hotel.country}`}
        {hotel.brand && ` · ${hotel.brand}`}
      </p>
      {hotel.officialSiteUrl && (
        <a
          href={hotel.officialSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-wt-3 inline-flex items-center font-body text-wt-body-sm font-medium text-wt-brand-500 hover:underline focus-wt"
        >
          공식 사이트 보기
        </a>
      )}
    </header>
  );
}
