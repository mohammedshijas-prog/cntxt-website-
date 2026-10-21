import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { companyFacts } from "@/lib/companyFacts";
import { anthropicKey } from "@/lib/secrets";
import { supabaseService } from "@/lib/supabase/server";

/*
 * The SEO and GEO pipeline. Every run crawls the live sitemap, checks each page
 * the way a search engine and an AI answer engine would read it, scores the
 * site, then (when the Anthropic key is set) writes a plain report, suggests
 * blog topics, and drafts one post for marketing to review. Nothing publishes.
 */

const SITE = "https://www.cntxt.tech";
const AI_BOTS = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];

type Page = {
  url: string;
  status: number;
  ms: number;
  kb: number;
  title: string;
  description: string;
  canonical: string;
  h1: number;
  words: number;
  imagesWithoutAlt: number;
  internalLinks: number;
  schema: string[];
  ogImage: boolean;
  noindex: boolean;
};

type Issue = { severity: "high" | "medium" | "low"; area: "SEO" | "GEO" | "Speed"; page: string; issue: string; fix: string };

const pick = (html: string, re: RegExp) => (html.match(re)?.[1] ?? "").replace(/&amp;/g, "&").trim();

/** Every @type in the page's JSON-LD, flattened. */
function schemaTypes(html: string) {
  const types = new Set<string>();
  for (const block of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const walk = (node: unknown) => {
        if (Array.isArray(node)) node.forEach(walk);
        else if (node && typeof node === "object") {
          const type = (node as Record<string, unknown>)["@type"];
          if (typeof type === "string") types.add(type);
          Object.values(node as Record<string, unknown>).forEach(walk);
        }
      };
      walk(JSON.parse(block[1]));
    } catch {
      /* malformed block: reported below as missing schema */
    }
  }
  return [...types];
}

async function crawl(url: string): Promise<Page> {
  const started = Date.now();
  const response = await fetch(url, { headers: { "User-Agent": "CNTXT-SEO-Audit/1.0" }, redirect: "follow", cache: "no-store" });
  const html = await response.text();
  const text = html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
  return {
    url: url.replace(SITE, "") || "/",
    status: response.status,
    ms: Date.now() - started,
    kb: Math.round(html.length / 1024),
    title: pick(html, /<title>([^<]*)<\/title>/),
    description: pick(html, /<meta name="description" content="([^"]*)"/),
    canonical: pick(html, /<link rel="canonical" href="([^"]*)"/),
    h1: (html.match(/<h1[\s>]/g) ?? []).length,
    words: text.split(" ").filter((word) => word.length > 1).length,
    imagesWithoutAlt: [...html.matchAll(/<img\b[^>]*>/g)].filter((tag) => !/\balt=/.test(tag[0])).length,
    internalLinks: (html.match(/href="\/(?!\/)/g) ?? []).length,
    schema: schemaTypes(html),
    ogImage: /property="og:image"/.test(html),
    noindex: /<meta name="robots" content="[^"]*noindex/.test(html),
  };
}

/** Run with a small pool so the site is never hammered. */
async function crawlAll(urls: string[], width = 6) {
  const out: Page[] = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: width }, async () => {
      while (next < urls.length) {
        const url = urls[next++];
        try {
          out.push(await crawl(url));
        } catch {
          out.push({ url: url.replace(SITE, ""), status: 0, ms: 0, kb: 0, title: "", description: "", canonical: "", h1: 0, words: 0, imagesWithoutAlt: 0, internalLinks: 0, schema: [], ogImage: false, noindex: false });
        }
      }
    }),
  );
  return out.sort((a, b) => a.url.localeCompare(b.url));
}

