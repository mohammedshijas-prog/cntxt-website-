import { limited } from "@/lib/rateLimit";
import { supabaseService } from "@/lib/supabase/server";

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

/** A dataset request from the catalogue, recorded for the data team in the portal. */
export async function POST(request: Request) {
  const db = supabaseService();
  if (!db) return Response.json({ error: "Requests are paused for maintenance. Please email sales@cntxt.tech." }, { status: 503 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Please fill in the form." }, { status: 400 });
  if (text(body.company_url, 200)) return Response.json({ ok: true });

  const name = text(body.name, 120);
  const email = text(body.email, 160).toLowerCase();
  if (!name) return Response.json({ error: "Enter your name." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Enter a valid email address." }, { status: 400 });

  const ids = Array.isArray(body.datasets) ? body.datasets.filter((id): id is string => typeof id === "string").slice(0, 50) : [];
  if (!ids.length) return Response.json({ error: "Add at least one dataset to your request." }, { status: 400 });
  // Only published datasets count, and titles come from the database, not the browser.
  const { data: datasets } = await db.from("datasets").select("id, title").in("id", ids).eq("status", "published");
  if (!datasets?.length) return Response.json({ error: "Those datasets are no longer in the catalogue." }, { status: 400 });
  if (limited(request, 8)) return Response.json({ error: "Too many requests from this connection. Please try again later." }, { status: 429 });

  const { error } = await db.from("dataset_requests").insert({
    name,
    email,
    company: text(body.company, 160) || null,
    message: text(body.message, 2000) || null,
    dataset_ids: datasets.map((item) => item.id),
    dataset_titles: datasets.map((item) => item.title),
    page: text(body.page, 200) || null,
  });
  if (error) {
    console.error("data-request: insert failed", error.message);
    return Response.json({ error: "We could not save your request. Please try again." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
