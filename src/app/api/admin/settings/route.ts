import Anthropic from "@anthropic-ai/sdk";
import { audit } from "@/lib/audit";
import { supabaseService } from "@/lib/supabase/server";

/*
 * Portal settings, admins only. The Anthropic key is written to a table no
 * browser can read; responses only ever say whether it is set and its last
 * four characters.
 */

async function admin(request: Request) {
  const db = supabaseService();
  if (!db) return { error: Response.json({ error: "Portal is not configured." }, { status: 503 }) } as const;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const { data } = token ? await db.auth.getUser(token) : { data: { user: null } };
  const email = data.user?.email?.toLowerCase();
  if (!email) return { error: Response.json({ error: "Sign in first." }, { status: 401 }) } as const;
  const { data: row } = await db.from("admins").select("role").eq("email", email).maybeSingle();
  if (row?.role !== "admin") return { error: Response.json({ error: "Only admins can change settings." }, { status: 403 }) } as const;
  return { db, email } as const;
}

async function status(db: NonNullable<ReturnType<typeof supabaseService>>) {
  const fromEnv = Boolean(process.env.ANTHROPIC_API_KEY);
  const { data } = await db.from("app_secrets").select("value, updated_by, updated_at").eq("name", "anthropic_api_key").maybeSingle();
  const value = (data?.value as string | undefined) ?? "";
  return {
    anthropic: {
      set: fromEnv || Boolean(value),
      source: fromEnv ? "environment" : value ? "portal" : null,
      last4: value ? value.slice(-4) : null,
      updatedBy: data?.updated_by ?? null,
      updatedAt: data?.updated_at ?? null,
    },
  };
}

export async function GET(request: Request) {
  const who = await admin(request);
  if ("error" in who) return who.error;
  return Response.json(await status(who.db));
}

/** Save the key after checking it works. */
export async function PUT(request: Request) {
  const who = await admin(request);
  if ("error" in who) return who.error;
  const body = (await request.json().catch(() => ({}))) as { anthropicApiKey?: string };
  const key = (body.anthropicApiKey ?? "").trim();
  if (!/^sk-ant-[A-Za-z0-9_-]{20,}$/.test(key)) return Response.json({ error: "That doesn't look like an Anthropic API key (it starts with sk-ant-)." }, { status: 400 });

  // A free call that only succeeds with a valid key.
  try {
    await new Anthropic({ apiKey: key }).models.retrieve("claude-opus-5-5");
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
      return Response.json({ error: "Anthropic rejected that key. Check it and try again." }, { status: 400 });
    }
    if (error instanceof Anthropic.APIError && error.status !== 404) {
      return Response.json({ error: "Couldn't reach Anthropic to check the key. Try again." }, { status: 502 });
    }
  }

  const { error } = await who.db.from("app_secrets").upsert({ name: "anthropic_api_key", value: key, updated_by: who.email, updated_at: new Date().toISOString() });
  if (error) return Response.json({ error: "Couldn't save the key." }, { status: 500 });
  await audit(who.db, request, { actor: who.email, action: "saved the Anthropic key", area: "settings", target: "Anthropic API key" });
  return Response.json(await status(who.db));
}

export async function DELETE(request: Request) {
  const who = await admin(request);
  if ("error" in who) return who.error;
  await who.db.from("app_secrets").delete().eq("name", "anthropic_api_key");
  await audit(who.db, request, { actor: who.email, action: "removed the Anthropic key", area: "settings", target: "Anthropic API key" });
  return Response.json(await status(who.db));
}
