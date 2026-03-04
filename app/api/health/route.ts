import { NextResponse } from "next/server";

/**
 * GET /api/health - 서비스 상태 확인 (10-api-spec 3.1)
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "ytravel",
    timestamp: new Date().toISOString(),
  });
}
