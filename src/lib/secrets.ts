import "server-only";
import { supabaseService } from "@/lib/supabase/server";

/** The Anthropic key: the site's environment first, then the one saved in the portal's Settings. */
export async function anthropicKey(): Promise<string | null> {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  const db = supabaseService();
  if (!db) return null;
  const { data } = await db.from("app_secrets").select("value").eq("name", "anthropic_api_key").maybeSingle();
  return (data?.value as string | undefined) ?? null;
}
