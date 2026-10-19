import type { MetadataRoute } from "next";
import { articleSlug } from "@/components/blog/posts";
import { industries } from "@/components/industries/industries";
import { verticals } from "@/components/physical-ai/verticals";
import { publishedPosts } from "@/lib/supabase/server";

const base = "https://www.cntxt.tech";

const paths = [
  "",
  "/products",
  "/agentix",
  "/physical-ai",
  ...verticals.map((vertical) => `/physical-ai/${vertical.slug}`),
  "/data-services",
  "/data-hub",
  "/solutions",
  "/healthcare",
  ...industries.map((industry) => `/industries/${industry.slug}`),
  "/security",
  "/about",
  "/careers",
  "/partners",
  "/blog",
  `/blog/${articleSlug}`,
  "/documentation",
  "/contact",
  "/ai-klkt",
  "/terms-conditions",
  "/privacy-policy",
  "/cookie-policy",
  "/klkt-terms-conditions",
  "/klkt-privacy-policy",
];

/* Main pages first; legal pages are listed but weighted low. */
const priority = (path: string) =>
  path === "" ? 1 : /policy|conditions/.test(path) ? 0.2 : path.split("/").length > 2 ? 0.6 : 0.8;

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages = paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: priority(path),
  }));
  // Articles published from the portal.
  const posts = (await publishedPosts()).map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at ?? post.published_at ?? now),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));
  return [...pages, ...posts];
}
