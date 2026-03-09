import type { Provider, ProviderLink } from "@/lib/types/schema";

/** 호텔·일정·인원이 채워진 fallback 링크를 만들 때 쓰는 검색 컨텍스트 */
export interface FallbackLinkContext {
  /** 검색지 (도시명 또는 호텔명) */
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  rooms: number;
}

/** providerId별로 호텔/일정/인원이 반영된 검색 URL 생성. 사이트별 파라미터는 추후 조정 가능. */
function buildFallbackUrl(
  providerId: string,
  ctx: FallbackLinkContext
): string {
  const enc = encodeURIComponent;
  const { destination, checkIn, checkOut, adults, rooms } = ctx;
  const q = destination.trim();
  switch (providerId) {
    case "kayak": {
      const params = new URLSearchParams({
        checkin: checkIn,
        checkout: checkOut,
        adults: String(adults),
        rooms: String(rooms),
      });
      if (q) params.set("destination", q);
      return `https://www.kayak.com/hotels?${params.toString()}`;
    }
    case "momondo": {
      const params = new URLSearchParams({
        checkin: checkIn,
        checkout: checkOut,
        adults: String(adults),
        rooms: String(rooms),
      });
      if (q) params.set("destination", q);
      return `https://www.momondo.com/hotels/?${params.toString()}`;
    }
    case "wego": {
      const params = new URLSearchParams({
        check_in: checkIn,
        check_out: checkOut,
        adults: String(adults),
        rooms: String(rooms),
      });
      if (q) params.set("query", q);
      return `https://www.wego.com/hotels?${params.toString()}`;
    }
    case "trivago": {
      const params = new URLSearchParams({
        themeId: "1",
        checkin: checkIn,
        checkout: checkOut,
        adults: String(adults),
        rooms: String(rooms),
      });
      if (q) params.set("search", q);
      return `https://www.trivago.com/?${params.toString()}`;
    }
    default:
      return FALLBACK_LINKS.find((l) => l.providerId === providerId)?.url ?? "#";
  }
}

/** Automated providers: compared against user's booked price. Trip.com, Traveloka, Vio.com. */
const AUTOMATED_PROVIDERS: Provider[] = [
  {
    id: "trip-com",
    name: "Trip.com",
    type: "ota",
    capability: "automated",
    baseUrl: "https://www.trip.com/hotels/",
    logoUrl: null,
    status: "active",
  },
  {
    id: "traveloka",
    name: "Traveloka",
    type: "ota",
    capability: "automated",
    baseUrl: "https://www.traveloka.com/en-en/hotel",
    logoUrl: null,
    status: "active",
  },
  {
    id: "vio",
    name: "Vio.com",
    type: "ota",
    capability: "automated",
    baseUrl: "https://www.vio.com/",
    logoUrl: null,
    status: "beta",
  },
];

/** IDs of automated providers (for fetch statuses and mock offers). */
export const AUTOMATED_PROVIDER_IDS = AUTOMATED_PROVIDERS.map((p) => p.id);

/**
 * Link-only fallback providers: no automated comparison; user can open for manual check.
 * KAYAK, momondo, Wego, trivago.
 */
const FALLBACK_LINKS: ProviderLink[] = [
  {
    providerId: "kayak",
    name: "KAYAK",
    url: "https://www.kayak.com/hotels",
    note: "Metasearch fallback",
  },
  {
    providerId: "momondo",
    name: "momondo",
    url: "https://www.momondo.com/hotels",
    note: "Metasearch fallback",
  },
  {
    providerId: "wego",
    name: "Wego",
    url: "https://www.wego.com/hotels",
    note: "Metasearch fallback",
  },
  {
    providerId: "trivago",
    name: "trivago",
    url: "https://www.trivago.com/",
    note: "Metasearch fallback",
  },
];

export function getProviders(): Provider[] {
  return [...AUTOMATED_PROVIDERS];
}

export function getProviderById(id: string): Provider | undefined {
  return AUTOMATED_PROVIDERS.find((p) => p.id === id);
}

/**
 * Returns link-only providers for manual verification.
 * 현재 메타검색 사이트들은 URL 쿼리로 검색 조건을 받지 않거나 내부 location ID를 써서,
 * 조건을 채운 URL을 만들 수 없음. 기본 호텔 검색 페이지만 열고, 사용자가 같은 조건을 입력하도록 안내.
 */
export function getFallbackLinks(_context?: FallbackLinkContext | null): ProviderLink[] {
  return FALLBACK_LINKS.map((l) => ({ ...l }));
}
