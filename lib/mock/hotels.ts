import type { Hotel } from "@/lib/types/schema";

/**
 * 호텔 단일 소스 (09-data-schema).
 * 검색·상세·유효 slug 판단은 모두 이 목록 기준. 실제 연동 시 DB/API로 교체.
 */
export const MOCK_HOTELS: Hotel[] = [
  {
    id: "hotel_gh_seoul",
    slug: "grand-hyatt-seoul",
    name: "그랜드 하얏트 서울",
    brand: "Hyatt",
    city: "서울",
    country: "KR",
    officialSiteUrl: "https://www.hyatt.com/ko-KR/hotel/korea/grand-hyatt-seoul/selhr",
    stars: 5,
    thumbnailUrl: null,
  },
  {
    id: "hotel_pp_westminster",
    slug: "park-plaza-westminster-bridge-london",
    name: "Park Plaza Westminster Bridge London",
    nameDisplay: "파크 플라자 웨스트민스터 브릿지 런던",
    brand: "Park Plaza",
    city: "London",
    country: "GB",
    officialSiteUrl: "https://www.parkplaza.com/london-hotels/park-plaza-westminster-bridge-london",
    stars: 4,
    thumbnailUrl: null,
  },
  {
    id: "hotel_standard_highline",
    slug: "the-standard-high-line-nyc",
    name: "The Standard, High Line New York",
    nameDisplay: "스탠다드, 하이 라인 뉴욕",
    brand: "Standard",
    city: "New York",
    country: "US",
    officialSiteUrl: "https://www.standardhotels.com/hotels/new-york",
    stars: 4,
    thumbnailUrl: null,
  },
];

/** 등록된 호텔 전체 (검색 결과 링크·유효 slug 검증용) */
export function getHotels(): Hotel[] {
  return [...MOCK_HOTELS];
}

/** UI 표시용 호텔명. nameDisplay 있으면 "한글명 (영문명)", 없으면 name 그대로 */
export function getHotelDisplayName(hotel: Hotel): string {
  const d = hotel.nameDisplay?.trim();
  if (d && d !== hotel.name) return `${d} (${hotel.name})`;
  return hotel.name;
}

/** 등록된 호텔 slug 목록 (없는 호텔 페이지 진입 방지용) */
export function getAllHotelSlugs(): string[] {
  return MOCK_HOTELS.map((h) => h.slug);
}

export function getHotelBySlug(slug: string): Hotel | undefined {
  return MOCK_HOTELS.find((h) => h.slug === slug);
}

export function getHotelById(id: string): Hotel | undefined {
  return MOCK_HOTELS.find((h) => h.id === id);
}

/**
 * "한글명 (영문명)" 형태에서 영문명 추출. 없으면 원문 반환.
 */
function extractNameFromDisplay(display: string): string {
  const m = display.trim().match(/\(([^)]+)\)\s*$/);
  return m ? m[1].trim() : display;
}

/**
 * 호텔명/목적지로 검색 (mock: 단순 포함 검색). 국내·해외 공통.
 * "스탠다드, 하이 라인 뉴욕 (The Standard...)" 형태도 괄호 안 영문명으로 매칭.
 */
export function findHotelByQuery(hotelName: string, destination: string | null): Hotel | undefined {
  const raw = hotelName.trim();
  const nameToMatch = extractNameFromDisplay(raw);
  const lower = nameToMatch.toLowerCase();
  const dest = (destination ?? "").trim().toLowerCase();
  const candidates = MOCK_HOTELS.filter(
    (h) =>
      h.name.toLowerCase().includes(lower) ||
      (h.brand && h.brand.toLowerCase().includes(lower)) ||
      h.slug.replace(/-/g, " ").includes(lower) ||
      h.city.toLowerCase().includes(lower) ||
      (dest && (h.city.toLowerCase().includes(dest) || h.country.toLowerCase().includes(dest)))
  );
  if (candidates.length === 0) return undefined;
  if (dest && candidates.length > 1)
    return candidates.find((h) => h.city.toLowerCase().includes(dest) || h.country.toLowerCase().includes(dest)) ?? candidates[0];
  return candidates[0];
}
