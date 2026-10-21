import { runSeoReport } from "@/lib/seoAudit";
import { supabaseService } from "@/lib/supabase/server";

// Crawling the site and writing the report takes a few minutes at most.
export const maxDuration = 800;

/** Vercel Cron calls this every 3 days (see vercel.json). */
export async function GET(request: Request) {
  // With CRON_SECRET set, Vercel sends it as a bearer token; otherwise only Vercel's cron agent may call.
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  const fromCron = secret ? auth === `Bearer ${secret}` : /vercel-cron/i.test(request.headers.get("user-agent") ?? "");
  if (!fromCron) return Response.json({ error: "Not allowed." }, { status: 401 });

  // Never more than one scheduled report in 60 hours, however often this is hit.
  const db = supabaseService();
  if (db) {
    const { data: last } = await db.from("seo_reports").select("created_at").eq("trigger", "schedule").order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (last && Date.now() - new Date(last.created_at).getTime() < 60 * 60 * 60 * 1000) return Response.json({ skipped: "A scheduled report ran recently." });
  }
  const id = await runSeoReport("schedule");
  return Response.json({ ok: true, id });
}
