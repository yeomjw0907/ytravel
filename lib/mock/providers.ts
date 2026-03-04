import type { Provider } from "@/lib/types/schema";

/**
 * MVP 지원 공급처: 공식 홈페이지, Trip.com, Agoda, Booking.com
 * 실제 연동 시 DB 또는 설정에서 로드 가능
 */
export const MOCK_PROVIDERS: Provider[] = [
  {
    id: "official",
    name: "공식 홈페이지",
    type: "official",
    baseUrl: "https://www.hyatt.com",
    logoUrl: null,
    status: "active",
  },
  {
    id: "trip-com",
    name: "Trip.com",
    type: "ota",
    baseUrl: "https://www.trip.com",
    logoUrl: null,
    status: "active",
  },
  {
    id: "agoda",
    name: "Agoda",
    type: "ota",
    baseUrl: "https://www.agoda.com",
    logoUrl: null,
    status: "active",
  },
  {
    id: "booking-com",
    name: "Booking.com",
    type: "ota",
    baseUrl: "https://www.booking.com",
    logoUrl: null,
    status: "active",
  },
];

export function getProviders(): Provider[] {
  return [...MOCK_PROVIDERS];
}

export function getProviderById(id: string): Provider | undefined {
  return MOCK_PROVIDERS.find((p) => p.id === id);
}
