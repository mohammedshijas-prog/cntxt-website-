"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import styles from "./role.module.css";

const accepted = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const maxBytes = 10 * 1024 * 1024;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** The application: details, CV and consent, sent to /api/apply. */
export function ApplyForm({ roleSlug, roleTitle }: { roleSlug: string; roleTitle: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [sentTo, setSentTo] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const cv = data.get("cv");
    if (!(cv instanceof File) || cv.size === 0) return setError("Attach your CV.");
    if (cv.size > maxBytes) return setError("Your CV is larger than 10 MB. Please attach a smaller file.");
    if (!/\.(pdf|docx?)$/i.test(cv.name)) return setError("Attach your CV as a PDF or Word document.");
    data.set("role", roleSlug);
    setState("sending");
    try {
      const response = await fetch("/api/apply", { method: "POST", body: data });
      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Something went wrong. Please try again.");
      setSentTo(String(data.get("email") ?? ""));
      setState("sent");
      // For Google Tag Manager: a completed application, by role.
      window.dataLayer?.push({ event: "job_application_submit", role: roleTitle });
      form.reset();
    } catch (problem) {
      setState("idle");
      setError(problem instanceof Error ? problem.message : "Something went wrong. Please try again.");
    }
  };

  if (state === "sent") {
    return (
      <div className={styles.card} role="status">
        <span className={styles.done} aria-hidden="true">
          ✓
        </span>
        <h2>Application received</h2>
        <p>
          Thank you for applying for <strong>{roleTitle}</strong>. A person on the team will review it, and we will
          email you{sentTo ? ` at ${sentTo}` : ""} about the next step.
        </p>
        <Link className={styles.secondary} href="/careers#openings">
          See other open roles
        </Link>
      </div>
    );
  }

  return (
    <form className={styles.card} onSubmit={submit} noValidate={false}>
      <h2>Apply for this role</h2>
      <p className={styles.hint}>Fields marked * are required.</p>

      <label>
        Full name *
        <input name="name" required autoComplete="name" maxLength={120} />
      </label>
      <label>
        Email *
        <input name="email" type="email" required autoComplete="email" maxLength={160} />
      </label>
      <div className={styles.two}>
        <label>
          Phone
          <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </label>
        <label>
          Location
          <input name="location" autoComplete="address-level2" placeholder="City, country" maxLength={120} />
        </label>
      </div>
      <label>
        LinkedIn or portfolio
        <input name="linkedin" type="url" inputMode="url" placeholder="https://" maxLength={300} />
      </label>
      <label className={styles.file}>
        CV *<span>PDF or Word, up to 10 MB</span>
        <input
          name="cv"
          type="file"
          required
          accept={accepted}
          onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
        />
        <b aria-hidden="true">{fileName || "Choose a file"}</b>
      </label>
      <label>
        Why this role? <span>(optional)</span>
        <textarea name="note" rows={4} maxLength={2000} />
      </label>
      {/* Left empty by people; bots fill it in. */}
      <input className={styles.trap} name="company_url" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className={styles.consent}>
        <input name="consent" type="checkbox" required />
        <span>
          I agree that CNTXT AI may store my application to assess it for this role, as described in the{" "}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            privacy policy
          </a>
          .
        </span>
      </label>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      <button className={styles.primary} disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Submit application"}
      </button>
    </form>
  );
}
