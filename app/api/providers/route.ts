import { NextResponse } from "next/server";
import {
  getAutomatedProviders,
  getProviders,
  getReferenceProviders,
} from "@/lib/mock/providers";

/**
 * GET /api/providers
 * Returns the currently available provider catalog for launch.
 */
export async function GET() {
  return NextResponse.json({
    providers: getProviders(),
    automatedProviders: getAutomatedProviders(),
    referenceProviders: getReferenceProviders(),
  });
}
