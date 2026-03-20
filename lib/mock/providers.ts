import type { Provider, ProviderLink } from "@/lib/types/schema";
import { isAmadeusOffersEnabled } from "@/lib/api/amadeus";

export interface FallbackLinkContext {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  rooms: number;
}

function buildFallbackUrl(providerId: string, ctx: FallbackLinkContext): string {
  const { destination, checkIn, checkOut, adults, rooms } = ctx;
  const query = destination.trim();

  switch (providerId) {
    case "kayak": {
      const params = new URLSearchParams({
        checkin: checkIn,
        checkout: checkOut,
        adults: String(adults),
        rooms: String(rooms),
      });
      if (query) params.set("destination", query);
      return `https://www.kayak.com/hotels?${params.toString()}`;
    }
    case "momondo": {
      const params = new URLSearchParams({
        checkin: checkIn,
        checkout: checkOut,
        adults: String(adults),
        rooms: String(rooms),
      });
      if (query) params.set("destination", query);
      return `https://www.momondo.com/hotels/?${params.toString()}`;
    }
    case "wego": {
      const params = new URLSearchParams({
        check_in: checkIn,
        check_out: checkOut,
        adults: String(adults),
        rooms: String(rooms),
      });
      if (query) params.set("query", query);
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
      if (query) params.set("search", query);
      return `https://www.trivago.com/?${params.toString()}`;
    }
    default:
      return FALLBACK_LINKS.find((link) => link.providerId === providerId)?.url ?? "#";
  }
}

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

const AMADEUS_PROVIDER: Provider = {
  id: "amadeus",
  name: "Amadeus Live",
  type: "ota",
  capability: "automated",
  baseUrl: "https://developers.amadeus.com/",
  logoUrl: null,
  status: "beta",
};

export const AUTOMATED_PROVIDER_IDS = AUTOMATED_PROVIDERS.map(
  (provider) => provider.id
);

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
  return isAmadeusOffersEnabled()
    ? [AMADEUS_PROVIDER]
    : [...AUTOMATED_PROVIDERS];
}

export function getProviderById(id: string): Provider | undefined {
  return [...AUTOMATED_PROVIDERS, AMADEUS_PROVIDER].find(
    (provider) => provider.id === id
  );
}

export function getFallbackLinks(
  context?: FallbackLinkContext | null
): ProviderLink[] {
  return FALLBACK_LINKS.map((link) => ({
    ...link,
    url: context ? buildFallbackUrl(link.providerId, context) : link.url,
  }));
}
