/** Where a visit came from, from the referring site's hostname (and UTM tags). */

const ai: [RegExp, string][] = [
  [/(^|\.)chatgpt\.com$|(^|\.)chat\.openai\.com$/, "ChatGPT"],
  [/(^|\.)perplexity\.ai$/, "Perplexity"],
  [/(^|\.)claude\.ai$/, "Claude"],
  [/(^|\.)gemini\.google\.com$|(^|\.)bard\.google\.com$/, "Gemini"],
  [/(^|\.)copilot\.microsoft\.com$/, "Copilot"],
  [/(^|\.)you\.com$/, "You.com"],
  [/(^|\.)phind\.com$/, "Phind"],
  [/(^|\.)meta\.ai$/, "Meta AI"],
  [/(^|\.)grok\.com$/, "Grok"],
  [/(^|\.)deepseek\.com$/, "DeepSeek"],
  [/(^|\.)mistral\.ai$/, "Mistral"],
];
const search: [RegExp, string][] = [
  [/(^|\.)google\.[a-z.]+$/, "Google"],
  [/(^|\.)bing\.com$/, "Bing"],
  [/(^|\.)duckduckgo\.com$/, "DuckDuckGo"],
  [/(^|\.)yahoo\.[a-z.]+$/, "Yahoo"],
  [/(^|\.)yandex\.[a-z.]+$/, "Yandex"],
  [/(^|\.)baidu\.com$/, "Baidu"],
  [/(^|\.)ecosia\.org$/, "Ecosia"],
  [/(^|\.)brave\.com$/, "Brave"],
];
const social: [RegExp, string][] = [
  [/(^|\.)linkedin\.com$|(^|\.)lnkd\.in$/, "LinkedIn"],
  [/(^|\.)x\.com$|(^|\.)twitter\.com$|(^|\.)t\.co$/, "X"],
  [/(^|\.)facebook\.com$|(^|\.)fb\.com$/, "Facebook"],
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)youtube\.com$/, "YouTube"],
  [/(^|\.)reddit\.com$/, "Reddit"],
  [/(^|\.)tiktok\.com$/, "TikTok"],
  [/(^|\.)whatsapp\.com$|(^|\.)wa\.me$/, "WhatsApp"],
];

export type Source = "ai" | "search" | "social" | "referral" | "campaign" | "direct";

export function classify(refHost: string | null, utmSource: string | null): { source: Source; engine: string | null } {
  const utm = (utmSource ?? "").toLowerCase();
  // AI tools increasingly tag links, e.g. utm_source=chatgpt.com.
  for (const [pattern, name] of ai) if (utm && pattern.test(utm)) return { source: "ai", engine: name };
  if (/chatgpt|openai|perplexity|claude|gemini|copilot/.test(utm)) return { source: "ai", engine: utm };
  const host = (refHost ?? "").toLowerCase();
  if (host) {
    for (const [pattern, name] of ai) if (pattern.test(host)) return { source: "ai", engine: name };
    for (const [pattern, name] of search) if (pattern.test(host)) return { source: "search", engine: name };
    for (const [pattern, name] of social) if (pattern.test(host)) return { source: "social", engine: name };
  }
  if (utm) return { source: "campaign", engine: utm.slice(0, 40) };
  if (host) return { source: "referral", engine: host.slice(0, 80) };
  return { source: "direct", engine: null };
}

/** Crawlers worth knowing about for GEO and SEO, by user agent. */
export const crawlers: [RegExp, string][] = [
  [/GPTBot/i, "GPTBot (OpenAI training)"],
  [/OAI-SearchBot/i, "OAI-SearchBot (ChatGPT search)"],
  [/ChatGPT-User/i, "ChatGPT-User (live fetch)"],
  [/ClaudeBot/i, "ClaudeBot (Anthropic)"],
  [/Claude-(User|SearchBot)/i, "Claude search and fetch"],
  [/PerplexityBot|Perplexity-User/i, "Perplexity"],
  [/Google-Extended|GoogleOther/i, "Google AI"],
  [/Googlebot/i, "Googlebot"],
  [/bingbot/i, "Bingbot"],
  [/Applebot/i, "Applebot"],
  [/CCBot/i, "Common Crawl"],
  [/meta-externalagent/i, "Meta AI"],
];
