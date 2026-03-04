import { NextResponse } from "next/server";
import { getProviders } from "@/lib/mock/providers";

/**
 * GET /api/providers - 지원 공급처 목록 (10-api-spec 3.5)
 */
export async function GET() {
  const providers = getProviders();
  return NextResponse.json({ providers });
}
