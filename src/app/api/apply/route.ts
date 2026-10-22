import { after } from "next/server";
import { limited } from "@/lib/rateLimit";
import { screenApplication } from "@/lib/screening";
import { supabaseService } from "@/lib/supabase/server";

const types: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};
const maxBytes = 10 * 1024 * 1024;
const text = (value: FormDataEntryValue | null, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

// Leaves time for the background fit check after the response.
export const maxDuration = 60;

/** A job application: details into `applications`, the CV into the private `cvs` bucket. */
const DAILY_AUTO_CHECKS = 300;

export async function POST(request: Request) {
  const db = supabaseService();
  if (!db) return Response.json({ error: "Applications are closed for maintenance. Please try again later." }, { status: 503 });

  const form = await request.formData().catch(() => null);
  if (!form) return Response.json({ error: "Please fill in the form." }, { status: 400 });
  // Honeypot: people leave it empty. Pretend success so bots learn nothing.
  if (text(form.get("company_url"), 200)) return Response.json({ ok: true });

  const name = text(form.get("name"), 120);
  const email = text(form.get("email"), 160).toLowerCase();
  if (!name) return Response.json({ error: "Enter your full name." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  if (form.get("consent") !== "on") return Response.json({ error: "Please agree to how we store your application." }, { status: 400 });
  const linkedin = text(form.get("linkedin"), 300);
  if (linkedin && !/^https?:\/\//i.test(linkedin)) return Response.json({ error: "Your LinkedIn or portfolio link should start with https://" }, { status: 400 });

  const { data: role } = await db.from("roles").select("id, title").eq("slug", text(form.get("role"), 120)).eq("status", "open").maybeSingle();
  if (!role) return Response.json({ error: "This role is no longer open." }, { status: 404 });

  const cv = form.get("cv");
  if (!(cv instanceof File) || cv.size === 0) return Response.json({ error: "Attach your CV." }, { status: 400 });
  if (cv.size > maxBytes) return Response.json({ error: "Your CV is larger than 10 MB." }, { status: 400 });
  const ext = cv.name.split(".").pop()?.toLowerCase() ?? "";
  if (!types[ext]) return Response.json({ error: "Attach your CV as a PDF or Word document." }, { status: 400 });
  // Check the file really is what its name says (PDF: %PDF, DOCX: zip, DOC: OLE).
  const head = new Uint8Array(await cv.slice(0, 8).arrayBuffer());
  const magic = Array.from(head.slice(0, 4), (b) => b.toString(16).padStart(2, "0")).join("");
  const real = (ext === "pdf" && magic === "25504446") || (ext === "docx" && magic === "504b0304") || (ext === "doc" && magic === "d0cf11e0");
  if (!real) return Response.json({ error: "That file does not look like a PDF or Word document." }, { status: 400 });
  // Count only applications that passed every check, so fixing a typo never locks anyone out.
  if (limited(request)) return Response.json({ error: "Too many applications from this connection. Please try again later." }, { status: 429 });

  const { data: application, error } = await db
    .from("applications")
    .insert({
      role_id: role.id,
      role_title: role.title,
      name,
      email,
      phone: text(form.get("phone"), 40) || null,
      location: text(form.get("location"), 120) || null,
      linkedin: linkedin || null,
      cover_note: text(form.get("note"), 2000) || null,
    })
    .select("id")
    .single();
  if (error || !application) {
    console.error("apply: insert failed", error?.message);
    return Response.json({ error: "We could not save your application. Please try again." }, { status: 500 });
  }

  const safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "cv";
  const path = `${application.id}/${safeName}-cv.${ext}`;
  const upload = await db.storage.from("cvs").upload(path, cv, { contentType: types[ext], upsert: false });
  if (upload.error) {
    console.error("apply: cv upload failed", upload.error.message);
    await db.from("applications").delete().eq("id", application.id);
    return Response.json({ error: "We could not upload your CV. Please try again." }, { status: 500 });
  }
  await db.from("applications").update({ cv_path: path }).eq("id", application.id);

  // The fit check runs after the applicant has their answer, so they never wait on it.
  // Automatic checks stop at a daily cap so a flood of applications can't run up
  // the AI bill; HR can still check any application by hand.
  after(async () => {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await db.from("applications").select("id", { count: "exact", head: true }).gte("fit_checked_at", since);
    if ((count ?? 0) >= DAILY_AUTO_CHECKS) return;
    await screenApplication(application.id);
  });

  return Response.json({ ok: true });
}
