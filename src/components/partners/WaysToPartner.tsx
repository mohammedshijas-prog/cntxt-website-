"use client";

import { useState } from "react";
import styles from "./partner.module.css";

const items = [
  {
    number: "01",
    title: "Technology & cloud partners",
    body: "We work with cloud and hardware providers so customers can run AI on infrastructure they control: on-premises, hybrid or cloud, with in-region hosting. Our technology partners today are Oracle, NVIDIA and AWS.",
  },
  {
    number: "02",
    title: "Commercial & delivery partners",
    body: "Bring CNTXT into your client engagements. We work alongside your team from discovery through build to sign-off, on custom AI integrated with enterprise and government systems.",
  },
  {
    number: "03",
    title: "Data partners",
    body: "Help capture and label real-world data. Your teams record the work they already do, or annotate text, image, audio and video. Every submission is confirmed by human review.",
  },
  {
    number: "04",
    title: "Research partners",
    body: "Joint research on Arabic speech, AI evaluation and physical AI data. Our research and ecosystem partners include the Technology Innovation Institute, AI71, Beam and Middlesex University Dubai.",
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
          Four ways to work with us,{" "}
          <span>from infrastructure to research.</span>
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
          src="/art/partners.svg"
          alt="Product interface showing a company context check"
        />
      </div>
    </section>
  );
}
