"use client";

import { useState } from "react";
import styles from "./dataTypes.module.css";

/* Datasets named here are the ones listed in the Data Hub. Also the catalogue's illustrative samples. */
export const modalities = [
  {
    name: "Text",
    sample: `{
  "text": "افتتح المعرض في دبي يوم الأحد",
  "entities": [
    { "span": "دبي", "type": "LOCATION" },
    { "span": "يوم الأحد", "type": "DATE" }
  ],
  "sentiment": "neutral",
  "reviewed_by": "native annotator"
}`,
    image: "/brand/product/label-text.webp",
    summary: "Entities, sentiment, moderation and preference labels, in Arabic and English.",
    labels: ["Named entities", "Sentiment", "Content moderation", "Ranked model responses"],
    datasets: ["Sentiment and entity labels", "Content moderation labels", "Ranked model responses"],
    category: "Text",
  },
  {
    name: "Speech & audio",
    sample: `{
  "audio": "call_0417.wav",
  "dialect": "Emirati",
  "segments": [
    { "speaker": "A", "start": 0.4, "end": 2.1,
      "text": "مرحبا، أبي أغيّر موعدي" },
    { "speaker": "B", "start": 2.3, "end": 4.0,
      "text": "Sure, which day suits you?",
      "code_switch": true }
  ]
}`,
    image: "/brand/product/label-audio.webp",
    summary: "Arabic speech transcribed across 25+ dialects, the data behind Munsit.",
    labels: ["Transcription", "Speaker diarisation", "Word-level timestamps", "Arabic–English code-switching"],
    datasets: ["Arabic conversational speech", "Transcribed audio"],
    category: "Audio",
  },
  {
    name: "Image",
    sample: `{
  "image": "shelf_0912.jpg",
  "objects": [
    { "label": "carton", "bbox": [412, 96, 188, 164] },
    { "label": "left hand", "bbox": [120, 210, 230, 190],
      "mask": "polygon" }
  ],
  "qa": "passed"
}`,
    image: "/brand/product/label-image.webp",
    summary: "Objects found and outlined by trained annotators, with human-in-the-loop quality checks.",
    labels: ["Bounding boxes", "Segmentation masks", "Classification"],
    datasets: ["Annotated images"],
    category: "Image",
  },
  {
    name: "Video",
    sample: `{
  "clip": "warehouse_pick_031.mp4",
  "view": "first-person",
  "actions": [
    { "t": [0.0, 1.8], "step": "reach to the shelf" },
    { "t": [1.8, 3.2], "step": "pick the carton" },
    { "t": [3.2, 5.6], "step": "place on the bench" }
  ],
  "hands": "tracked", "consent": true
}`,
    image: "/brand/product/label-video.webp",
    summary: "First-person video of real work, broken into the actions a robot has to learn.",
    labels: ["Action labels", "Hand and object marks", "Step segmentation", "Bounding boxes"],
    datasets: ["Action-labelled video", "First-person video of warehouse work", "First-person video of service work"],
    category: "Video",
  },
  {
    name: "3D & LiDAR",
    sample: `{
  "sweep": "lidar_frame_2208.pcd",
  "points": 118204,
  "objects": [
    { "label": "forklift", "box3d": {
        "center": [4.2, -1.1, 0.9],
        "size": [2.4, 1.2, 2.1], "yaw": 0.31 } }
  ],
  "synced_camera": "front_01.jpg"
}`,
    image: "/art/lines/perception.webp",
    summary: "Point clouds labelled alongside camera frames for perception systems.",
    labels: ["LiDAR point clouds", "Bounding boxes", "Segmentation masks"],
    datasets: ["Annotated LiDAR"],
    category: "3D",
  },
  {
    name: "Documents",
    sample: `{
  "page": "form_scan_0021.png",
  "language": "ar",
  "handwriting": true,
  "fields": {
    "الاسم": "…",
    "التاريخ": "…",
    "رقم المرجع": "…"
  },
  "doc_type": "application form"
}`,
    image: "/art/annotation.svg",
    summary: "Handwritten and printed pages turned into structured, searchable data.",
    labels: ["Handwriting transcription", "Field extraction", "Document classification"],
    datasets: ["Handwritten Arabic pages"],
    category: "Document",
  },
];

