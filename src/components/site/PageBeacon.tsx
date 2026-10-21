"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Counts each page view once, with where the visitor came from. No cookies. */
export function PageBeacon() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const params = new URLSearchParams(window.location.search);
    // Only the first page of a visit has an outside referrer; later pages are internal moves.
    const payload = JSON.stringify({ path: pathname, referrer: first.current ? document.referrer : "", utm: params.get("utm_source") ?? "" });
    first.current = false;
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    else fetch("/api/track", { method: "POST", body: payload, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
  }, [pathname]);
  return null;
}
