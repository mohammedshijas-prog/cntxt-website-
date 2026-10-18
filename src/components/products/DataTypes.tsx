"use client";

import { useState } from "react";
import styles from "./dataTypes.module.css";

/* Datasets named here are the ones listed in the Data Hub. */
const modalities = [
  {
    name: "Text",
    image: "/brand/product/label-text.webp",
    summary: "Entities, sentiment, moderation and preference labels, in Arabic and English.",
    labels: ["Named entities", "Sentiment", "Content moderation", "Ranked model responses"],
    datasets: ["Sentiment and entity labels", "Content moderation labels", "Ranked model responses"],
    category: "Text",
  },
  {
    name: "Speech & audio",
    image: "/brand/product/label-audio.webp",
    summary: "Arabic speech transcribed across 25+ dialects, the data behind Munsit.",
    labels: ["Transcription", "Speaker diarisation", "Word-level timestamps", "Arabic–English code-switching"],
    datasets: ["Arabic conversational speech", "Transcribed audio"],
    category: "Audio",
  },
  {
    name: "Image",
    image: "/brand/product/label-image.webp",
    summary: "Objects found and outlined by trained annotators, with human-in-the-loop quality checks.",
    labels: ["Bounding boxes", "Segmentation masks", "Classification"],
    datasets: ["Annotated images"],
    category: "Image",
  },
  {
    name: "Video",
    image: "/brand/product/label-video.webp",
    summary: "First-person video of real work, broken into the actions a robot has to learn.",
    labels: ["Action labels", "Hand and object marks", "Step segmentation", "Bounding boxes"],
    datasets: ["Action-labelled video", "First-person video of warehouse work", "First-person video of service work"],
    category: "Video",
  },
  {
    name: "3D & LiDAR",
    image: "/art/lines/perception.webp",
    summary: "Point clouds labelled alongside camera frames for perception systems.",
    labels: ["LiDAR point clouds", "Bounding boxes", "Segmentation masks"],
    datasets: ["Annotated LiDAR"],
    category: "3D",
  },
  {
    name: "Documents",
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
        <p className={styles.lead}>98% labelling accuracy, with human-in-the-loop quality checks on every project.</p>
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
          <img src={item.image} alt={`${item.name} labelling example`} />
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
          <p className={styles.listTitle}>Example datasets</p>
          <ul className={styles.datasets}>
            {item.datasets.map((dataset) => (
              <li key={dataset}>{dataset}</li>
            ))}
          </ul>
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
          <h2 id="cases-heading">Results from work already delivered.</h2>
        </div>
        <p className={styles.lead}>Published outcomes from our projects, with clients unnamed.</p>
      </header>
      <ul className={styles.cases}>
        {cases.map((item) => (
          <li key={item.title}>
            <a href={item.href}>
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
