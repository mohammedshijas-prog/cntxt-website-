import { runSeoReport } from "@/lib/seoAudit";
import { supabaseService } from "@/lib/supabase/server";

// Crawling the site and writing the report takes a few minutes at most.
export const maxDuration = 800;

/** Vercel Cron calls this every 3 days (see vercel.json). */
export async function GET(request: Request) {
  // Vercel sends CRON_SECRET as a bearer token. Without the secret set, the
  // route refuses everyone: a user-agent check alone can be faked.
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return Response.json({ error: "Not allowed." }, { status: 401 });

  // Never more than one scheduled report in 60 hours, however often this is hit.
  const db = supabaseService();
  if (db) {
    const { data: last } = await db.from("seo_reports").select("created_at").eq("trigger", "schedule").order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (last && Date.now() - new Date(last.created_at).getTime() < 60 * 60 * 60 * 1000) return Response.json({ skipped: "A scheduled report ran recently." });
  }
  if (db) {
    const { data: claimed } = await db.rpc("claim_job", { job: "seo-report", ttl_minutes: 20 });
    if (!claimed) return Response.json({ skipped: "A report is already running." });
  }
  try {
    const id = await runSeoReport("schedule");
    return Response.json({ ok: true, id });
  } finally {
    await db?.from("job_locks").delete().eq("name", "seo-report");
  }
}
