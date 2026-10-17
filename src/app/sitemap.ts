import type { MetadataRoute } from "next";
import { articleSlug } from "@/components/blog/posts";
import { industries } from "@/components/industries/industries";

const base = "https://www.cntxt.tech";

const paths = [
  "",
  "/products",
  "/agentix",
  "/physical-ai",
  "/data-hub",
  "/evaluate-ai",
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
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({ url: `${base}${path}`, changeFrequency: "monthly", priority: path === "" ? 1 : 0.7 }));
}