/** Encord/Scale-style modality tabs: what we label, an example, and real datasets. */
export function DataTypes() {
  const [active, setActive] = useState(0);
  const item = modalities[active];
  return (
    <section className={styles.section} aria-labelledby="types-heading">
      <header className={styles.head}>
        <div>
          <p className={styles.kicker}>Supported data types</p>
          <h2 id="types-heading">Every data type, labelled by people.</h2>
        </div>
      </header>
      <div className={styles.tabs} role="tablist" aria-label="Data types">
        {modalities.map((modality, index) => (
          <button
            key={modality.name}
            type="button"
            role="tab"
            id={`type-tab-${index}`}
            aria-selected={index === active}
            aria-controls="type-panel"
            className={index === active ? styles.tabActive : ""}
            onClick={() => setActive(index)}
          >
            {modality.name}
          </button>
        ))}
      </div>
      <div className={styles.panel} id="type-panel" role="tabpanel" aria-labelledby={`type-tab-${active}`}>
        <div key={item.name} className={styles.example}>
          <img loading="lazy" decoding="async" src={item.image} alt={`${item.name} labelling example`} />
        </div>
        <div key={`${item.name}-copy`} className={styles.copy}>
          <h3>{item.name}</h3>
          <p>{item.summary}</p>
          <p className={styles.listTitle}>What we label</p>
          <ul className={styles.labels}>
            {item.labels.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
          <div className={styles.record}>
            <p>
              <span>Sample record</span>
              <em>Illustrative, not customer data</em>
            </p>
            <pre>
              <code>{item.sample}</code>
            </pre>
          </div>
          <a href={`/data-hub?category=${encodeURIComponent(item.category)}`}>
            Explore {item.name.toLowerCase()} data <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* Published results only (docs/content-brief.md); clients are unnamed. */
const cases = [
  { sector: "Financial services", title: "Contract compliance review", stats: [["85%", "faster reviews"], ["60%", "faster application processing"]], href: "/industries/financial-services" },
  { sector: "Insurance", title: "Claims checked as they are submitted", stats: [["72%", "estimated cut in rejections"], ["60%", "less processing time"]], href: "/industries/insurance" },
  { sector: "Real estate", title: "Real estate operations", stats: [["22%", "faster reviews"], ["28%", "less legal workload"]], href: "/industries/real-estate" },
  { sector: "Physical AI", title: "Vision data for humanoid robots", stats: [["1.8M", "frames annotated"], ["6", "months"]], href: "/physical-ai/robotics-humanoids" },
  { sector: "HR", title: "Hiring across 3,000+ CVs", stats: [["32%", "faster hiring and onboarding"], ["21%", "lower admin cost"]], href: "/contact?topic=Custom%20AI%20solutions" },
  { sector: "Supply chain", title: "Supply chain processing", stats: [["23%", "faster processing"], ["17%", "fewer data-entry errors (projected)"]], href: "/contact?topic=Custom%20AI%20solutions" },
];

export function CaseStudies() {
  return (
    <section className={styles.section} aria-labelledby="cases-heading">
      <header className={styles.head}>
        <div>
          <p className={styles.kicker}>Case studies</p>
          <h2 id="cases-heading">Results already delivered.</h2>
        </div>
      </header>
      <ul className={styles.cases} data-rail>
        {cases.map((item) => (
          <li key={item.title}>
            <a href={item.href} data-tilt>
              <span className={styles.sector}>{item.sector}</span>
              <strong>{item.title}</strong>
              <span className={styles.stats}>
                {item.stats.map(([value, label]) => (
                  <span key={label}>
                    <b>{value}</b>
                    {label}
                  </span>
                ))}
              </span>
              <em>
                {item.href.startsWith("/contact") ? "Speak to an expert" : "Read case study"} <span aria-hidden="true">→</span>
              </em>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
