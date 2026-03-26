import type {
  Hotel,
  Provider,
  ProviderLink,
  ProviderLinkKind,
} from "@/lib/types/schema";
import { isAmadeusConfigured, isAmadeusOffersEnabled } from "@/lib/api/amadeus";

export interface SearchLinkContext {
  hotelId?: string;
  hotelName: string;
  destination: string | null;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  childAges: number[];
  rooms: number;
  locale: string;
}

export interface ProviderOutboundLink {
  url: string;
  linkKind: ProviderLinkKind;
  hotelDetailUrl: string | null;
  note?: string | null;
}

type HotelProviderReference = {
  bookingPath?: string;
  expediaPath?: string;
  expediaDestination?: string;
  expediaRegionId?: string;
  hotelsComPath?: string;
  hotelsComDestination?: string;
  hotelsComRegionId?: string;
  hotelsComSelectedId?: string;
  travelocityPath?: string;
  travelocityDestination?: string;
  travelocityRegionId?: string;
  stayforlongPath?: string;
  tripCityEnName?: string;
  tripCityId?: string;
  tripHotelId?: string;
  travelokaHotelId?: string;
  travelokaHotelName?: string;
  webjetArea?: string;
  webjetAreaId?: string;
  webjetFeaturedHotel?: string;
  webjetHotel?: string;
  webjetHotelId?: string;
  interparkHotelCode?: string;
  almosaferPath?: string;
  smshoteldealsPropertyId?: string;
  smshoteldealsDestinationCode?: string;
  smshoteldealsSearchTerm?: string;
  smshoteldealsStars?: [number, number];
  hotelsugogoPropertyId?: string;
  hotelsugogoDestinationCode?: string;
  hotelsugogoSearchTerm?: string;
  hotelsugogoStars?: [number, number];
};

