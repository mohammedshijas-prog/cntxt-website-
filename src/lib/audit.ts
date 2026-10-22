import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/*
 * The portal activity log. Row changes made with a member's own login are
 * recorded by a database trigger; this helper records what the server does on
 * a member's behalf (team changes, settings, AI runs) and sign-ins.
 */

/** "Chrome on macOS", from the user agent; the full string is never stored. */
export function deviceOf(ua: string) {
  const browser = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Browser";
  const os = /iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Mac OS X/.test(ua) ? "macOS" : /Windows/.test(ua) ? "Windows" : /Linux/.test(ua) ? "Linux" : "unknown OS";
  return `${browser} on ${os}`;
}

export function requestInfo(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || null;
  return { ip, country: request.headers.get("x-vercel-ip-country"), device: deviceOf(request.headers.get("user-agent") ?? "") };
}

export async function audit(
  db: SupabaseClient,
  request: Request,
  entry: { actor: string | null; action: string; area: string; target?: string | null; targetId?: string | null; detail?: Record<string, unknown> },
) {
  const { error } = await db.from("portal_audit").insert({
    actor: entry.actor,
    action: entry.action,
    area: entry.area,
    target: entry.target?.slice(0, 200) ?? null,
    target_id: entry.targetId ?? null,
    detail: entry.detail ?? {},
    ...requestInfo(request),
  });
  // A duplicate sign-in for the same session is expected and ignored.
  if (error && error.code !== "23505") console.error("audit: insert failed", error.message);
}
