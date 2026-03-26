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
  rooms: number;
  locale: string;
}

export interface ProviderOutboundLink {
  url: string;
  linkKind: ProviderLinkKind;
  hotelDetailUrl: string | null;
}

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

const AUTOMATED_PROVIDER: Provider = {
  id: "amadeus",
  name: "Amadeus Live",
  type: "ota",
  capability: "automated",
  baseUrl: "https://developers.amadeus.com/",
  logoUrl: null,
  status: "beta",
};

const FALLBACK_LINKS: Omit<ProviderLink, "url" | "linkKind">[] = [
  {
    providerId: "trip-com",
    name: "Trip.com",
    note: "媛숈? ?명뀛紐낃낵 ?좎쭨 議곌굔?쇰줈 ?ㅼ떆 ?뺤씤",
  },
  {
    providerId: "kayak",
    name: "KAYAK",
    note: "媛숈? 寃??議곌굔?쇰줈 硫뷀??쒖튂 寃곌낵 ?뺤씤",
  },
  {
    providerId: "momondo",
    name: "momondo",
    note: "媛숈? 寃??議곌굔?쇰줈 硫뷀??쒖튂 寃곌낵 ?뺤씤",
  },
  {
    providerId: "wego",
    name: "Wego",
    note: "媛숈? 寃??議곌굔?쇰줈 硫뷀??쒖튂 寃곌낵 ?뺤씤",
  },
  {
    providerId: "trivago",
    name: "trivago",
    note: "媛숈? 寃??議곌굔?쇰줈 硫뷀??쒖튂 寃곌낵 ?뺤씤",
  },
];

type CuratedDeeplink = {
  providerId: string;
  name: string;
  url: string;
};

type CuratedDeeplinkSet = {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  links: CuratedDeeplink[];
};

