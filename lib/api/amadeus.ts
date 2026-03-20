/**
 * Amadeus for Developers - Hotel Name Autocomplete
 * https://developers.amadeus.com/self-service/category/hotels
 * 환경변수: AMADEUS_CLIENT_ID, AMADEUS_CLIENT_SECRET (설정 시 외부 API 사용)
 */
import type { Hotel } from "@/lib/types/schema";

const AMADEUS_TOKEN_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const AMADEUS_BASE = "https://test.api.amadeus.com/v1";
const AMADEUS_BASE_V3 = "https://test.api.amadeus.com/v3";

let cachedToken: { access_token: string; expires_at: number } | null = null;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expires_at > now + 60_000) return cachedToken.access_token;

  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("AMADEUS_CLIENT_ID/SECRET not set");

  const res = await fetch(AMADEUS_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  if (!res.ok) throw new Error(`Amadeus token failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    access_token: data.access_token,
    expires_at: now + data.expires_in * 1000,
  };
  return data.access_token;
}

/** Amadeus Hotel Name Autocomplete 응답 항목 (공식 문서 기준) */
export interface AmadeusHotelSuggestion {
  hotelId: string;
  name: string;
  cityCode?: string;
  latitude?: number;
  longitude?: number;
  address?: { countryCode?: string };
  [key: string]: unknown;
}

/** 우리 서비스에서 쓰는 자동완성 항목 */
export interface HotelSuggestion {
  id: string;
  slug: string;
  name: string;
  city: string;
  country?: string;
}

/**
 * Amadeus Hotel Name Autocomplete API 호출.
 * GET /v1/reference-data/locations/hotels/by-keyword?keyword=xxx (문서/Postman 기준)
 */
export async function amadeusHotelAutocomplete(keyword: string): Promise<HotelSuggestion[]> {
  const token = await getAccessToken();
  const q = encodeURIComponent(keyword.trim());
  if (!q) return [];

  // Amadeus Hotel Name Autocomplete (공식 문서 경로는 개발자 포털에서 확인)
  const url = `${AMADEUS_BASE}/reference-data/locations/hotels/by-keyword?keyword=${q}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    if (res.status === 404 || res.status === 422) return [];
    throw new Error(`Amadeus autocomplete failed: ${res.status}`);
  }

  const json = (await res.json()) as { data?: AmadeusHotelSuggestion[] };
  const data = json.data ?? [];
  return data.slice(0, 20).map((h) => ({
    id: h.hotelId,
    slug: h.hotelId.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || h.hotelId,
    name: h.name ?? "",
    city: h.cityCode ?? "",
    country: undefined,
  }));
}

export function isAmadeusConfigured(): boolean {
  return Boolean(process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET);
}

export function isAmadeusOffersEnabled(): boolean {
  return process.env.AMADEUS_HOTEL_OFFERS_ENABLED === "true";
}

