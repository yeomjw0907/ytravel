import type { Provider, ProviderLink } from "@/lib/types/schema";
import { isAmadeusConfigured, isAmadeusOffersEnabled } from "@/lib/api/amadeus";

export interface SearchLinkContext {
  hotelName: string;
  destination: string | null;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  locale: string;
}

const REFERENCE_PROVIDERS: Provider[] = [
  {
    id: "trip-com",
    name: "Trip.com",
    type: "ota",
    capability: "reference",
    baseUrl: "https://www.trip.com/hotels/",
    logoUrl: null,
    status: "active",
  },
  {
    id: "traveloka",
    name: "Traveloka",
    type: "ota",
    capability: "reference",
    baseUrl: "https://www.traveloka.com/en-en/hotel",
    logoUrl: null,
    status: "beta",
  },
  {
    id: "vio",
    name: "Vio.com",
    type: "ota",
    capability: "reference",
    baseUrl: "https://www.vio.com/",
    logoUrl: null,
    status: "beta",
  },
];

const AUTOMATED_PROVIDER: Provider = {
  id: "amadeus",
  name: "Amadeus Live",
  type: "ota",
  capability: "automated",
  baseUrl: "https://developers.amadeus.com/",
  logoUrl: null,
  status: "beta",
};

const FALLBACK_LINKS: Omit<ProviderLink, "url">[] = [
  {
    providerId: "trip-com",
    name: "Trip.com",
    note: "같은 검색 조건으로 다시 확인",
  },
  {
    providerId: "kayak",
    name: "KAYAK",
    note: "같은 검색 조건으로 다시 확인",
  },
  {
    providerId: "momondo",
    name: "momondo",
    note: "같은 검색 조건으로 다시 확인",
  },
  {
    providerId: "wego",
    name: "Wego",
    note: "같은 검색 조건으로 다시 확인",
  },
  {
    providerId: "trivago",
    name: "trivago",
    note: "같은 검색 조건으로 다시 확인",
  },
];

function buildKeyword(ctx: SearchLinkContext): string {
  const hotelName = ctx.hotelName.trim();
  const destination = (ctx.destination ?? "").trim();

  if (!hotelName) return destination;
  if (!destination) return hotelName;
  if (hotelName.toLowerCase().includes(destination.toLowerCase())) return hotelName;

  return `${hotelName} ${destination}`;
}

export function buildProviderSearchUrl(
  providerId: string,
  ctx: SearchLinkContext
): string {
  const keyword = buildKeyword(ctx);

  switch (providerId) {
    case "trip-com": {
      const params = new URLSearchParams({
        keyword,
        checkIn: ctx.checkIn,
        checkOut: ctx.checkOut,
        adult: String(ctx.adults),
        children: String(ctx.children),
        crn: String(ctx.rooms),
      });
      return `https://www.trip.com/hotels/list?${params.toString()}`;
    }
    case "kayak": {
      const params = new URLSearchParams({
        checkin: ctx.checkIn,
        checkout: ctx.checkOut,
        adults: String(ctx.adults),
        rooms: String(ctx.rooms),
      });
      if (keyword) params.set("destination", keyword);
      return `https://www.kayak.com/hotels?${params.toString()}`;
    }
    case "momondo": {
      const params = new URLSearchParams({
        checkin: ctx.checkIn,
        checkout: ctx.checkOut,
        adults: String(ctx.adults),
        rooms: String(ctx.rooms),
      });
      if (keyword) params.set("destination", keyword);
      return `https://www.momondo.com/hotels/?${params.toString()}`;
    }
    case "wego": {
      const params = new URLSearchParams({
        check_in: ctx.checkIn,
        check_out: ctx.checkOut,
        adults: String(ctx.adults),
        rooms: String(ctx.rooms),
      });
      if (keyword) params.set("query", keyword);
      return `https://www.wego.com/hotels?${params.toString()}`;
    }
    case "trivago": {
      const params = new URLSearchParams({
        themeId: "1",
        checkin: ctx.checkIn,
        checkout: ctx.checkOut,
        adults: String(ctx.adults),
        rooms: String(ctx.rooms),
      });
      if (keyword) params.set("search", keyword);
      return `https://www.trivago.com/?${params.toString()}`;
    }
    default:
      return getProviderById(providerId)?.baseUrl ?? "#";
  }
}

export function getAutomatedProviders(): Provider[] {
  return isAmadeusConfigured() && isAmadeusOffersEnabled() ? [AUTOMATED_PROVIDER] : [];
}

export function getReferenceProviders(): Provider[] {
  return [...REFERENCE_PROVIDERS];
}

export function getProviders(): Provider[] {
  return [...getAutomatedProviders(), ...getReferenceProviders()];
}

export function getProviderById(id: string): Provider | undefined {
  return [...REFERENCE_PROVIDERS, AUTOMATED_PROVIDER].find(
    (provider) => provider.id === id
  );
}

export function getFallbackLinks(context?: SearchLinkContext | null): ProviderLink[] {
  return FALLBACK_LINKS.map((link) => ({
    ...link,
    url: context ? buildProviderSearchUrl(link.providerId, context) : "#",
  }));
}
