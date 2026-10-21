import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { anthropicKey } from "@/lib/secrets";
import { supabaseService } from "@/lib/supabase/server";

/*
 * A quick fit check of one application against its role, written back to the
 * application for HR to read. It is advice, never a decision: HR always decides.
 */

const Fit = z.object({
  score: z.number().int().min(0).max(100).describe("0-100: how well the evidence matches what the role asks for."),
  label: z.enum(["strong", "possible", "weak"]),
  summary: z.string().describe("Two sentences, plain and specific, for a busy recruiter."),
  strengths: z.array(z.string()).describe("Up to 4 job-relevant strengths, each tied to evidence in the CV or answers."),
  gaps: z.array(z.string()).describe("Up to 4 job-relevant gaps or things the application does not show."),
  questions: z.array(z.string()).describe("Up to 3 interview questions that would settle the biggest open points."),
});

const system = `You help CNTXT AI's HR team triage job applications. You give a quick, fair read of how well one applicant's evidence matches one role. A person on the team always makes the decision.

Rules:
- Judge only job-relevant evidence: skills, experience, work samples, languages the role needs, certifications, and what the applicant wrote about the role.
- Ignore and never mention name, gender, age, nationality, ethnicity, religion, marital status, disability, photos, or which university someone attended unless the role explicitly requires a qualification.
- Do not penalise career breaks, non-traditional paths, or a CV's design.
- If the CV is missing or unreadable, say so and judge only what the form shows; lower your confidence rather than guessing.
- Scores: 75+ strong (clearly meets most requirements), 45-74 possible (some matches, open questions), under 45 weak (little evidence for the core requirements).
- Be specific and brief. British spelling.`;

export async function screenApplication(applicationId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const db = supabaseService();
  if (!db) return { ok: false, error: "Portal is not configured." };
  const apiKey = await anthropicKey();
  if (!apiKey) return { ok: false, error: "Add the Anthropic key in Settings to turn on fit checks." };

  const { data: app } = await db.from("applications").select("*").eq("id", applicationId).maybeSingle();
  if (!app) return { ok: false, error: "Application not found." };
  const { data: role } = app.role_id
    ? await db.from("roles").select("title, department, location, terms, summary, description").eq("id", app.role_id).maybeSingle()
    : { data: null };

  const roleText = role
    ? `Title: ${role.title}\nDepartment: ${role.department}\nLocation: ${role.location}\nTerms: ${role.terms}\nSummary: ${role.summary}\n\n${role.description || "(No full description yet; judge against the title and summary.)"}`
    : `Title: ${app.role_title}\n(The role has since been removed; judge against the title.)`;

  const answers = [
    app.location && `Location: ${app.location}`,
    app.linkedin && `LinkedIn or portfolio: ${app.linkedin}`,
    app.cover_note && `Why this role:\n${app.cover_note}`,
  ]
    .filter(Boolean)
    .join("\n");

  // PDF CVs go to Claude as documents; Word files can't be read directly, so the form answers carry the check.
  const content: Anthropic.Beta.BetaContentBlockParam[] = [];
  let cvNote = "No CV attached.";
  if (app.cv_path?.endsWith(".pdf")) {
    const { data: file } = await db.storage.from("cvs").download(app.cv_path);
    if (file) {
      content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: Buffer.from(await file.arrayBuffer()).toString("base64") } });
      cvNote = "The CV is attached above as a PDF.";
    }
  } else if (app.cv_path) {
    cvNote = "The CV is a Word file that could not be read here; judge from the form answers.";
  }
  content.push({
    type: "text",
    text: `The role:\n${roleText}\n\nThe application form:\n${answers || "(No extra answers.)"}\n\n${cvNote}\n\nGive your fit check.`,
  });

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.beta.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      output_config: { effort: "medium", format: betaZodOutputFormat(Fit) },
      // If the model declines, the API retries on a fallback model in the same call.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system,
      messages: [{ role: "user", content }],
    });
    const fit = response.parsed_output;
    if (response.stop_reason === "refusal" || !fit) throw new Error("No fit check returned.");
    await db
      .from("applications")
      .update({
        fit_score: fit.score,
        fit_label: fit.label,
        fit_summary: fit.summary,
        fit_strengths: fit.strengths.slice(0, 4),
        fit_gaps: fit.gaps.slice(0, 4),
        fit_questions: fit.questions.slice(0, 3),
        fit_checked_at: new Date().toISOString(),
        fit_error: null,
      })
      .eq("id", applicationId);
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Anthropic.AuthenticationError
        ? "The Anthropic key was rejected. Replace it in Settings."
        : error instanceof Anthropic.RateLimitError
          ? "Too many checks at once. Try again in a minute."
          : "The fit check didn't finish. Try again.";
    if (error instanceof Anthropic.APIError) console.error("screening: API error", error.status, error.message);
    await db.from("applications").update({ fit_error: message, fit_checked_at: new Date().toISOString() }).eq("id", applicationId);
    return { ok: false, error: message };
  }
}
