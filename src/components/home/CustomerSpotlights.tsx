"use client";

import { useState } from "react";
import styles from "./home.module.css";

type Spotlight = {
  name: string;
  /** Logo file in /public/customers; the name is shown until it exists. */
  logo?: string;
  /** Logo width ÷ height, so every logo gets the same visual weight. */
  aspect?: number;
  /** Visual-area multiplier for logos that read heavier or lighter than the rest. */
  weight?: number;
  sector: string;
  figure: string;
  figureLabel: string;
  body: string;
};

/*
 * Verified clients only (confirmed by CNTXT, 22 Oct 2026; see docs/content-brief.md).
 * Add a name here only once it is confirmed, with facts from the brief.
 */
const spotlights: Spotlight[] = [
  {
    name: "US robotics company",
    sector: "Physical AI",
    figure: "4-year",
    figureLabel: "Physical AI contract",
    body: "Fuelling the next generation of robotic foundation models with real-world training data.",
  },
  {
    name: "TII",
    logo: "/customers/tii.png",
    aspect: 1.81,
    sector: "Technology Innovation Institute · Research",
    figure: "Research",
    figureLabel: "Arabic language models",
    body: "Research work on Arabic-centric language models: specialised linguistic datasets, multilingual annotation frameworks and evaluation methods.",
  },
  {
    name: "AI71",
    logo: "/customers/ai71.svg",
    aspect: 1.24,
    weight: 0.8,
    sector: "AI · Also an investor",
    figure: "$60M",
    figureLabel: "Series A co-led by AI71",
    body: "\u201cCNTXT AI capabilities and speed of execution stand out in this fast-moving AI world.\u201d \u2014 Reda Nidhakou, AI71",
  },
  {
    name: "Venture One",
    sector: "Client",
    figure: "Client",
    figureLabel: "Verified customer",
    body: "Working with CNTXT AI.",
  },
];

/** Size a logo to a fixed visual area (~2800px²) instead of a fixed height. */
function logoSize(aspect = 3.5, weight = 1, area = 2800 * weight, maxHeight = 38) {
  const height = Math.min(maxHeight, Math.sqrt(area / aspect));
  return { width: Math.round(height * aspect), height: Math.round(height) };
}

/** Tabbed customer spotlight: logo bar on top, then brand, result and detail panels. */
export function CustomerSpotlights({ eyebrow }: { eyebrow: React.ReactNode }) {
  const [active, setActive] = useState(0);
  const item = spotlights[active];

  return (
    <section className={styles.customers} aria-labelledby="customers-heading">
      {eyebrow}
      <h2 id="customers-heading">Trusted on the floor.</h2>
      <div className={styles.logoBar} role="tablist" aria-label="Customers">
        {spotlights.map((spot, index) => (
          <button
            key={spot.name}
            type="button"
            role="tab"
            id={`spot-tab-${index}`}
            aria-selected={active === index}
            aria-controls="spot-panel"
            onClick={() => setActive(index)}
          >
            {spot.logo ? (
              <img loading="lazy" decoding="async" src={spot.logo} alt={spot.name} style={logoSize(spot.aspect, spot.weight)} />
            ) : (
              <span className={styles.logoText}>{spot.name}</span>
            )}
          </button>
        ))}
      </div>
      <div
        className={styles.result}
        id="spot-panel"
        role="tabpanel"
        aria-labelledby={`spot-tab-${active}`}
      >
        <div className={styles.brand}>
          <img loading="lazy" decoding="async" className={styles.brandBg} src="/healthcare/brand-bg.webp" alt="" />
          {item.logo ? (
            <span className={styles.brandCard}>
              <img loading="lazy" decoding="async" src={item.logo} alt={item.name} />
            </span>
          ) : (
            <p className={styles.brandName}>{item.name}</p>
          )}
        </div>
        <div className={styles.metric}>
          <p>{item.body}</p>
          <div>
            <strong>{item.figure}</strong>
            <span>{item.figureLabel}</span>
          </div>
        </div>
        <div className={styles.detail}>
          <p className={styles.detailLabel}>Customer spotlight</p>
          <div>
            <p className={styles.detailName}>{item.name}</p>
            <p className={styles.detailSector}>{item.sector}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
