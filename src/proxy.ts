import type { NextFetchEvent, NextRequest } from "next/server";
import { crawlers } from "@/lib/traffic";

/*
 * Logs AI and search crawler visits (they never run page scripts, so the page
 * counter can't see them). Only matching user agents do any work, and the log
 * is written after the response, so pages are never slowed down.
 */
export function proxy(request: NextRequest, event: NextFetchEvent) {
  const ua = request.headers.get("user-agent") ?? "";
  const match = crawlers.find(([pattern]) => pattern.test(ua));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!match || !url || !key) return;
  event.waitUntil(
    fetch(`${url}/rest/v1/bot_hits`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ path: request.nextUrl.pathname.slice(0, 200), bot: match[1] }),
    }).catch(() => {}),
  );
}

export const config = {
  // Pages only: skip assets, images and API routes.
  matcher: ["/((?!_next/|api/|.*\\.(?:png|jpg|jpeg|webp|svg|ico|gif|mp4|webm|css|js|woff2?|txt|xml)$).*)", "/llms.txt", "/robots.txt", "/sitemap.xml"],
};