function findIssues(pages: Page[], site: { robots: string; llms: string }): Issue[] {
  const issues: Issue[] = [];
  const titles = new Map<string, string>();
  for (const page of pages) {
    const add = (severity: Issue["severity"], area: Issue["area"], issue: string, fix: string) => issues.push({ severity, area, page: page.url, issue, fix });
    if (page.status !== 200) add("high", "SEO", `Returns ${page.status || "no response"}`, "Fix or remove the page and its sitemap entry.");
    if (page.noindex) add("high", "SEO", "Marked noindex but listed in the sitemap", "Remove noindex or drop it from the sitemap.");
    if (!page.title) add("high", "SEO", "No title", "Add a unique title of 30-60 characters.");
    else if (page.title.length > 65) add("low", "SEO", `Title is ${page.title.length} characters`, "Shorten to 60 so it isn't cut off in results.");
    if (page.title) {
      if (titles.has(page.title)) add("medium", "SEO", `Same title as ${titles.get(page.title)}`, "Give each page its own title.");
      titles.set(page.title, page.url);
    }
    if (!page.description) add("medium", "SEO", "No meta description", "Add a 120-160 character description.");
    else if (page.description.length < 70 || page.description.length > 170) add("low", "SEO", `Description is ${page.description.length} characters`, "Aim for 120-160 characters.");
    if (!page.canonical) add("medium", "SEO", "No canonical URL", "Add a canonical link.");
    if (page.h1 !== 1) add("medium", "SEO", `${page.h1} H1 headings`, "Use exactly one H1 per page.");
    if (page.imagesWithoutAlt) add("low", "SEO", `${page.imagesWithoutAlt} images without alt text`, "Add alt text (empty alt for decoration).");
    if (!page.ogImage) add("low", "SEO", "No share image", "Add an og:image.");
    if (page.words < 250 && !/policy|conditions|admin/.test(page.url)) add("medium", "GEO", `Only ${page.words} words of text`, "Answer engines quote text: add a short, factual section.");
    if (!page.schema.length) add("medium", "GEO", "No structured data", "Add schema.org JSON-LD for what the page is about.");
    if (page.ms > 1500) add("medium", "Speed", `HTML took ${page.ms} ms`, "Check caching and server work on this route.");
    if (page.kb > 400) add("low", "Speed", `HTML is ${page.kb} KB`, "Trim inline data or split heavy components.");
  }
  const home = pages.find((page) => page.url === "/");
  if (home && !home.schema.includes("Organization")) issues.push({ severity: "high", area: "GEO", page: "/", issue: "No Organization schema on the home page", fix: "Add Organization JSON-LD with name, logo and sameAs." });
  if (!pages.some((page) => page.schema.includes("FAQPage"))) issues.push({ severity: "medium", area: "GEO", page: "site", issue: "No FAQ schema anywhere", fix: "Mark up buyer FAQs with FAQPage." });
  for (const bot of AI_BOTS) {
    if (!new RegExp(`User-Agent: ${bot}`, "i").test(site.robots) && /Disallow: \/\s*$/m.test(site.robots)) {
      issues.push({ severity: "high", area: "GEO", page: "/robots.txt", issue: `${bot} may be blocked`, fix: `Allow ${bot} in robots.txt.` });
    }
  }
  if (!site.llms) issues.push({ severity: "medium", area: "GEO", page: "/llms.txt", issue: "llms.txt is missing", fix: "Publish a factual llms.txt summary." });
  return issues;
}

/** 100 minus weighted issues, kept in range. */
function scoreOf(issues: Issue[], area?: Issue["area"]) {
  const weight = { high: 8, medium: 3, low: 1 } as const;
  const lost = issues.filter((issue) => !area || issue.area === area).reduce((sum, issue) => sum + weight[issue.severity], 0);
  return Math.max(0, Math.min(100, 100 - lost));
}

const Report = z.object({
  summary: z.string().describe("Three or four sentences for a marketing lead: how the site stands and what changed."),
  trafficNote: z.string().describe("Two or three sentences on visits: how many, where they came from (AI engines, search, social, other sites, direct), what moved since the previous 3 days, and which AI crawlers visited. Say plainly if there is too little data yet."),
  recommendations: z
    .array(z.object({ title: z.string(), why: z.string(), how: z.string(), impact: z.enum(["high", "medium", "low"]) }))
    .describe("The five most valuable next steps across SEO and GEO, most valuable first."),
  blogIdeas: z
    .array(
      z.object({
        title: z.string(),
        query: z.string().describe("The search or AI question this answers."),
        angle: z.string(),
        whyNow: z.string().describe("The trend or news that makes this timely, in one sentence."),
        source: z.string().describe("URL of the source for that trend, from the research notes, or empty."),
        outline: z.array(z.string()),
      }),
    )
    .describe("Three blog posts CNTXT could publish next, tied to current trends and built only on the facts given."),
});

