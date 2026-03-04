import { NextResponse } from "next/server";
import { getHotels } from "@/lib/mock/hotels";

/**
 * GET /api/hotels - 등록된 호텔 목록 (10-api-spec 확장).
 * 검색 자동완성·유효 slug 검증 등에서 사용. 단일 소스는 lib/mock/hotels getHotels().
 */
export async function GET() {
  const hotels = getHotels();
  return NextResponse.json({ hotels });
}
