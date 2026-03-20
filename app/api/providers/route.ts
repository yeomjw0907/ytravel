import { NextResponse } from "next/server";
import { getProviders } from "@/lib/mock/providers";

/**
 * GET /api/providers
 * 현재 지원하는 자동 비교 공급처 목록을 반환합니다.
 */
export async function GET() {
  const providers = getProviders();
  return NextResponse.json({ providers });
}
