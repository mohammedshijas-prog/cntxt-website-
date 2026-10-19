import type { MetadataRoute } from "next";

const blocked = ["/admin", "/api/"];

/* AI answer engines are welcome: being quoted accurately by them is part of being found. */
const aiCrawlers = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: blocked },
      { userAgent: aiCrawlers, allow: "/", disallow: blocked },
    ],
    sitemap: "https://www.cntxt.tech/sitemap.xml",
    host: "https://www.cntxt.tech",
  };
}
