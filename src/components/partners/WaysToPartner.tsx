"use client";

import { useState } from "react";
import styles from "./partner.module.css";

const items = [
  {
    number: "01",
    title: "Technology & cloud partners",
    body: "Run CNTXT on the infrastructure your customers already trust. We co-build reference architectures, certify deployments on your cloud or hardware, and go to market together in regulated industries.",
  },
  {
    number: "02",
    title: "Solution / integration partners",
    body: "Deliver CNTXT inside your client engagements. We train your teams, share implementation playbooks and support you on delivery, so projects move from pilot to production faster.",
  },
  {
    number: "03",
    title: "Data & annotation partners",
    body: "Join the network that collects and labels real-world data. We provide the tooling, quality checks and steady volume; you bring domain experts and local reach.",
  },
  {
    number: "04",
    title: "Research & academic partners",
    body: "Work with us on open problems in evaluation, speech and physical AI. Partners get access to datasets, compute and co-authorship on published research.",
  },
];

export function WaysToPartner() {
  const [open, setOpen] = useState(0);

  return (
    <section className={styles.ways} aria-labelledby="ways-heading">
      <div className={styles.waysIntro}>
        <p className={styles.eyebrow}>
          <span className={styles.tag} aria-hidden="true" />
          Ways to partner
        </p>
        <h2 id="ways-heading">
          Three things have to be in place before a question{" "}
          <span>can be answered properly.</span>
        </h2>
      </div>
      <div className={styles.waysGrid}>
        <div className={styles.accordion}>
          {items.map((item, index) => {
            const expanded = open === index;
            return (
              <div key={item.number} className={styles.accordionItem}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? -1 : index)}
                >
                  <span>{item.number}</span>
                  {item.title}
                </button>
                {expanded && item.body ? <p>{item.body}</p> : null}
              </div>
            );
          })}
        </div>
        <img
          className={styles.waysArt}
          src="/partners/ways.png"
          alt="Product interface showing a company context check"
        />
      </div>
    </section>
  );
}