const REFERENCE_PROVIDERS: Provider[] = [
  {
    id: "booking",
    name: "Booking.com",
    type: "ota",
    capability: "reference",
    baseUrl: "https://www.booking.com/",
    logoUrl: null,
    status: "active",
  },
  {
    id: "expedia",
    name: "Expedia",
    type: "ota",
    capability: "reference",
    baseUrl: "https://www.expedia.com/",
    logoUrl: null,
    status: "active",
  },
  {
    id: "hotels-com",
    name: "Hotels.com",
    type: "ota",
    capability: "reference",
    baseUrl: "https://www.hotels.com/",
    logoUrl: null,
    status: "active",
  },
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
    id: "travelocity",
    name: "Travelocity",
    type: "ota",
    capability: "reference",
    baseUrl: "https://www.travelocity.com/",
    logoUrl: null,
    status: "active",
  },
  {
    id: "stayforlong",
    name: "Stayforlong",
    type: "ota",
    capability: "reference",
    baseUrl: "https://www.stayforlong.com/",
    logoUrl: null,
    status: "active",
  },
  {
    id: "webjet",
    name: "Webjet",
    type: "ota",
    capability: "reference",
    baseUrl: "https://www.webjet.com.au/",
    logoUrl: null,
    status: "beta",
  },
  {
    id: "interpark",
    name: "Interpark",
    type: "ota",
    capability: "reference",
    baseUrl: "https://travel.interpark.com/",
    logoUrl: null,
    status: "beta",
  },
  {
    id: "almosafer",
    name: "Almosafer",
    type: "ota",
    capability: "reference",
    baseUrl: "https://global.almosafer.com/",
    logoUrl: null,
    status: "beta",
  },
  {
    id: "smshoteldeals",
    name: "SMSHotelDeals",
    type: "ota",
    capability: "reference",
    baseUrl: "https://smshoteldeals.com/",
    logoUrl: null,
    status: "beta",
  },
  {
    id: "hotelsugogo",
    name: "HotelsuGoGo",
    type: "ota",
    capability: "reference",
    baseUrl: "https://hotelsugogo.com/",
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

const LINK_ONLY_PROVIDERS: Provider[] = [
  {
    id: "kayak",
    name: "KAYAK",
    type: "ota",
    capability: "link_only",
    baseUrl: "https://www.kayak.com/hotels",
    logoUrl: null,
    status: "active",
  },
  {
    id: "momondo",
    name: "momondo",
    type: "ota",
    capability: "link_only",
    baseUrl: "https://www.momondo.com/hotels/",
    logoUrl: null,
    status: "active",
  },
  {
    id: "wego",
    name: "Wego",
    type: "ota",
    capability: "link_only",
    baseUrl: "https://www.wego.com/hotels",
    logoUrl: null,
    status: "active",
  },
  {
    id: "trivago",
    name: "trivago",
    type: "ota",
    capability: "link_only",
    baseUrl: "https://www.trivago.com/",
    logoUrl: null,
    status: "active",
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

const HOTEL_PROVIDER_REFERENCES: Record<string, HotelProviderReference> = {
  hotel_phuket_marriott_merlin_beach: {
    bookingPath: "/hotel/th/phuket-marriott-resort-and-spa-merlin-beach.html",
    expediaPath: "Phuket-Hotels-Phuket-Marriott-Resort-Spa.h1594141.Hotel-Information",
    expediaDestination: "Patong, Phuket Province, Thailand",
    expediaRegionId: "6337833",
    hotelsComPath:
      "ho350330/pukes-melieoteu-lijoteu-seupa-meollin-bichi-patong-taegug/",
    hotelsComDestination: "Patong, Phuket Province, Thailand",
    hotelsComRegionId: "6337833",
    hotelsComSelectedId: "1594141",
    travelocityPath:
      "Phuket-Hotels-Phuket-Marriott-Resort-Spa.h1594141.Hotel-Information",
    travelocityDestination: "Phuket, Phuket Province, Thailand",
    travelocityRegionId: "6046393",
    stayforlongPath:
      "/hotel/th/phuket-marriott-resort-spa-merlin-beach_patong",
    tripCityEnName: "Phuket",
    tripCityId: "725",
    tripHotelId: "703198",
    travelokaHotelId: "1000000350330",
    travelokaHotelName: "Phuket Marriott Resort & Spa, Merlin Beach",
    webjetArea: "Patong, Phuket Province, Thailand",
    webjetAreaId: "306337833",
    webjetFeaturedHotel:
      "401594141-306337833-Patong, Phuket Province, Thailand",
    webjetHotel: "Phuket Marriott Resort & Spa, Merlin Beach, Patong, TH",
    webjetHotelId: "401594141",
    interparkHotelCode: "1000038160",
    almosaferPath:
      "atg/phuket-marriott-resort-spa-merlin-beach-1052164",
    smshoteldealsPropertyId: "11741",
    smshoteldealsDestinationCode: "dXJuOm1ieHBsYzpUUWpk",
    smshoteldealsSearchTerm: "phuket",
    smshoteldealsStars: [5, 5],
    hotelsugogoPropertyId: "11741",
    hotelsugogoDestinationCode: "dXJuOm1ieHBsYzpUUWpk",
    hotelsugogoSearchTerm: "phuket marr",
    hotelsugogoStars: [5, 5],
  },
};

const STATIC_HOTEL_DETAIL_URLS: Record<string, Partial<Record<string, string>>> = {
  hotel_gh_seoul: {
    "trip-com":
      "https://www.trip.com/hotels/seoul-hotel-detail-988623/grand-hyatt-seoul/",
    traveloka:
      "https://www.traveloka.com/en-en/hotel/south-korea/grand-hyatt-seoul-1000000106097",
  },
  hotel_pp_westminster: {
    "trip-com":
      "https://www.trip.com/hotels/london-hotel-detail-730950/park-plaza-westminster-bridge-london/",
    traveloka:
      "https://www.traveloka.com/en-en/hotel/england/park-plaza-london-westminster-bridge-1000000335698",
  },
  hotel_standard_highline: {
    "trip-com":
      "https://www.trip.com/hotels/new-york-hotel-detail-2193519/the-standard-high-line-new-york/",
    traveloka:
      "https://www.traveloka.com/en-en/hotel/united-states-of-america/the-standard-high-line-4000001018317",
  },
};

function getHotelProviderReference(hotelId: string): HotelProviderReference | null {
  return HOTEL_PROVIDER_REFERENCES[hotelId] ?? null;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function formatDateDdMmYyyy(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${pad2(date.getDate())}-${pad2(date.getMonth() + 1)}-${date.getFullYear()}`;
}

function formatDateCompact(iso: string): string {
  return iso.replaceAll("-", "");
}

function formatDateDots(iso: string): string {
  return iso.replaceAll("-", ".");
}

function getStayLength(ctx: SearchLinkContext): number {
  const start = new Date(ctx.checkIn);
  const end = new Date(ctx.checkOut);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000));
}

function buildKeyword(ctx: SearchLinkContext): string {
  const hotelName = ctx.hotelName.trim();
  const destination = (ctx.destination ?? "").trim();

  if (!hotelName) return destination;
  if (!destination) return hotelName;
  if (hotelName.toLowerCase().includes(destination.toLowerCase())) return hotelName;

  return `${hotelName} ${destination}`;
}

function getChildAges(ctx: SearchLinkContext): number[] {
  return ctx.childAges.filter((age) => Number.isInteger(age) && age >= 0);
}

function hasRequiredChildAges(ctx: SearchLinkContext): boolean {
  return ctx.children === 0 || getChildAges(ctx).length === ctx.children;
}

function getChildAgeCsv(ctx: SearchLinkContext): string {
  return getChildAges(ctx).join(",");
}

function getChildAgeDash(ctx: SearchLinkContext): string {
  return getChildAges(ctx).join("-");
}

function buildBookingRoomOccupancy(ctx: SearchLinkContext): string {
  const adults = Array.from({ length: ctx.adults }, () => "A");
  const children = getChildAges(ctx).map((age) => String(age));
  return [...adults, ...children].join(",");
}

function buildExpediaRoomSpec(ctx: SearchLinkContext): string | null {
  if (!hasRequiredChildAges(ctx)) return null;

  const parts = [`a${ctx.adults}`];
  for (const age of getChildAges(ctx)) {
    parts.push(`c${age}`);
  }

  return parts.join(":");
}

function getLinkNote(linkKind: ProviderLinkKind, ctx: SearchLinkContext): string {
  const base =
    linkKind === "hotel_detail"
      ? "호텔 상세 랜딩"
      : linkKind === "condition_search"
        ? "검색 결과 랜딩"
        : "공급처 홈";

  if (ctx.children > 0 && !hasRequiredChildAges(ctx)) {
    return `${base} · 아동 나이는 이동 후 다시 입력할 수 있습니다.`;
  }

  return base;
}

function buildProviderConditionSearchUrl(
  providerId: string,
  ctx: SearchLinkContext
): string | null {
  const keyword = buildKeyword(ctx);

  switch (providerId) {
    case "booking": {
      const params = new URLSearchParams({
        ss: keyword,
        checkin: ctx.checkIn,
        checkout: ctx.checkOut,
        group_adults: String(ctx.adults),
        no_rooms: String(ctx.rooms),
      });

      if (ctx.children > 0) {
        params.set("group_children", String(ctx.children));
        for (const age of getChildAges(ctx)) {
          params.append("age", String(age));
        }
      }

      return `https://www.booking.com/searchresults.html?${params.toString()}`;
    }
    case "trip-com": {
      const params = new URLSearchParams({
        keyword,
        checkIn: ctx.checkIn,
        checkOut: ctx.checkOut,
        adult: String(ctx.adults),
        children: String(ctx.children),
        crn: String(ctx.rooms),
      });
      if (getChildAges(ctx).length > 0) {
        params.set("ages", getChildAgeCsv(ctx));
      }
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
        checkin: ctx.checkIn,
        checkout: ctx.checkOut,
        adults: String(ctx.adults),
        rooms: String(ctx.rooms),
      });
      if (keyword) params.set("search", keyword);
      return `https://www.trivago.com/?${params.toString()}`;
    }
    default:
      return null;
  }
}

