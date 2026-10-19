"use client";

import { useEffect, useRef, useState } from "react";
import { iconPaths } from "../shared/graphics";
import { useSwipe } from "@/lib/useSwipe";
import styles from "./dataFactory.module.css";

type Glyph = string;

function Glyph({ name, size = 18 }: { name: Glyph; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

/* Every figure below is from docs/content-brief.md. */
const stations = [
  {
    key: "capture",
    name: "Capture",
    title: "Real work, recorded with consent.",
    body: "Data starts where the work happens. Domain datasets, field collection and enterprise systems come in alongside first-person video captured through KLKT, on a phone, a Roboband or a wristband.",
    facts: ["67,795+ people on KLKT, in 20+ countries", "Consent in Arabic, English, Filipino and Urdu"],
    image: "/brand/klkt/roboband-hero.webp",
    glyph: "camera" as Glyph,
  },
  {
    key: "label",
    name: "Label",
    title: "Labelled by people who know the language.",
    body: "Native Arabic annotators across 25+ dialects mark up text, speech, images, video, LiDAR and documents: transcripts and speakers, boxes and masks, entities, actions and hand-object marks.",
    facts: ["25+ Arabic dialects", "Six data types, one workflow"],
    image: "/brand/product/label-image.webp",
    glyph: "image" as Glyph,
  },
  {
    key: "review",
    name: "Review",
    title: "Nothing ships without a second pair of eyes.",
    body: "Human-in-the-loop quality checks run on every project. Physical-AI recordings are reviewed before they are accepted, and accepted clips are labelled only after that.",
    facts: ["98% labelling accuracy", "Every accepted hour confirmed by a person"],
    image: "/art/annotation.svg",
    glyph: "check" as Glyph,
  },
  {
    key: "evaluate",
    name: "Evaluate",
    title: "Experts test the model, not just the data.",
    body: "Human AI evaluators with domain expertise score model output in biology, medicine, finance, code and two-language work. For retrieval systems, we publish RAGMeter, an open-source evaluation toolkit.",
    facts: ["Biology, medical, financial, coding and bilingual evaluators", "RAGMeter on PyPI"],
    image: "/brand/product/label-text.webp",
    glyph: "text" as Glyph,
  },
  {
    key: "deliver",
    name: "Deliver",
    title: "Into your training run, inside your walls.",
    body: "Verified datasets are delivered to your team, and the models trained on them are deployed on-premises, hybrid or in the cloud, with hosting and processing kept in region.",
    facts: ["30M+ data points annotated", "On-premises, hybrid or cloud"],
    image: "/art/deploy.svg",
    glyph: "lock" as Glyph,
  },
];

/**
 * The line, station by station. It advances on its own until someone picks a
 * station; a packet rides the rail to whichever station is open.
 */
export function FactoryLine() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const section = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const seen = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    seen.observe(node);
    return () => seen.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((value) => (value + 1) % stations.length), 5200);
    return () => clearInterval(id);
  }, [auto, inView]);

  const station = stations[active];
  const swipe = useSwipe(
    () => {
      setActive((value) => Math.min(stations.length - 1, value + 1));
      setAuto(false);
    },
    () => {
      setActive((value) => Math.max(0, value - 1));
      setAuto(false);
    },
  );
  const at = (active / (stations.length - 1)) * 100;

  return (
    <section ref={section} className={styles.line} aria-labelledby="line-heading">
      <header className={styles.lineHead}>
        <p className={styles.kicker}>The data factory</p>
        <h2 id="line-heading">Raw data in. Training-ready data out.</h2>
      </header>

      <div className={styles.rail} role="tablist" aria-label="Factory stations">
        <span className={styles.railTrack} aria-hidden="true">
          <span className={styles.railFill} style={{ width: `${at}%` }} />
          <span className={styles.railPacket} style={{ left: `${at}%` }} />
        </span>
        {stations.map((item, index) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            id={`station-${item.key}`}
            aria-selected={index === active}
            aria-controls="station-panel"
            className={`${styles.station} ${index === active ? styles.stationActive : ""} ${index < active ? styles.stationDone : ""}`}
            onClick={() => {
              setActive(index);
              setAuto(false);
            }}
          >
            <span className={styles.stationIcon}>
              <Glyph name={item.glyph} size={20} />
            </span>
            <span className={styles.stationName}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              {item.name}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.panel} id="station-panel" role="tabpanel" aria-labelledby={`station-${station.key}`} {...swipe}>
        <div key={station.key} className={styles.panelCopy}>
          <h3>{station.title}</h3>
          <p>{station.body}</p>
          <ul>
            {station.facts.map((fact) => (
              <li key={fact}>
                <Glyph name="check" size={16} />
                {fact}
              </li>
            ))}
          </ul>
        </div>
        <div key={`${station.key}-art`} className={styles.panelArt}>
          <img loading="lazy" decoding="async" src={station.image} alt="" />
          <span className={styles.stamp}>
            Station {String(active + 1).padStart(2, "0")} · {station.name}
          </span>
          {auto && inView ? <span className={styles.timer} key={`t-${active}`} aria-hidden="true" /> : null}
        </div>
      </div>
    </section>
  );
}

const crew = [
  { value: "25+", label: "Arabic dialects", body: "Native Arabic annotators label speech and text in the dialects people actually use." },
  { value: "67,795+", label: "People on KLKT", body: "Contributors in 20+ countries record real work, at work or at home, and are paid per accepted hour." },
  { value: "5", label: "Evaluator specialties", body: "Biology, medical, financial, coding and bilingual evaluators score model output." },
  { value: "4", label: "Expert domains", body: "Domain experts in finance, healthcare, logistics and government shape every dataset." },
];

/** The people on the line. */
export function FactoryCrew() {
  return (
    <section className={styles.crew} aria-labelledby="crew-heading">
      <header className={styles.lineHead}>
        <p className={styles.kicker}>The people on the line</p>
        <h2 id="crew-heading">A factory run by people, not just pipelines.</h2>
      </header>
      <ul data-rail>
        {crew.map((item) => (
          <li key={item.label} data-tilt>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
            <p>{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