type AmadeusHotelOffersApiResponse = {
  data?: Array<{
    id?: string;
    offers?: Array<{
      id?: string;
      checkInDate?: string;
      checkOutDate?: string;
      room?: {
        typeEstimated?: { category?: string; bedType?: string; beds?: number };
        description?: { text?: string; lang?: string };
      };
      guests?: { adults?: number };
      price?: { currency?: string; total?: string; base?: string };
      policies?: {
        cancellations?: Array<{ type?: string; description?: { text?: string } }>;
        paymentType?: string;
      };
      self?: string;
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
};

export interface AmadeusRawHotelOffer {
  hotelId: string;
  offerId: string;
  currency: string;
  total: number;
  base: number | null;
  roomName: string;
  rawRoomName: string | null;
  adults: number | null;
  paymentTypeRaw: string | null;
  cancellationTypeRaw: string | null;
  deeplink: string | null;
  collectedAt: string;
}

function parseAmadeusMoney(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * Amadeus Hotel Search API - Hotel Offers (v3).
 * - 일반적으로 `GET /v3/shopping/hotel-offers?hotelIds=...` 형태를 사용.
 * - 계정/권한에 따라 `by-hotel` 변형이 필요할 수 있어, 1차 시도 후 실패 시 fallback을 시도.
 */
export async function amadeusHotelOffers(
  hotelId: string,
  checkInDate: string,
  checkOutDate: string,
  adults: number,
  rooms: number
): Promise<AmadeusRawHotelOffer[]> {
  if (!isAmadeusConfigured()) return [];
  const token = await getAccessToken();
  const collectedAt = new Date().toISOString();

  const common = new URLSearchParams();
  common.set("checkInDate", checkInDate);
  common.set("checkOutDate", checkOutDate);
  common.set("adults", String(Math.max(1, adults)));
  // rooms 파라미터는 계정/버전에 따라 없을 수 있어 optional로 보냄
  if (rooms && rooms > 0) common.set("roomQuantity", String(rooms));

  const urls = [
    `${AMADEUS_BASE_V3}/shopping/hotel-offers?hotelIds=${encodeURIComponent(hotelId)}&${common.toString()}`,
    `${AMADEUS_BASE}/shopping/hotel-offers/by-hotel?hotelId=${encodeURIComponent(hotelId)}&${common.toString()}`,
  ];

  for (const url of urls) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      if (res.status === 404 || res.status === 422) continue;
      // 다른 URL도 시도
      continue;
    }

    const json = (await res.json()) as AmadeusHotelOffersApiResponse;
    const firstHotel = (json.data ?? [])[0];
    const offers = firstHotel?.offers ?? [];
    const normalized: AmadeusRawHotelOffer[] = offers
      .map((o) => {
        const currency = o.price?.currency ?? "";
        const total = parseAmadeusMoney(o.price?.total);
        if (!currency || total == null) return null;

        const base = parseAmadeusMoney(o.price?.base);
        const roomCategory = o.room?.typeEstimated?.category?.trim() ?? "";
        const rawRoom = o.room?.description?.text?.trim() ?? null;
        const roomName = roomCategory || rawRoom || "Unknown room";

        const cancellationRaw =
          o.policies?.cancellations?.[0]?.type ??
          o.policies?.cancellations?.[0]?.description?.text ??
          null;

        const paymentTypeRaw = o.policies?.paymentType ?? null;

        return {
          hotelId,
          offerId: o.id ?? `${hotelId}_${Math.random().toString(36).slice(2)}`,
          currency,
          total,
          base: base == null ? null : base,
          roomName,
          rawRoomName: rawRoom,
          adults: o.guests?.adults ?? null,
          paymentTypeRaw,
          cancellationTypeRaw: cancellationRaw,
          deeplink: (typeof o.self === "string" && o.self) || null,
          collectedAt,
        } satisfies AmadeusRawHotelOffer;
      })
      .filter((x): x is AmadeusRawHotelOffer => Boolean(x));

    return normalized;
  }

  return [];
}

/** slug 생성: hotelId 기반 (호텔 상세 링크·캐시 키용) */
function toSlug(hotelId: string): string {
  return hotelId.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || hotelId;
}

/**
 * 검색 시 호텔 1건 해상도. by-keyword로 조회 후 첫 결과를 우리 Hotel 타입으로 변환.
 * Amadeus 미설정 시 null. 실패 시 null (호출부에서 mock fallback).
 */
export async function amadeusResolveHotel(
  keyword: string,
  cityCodeOrName?: string | null
): Promise<Hotel | null> {
  if (!isAmadeusConfigured()) return null;
  const q = keyword.trim();
  if (!q) return null;

  try {
    const token = await getAccessToken();
    const url = `${AMADEUS_BASE}/reference-data/locations/hotels/by-keyword?keyword=${encodeURIComponent(q)}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: AmadeusHotelSuggestion[] };
    const list = json.data ?? [];
    const cityLower = (cityCodeOrName ?? "").trim().toLowerCase();
    const first = cityLower
      ? list.find(
          (h) =>
            (h.cityCode ?? "").toLowerCase() === cityLower ||
            (h.cityCode ?? "").toLowerCase().includes(cityLower) ||
            (h.name ?? "").toLowerCase().includes(cityLower)
        ) ?? list[0]
      : list[0];
    if (!first?.hotelId || !first?.name) return null;

    const country = (first.address as { countryCode?: string } | undefined)?.countryCode ?? "";
    return {
      id: first.hotelId,
      slug: toSlug(first.hotelId),
      name: first.name,
      nameDisplay: null,
      brand: null,
      city: first.cityCode ?? "",
      country,
      officialSiteUrl: "",
      stars: null,
      thumbnailUrl: null,
    };
  } catch {
    return null;
  }
}
