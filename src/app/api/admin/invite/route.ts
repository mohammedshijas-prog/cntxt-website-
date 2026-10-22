import { audit } from "@/lib/audit";
import { supabaseService } from "@/lib/supabase/server";

/*
 * The portal team: add a teammate with a role, change a role, or remove
 * someone. Admins manage everyone; the head of HR can add and remove
 * recruiting managers. Every check runs here, with the caller's own token.
 */

const roles = ["admin", "marketing", "hr_head", "recruiter", "data_head", "data_manager"] as const;
type Role = (typeof roles)[number];

/** Who may grant (or take away) each role. */
const grantors: Record<Role, Role[]> = {
  admin: ["admin"],
  marketing: ["admin"],
  hr_head: ["admin"],
  recruiter: ["admin", "hr_head"],
  data_head: ["admin"],
  data_manager: ["admin", "data_head"],
};

async function caller(request: Request) {
  const db = supabaseService();
  if (!db) return { error: Response.json({ error: "Portal is not configured." }, { status: 503 }) } as const;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { error: Response.json({ error: "Sign in first." }, { status: 401 }) } as const;
  const { data } = await db.auth.getUser(token);
  const email = data.user?.email?.toLowerCase();
  if (!email) return { error: Response.json({ error: "Sign in first." }, { status: 401 }) } as const;
  const { data: row } = await db.from("admins").select("role").eq("email", email).maybeSingle();
  if (!row) return { error: Response.json({ error: "You are not on the portal team." }, { status: 403 }) } as const;
  return { db, email, role: row.role as Role } as const;
}

async function readBody(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string; role?: string; name?: string };
  const email = (body.email ?? "").trim().toLowerCase();
  const role = roles.includes(body.role as Role) ? (body.role as Role) : null;
  const name = (body.name ?? "").trim().slice(0, 120) || null;
  return { email, role, name };
}

const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/** Add a teammate: their login plus their place on the team, with a role. */
export async function POST(request: Request) {
  const who = await caller(request);
  if ("error" in who) return who.error;
  const { email, role, name } = await readBody(request);
  if (!validEmail(email)) return Response.json({ error: "Enter a valid email." }, { status: 400 });
  if (!role) return Response.json({ error: "Choose a role." }, { status: 400 });
  if (!grantors[role].includes(who.role)) return Response.json({ error: "You can't give that role." }, { status: 403 });

  const { data: existing } = await who.db.from("admins").select("role").eq("email", email).maybeSingle();
  if (existing && !grantors[existing.role as Role].includes(who.role)) {
    return Response.json({ error: "That person is already on the team with a role you can't change." }, { status: 403 });
  }

  const { error: listError } = await who.db.from("admins").upsert({ email, role, name });
  if (listError) return Response.json({ error: "Could not add that email." }, { status: 500 });

  // Create the login if it does not exist yet; an existing one is fine.
  const { error: userError } = await who.db.auth.admin.createUser({ email, email_confirm: true });
  if (userError && !/already|registered|exists/i.test(userError.message)) {
    console.error("team: createUser failed", userError.message);
    return Response.json({ error: "Could not create that login." }, { status: 500 });
  }
  await audit(who.db, request, { actor: who.email, action: existing ? "changed a role" : "added a teammate", area: "team", target: email, detail: { role, ...(existing ? { from: existing.role } : {}) } });
  return Response.json({ ok: true });
}

/** Change a teammate's role. */
export async function PATCH(request: Request) {
  const who = await caller(request);
  if ("error" in who) return who.error;
  const { email, role } = await readBody(request);
  if (!role) return Response.json({ error: "Choose a role." }, { status: 400 });
  if (email === who.email) return Response.json({ error: "Ask another admin to change your own role." }, { status: 400 });

  const { data: existing } = await who.db.from("admins").select("role").eq("email", email).maybeSingle();
  if (!existing) return Response.json({ error: "That person is not on the team." }, { status: 404 });
  if (!grantors[existing.role as Role].includes(who.role) || !grantors[role].includes(who.role)) {
    return Response.json({ error: "You can't make that change." }, { status: 403 });
  }

  const { error } = await who.db.from("admins").update({ role }).eq("email", email);
  if (error) return Response.json({ error: "Could not change the role." }, { status: 500 });
  await audit(who.db, request, { actor: who.email, action: "changed a role", area: "team", target: email, detail: { from: existing.role, role } });
  return Response.json({ ok: true });
}

/** Remove a teammate from the portal (their login stays, with no access). */
export async function DELETE(request: Request) {
  const who = await caller(request);
  if ("error" in who) return who.error;
  const { email } = await readBody(request);
  if (email === who.email) return Response.json({ error: "You can't remove yourself." }, { status: 400 });

  const { data: existing } = await who.db.from("admins").select("role").eq("email", email).maybeSingle();
  if (!existing) return Response.json({ error: "That person is not on the team." }, { status: 404 });
  if (!grantors[existing.role as Role].includes(who.role)) return Response.json({ error: "You can't remove that person." }, { status: 403 });

  const { error } = await who.db.from("admins").delete().eq("email", email);
  if (error) return Response.json({ error: "Could not remove that person." }, { status: 500 });
  await audit(who.db, request, { actor: who.email, action: "removed a teammate", area: "team", target: email, detail: { role: existing.role } });
  return Response.json({ ok: true });
}
