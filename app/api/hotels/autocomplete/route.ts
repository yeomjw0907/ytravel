import { NextRequest, NextResponse } from "next/server";
import { getHotels, getHotelDisplayName } from "@/lib/mock/hotels";
import { amadeusHotelAutocomplete, isAmadeusConfigured } from "@/lib/api/amadeus";

export interface HotelAutocompleteItem {
  id: string;
  slug: string;
  name: string;
  /** UI 표시용. 한글명 (영문명) 형태 등 */
  displayName?: string;
  city: string;
  country?: string;
}

/**
 * GET /api/hotels/autocomplete?q=xxx - 호텔명 자동완성.
 * AMADEUS_CLIENT_ID/SECRET 있으면 Amadeus API 사용, 없으면 내부 목록 검색.
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
  } catch (_) {
    // Amadeus 실패 시 내부 목록으로 fallback
  }

  const hotels = getHotels();
  const suggestions: HotelAutocompleteItem[] = hotels.filter(
    (h) =>
      h.name.toLowerCase().includes(lower) ||
      h.slug.replace(/-/g, " ").includes(lower) ||
      h.city.toLowerCase().includes(lower)
  ).slice(0, 20).map((h) => ({
    id: h.id,
    slug: h.slug,
    name: h.name,
    displayName: getHotelDisplayName(h),
    city: h.city,
    country: h.country ?? undefined,
  }));

  return NextResponse.json({ suggestions });
}
