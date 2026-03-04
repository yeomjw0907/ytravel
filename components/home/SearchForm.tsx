"use client";

import { Button, Select } from "@/components/ui";
import { DateRangeField } from "./DateRangeField";
import { HotelAutocomplete } from "./HotelAutocomplete";

const ADULT_OPTIONS = Array.from({ length: 6 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}명` }));
const ROOM_OPTIONS = Array.from({ length: 3 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}개` }));

/**
 * 검색 폼: GET /search 로 전달. name/value는 SearchQuery·API와 호환.
 * 체크인/체크아웃은 DateRangeField로 범위 선택 경험 제공.
 */
export function SearchForm() {
  return (
    <form
      action="/search"
      method="get"
      className="hero-search-form flex w-full flex-col gap-wt-5 sm:gap-wt-6 md:flex-row md:flex-wrap md:items-end md:gap-wt-6"
    >
      <input type="hidden" name="currency" value="KRW" />
      <input type="hidden" name="locale" value="ko-KR" />
      <input type="hidden" name="children" value="0" />
      <input type="hidden" name="destination" value="" />

      <div className="min-w-0 flex-1 md:min-w-[220px] md:max-w-[300px]">
        <HotelAutocomplete
          name="hotelName"
          label="호텔명"
          placeholder="예: 그랜드 하얏트 서울"
          required
        />
      </div>
      <div className="min-w-0 flex-1 md:min-w-[220px] md:max-w-[280px]">
        <DateRangeField checkInName="checkIn" checkOutName="checkOut" />
      </div>
      <div className="min-w-0 flex-1 md:min-w-[100px] md:max-w-[130px]">
        <Select label="투숙 인원" name="adults" options={ADULT_OPTIONS} defaultValue="2" />
      </div>
      <div className="min-w-0 flex-1 md:min-w-[100px] md:max-w-[130px]">
        <Select label="객실 수" name="rooms" options={ROOM_OPTIONS} defaultValue="1" />
      </div>
      <div className="flex items-end pt-wt-1 md:min-w-[130px] md:pt-0">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="h-12 w-full min-w-[120px] px-wt-6 text-base font-semibold md:w-auto"
        >
          검색하기
        </Button>
      </div>
    </form>
  );
}
