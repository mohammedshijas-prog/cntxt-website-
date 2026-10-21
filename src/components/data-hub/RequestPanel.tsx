"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { CatalogueItem } from "./DataHubPage";
import styles from "./data-hub.module.css";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Download link for a dataset's sample, when the team has uploaded one. */
export function SampleLink({ item }: { item: { sample_url?: string | null; sample_name?: string | null; title: string } }) {
  if (!item.sample_url) return null;
  return (
    <a className={styles.sample} href={item.sample_url} target="_blank" rel="noopener noreferrer" download={item.sample_name ?? undefined}>
      Download sample <span aria-hidden="true">↓</span>
    </a>
  );
}

/** The request: who is asking and what for, sent to /api/data-request and tracked in the portal. */
export function RequestPanel({ items, onClose, onSent }: { items: CatalogueItem[]; onClose: () => void; onSent: () => void }) {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);

  // Open once; keep the latest close handler without reopening the dialog.
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (!node.open) node.showModal();
    const close = () => closeRef.current();
    node.addEventListener("close", close);
    return () => node.removeEventListener("close", close);
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setState("sending");
    try {
      const response = await fetch("/api/data-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, datasets: items.map((item) => item.id), page: window.location.pathname }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Something went wrong. Please try again.");
      setState("sent");
      onSent();
      // For Google Tag Manager: a dataset request, with what was asked for.
      window.dataLayer?.push({ event: "dataset_request_submit", datasets: items.map((item) => item.title).join(", "), count: items.length });
    } catch (problem) {
      setState("idle");
      setError(problem instanceof Error ? problem.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <dialog ref={dialog} className={styles.panel} aria-labelledby="request-title">
      <button type="button" className={styles.panelClose} aria-label="Close" onClick={() => dialog.current?.close()}>
        ×
      </button>
      {state === "sent" ? (
        <div className={styles.panelBody} role="status">
          <span className={styles.panelDone} aria-hidden="true">
            ✓
          </span>
          <h2 id="request-title">Request received</h2>
          <p>Our data team will review what you asked for and email you to scope it.</p>
          <button type="button" className={styles.panelPrimary} onClick={() => dialog.current?.close()}>
            Back to the catalogue
          </button>
        </div>
      ) : (
        <form className={styles.panelBody} onSubmit={submit}>
          <h2 id="request-title">Request {items.length === 1 ? "this dataset" : `these ${items.length} datasets`}</h2>
          <ul className={styles.panelList}>
            {items.map((item) => (
              <li key={item.id}>
                <b>{item.category}</b> {item.title}
              </li>
            ))}
          </ul>
          <div className={styles.panelTwo}>
            <label>
              Name *
              <input name="name" required autoComplete="name" maxLength={120} />
            </label>
            <label>
              Work email *
              <input name="email" type="email" required autoComplete="email" maxLength={160} />
            </label>
          </div>
          <label>
            Company
            <input name="company" autoComplete="organization" maxLength={160} />
          </label>
          <label>
            What will you use it for? <span>Volume, languages, timeline</span>
            <textarea name="message" rows={3} maxLength={2000} />
          </label>
          <input className={styles.trap} name="company_url" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          {error ? (
            <p className={styles.panelError} role="alert">
              {error}
            </p>
          ) : null}
          <button className={styles.panelPrimary} disabled={state === "sending"}>
            {state === "sending" ? "Sending…" : "Send request"}
          </button>
        </form>
      )}
    </dialog>
  );
}
