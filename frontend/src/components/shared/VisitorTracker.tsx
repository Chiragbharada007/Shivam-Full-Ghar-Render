"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function VisitorTracker() {
  const pathname = usePathname() || "";
  const lastTrackedPath = useRef<string>("");

  useEffect(() => {
    // Avoid tracking admin routes or rapid duplicate navigations
    if (!pathname || pathname.includes("/admin") || lastTrackedPath.current === pathname) {
      return;
    }
    lastTrackedPath.current = pathname;

    let locale = "gu";
    const segments = pathname.split("/");
    if (segments[1] && ["gu", "hi", "en"].includes(segments[1])) {
      locale = segments[1];
    }

    let userEmail = "";
    let userName = "";
    try {
      userEmail = localStorage.getItem("shivam_user_email") || "";
      userName = localStorage.getItem("shivam_user_name") || "";
    } catch {}

    const payload = JSON.stringify({
      path: pathname,
      locale,
      referrer: typeof document !== "undefined" ? document.referrer : "",
      visitorEmail: userEmail || undefined,
      visitorName: userName || undefined,
    });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/track", blob);
    } else {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => null);
    }
  }, [pathname]);

  return null;
}

/**
 * Client helper to log visitor interactions (WhatsApp click, quotation, etc.)
 */
export function trackVisitorEvent(
  eventType: "whatsapp_click" | "product_view" | "custom_request_submit" | "quotation_view",
  entityId?: string,
  metadata?: Record<string, any>
) {
  try {
    const payload = JSON.stringify({
      type: "event",
      eventType,
      entityId,
      metadata,
    });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/track", blob);
    } else {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => null);
    }
  } catch {}
}