const CURATED_DEEPLINK_SETS: CuratedDeeplinkSet[] = [
  {
    hotelId: "hotel_phuket_marriott_merlin_beach",
    checkIn: "2026-05-05",
    checkOut: "2026-05-07",
    adults: 2,
    children: 2,
    rooms: 1,
    links: [
      {
        providerId: "booking",
        name: "Booking.com",
        url: "https://www.booking.com/hotel/th/phuket-marriott-resort-and-spa-merlin-beach.html?aid=368687&checkin=2026-05-05&checkout=2026-05-07&no_rooms=1&group_adults=2&group_children=2&age=6&age=3&selected_currency=USD&show_room=4451138&lang=en-us&label=802145_S212bcb2cf41c5632cd72ac4be23c3f1c_1773395833746",
      },
      {
        providerId: "expedia",
        name: "Expedia",
        url: "https://www.expedia.co.th/Phuket-Hotels-Phuket-Marriott-Resort-Spa.h1594141.Hotel-Information?affcid=US.DIRECT.PHG.1100l37627.0&affdtl=PHG.1110l33pHIPv.htlg_en&afflid=1110l33pHIPv&button_referral_source=other&chid=dcad9beb-6375-43e8-8c60-ae9f68385671&chkin=2026-05-05&chkout=2026-05-07&clickref=1110l33pHIPv&currency=THB&htlg_en=&locale=th_TH&mpa=59400.00&mpb=11108.00&mpd=JPY&mpe=1773395634&mpm=24&mpq=32670.00&my_ad=AFF.US.DIRECT.PHG.1100l37627.0&rateplanid=222158066&ref_id=1110l33pHIPv&regionId=6337833&rm1=a2%3Ac6%3Ac3&siteid=17&tpid=28",
      },
      {
        providerId: "hotels-com",
        name: "Hotels.com",
        url: "https://kr.hotels.com/ho350330/pukes-melieoteu-lijoteu-seupa-meollin-bichi-patong-taegug/?chkin=2026-05-05&chkout=2026-05-07&x_pwa=1&rfrr=HSR&pwa_ts=1773399549432&referrerUrl=aHR0cHM6Ly9rci5ob3RlbHMuY29tL0hvdGVsLVNlYXJjaA%3D%3D&rffrid=aff.hcom.KR.038.000.1101l32628.kwrd%3D1110l33pPnH3&useRewards=false&rm1=a2%3Ac6%3Ac3&regionId=6337833&destination=%ED%8C%8C%ED%86%B5%2C+%ED%91%B8%EC%BC%93+%EC%A3%BC%2C+%ED%83%9C%EA%B5%AD&destType=MARKET&selected=1594141&latLong=7.896579%2C98.302097&mpo=HC&sort=RECOMMENDED&top_dp=6000&top_cur=THB&affcid=HCOM-KR.DIRECT.PHG.1101l32628&afflid=1110l33pPnH3&userIntent=&selectedRoomType=210306852&selectedRatePlan=222158066&expediaPropertyId=1594141&searchId=41371b86-31c4-4b9f-9602-90a7a7fd58c2",
      },
      {
        providerId: "travelocity",
        name: "Travelocity",
        url: "https://www.travelocity.com/Phuket-Hotels-Phuket-Marriott-Resort-Spa.h1594141.Hotel-Information?chkin=2026-05-05&chkout=2026-05-07&x_pwa=1&rfrr=HSR&pwa_ts=1773395882335&referrerUrl=aHR0cHM6Ly93d3cudHJhdmVsb2NpdHkuY29tL0hvdGVsLVNlYXJjaA%3D%3D&useRewards=false&rm1=a2%3Ac6%3Ac3&regionId=6046393&destination=Phuket%2C+Phuket+Province%2C+Thailand&destType=MARKET&latLong=7.880443%2C98.392247&sort=RECOMMENDED&top_dp=443&top_cur=USD&userIntent=&selectedRoomType=210306852&selectedRatePlan=222158066&searchId=834efb85-cec8-4a58-918d-e3d2abc2477f",
      },
      {
        providerId: "traveloka",
        name: "Traveloka",
        url: "https://www.traveloka.com/en-th/hotel/detail?spec=05-05-2026.07-05-2026.2.1.HOTEL.1000000350330.Phuket%20Marriott%20Resort%20%26%20Spa%2C%20Merlin%20Beach.2&loginPromo=1&prevSearchId=1859540457357336511&mToken=VptPd1N%2BKefTkOwJCrzayVHgpY14qKbb%2FSrBkbS3omnQP%2FfLqCG2zgz25fMPRSeFQp8xy8cT2mtTuFSNYKzfxA%3D%3D&metasearchRateId=desktop&priceDisplay=NIGHT&childSpec=6%2C3&multiRoomAlternativeOption=false&iuid=98eaa9a3-be3c-466e-9269-0040bc3fd9c4",
      },
      {
        providerId: "stayforlong",
        name: "Stayforlong",
        url: "https://www.stayforlong.com/hotel/th/phuket-marriott-resort-spa-merlin-beach_patong?adults=2&checkIn=2026-05-05&checkOut=2026-05-07&checkin=2026-05-05&checkout=2026-05-07&children=6%2C3&lang=en&market=us&page=1&tid=01kkk9p0vpj48krpb9jp0t9vb1",
      },
      {
        providerId: "trip-com",
        name: "Trip.com",
        url: "https://us.trip.com/hotels/detail/?cityEnName=Phuket&cityId=725&hotelId=703198&checkIn=2026-05-05&checkOut=2026-05-07&adult=2&children=2&crn=1&ages=6%2C3&curr=THB&barcurr=THB",
      },
      {
        providerId: "webjet",
        name: "Webjet",
        url: "https://services.webjet.com.au/web/hotels/search/#/hotel?area=Patong%2C%20Phuket%20Province%2C%20Thailand&areaId=306337833&checkInDate=20260505&checkOutDate=20260507&childAge=6%2C3&featuredHotel=401594141-306337833-Patong%2C%20Phuket%20Province%2C%20Thailand&hotel=Phuket%20Marriott%20Resort%20%26%20Spa%2C%20Merlin%20Beach%2C%20Patong%2C%20TH&hotelid=401594141&numberOfBedroomsFilter=0&paxRequest=A2C2&sessionId=736c54cd-7fad-4504-b71f-0945615411b1&isExpandedProperty=false",
      },
      {
        providerId: "interpark",
        name: "Interpark",
        url: "https://travel.interpark.com/hotel/goods?hotelCD=1000038160&iDT=2026.05.05&oDT=2026.05.07&sRinfo=2-6_3&guarantee=N&rateStatus=Y&breakfast=N&benefitInformation=N",
      },
      {
        providerId: "almosafer",
        name: "Almosafer",
        url: "https://global.almosafer.com/en/hotel/details/atg/phuket-marriott-resort-spa-merlin-beach-1052164?checkin=05-05-2026&checkout=07-05-2026&rooms=2_adult%2C2_child%2C6-3_age&lang=en",
      },
      {
        providerId: "smshoteldeals",
        name: "SMSHotelDeals",
        url: "https://smshoteldeals.com/property/11741?startDate=05-05-2026&endDate=07-05-2026&occupancies=%5B%7B%22Adults%22%3A2%2C%22Children%22%3A2%2C%22ChildrenAges%22%3A%5B6%2C3%5D%7D%5D&destinationCode=dXJuOm1ieHBsYzpUUWpk&searchTerm=phuket+&stars=%5B5%2C5%5D",
      },
      {
        providerId: "hotelsugogo",
        name: "HotelsuGoGo",
        url: "https://hotelsugogo.com/property/11741?startDate=05-05-2026&endDate=07-05-2026&occupancies=%5B%7B%22Adults%22%3A2%2C%22Children%22%3A2%2C%22ChildrenAges%22%3A%5B6%2C3%5D%7D%5D&destinationCode=dXJuOm1ieHBsYzpUUWpk&searchTerm=phuket+marr&stars=%5B5%2C5%5D",
      },
    ],
  },
];