const Post = z.object({
  title: z.string(),
  slug: z.string().describe("lowercase-words-with-hyphens"),
  excerpt: z.string().describe("One or two sentences for the blog card."),
  category: z.enum(["Arabic AI", "Data", "Evaluation", "Agents", "Industry"]),
  body: z.string().describe("The article in markdown, 600-900 words, with ## headings and a short FAQ at the end."),
});

const writer = `You are CNTXT AI's SEO and GEO (generative engine optimisation) lead.
Company facts you may use, and nothing beyond them:
${companyFacts}

Settled site decisions (do not recommend changing them):
- Munsit and KLKT live on their own sites (munsit.com, klkt.app); /munsit redirects there on purpose. Don't suggest a Munsit page on cntxt.tech.
- Legal pages are kept verbatim; don't suggest rewriting them.

Traffic numbers come only from the traffic data you are given; never estimate or round them up. If a recommendation follows from the traffic (for example a page AI engines send people to), say which numbers it rests on.

Write in British English, sentence case, short plain sentences. No hype words. Never invent customers, figures, dates or quotes.`;

/**
 * Trend research with web search: what people are searching and asking AI about
 * in CNTXT's space right now. Returns plain notes with source URLs.
 */
async function researchTrends(client: Anthropic, blogTitles: string[]) {
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    {
      role: "user",
      content: `Research what is trending right now (the last few weeks) that CNTXT AI could write about to be found in search and quoted by AI answer engines. Look at: Arabic and multi-dialect speech AI, AI adoption and regulation in the UAE, Saudi Arabia and the GCC, AI training data and labelling, AI agents for customer service, physical AI and robotics data, and model evaluation.

Return 6-8 short notes. Each: the trend in one sentence, why people are searching for it, and its source URL. Skip topics CNTXT already covered: ${blogTitles.join("; ") || "none yet"}.`,
    },
  ];
  // Server-side search can pause a long turn; resume it a few times at most.
  for (let turn = 0; turn < 4; turn++) {
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      output_config: { effort: "medium" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 8 }],
      messages,
    });
    if (response.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: response.content });
      continue;
    }
    if (response.stop_reason === "refusal") return "";
    return response.content
      .filter((block): block is Anthropic.Beta.BetaTextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();
  }
  return "";
}

async function writeUp(apiKey: string, pages: Page[], issues: Issue[], score: number, geoScore: number, blogTitles: string[], traffic: unknown) {
  const client = new Anthropic({ apiKey });
  const trends = await researchTrends(client, blogTitles).catch(() => "");
  const audit = {
    score,
    geoScore,
    pages: pages.map((page) => ({ url: page.url, title: page.title, words: page.words, schema: page.schema, ms: page.ms })),
    issues: issues.slice(0, 60),
    existingPosts: blogTitles,
    // Visits over the last 3 days next to the 3 days before, by source (ai, search, social, referral, campaign, direct), engine, page and crawler.
    traffic,
  };
  const report = await client.beta.messages.parse({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    output_config: { effort: "medium", format: betaZodOutputFormat(Report) },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: writer,
    messages: [
      {
        role: "user",
        content: `Here is this run's audit of www.cntxt.tech as JSON:\n\n${JSON.stringify(audit)}\n\nTrend research from the web this run (use it for the blog ideas; cite its URLs):\n\n${trends || "(No trend research this run; base ideas on the audit and the company facts.)"}\n\nWrite the report.`,
      },
    ],
  });
  if (report.stop_reason === "refusal" || !report.parsed_output) throw new Error("No report returned.");
  const idea = report.parsed_output.blogIdeas[0];
  let draft: z.infer<typeof Post> | null = null;
  if (idea) {
    const post = await client.beta.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      output_config: { effort: "medium", format: betaZodOutputFormat(Post) },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: `${writer}\n\nYou write articles that rank in search and get quoted by AI answer engines: answer the question in the first paragraph, use clear headings, state facts plainly, and end with three short FAQs.`,
      messages: [
        {
          role: "user",
          content: `Write this post.\nTitle: ${idea.title}\nQuestion it answers: ${idea.query}\nAngle: ${idea.angle}\nWhy now: ${idea.whyNow}${idea.source ? ` (${idea.source})` : ""}\nOutline:\n- ${idea.outline.join("\n- ")}\n\nYou may mention the trend in general terms, but every claim about CNTXT must come from the company facts.`,
        },
      ],
    });
    if (post.stop_reason !== "refusal" && post.parsed_output) draft = post.parsed_output;
  }
  return { report: report.parsed_output, draft, trends };
}

