import { supabaseService } from "@/lib/supabase/server";

/**
 * Adds a teammate to the portal: creates their login and puts their email on
 * the allowlist. Only someone already on the allowlist can call it.
 */
export async function POST(request: Request) {
  const db = supabaseService();
  if (!db) return Response.json({ error: "Portal is not configured." }, { status: 503 });

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return Response.json({ error: "Sign in first." }, { status: 401 });
  const { data: caller } = await db.auth.getUser(token);
  const callerEmail = caller.user?.email?.toLowerCase();
  if (!callerEmail) return Response.json({ error: "Sign in first." }, { status: 401 });
  const { data: allowed } = await db.from("admins").select("email").eq("email", callerEmail).maybeSingle();
  if (!allowed) return Response.json({ error: "Only admins can add people." }, { status: 403 });

  const { email } = (await request.json().catch(() => ({}))) as { email?: string };
  const clean = (email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return Response.json({ error: "Enter a valid email." }, { status: 400 });

  const { error: listError } = await db.from("admins").upsert({ email: clean });
  if (listError) return Response.json({ error: "Could not add that email." }, { status: 500 });

  // Create the login if it does not exist yet; an existing one is fine.
  const { error: userError } = await db.auth.admin.createUser({ email: clean, email_confirm: true });
  if (userError && !/already|registered|exists/i.test(userError.message)) {
    console.error("invite: createUser failed", userError.message);
    return Response.json({ error: "Could not create that login." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