function buildProviderDetailUrl(
  providerId: string,
  hotel: Hotel,
  ctx: SearchLinkContext
): string | null {
  const ref = getHotelProviderReference(hotel.id);
  if (!ref) return null;

  switch (providerId) {
    case "booking": {
      if (!ref.bookingPath) return null;
      const params = new URLSearchParams({
        checkin: ctx.checkIn,
        checkout: ctx.checkOut,
        no_rooms: String(ctx.rooms),
        group_adults: String(ctx.adults),
      });

      if (ctx.children > 0) {
        params.set("group_children", String(ctx.children));
        for (const age of getChildAges(ctx)) {
          params.append("age", String(age));
        }
        if (hasRequiredChildAges(ctx)) {
          params.set("room1", buildBookingRoomOccupancy(ctx));
        }
      }

      return `https://www.booking.com${ref.bookingPath}?${params.toString()}`;
    }

    case "expedia": {
      const roomSpec = buildExpediaRoomSpec(ctx);
      if (!ref.expediaPath || !ref.expediaDestination || !ref.expediaRegionId) {
        return null;
      }
      if (ctx.children > 0 && !roomSpec) return null;

      const params = new URLSearchParams({
        chkin: ctx.checkIn,
        chkout: ctx.checkOut,
        regionId: ref.expediaRegionId,
        destination: ref.expediaDestination,
        destType: "MARKET",
        rm1: roomSpec ?? `a${ctx.adults}`,
      });

      return `https://www.expedia.com/${ref.expediaPath}?${params.toString()}`;
    }

    case "hotels-com": {
      const roomSpec = buildExpediaRoomSpec(ctx);
      if (
        !ref.hotelsComPath ||
        !ref.hotelsComDestination ||
        !ref.hotelsComRegionId ||
        !ref.hotelsComSelectedId
      ) {
        return null;
      }
      if (ctx.children > 0 && !roomSpec) return null;

      const params = new URLSearchParams({
        chkin: ctx.checkIn,
        chkout: ctx.checkOut,
        regionId: ref.hotelsComRegionId,
        destination: ref.hotelsComDestination,
        selected: ref.hotelsComSelectedId,
        rm1: roomSpec ?? `a${ctx.adults}`,
      });

      return `https://www.hotels.com/${ref.hotelsComPath}?${params.toString()}`;
    }

    case "travelocity": {
      const roomSpec = buildExpediaRoomSpec(ctx);
      if (
        !ref.travelocityPath ||
        !ref.travelocityDestination ||
        !ref.travelocityRegionId
      ) {
        return null;
      }
      if (ctx.children > 0 && !roomSpec) return null;

      const params = new URLSearchParams({
        chkin: ctx.checkIn,
        chkout: ctx.checkOut,
        regionId: ref.travelocityRegionId,
        destination: ref.travelocityDestination,
        destType: "MARKET",
        rm1: roomSpec ?? `a${ctx.adults}`,
      });

      return `https://www.travelocity.com/${ref.travelocityPath}?${params.toString()}`;
    }

    case "stayforlong": {
      if (!ref.stayforlongPath) return null;
      if (ctx.children > 0 && !hasRequiredChildAges(ctx)) return null;

      const params = new URLSearchParams({
        adults: String(ctx.adults),
        checkIn: ctx.checkIn,
        checkOut: ctx.checkOut,
        lang: "en",
        market: "us",
        page: "1",
      });

      if (ctx.children > 0) {
        params.set("children", getChildAgeCsv(ctx));
      }

      return `https://www.stayforlong.com${ref.stayforlongPath}?${params.toString()}`;
    }

    case "trip-com": {
      if (!ref.tripCityEnName || !ref.tripCityId || !ref.tripHotelId) return null;

      const params = new URLSearchParams({
        cityEnName: ref.tripCityEnName,
        cityId: ref.tripCityId,
        hotelId: ref.tripHotelId,
        checkIn: ctx.checkIn,
        checkOut: ctx.checkOut,
        adult: String(ctx.adults),
        children: String(ctx.children),
        crn: String(ctx.rooms),
      });

      if (getChildAges(ctx).length > 0) {
        params.set("ages", getChildAgeCsv(ctx));
      }

      return `https://us.trip.com/hotels/detail/?${params.toString()}`;
    }

    case "traveloka": {
      if (!ref.travelokaHotelId || !ref.travelokaHotelName) return null;
      if (ctx.children > 0 && !hasRequiredChildAges(ctx)) return null;

      const spec = [
        formatDateDdMmYyyy(ctx.checkIn),
        formatDateDdMmYyyy(ctx.checkOut),
        String(ctx.adults),
        String(ctx.rooms),
        "HOTEL",
        ref.travelokaHotelId,
        ref.travelokaHotelName,
        String(ctx.children),
      ].join(".");

      const params = new URLSearchParams({ spec });
      if (ctx.children > 0) {
        params.set("childSpec", getChildAgeCsv(ctx));
      }

      return `https://www.traveloka.com/en-th/hotel/detail?${params.toString()}`;
    }

    case "webjet": {
      if (
        !ref.webjetArea ||
        !ref.webjetAreaId ||
        !ref.webjetFeaturedHotel ||
        !ref.webjetHotel ||
        !ref.webjetHotelId
      ) {
        return null;
      }

      const params = new URLSearchParams({
        area: ref.webjetArea,
        areaId: ref.webjetAreaId,
        checkInDate: formatDateCompact(ctx.checkIn),
        checkOutDate: formatDateCompact(ctx.checkOut),
        featuredHotel: ref.webjetFeaturedHotel,
        hotel: ref.webjetHotel,
        hotelid: ref.webjetHotelId,
        numberOfBedroomsFilter: "0",
        paxRequest: `A${ctx.adults}C${ctx.children}`,
        isExpandedProperty: "false",
      });

      if (getChildAges(ctx).length > 0) {
        params.set("childAge", getChildAgeCsv(ctx));
      }

      return `https://services.webjet.com.au/web/hotels/search/#/hotel?${params.toString()}`;
    }

    case "interpark": {
      if (!ref.interparkHotelCode) return null;
      if (ctx.children > 0 && !hasRequiredChildAges(ctx)) return null;

      const params = new URLSearchParams({
        hotelCD: ref.interparkHotelCode,
        iDT: formatDateDots(ctx.checkIn),
        oDT: formatDateDots(ctx.checkOut),
      });

      if (ctx.children > 0) {
        params.set("sRinfo", `${ctx.adults}-${getChildAges(ctx).join("_")}`);
      } else {
        params.set("sRinfo", String(ctx.adults));
      }

      return `https://travel.interpark.com/hotel/goods?${params.toString()}`;
    }

    case "almosafer": {
      if (!ref.almosaferPath) return null;
      if (ctx.children > 0 && !hasRequiredChildAges(ctx)) return null;

      const roomParts = [`${ctx.adults}_adult`];
      if (ctx.children > 0) {
        roomParts.push(`${ctx.children}_child`);
        roomParts.push(`${getChildAgeDash(ctx)}_age`);
      }

      const params = new URLSearchParams({
        checkin: formatDateDdMmYyyy(ctx.checkIn),
        checkout: formatDateDdMmYyyy(ctx.checkOut),
        rooms: roomParts.join(","),
        lang: "en",
      });

      return `https://global.almosafer.com/en/hotel/details/${ref.almosaferPath}?${params.toString()}`;
    }

    case "smshoteldeals": {
      if (!ref.smshoteldealsPropertyId || !ref.smshoteldealsDestinationCode) {
        return null;
      }

      const occupancies = JSON.stringify([
        {
          Adults: ctx.adults,
          Children: ctx.children,
          ChildrenAges: getChildAges(ctx),
        },
      ]);

      const params = new URLSearchParams({
        startDate: formatDateDdMmYyyy(ctx.checkIn),
        endDate: formatDateDdMmYyyy(ctx.checkOut),
        occupancies,
        destinationCode: ref.smshoteldealsDestinationCode,
        searchTerm: ref.smshoteldealsSearchTerm ?? buildKeyword(ctx),
      });

      if (ref.smshoteldealsStars) {
        params.set("stars", JSON.stringify(ref.smshoteldealsStars));
      }

      return `https://smshoteldeals.com/property/${ref.smshoteldealsPropertyId}?${params.toString()}`;
    }

    case "hotelsugogo": {
      if (!ref.hotelsugogoPropertyId || !ref.hotelsugogoDestinationCode) {
        return null;
      }

      const occupancies = JSON.stringify([
        {
          Adults: ctx.adults,
          Children: ctx.children,
          ChildrenAges: getChildAges(ctx),
        },
      ]);

      const params = new URLSearchParams({
        startDate: formatDateDdMmYyyy(ctx.checkIn),
        endDate: formatDateDdMmYyyy(ctx.checkOut),
        occupancies,
        destinationCode: ref.hotelsugogoDestinationCode,
        searchTerm: ref.hotelsugogoSearchTerm ?? buildKeyword(ctx),
      });

      if (ref.hotelsugogoStars) {
        params.set("stars", JSON.stringify(ref.hotelsugogoStars));
      }

      return `https://hotelsugogo.com/property/${ref.hotelsugogoPropertyId}?${params.toString()}`;
    }

    default:
      return null;
  }
}

