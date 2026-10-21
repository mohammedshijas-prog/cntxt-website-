import { limited } from "@/lib/rateLimit";
import { classify } from "@/lib/traffic";
import { supabaseService } from "@/lib/supabase/server";

/*
 * Counts one page view. No cookies, no IP and no user agent are stored: only
 * the page, the referring site's hostname, the source, country and device type.
 */
export async function POST(request: Request) {
  const db = supabaseService();
  if (!db || limited(request, 120, 60_000)) return new Response(null, { status: 204 });
  const body = (await request.json().catch(() => null)) as { path?: string; referrer?: string; utm?: string } | null;
  const path = typeof body?.path === "string" ? body.path.slice(0, 200) : "";
  if (!path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) return new Response(null, { status: 204 });

  let refHost: string | null = null;
  try {
    refHost = body?.referrer ? new URL(body.referrer).hostname.replace(/^www\./, "") : null;
  } catch {
    refHost = null;
  }
  // Moves between our own pages aren't a new source.
  if (refHost && /(^|\.)cntxt\.tech$|vercel\.app$|localhost/.test(refHost)) refHost = null;
  const { source, engine } = classify(refHost, typeof body?.utm === "string" ? body.utm.slice(0, 60) : null);
  const ua = request.headers.get("user-agent") ?? "";
  if (/bot|crawl|spider|headless/i.test(ua)) return new Response(null, { status: 204 });

  await db.from("page_views").insert({
    path,
    ref_host: refHost,
    source,
    engine,
    country: request.headers.get("x-vercel-ip-country"),
    device: /mobile|iphone|android/i.test(ua) ? "mobile" : /ipad|tablet/i.test(ua) ? "tablet" : "desktop",
  });
  return new Response(null, { status: 204 });
}
