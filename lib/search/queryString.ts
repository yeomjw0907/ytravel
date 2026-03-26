import type { SearchQuery } from "@/lib/types/schema";

export function toSearchQueryString(query: SearchQuery): string {
  const params = new URLSearchParams();
  params.set("hotelName", query.hotelName);
  params.set("checkIn", query.checkIn);
  params.set("checkOut", query.checkOut);
  params.set("adults", String(query.adults));
  params.set("children", String(query.children));
  if (query.childAges.length > 0) {
    params.set("childAges", query.childAges.join(","));
  }
  params.set("rooms", String(query.rooms));
  params.set("currency", query.currency);
  params.set("locale", query.locale);
  params.set("roomName", query.roomName);
  params.set("userBookedPrice", String(query.userBookedPrice));
  params.set("bookedBoardType", query.bookedBoardType);
  params.set("bookedCancellationType", query.bookedCancellationType);
  params.set(
    "bookedTaxIncluded",
    query.bookedTaxIncluded == null ? "" : String(query.bookedTaxIncluded)
  );
  params.set("bookedPaymentType", query.bookedPaymentType);
  if (query.destination) params.set("destination", query.destination);
  return params.toString();
}

export function toHotelQueryString(query: SearchQuery): string {
  return toSearchQueryString(query);
}
