"use client";

import { createBrowserClient } from "@supabase/ssr";

/** The portal's browser client: signs admins in and acts as them under row-level security. */
export function supabaseBrowser() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
