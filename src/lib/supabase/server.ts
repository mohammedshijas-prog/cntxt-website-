import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

/** Public reads (published posts only, enforced by row-level security). */
export function supabasePublic() {
  if (!url || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  return createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
}

/** Server-only writes that bypass row-level security, e.g. saving form submissions. Never import this into client code. */
export function supabaseService() {
  if (!url || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
}

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover_url: string | null;
  body: string;
  author: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Published posts, newest first. Returns [] if Supabase is unreachable so the blog still renders. */
export async function publishedPosts(): Promise<Post[]> {
  const db = supabasePublic();
  if (!db) return [];
  const { data, error } = await db.from("posts").select("*").eq("status", "published").order("published_at", { ascending: false });
  return error ? [] : (data as Post[]);
}

export async function publishedPost(slug: string): Promise<Post | null> {
  const db = supabasePublic();
  if (!db) return null;
  const { data } = await db.from("posts").select("*").eq("status", "published").eq("slug", slug).maybeSingle();
  return (data as Post | null) ?? null;
}
