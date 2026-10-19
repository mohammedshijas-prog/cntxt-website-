"use client";

import { useState } from "react";
import { useSwipe } from "@/lib/useSwipe";
import styles from "./ways.module.css";

/* Facts from docs/content-brief.md (partners, delivery, data, research). */
const ways = [
  {
    tab: "Technology",
    title: "Run AI on infrastructure customers control.",
    points: ["On-premises, hybrid or cloud", "In-region hosting", "NVIDIA Inception member"],
    href: "#apply",
  },
  {
    tab: "Delivery",
    title: "Bring CNTXT into your client work.",
    points: ["Discovery to sign-off", "Enterprise and government systems", "Two build phases, reviewed"],
    href: "#apply",
  },
  {
    tab: "Data",
    title: "Turn real work into training data.",
    points: ["Text, image, audio and video", "Recorded with consent", "Every hour reviewed by a person"],
    href: "#apply",
  },
  {
    tab: "Research",
    title: "Research Arabic AI with us.",
    points: ["Arabic speech", "AI evaluation", "Physical AI data"],
    href: "#apply",
  },
];

const tech = ["oracle", "nvidia", "aws"];
const research = ["tii", "ai71", "beam", "middlesex-university-dubai"];

function Visual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className={styles.stack}>
        <ul className={styles.logos}>
          {tech.map((name) => (
            <li key={name}>
              <img src={`/brand/partners/${name}.svg`} alt={name} />
            </li>
          ))}
        </ul>
        <div className={styles.layers}>
          {["On-premises", "Hybrid", "Cloud"].map((name, i) => (
            <span key={name} style={{ animationDelay: `${i * 0.15}s` }}>
              {name}
            </span>
          ))}
        </div>
        <p className={styles.badge}>In-region hosting</p>
      </div>
    );
  }
  if (index === 1) {
    return (
      <ol className={styles.timeline}>
        {["Discovery", "Phase 1 build", "Review", "Phase 2 and sign-off"].map((step, i) => (
          <li key={step} style={{ animationDelay: `${i * 0.15}s` }}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {step}
            <em>{i === 3 ? "Signed off" : "Joint team"}</em>
          </li>
        ))}
      </ol>
    );
  }
  if (index === 2) {
    return (
      <div className={styles.types}>
        {["Text", "Image", "Audio", "Video"].map((type, i) => (
          <span key={type} style={{ animationDelay: `${i * 0.12}s` }}>
            {type}
            <b>✓ Reviewed</b>
          </span>
        ))}
      </div>
    );
  }
  return (
    <ul className={`${styles.logos} ${styles.logosResearch}`}>
      {research.map((name) => (
        <li key={name}>
          <img src={`/brand/partners/${name}.svg`} alt={name} />
        </li>
      ))}
    </ul>
  );
}

/** Four ways to partner, one tab each. */
export function WaysToPartner() {
  const [active, setActive] = useState(0);
  const way = ways[active];
  const swipe = useSwipe(
    () => setActive((value) => Math.min(ways.length - 1, value + 1)),
    () => setActive((value) => Math.max(0, value - 1)),
  );

  return (
    <section className={styles.section} aria-labelledby="ways-heading">
      <header className={styles.head}>
        <p className={styles.kicker}>Ways to partner</p>
        <h2 id="ways-heading">Four ways to work with us.</h2>
      </header>

      <div className={styles.tabs} role="tablist" aria-label="Ways to partner">
        {ways.map((item, index) => (
          <button
            key={item.tab}
            type="button"
            role="tab"
            id={`way-tab-${index}`}
            aria-selected={index === active}
            aria-controls="way-panel"
            className={index === active ? styles.on : ""}
            onClick={() => setActive(index)}
          >
            {item.tab}
          </button>
        ))}
      </div>

      <div className={styles.panel} id="way-panel" role="tabpanel" aria-labelledby={`way-tab-${active}`} {...swipe}>
        <div key={way.tab} className={styles.copy}>
          <h3>{way.title}</h3>
          <ul>
            {way.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <a className={styles.cta} href={way.href}>
            Become a {way.tab.toLowerCase()} partner <span aria-hidden="true">→</span>
          </a>
        </div>
        <div key={`${way.tab}-visual`} className={styles.visual} aria-hidden="true">
          <Visual index={active} />
        </div>
      </div>
    </section>
  );
}
