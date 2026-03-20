import { NextRequest, NextResponse } from "next/server";
import { amadeusHotelAutocomplete, isAmadeusConfigured } from "@/lib/api/amadeus";
import { getHotelDisplayName, getHotels } from "@/lib/mock/hotels";

export interface HotelAutocompleteItem {
  id: string;
  slug: string;
  name: string;
  displayName?: string;
  city: string;
  country?: string;
}

/**
 * GET /api/hotels/autocomplete?q=xxx
 * Amadeus가 설정되어 있으면 우선 사용하고, 실패하면 로컬 목록으로 fallback 합니다.
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 1) {
    return NextResponse.json({ suggestions: [] });
  }

  const lower = q.toLowerCase();

  try {
    if (isAmadeusConfigured()) {
      const suggestions = await amadeusHotelAutocomplete(q);
      return NextResponse.json({ suggestions });
    }
  } catch {
    // Ignore and fall back to the local catalog.
  }

  const suggestions: HotelAutocompleteItem[] = getHotels()
    .filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(lower) ||
        hotel.nameDisplay?.toLowerCase().includes(lower) ||
        hotel.slug.replace(/-/g, " ").includes(lower) ||
        hotel.city.toLowerCase().includes(lower)
    )
    .slice(0, 20)
    .map((hotel) => ({
      id: hotel.id,
      slug: hotel.slug,
      name: hotel.name,
      displayName: getHotelDisplayName(hotel),
      city: hotel.city,
      country: hotel.country ?? undefined,
    }));

  return NextResponse.json({ suggestions });
}