export function getProviderHotelDetailUrl(
  hotelId: string,
  providerId: string
): string | null {
  return STATIC_HOTEL_DETAIL_URLS[hotelId]?.[providerId] ?? null;
}

export function buildProviderSearchUrl(
  providerId: string,
  ctx: SearchLinkContext
): string {
  return buildProviderConditionSearchUrl(providerId, ctx) ?? getProviderById(providerId)?.baseUrl ?? "#";
}

export function buildProviderOutboundLink(
  providerId: string,
  hotel: Hotel,
  ctx: SearchLinkContext
): ProviderOutboundLink {
  const detailUrl = buildProviderDetailUrl(providerId, hotel, ctx);
  if (detailUrl) {
    return {
      url: detailUrl,
      linkKind: "hotel_detail",
      hotelDetailUrl: detailUrl,
      note: getLinkNote("hotel_detail", ctx),
    };
  }

  const searchUrl = buildProviderConditionSearchUrl(providerId, ctx);
  if (searchUrl) {
    return {
      url: searchUrl,
      linkKind: "condition_search",
      hotelDetailUrl: getProviderHotelDetailUrl(hotel.id, providerId),
      note: getLinkNote("condition_search", ctx),
    };
  }

  const staticDetailUrl = getProviderHotelDetailUrl(hotel.id, providerId);
  if (staticDetailUrl) {
    return {
      url: staticDetailUrl,
      linkKind: "hotel_detail",
      hotelDetailUrl: staticDetailUrl,
      note: "호텔 상세 랜딩",
    };
  }

  return {
    url: getProviderById(providerId)?.baseUrl ?? "#",
    linkKind: "provider_home",
    hotelDetailUrl: null,
    note: null,
  };
}

