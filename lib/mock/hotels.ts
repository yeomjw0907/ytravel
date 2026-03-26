import type { Hotel } from "@/lib/types/schema";

export const MOCK_HOTELS: Hotel[] = [
  {
    id: "hotel_phuket_marriott_merlin_beach",
    slug: "phuket-marriott-resort-spa-merlin-beach",
    name: "Phuket Marriott Resort & Spa, Merlin Beach",
    nameDisplay: "Phuket Marriott Resort & Spa, Merlin Beach",
    brand: "Marriott",
    city: "Phuket",
    country: "TH",
    officialSiteUrl:
      "https://www.marriott.com/en-us/hotels/hktmb-phuket-marriott-resort-and-spa-merlin-beach/overview/",
    stars: 5,
    thumbnailUrl: null,
  },
  {
    id: "hotel_gh_seoul",
    slug: "grand-hyatt-seoul",
    name: "Grand Hyatt Seoul",
    nameDisplay: "그랜드 하얏트 서울",
    brand: "Hyatt",
    city: "서울",
    country: "KR",
    officialSiteUrl:
      "https://www.hyatt.com/ko-KR/hotel/korea/grand-hyatt-seoul/selhr",
    stars: 5,
    thumbnailUrl: null,
  },
  {
    id: "hotel_pp_westminster",
    slug: "park-plaza-westminster-bridge-london",
    name: "Park Plaza Westminster Bridge London",
    nameDisplay: "파크 플라자 웨스트민스터 브리지 런던",
    brand: "Park Plaza",
    city: "London",
    country: "GB",
    officialSiteUrl:
      "https://www.parkplaza.com/london-hotels/park-plaza-westminster-bridge-london",
    stars: 4,
    thumbnailUrl: null,
  },
  {
    id: "hotel_standard_highline",
    slug: "the-standard-high-line-nyc",
    name: "The Standard, High Line New York",
    nameDisplay: "더 스탠다드 하이 라인 뉴욕",
    brand: "Standard",
    city: "New York",
    country: "US",
    officialSiteUrl: "https://www.standardhotels.com/hotels/new-york",
    stars: 4,
    thumbnailUrl: null,
  },
];

export function getHotels(): Hotel[] {
  return [...MOCK_HOTELS];
}

export function getHotelDisplayName(hotel: Hotel): string {
  const display = hotel.nameDisplay?.trim();
  if (display && display !== hotel.name) return `${display} (${hotel.name})`;
  return hotel.name;
}

export function getAllHotelSlugs(): string[] {
  return MOCK_HOTELS.map((hotel) => hotel.slug);
}

export function getHotelBySlug(slug: string): Hotel | undefined {
  return MOCK_HOTELS.find((hotel) => hotel.slug === slug);
}

export function getHotelById(id: string): Hotel | undefined {
  return MOCK_HOTELS.find((hotel) => hotel.id === id);
}

function extractNameFromDisplay(display: string): string {
  const match = display.trim().match(/\(([^)]+)\)\s*$/);
  return match ? match[1].trim() : display;
}

export function findHotelByQuery(
  hotelName: string,
  destination: string | null
): Hotel | undefined {
  const raw = hotelName.trim();
  const nameToMatch = extractNameFromDisplay(raw);
  const lower = nameToMatch.toLowerCase();
  const dest = (destination ?? "").trim().toLowerCase();

  const candidates = MOCK_HOTELS.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(lower) ||
      hotel.nameDisplay?.toLowerCase().includes(lower) ||
      hotel.slug.replace(/-/g, " ").includes(lower) ||
      hotel.city.toLowerCase().includes(lower) ||
      (hotel.brand && hotel.brand.toLowerCase().includes(lower)) ||
      (dest &&
        (hotel.city.toLowerCase().includes(dest) ||
          hotel.country.toLowerCase().includes(dest)))
  );

  if (candidates.length === 0) return undefined;

  if (dest && candidates.length > 1) {
    return (
      candidates.find(
        (hotel) =>
          hotel.city.toLowerCase().includes(dest) ||
          hotel.country.toLowerCase().includes(dest)
      ) ?? candidates[0]
    );
  }

  return candidates[0];
}