const HOTEL_DETAIL_URLS: Record<string, Partial<Record<string, string>>> = {
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

function findCuratedDeeplinkSet(
  ctx: SearchLinkContext
): CuratedDeeplinkSet | undefined {
  if (!ctx.hotelId) return undefined;

  return CURATED_DEEPLINK_SETS.find(
    (set) =>
      set.hotelId === ctx.hotelId &&
      set.checkIn === ctx.checkIn &&
      set.checkOut === ctx.checkOut &&
      set.adults === ctx.adults &&
      set.children === ctx.children &&
      set.rooms === ctx.rooms
  );
}

function buildKeyword(ctx: SearchLinkContext): string {
  const hotelName = ctx.hotelName.trim();
  const destination = (ctx.destination ?? "").trim();

  if (!hotelName) return destination;
  if (!destination) return hotelName;
  if (hotelName.toLowerCase().includes(destination.toLowerCase())) return hotelName;

  return `${hotelName} ${destination}`;
}

function supportsConditionSearch(providerId: string): boolean {
  return ["trip-com", "kayak", "momondo", "wego", "trivago"].includes(providerId);
}

export function getProviderHotelDetailUrl(
  hotelId: string,
  providerId: string
): string | null {
  return HOTEL_DETAIL_URLS[hotelId]?.[providerId] ?? null;
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

export function buildProviderOutboundLink(
  providerId: string,
  hotel: Hotel,
  ctx: SearchLinkContext
): ProviderOutboundLink {
  const curatedSet = findCuratedDeeplinkSet({ ...ctx, hotelId: hotel.id });
  const curatedLink = curatedSet?.links.find((link) => link.providerId === providerId);
  if (curatedLink) {
    return {
      url: curatedLink.url,
      linkKind: "hotel_detail",
      hotelDetailUrl: curatedLink.url,
    };
  }

  const hotelDetailUrl = getProviderHotelDetailUrl(hotel.id, providerId);

  if (supportsConditionSearch(providerId)) {
    return {
      url: buildProviderSearchUrl(providerId, ctx),
      linkKind: "condition_search",
      hotelDetailUrl,
    };
  }

  if (hotelDetailUrl) {
    return {
      url: hotelDetailUrl,
      linkKind: "hotel_detail",
      hotelDetailUrl,
    };
  }

  return {
    url: getProviderById(providerId)?.baseUrl ?? "#",
    linkKind: "provider_home",
    hotelDetailUrl: null,
  };
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

export function getFallbackLinks(
  context?: SearchLinkContext | null
): ProviderLink[] {
  const curatedSet = context ? findCuratedDeeplinkSet(context) : undefined;
  if (curatedSet) {
    return curatedSet.links.map((link) => ({
      providerId: link.providerId,
      name: link.name,
      url: link.url,
      linkKind: "hotel_detail",
      note: "Verified deep link for this itinerary.",
    }));
  }

  return FALLBACK_LINKS.map((link) => ({
    ...link,
    url: context ? buildProviderSearchUrl(link.providerId, context) : "#",
    linkKind: context ? "condition_search" : "provider_home",
  }));
}
