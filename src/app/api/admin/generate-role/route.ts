import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { supabaseService } from "@/lib/supabase/server";

/*
 * Drafts a job listing for the portal's role editor: a one-sentence summary and
 * a markdown description. Only HR members of the portal can call it. Company
 * facts come from docs/content-brief.md; the model is told not to invent any.
 */

const Draft = z.object({
  summary: z.string().describe("One sentence, under 25 words, shown at the top of the role page."),
  description: z.string().describe("The full listing in markdown, using ## headings and - bullet lists."),
});

const company = `CNTXT AI is a UAE-based data and AI company headquartered in Abu Dhabi. It captures and verifies data from real work, trains models on it, and deploys Arabic-first AI on-premises, hybrid or in the cloud for enterprises and governments.
- Products: Munsit (Arabic speech-to-text and text-to-speech across 25+ dialects), Agentix (Arabic voice and chat agents on GCC phone lines), KLKT (an app where people record everyday work with consent and are paid per accepted hour).
- Data services: data collection, labelling of text, image, video and audio at 98% accuracy with human review, expert AI evaluation, and physical-AI data for robotics.
- 250+ enterprise and government organisations served; 30M+ data points annotated. Raised a $60M Series A in June 2026.
- What people get working here: mentorship from people who have done the job before; live projects from the start (data collection, annotation, model evaluation, custom AI builds); support for professional certifications relevant to the role; some roles are remote and some on site, and each listing says which.`;

const system = `You write job listings for CNTXT AI's careers page.

Company facts (use only these about CNTXT; do not invent others):
${company}

Write a listing for the role you are given:
- "## About the role" (2-3 sentences: what the person does and why it matters at CNTXT), "## What you will do" (5-7 bullets), "## What you bring" (5-7 bullets), "## Nice to have" (2-4 bullets), "## Working at CNTXT" (2-4 bullets drawn only from the facts above).
- British spelling, sentence case, short plain sentences. No hype words such as "rockstar", "ninja", "revolutionise", "cutting-edge" or "seamless".
- Do not state salary, equity, years of experience as a hard rule, team size, office perks, or any benefit not listed above. If the brief from HR includes such details, you may use what they give.
- Keep requirements realistic and inclusive; avoid gendered language.
- The summary is one sentence for the top of the page.`;

async function hrCaller(request: Request) {
  const db = supabaseService();
  if (!db) return { error: "Portal is not configured.", status: 503 } as const;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { error: "Sign in first.", status: 401 } as const;
  const { data } = await db.auth.getUser(token);
  const email = data.user?.email?.toLowerCase();
  if (!email) return { error: "Sign in first.", status: 401 } as const;
  const { data: row } = await db.from("admins").select("role").eq("email", email).maybeSingle();
  if (!row || !["admin", "hr_head", "recruiter"].includes(row.role)) return { error: "Only HR can draft roles.", status: 403 } as const;
  return { ok: true } as const;
}

// Drafting takes a little while; give the function room.
export const maxDuration = 60;

export async function POST(request: Request) {
  const who = await hrCaller(request);
  if ("error" in who) return Response.json({ error: who.error }, { status: who.status });
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "AI drafting isn't switched on yet: add ANTHROPIC_API_KEY to the site's environment." }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const field = (key: string, max: number) => (typeof body[key] === "string" ? (body[key] as string).trim().slice(0, max) : "");
  const title = field("title", 120);
  if (!title) return Response.json({ error: "Add a title first." }, { status: 400 });
  const brief = [
    `Title: ${title}`,
    field("department", 120) && `Department: ${field("department", 120)}`,
    field("location", 120) && `Location: ${field("location", 120)}`,
    field("terms", 120) && `Terms: ${field("terms", 120)}`,
    field("notes", 2000) && `Notes from HR:\n${field("notes", 2000)}`,
  ]
    .filter(Boolean)
    .join("\n");

  const client = new Anthropic();
  try {
    const response = await client.beta.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      output_config: { effort: "medium", format: betaZodOutputFormat(Draft) },
      // If the model declines, the API retries on a fallback model in the same call.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system,
      messages: [{ role: "user", content: `Write the listing for this role.\n\n${brief}` }],
    });
    if (response.stop_reason === "refusal" || !response.parsed_output) {
      return Response.json({ error: "Couldn't draft this one. Try rewording the title or notes." }, { status: 422 });
    }
    return Response.json(response.parsed_output);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) return Response.json({ error: "Too many drafts at once. Try again in a minute." }, { status: 429 });
    if (error instanceof Anthropic.AuthenticationError) return Response.json({ error: "The AI key was rejected. Check ANTHROPIC_API_KEY." }, { status: 503 });
    if (error instanceof Anthropic.APIError) {
      console.error("generate-role: API error", error.status, error.message);
      return Response.json({ error: "The AI service had a problem. Try again." }, { status: 502 });
    }
    throw error;
  }
}
