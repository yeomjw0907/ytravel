import { NextResponse } from "next/server";
import { BRG_ELIGIBLE_SITES } from "@/lib/data/brg-eligible-sites";

/**
 * GET /api/brg-eligible-sites - BRG 비교 가능 사이트 목록 (참고용).
 */
export async function GET() {
  return NextResponse.json({ sites: BRG_ELIGIBLE_SITES });
}
