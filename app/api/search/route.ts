import { NextResponse } from "next/server";
import { search } from "@/lib/services/search-service";
import { validateSearchBody } from "@/lib/api/validate-search";

/**
 * POST /api/search - 호텔명·일정 기준 가격 비교 결과 (10-api-spec 3.2)
 * 부분 성공 허용: 일부 공급처 실패 시에도 200 + fetchStatuses 반영
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_REQUEST", message: "JSON 본문이 필요합니다." } },
      { status: 400 }
    );
  }

  const validation = validateSearchBody(body);
  if (!validation.ok) {
    return NextResponse.json(
      { error: { code: validation.code, message: validation.message } },
      { status: 422 }
    );
  }

  const result = await search(validation.query);

  return NextResponse.json(result);
}
