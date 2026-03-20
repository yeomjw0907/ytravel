"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/client";

export function AnalyticsListener() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const tracked = target?.closest<HTMLElement>("[data-track]");
      if (!tracked) return;

      if (tracked.dataset.track !== "external_link_click") return;

      trackEvent("external_link_click", {
        location: tracked.dataset.trackLocation ?? null,
        provider: tracked.dataset.trackProvider ?? null,
        url: tracked.dataset.trackUrl ?? null,
      });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