export async function runSeoReport(trigger: "schedule" | "manual") {
  const db = supabaseService();
  if (!db) throw new Error("Portal is not configured.");

  const [sitemap, robots, llms] = await Promise.all(
    ["/sitemap.xml", "/robots.txt", "/llms.txt"].map((path) =>
      fetch(`${SITE}${path}`, { cache: "no-store" })
        .then((response) => (response.ok ? response.text() : ""))
        .catch(() => ""),
    ),
  );
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).slice(0, 80);
  const pages = await crawlAll(urls);
  const issues = findIssues(pages, { robots, llms });
  issues.sort((a, b) => ["high", "medium", "low"].indexOf(a.severity) - ["high", "medium", "low"].indexOf(b.severity));
  const score = scoreOf(issues.filter((issue) => issue.area !== "GEO"));
  const geoScore = scoreOf(issues, "GEO");
  const siteChecks = {
    pagesInSitemap: urls.length,
    llmsTxt: Boolean(llms),
    aiCrawlersAllowed: AI_BOTS.filter((bot) => new RegExp(bot, "i").test(robots)),
    averageMs: Math.round(pages.reduce((sum, page) => sum + page.ms, 0) / Math.max(1, pages.length)),
  };

  // Traffic: the last 3 days against the 3 days before, summed in the database.
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const span = (from: number, to: number) =>
    db.rpc("traffic_summary", { since: new Date(from).toISOString(), until: new Date(to).toISOString() }).then(({ data }) => data ?? null);
  const [current, before] = await Promise.all([span(now - 3 * day, now), span(now - 6 * day, now - 3 * day)]).catch(() => [null, null]);
  const traffic = current ? { from: new Date(now - 3 * day).toISOString(), to: new Date(now).toISOString(), current, previous: before } : null;

  const row: Record<string, unknown> = { trigger, score, geo_score: geoScore, pages, issues, site_checks: siteChecks, traffic };
  const apiKey = await anthropicKey();
  if (apiKey) {
    try {
      const { data: posts } = await db.from("posts").select("title");
      const { report, draft, trends } = await writeUp(apiKey, pages, issues, score, geoScore, (posts ?? []).map((post) => post.title as string), traffic);
      row.summary = report.summary;
      if (row.traffic) row.traffic = { ...(row.traffic as object), note: report.trafficNote };
      row.recommendations = report.recommendations;
      row.blog_ideas = report.blogIdeas;
      row.site_checks = { ...siteChecks, trendNotes: trends };
      if (draft) {
        const slug = `${draft.slug.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "").slice(0, 70)}-${Date.now().toString(36)}`;
        const { data: saved } = await db
          .from("posts")
          .insert({ slug, title: draft.title, excerpt: draft.excerpt, category: draft.category, body: draft.body, author: "CNTXT AI", status: "draft" })
          .select("id")
          .single();
        row.draft_post_id = saved?.id ?? null;
      }
    } catch (error) {
      row.error = error instanceof Anthropic.APIError ? `The AI write-up failed (${error.status}).` : "The AI write-up failed.";
    }
  } else {
    row.error = "Checks ran. Add the Anthropic key in Settings to get the written report, blog ideas and a draft post.";
  }
  const { data, error } = await db.from("seo_reports").insert(row).select("id").single();
  if (error) throw new Error(error.message);
  return data.id as string;
}
