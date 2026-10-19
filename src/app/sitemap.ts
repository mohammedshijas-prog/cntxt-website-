import type { MetadataRoute } from "next";
import { articleSlug } from "@/components/blog/posts";
import { industries } from "@/components/industries/industries";
import { verticals } from "@/components/physical-ai/verticals";

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
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({ url: `${base}${path}`, changeFrequency: "monthly", priority: path === "" ? 1 : 0.7 }));
}
