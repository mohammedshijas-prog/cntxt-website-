import { runSeoReport } from "@/lib/seoAudit";
import { supabaseService } from "@/lib/supabase/server";

export const maxDuration = 800;

/** "Run now" from the portal, for admins and marketing. */
export async function POST(request: Request) {
  const db = supabaseService();
  if (!db) return Response.json({ error: "Portal is not configured." }, { status: 503 });
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const { data } = token ? await db.auth.getUser(token) : { data: { user: null } };
  const email = data.user?.email?.toLowerCase();
  if (!email) return Response.json({ error: "Sign in first." }, { status: 401 });
  const { data: row } = await db.from("admins").select("role").eq("email", email).maybeSingle();
  if (!row || !["admin", "marketing"].includes(row.role)) return Response.json({ error: "Only admins and marketing can run reports." }, { status: 403 });

  const { data: last } = await db.from("seo_reports").select("created_at").order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (last && Date.now() - new Date(last.created_at).getTime() < 10 * 60 * 1000) {
    return Response.json({ error: "A report ran in the last 10 minutes. Give it a moment." }, { status: 429 });
  }
  try {
    const id = await runSeoReport("manual");
    return Response.json({ ok: true, id });
  } catch (error) {
    console.error("seo-report: failed", error instanceof Error ? error.message : error);
    return Response.json({ error: "The report didn't finish. Try again." }, { status: 500 });
  }
}
