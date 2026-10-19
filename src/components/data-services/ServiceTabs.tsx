"use client";

import { useState } from "react";
import { useSwipe } from "@/lib/useSwipe";
import styles from "./dataServices.module.css";

/* Every line below restates docs/content-brief.md (data sourcing, preparation, TestAI, KLKT). */
const services = [
  {
    tab: "Collection",
    title: "Data sourced for your model, not pulled off a shelf.",
    points: [
      "Domain-specific datasets",
      "Field collection, in the places the work happens",
      "Integration with your enterprise systems",
      "Synthetic data in controlled environments",
    ],
    cta: { label: "Talk to us about a collection", href: "/contact?topic=Data+services&about=Collection" },
    sample: "collection",
  },
  {
    tab: "Annotation",
    title: "Labelled by people who know the language and the domain.",
    points: [
      "Audio: transcription, timestamps, speaker diarisation",
      "Image: bounding boxes, segmentation masks",
      "Text: sentiment, entities, content moderation",
      "Video: action labelling, LiDAR annotation",
    ],
    cta: { label: "Talk to us about labelling", href: "/contact?topic=Data+services&about=Annotation" },
    sample: "annotation",
  },
  {
    tab: "Evaluation",
    title: "Experts who judge the model's answers.",
    points: [
      "Eval ranking and prompt annotation",
      "Biology, medical, financial, coding and bilingual evaluators",
      "Bias, reliability and compliance checks before deployment",
      "RAGMeter, our open-source RAG evaluation toolkit",
    ],
    cta: { label: "Request an evaluation", href: "/contact?topic=Data+services&about=Evaluation" },
    sample: "evaluation",
  },
  {
    tab: "Physical AI",
    title: "First-person video of real work, recorded with consent.",
    points: [
      "Recorded on a phone, a Roboband or a wristband",
      "67,795+ people on KLKT, in 20+ countries",
      "Every accepted hour reviewed by a person, then labelled",
      "1.8M annotated frames in six months for a GCC robotics lab",
    ],
    cta: { label: "Explore Physical AI data", href: "/physical-ai" },
    sample: "physical",
  },
] as const;

function Sample({ kind }: { kind: (typeof services)[number]["sample"] }) {
  if (kind === "collection") {
    return (
      <div className={styles.collect}>
        {[
          ["Domain datasets", "Finance · Healthcare · Logistics · Government"],
          ["Field collection", "Recorded on site, with consent"],
          ["Enterprise systems", "Integrated where your data lives"],
          ["Synthetic data", "Generated in controlled environments"],
        ].map(([name, note], i) => (
          <div key={name} style={{ animationDelay: `${i * 90}ms` }}>
            <b>{name}</b>
            <span>{note}</span>
          </div>
        ))}
        <p className={styles.collectOut}>One dataset, built to your spec</p>
      </div>
    );
  }
  if (kind === "annotation") {
    return (
      <ul className={styles.labels}>
        {[
          ["label-audio", "Audio · transcribed"],
          ["label-image", "Image · boxes"],
          ["label-text", "Text · entities"],
          ["label-video", "Video · actions"],
        ].map(([file, caption]) => (
          <li key={file}>
            <img loading="lazy" decoding="async" src={`/brand/product/${file}.webp`} alt="" />
            <span>{caption}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (kind === "evaluation") {
    return (
      <div className={styles.rank}>
        <p className={styles.rankPrompt}>Prompt · Which answer is better?</p>
        {[
          ["A", "Cites the clause and answers in the user's dialect.", "Preferred"],
          ["B", "Correct, but answers in English to an Arabic question.", "Second"],
          ["C", "States a figure that is not in the source.", "Flagged"],
        ].map(([key, text, verdict]) => (
          <div key={key} className={styles.rankRow} data-verdict={verdict}>
            <b>{key}</b>
            <span>{text}</span>
            <em>{verdict}</em>
          </div>
        ))}
      </div>
    );
  }
  return (
    <figure className={styles.ego}>
      <img loading="lazy" decoding="async" src="/art/ego-shelf-pick.webp" alt="" />
      <figcaption>
        <span>Pick item · left hand</span>
        <span>Accepted ✓</span>
      </figcaption>
    </figure>
  );
}

/** The four service lines, one tab each, with a sample of the work. */
export function ServiceTabs() {
  const [active, setActive] = useState(0);
  const service = services[active];
  const swipe = useSwipe(
    () => setActive((value) => Math.min(services.length - 1, value + 1)),
    () => setActive((value) => Math.max(0, value - 1)),
  );

  return (
    <section className={styles.section} aria-labelledby="services-heading">
      <header className={styles.head}>
        <p className={styles.kicker}>What we do</p>
        <h2 id="services-heading">Four services, one data partner.</h2>
      </header>

      <div className={styles.tabs} role="tablist" aria-label="Data services">
        {services.map((item, index) => (
          <button
            key={item.tab}
            type="button"
            role="tab"
            id={`service-tab-${index}`}
            aria-selected={index === active}
            aria-controls="service-panel"
            className={index === active ? styles.on : ""}
            onClick={() => setActive(index)}
          >
            {item.tab}
          </button>
        ))}
      </div>

      <div className={styles.panel} id="service-panel" role="tabpanel" aria-labelledby={`service-tab-${active}`} {...swipe}>
        <div key={service.tab} className={styles.copy}>
          <h3>{service.title}</h3>
          <ul>
            {service.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <a className={styles.cta} href={service.cta.href}>
            {service.cta.label} <span aria-hidden="true">→</span>
          </a>
        </div>
        <div key={`${service.tab}-sample`} className={styles.visual} aria-hidden="true">
          <Sample kind={service.sample} />
        </div>
      </div>
    </section>
  );
}
