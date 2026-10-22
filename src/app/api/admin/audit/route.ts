import { audit } from "@/lib/audit";
import { limited } from "@/lib/rateLimit";
import { supabaseService } from "@/lib/supabase/server";

/*
 * Records portal sign-ins and sign-outs. The login is checked here, so the
 * actor is always the real signed-in email; one sign-in is logged per session.
 * Logins that are not on the portal team are logged as "access denied".
 */

function sessionOf(token: string) {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8")) as { session_id?: string };
    return payload.session_id ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const db = supabaseService();
  if (!db) return new Response(null, { status: 204 });
  if (limited(request, 30, 60_000)) return new Response(null, { status: 429 });
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return new Response(null, { status: 401 });
  const { data } = await db.auth.getUser(token);
  const email = data.user?.email?.toLowerCase();
  if (!email) return new Response(null, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { event?: string };
  const event = body.event === "sign_out" ? "sign_out" : "sign_in";
  const { data: member } = await db.from("admins").select("role").eq("email", email).maybeSingle();
  const session = sessionOf(token);

  await audit(db, request, {
    actor: email,
    action: event === "sign_out" ? "signed out" : member ? "signed in" : "access denied",
    area: "session",
    target: member ? member.role : "not on the portal team",
    detail: { session, method: data.user?.app_metadata?.provider ?? "email" },
  });
  return new Response(null, { status: 204 });
}
