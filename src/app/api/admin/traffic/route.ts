import { supabaseService } from "@/lib/supabase/server";

/*
 * Live traffic for the portal: visits, unique visitors and where they came from
 * for a chosen window, next to the window before it. Admins and marketing only.
 */

const windows = { "1": 1, "7": 7, "30": 30, "90": 90 } as const;

export async function GET(request: Request) {
  const db = supabaseService();
  if (!db) return Response.json({ error: "Portal is not configured." }, { status: 503 });
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const { data } = token ? await db.auth.getUser(token) : { data: { user: null } };
  const email = data.user?.email?.toLowerCase();
  if (!email) return Response.json({ error: "Sign in first." }, { status: 401 });
  const { data: row } = await db.from("admins").select("role").eq("email", email).maybeSingle();
  if (!row || !["admin", "marketing"].includes(row.role)) return Response.json({ error: "Only admins and marketing can see traffic." }, { status: 403 });

  const key = new URL(request.url).searchParams.get("days") ?? "7";
  const days = windows[key as keyof typeof windows] ?? 7;
  const now = Date.now();
  const span = days * 24 * 60 * 60 * 1000;
  const iso = (ms: number) => new Date(ms).toISOString();
  const [current, previous] = await Promise.all([
    db.rpc("traffic_summary", { since: iso(now - span), until: iso(now) }),
    db.rpc("traffic_summary", { since: iso(now - 2 * span), until: iso(now - span) }),
  ]);
  if (current.error) return Response.json({ error: "Could not read traffic." }, { status: 500 });
  return Response.json(
    { days, from: iso(now - span), to: iso(now), current: current.data, previous: previous.data ?? null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
