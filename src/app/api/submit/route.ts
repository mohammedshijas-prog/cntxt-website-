import { supabaseService } from "@/lib/supabase/server";

const clip = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

/** Saves a contact or partner form submission. Only the server holds the key that can write. */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // A hidden field real visitors never fill in; bots usually do.
  if (clip(body.company_url, 200)) return Response.json({ ok: true });

  const form = body.form === "partner" ? "partner" : "contact";
  const row = {
    form,
    first_name: clip(body.firstName, 120),
    last_name: clip(body.lastName, 120) || null,
    email: clip(body.email, 200),
    company: clip(body.company, 200) || null,
    website: clip(body.website, 300) || null,
    topic: clip(body.topic, 120) || null,
    message: clip(body.message, 5000) || null,
    page: clip(body.page, 300) || null,
  };

  if (!row.first_name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
    return Response.json({ error: "Please add your name and a valid email." }, { status: 400 });
  }

  const db = supabaseService();
  if (!db) return Response.json({ error: "Submissions are not configured." }, { status: 503 });

  const { error } = await db.from("submissions").insert(row);
  if (error) return Response.json({ error: "We could not save your message. Please email sales@cntxt.tech." }, { status: 500 });
  return Response.json({ ok: true });
}
