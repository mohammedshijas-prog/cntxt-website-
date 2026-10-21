import { screenApplication } from "@/lib/screening";
import { supabaseService } from "@/lib/supabase/server";

export const maxDuration = 60;

/** HR re-runs the fit check for one application. */
export async function POST(request: Request) {
  const db = supabaseService();
  if (!db) return Response.json({ error: "Portal is not configured." }, { status: 503 });
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const { data } = token ? await db.auth.getUser(token) : { data: { user: null } };
  const email = data.user?.email?.toLowerCase();
  if (!email) return Response.json({ error: "Sign in first." }, { status: 401 });
  const { data: row } = await db.from("admins").select("role").eq("email", email).maybeSingle();
  if (!row || !["admin", "hr_head", "recruiter"].includes(row.role)) return Response.json({ error: "Only HR can check applications." }, { status: 403 });

  const { id } = (await request.json().catch(() => ({}))) as { id?: string };
  if (!id) return Response.json({ error: "Missing application." }, { status: 400 });
  const result = await screenApplication(id);
  if (!result.ok) return Response.json({ error: result.error }, { status: 502 });
  const { data: app } = await db
    .from("applications")
    .select("fit_score, fit_label, fit_summary, fit_strengths, fit_gaps, fit_questions, fit_checked_at, fit_error")
    .eq("id", id)
    .maybeSingle();
  return Response.json(app);
}
