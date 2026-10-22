"use client";

import { useEffect, useRef, useState } from "react";
import { modalities } from "../products/DataTypes";
import type { CatalogueItem } from "./DataHubPage";
import styles from "./data-hub.module.css";

/* Evaluation has no tab on the AI Lab page, so its illustrative record lives here. */
const evaluationSample = {
  image: "/art/ranking.svg",
  sample: `{
  "prompt": "ما هي شروط استرداد الرسوم؟",
  "responses": [
    { "id": "A", "rank": 1, "note": "Cites the policy, answers in Arabic" },
    { "id": "B", "rank": 2, "note": "Correct, but answers in English" },
    { "id": "C", "rank": 3, "note": "States a figure not in the source" }
  ],
  "evaluator": "financial domain expert",
  "agreement": "2 of 2 reviewers"
}`,
};

function illustrative(category: string) {
  if (category === "Evaluation") return evaluationSample;
  return modalities.find((item) => item.category === category) ?? modalities[0];
}

const kindOf = (name: string) => {
  const ext = name.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return "image";
  if (["mp4", "webm", "mov"].includes(ext)) return "video";
  if (["mp3", "wav", "m4a", "ogg"].includes(ext)) return "audio";
  if (ext === "pdf") return "pdf";
  if (["json", "jsonl", "csv", "txt"].includes(ext)) return "text";
  return "file";
};

/** Text samples: the first lines, so a large file never floods the page. */
function TextSample({ url }: { url: string }) {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    fetch(url)
      .then((response) => response.text())
      .then((body) => {
        if (!live) return;
        const lines = body.split("\n");
        setText(lines.slice(0, 60).join("\n") + (lines.length > 60 ? `\n… ${lines.length - 60} more lines in the download` : ""));
      })
      .catch(() => live && setText("Couldn't load a preview. Use the download link below."));
    return () => {
      live = false;
    };
  }, [url]);
  return <pre className={styles.sampleCode}>{text ?? "Loading…"}</pre>;
}

/** A dataset's sample, previewed on the page: the uploaded file when there is one, otherwise an illustrative record. */
export function SampleViewer({
  item,
  requested,
  others,
  onToggle,
  onRequest,
  onClose,
}: {
  item: CatalogueItem;
  requested: boolean;
  /** Other datasets already in the request. */
  others: number;
  onToggle: () => void;
  /** Add this dataset (if needed) and go straight to the request form. */
  onRequest: () => void;
  onClose: () => void;
}) {
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

  const url = item.sample_url;
  const kind = url ? kindOf(item.sample_name ?? url) : null;
  const fallback = illustrative(item.category);

  return (
    <dialog ref={dialog} className={`${styles.panel} ${styles.samplePanel}`} aria-labelledby="sample-title">
      <button type="button" className={styles.panelClose} aria-label="Close" onClick={() => dialog.current?.close()}>
        ×
      </button>
      <div className={styles.panelBody}>
        <p className={styles.sampleTag}>
          {item.category} · {item.kind === "captured" ? "Captured data" : "Labelled data"}
        </p>
        <h2 id="sample-title">{item.title}</h2>
        <p>{item.blurb}</p>

        <div className={styles.sampleStage}>
          {url && kind === "image" ? <img src={url} alt={`Sample from ${item.title}`} /> : null}
          {url && kind === "video" ? <video src={url} controls playsInline preload="metadata" /> : null}
          {url && kind === "audio" ? <audio src={url} controls preload="metadata" /> : null}
          {url && kind === "pdf" ? <iframe src={url} title={`Sample from ${item.title}`} /> : null}
          {url && kind === "text" ? <TextSample url={url} /> : null}
          {url && kind === "file" ? <p className={styles.sampleNote}>This sample is a {item.sample_name?.split(".").pop()?.toUpperCase()} file. Download it to look inside.</p> : null}
          {!url ? (
            <div className={styles.sampleIllustrative}>
              <img src={fallback.image} alt="" />
              <pre className={styles.sampleCode}>{fallback.sample}</pre>
            </div>
          ) : null}
        </div>
        <p className={styles.sampleNote}>
          {url ? "A real sample from this dataset." : "Illustrative record showing the format and labels. Not customer data. Ask us for a real sample."}
        </p>

        <div className={styles.sampleActions}>
          <button
            type="button"
            className={styles.panelPrimary}
            onClick={() => {
              // Close the sample first, then open the request form in its place: one step, no back-and-forth.
              dialog.current?.close();
              onRequest();
            }}
          >
            {others > 0 ? `Request ${others + 1} datasets` : "Request this dataset"} <span aria-hidden="true">→</span>
          </button>
          <button type="button" className={styles.sampleSecondary} aria-pressed={requested} onClick={onToggle}>
            {requested ? "Added ✓ · keep browsing" : "Add and keep browsing"}
          </button>
          {url ? (
            <a className={styles.sample} href={url} target="_blank" rel="noopener noreferrer" download={item.sample_name ?? undefined}>
              Download sample <span aria-hidden="true">↓</span>
            </a>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