export function getAutomatedProviders(): Provider[] {
  return isAmadeusConfigured() && isAmadeusOffersEnabled() ? [AUTOMATED_PROVIDER] : [];
}

export function getReferenceProviders(): Provider[] {
  return [...REFERENCE_PROVIDERS];
}

export function getProviders(): Provider[] {
  return [...getAutomatedProviders(), ...REFERENCE_PROVIDERS, ...LINK_ONLY_PROVIDERS];
}

export function getProviderById(id: string): Provider | undefined {
  return [...REFERENCE_PROVIDERS, ...LINK_ONLY_PROVIDERS, AUTOMATED_PROVIDER].find(
    (provider) => provider.id === id
  );
}

export function getFallbackLinks(
  hotel: Hotel | null,
  context?: SearchLinkContext | null
): ProviderLink[] {
  if (!hotel || !context) return [];

  const providerIds = [
    ...REFERENCE_PROVIDERS.map((provider) => provider.id),
    ...LINK_ONLY_PROVIDERS.map((provider) => provider.id),
  ];

  const links: ProviderLink[] = [];

  for (const providerId of providerIds) {
    const provider = getProviderById(providerId);
    if (!provider) continue;

    const outbound = buildProviderOutboundLink(providerId, hotel, context);
    if (outbound.linkKind === "provider_home" || outbound.url === "#") continue;

    links.push({
      providerId,
      name: provider.name,
      url: outbound.url,
      linkKind: outbound.linkKind,
      note: outbound.note ?? null,
    });
  }

  return links;
}
