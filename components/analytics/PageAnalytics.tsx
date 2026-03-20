"use client";

import { useEffect } from "react";
import type { AnalyticsEventName } from "@/lib/analytics/client";
import { trackEvent } from "@/lib/analytics/client";

interface PageAnalyticsProps {
  event: AnalyticsEventName;
  properties?: Record<string, string | number | boolean | null | undefined>;
}

export function PageAnalytics({ event, properties }: PageAnalyticsProps) {
  useEffect(() => {
    trackEvent(event, properties);
  }, [event, properties]);

  return null;
}
