"use client";

export type AnalyticsEventName =
  | "search_start"
  | "search_success"
  | "candidate_found"
  | "external_link_click"
  | "partial_failure"
  | "no_result";

export function trackEvent(
  event: AnalyticsEventName,
  properties: Record<string, string | number | boolean | null | undefined> = {}
) {
  if (typeof window === "undefined") return;

  const payload = {
    event,
    properties,
    path: window.location.pathname + window.location.search,
    timestamp: new Date().toISOString(),
  };

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/analytics", blob);
    return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}
