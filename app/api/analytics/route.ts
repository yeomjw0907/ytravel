import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_REQUEST", message: "JSON body is required." } },
      { status: 400 }
    );
  }

  console.info("[analytics]", payload);
  return new NextResponse(null, { status: 204 });
}
