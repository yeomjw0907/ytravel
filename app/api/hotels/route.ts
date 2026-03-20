import { NextResponse } from "next/server";
import { getHotels } from "@/lib/mock/hotels";

/**
 * GET /api/hotels
 * 등록된 호텔 목록을 반환합니다.
 */
export async function GET() {
  const hotels = getHotels();
  return NextResponse.json({ hotels });
}
