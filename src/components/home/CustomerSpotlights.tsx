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

const spotlights: Spotlight[] = [
  {
    name: "US robotics company",
    sector: "Physical AI",
    figure: "4-year",
    figureLabel: "Physical AI contract",
    body: "Fuelling the next generation of robotic foundation models with real-world training data.",
  },
  {
    name: "Munsit",
    logo: "/customers/munsit.svg",
    aspect: 4.14,
    weight: 0.62,
    sector: "Our product · Arabic voice AI",
    figure: "250+",
    figureLabel: "Government & enterprise organisations",
    body: "Arabic voice AI for 150,000+ users, inside government and enterprise workflows.",
  },
  {
    name: "Burjeel",
    sector: "Healthcare",
    figure: "Healthcare",
    figureLabel: "Clinical support",
    body: "Capturing clinical support work to train AI that assists on the ward.",
  },
  {
    name: "DP World",
    logo: "/customers/dp-world.png",
    aspect: 4.07,
    sector: "Logistics",
    figure: "Logistics",
    figureLabel: "Warehouse & port operations",
    body: "Real-world warehouse and port operations data for physical AI.",
  },
  {
    name: "noon",
    logo: "/customers/noon.png",
    aspect: 3.3,
    sector: "Retail & e-commerce",
    figure: "Retail",
    figureLabel: "Picking, packing & restock",
    body: "Picking, packing and restock shifts turned into robotics-ready training data.",
  },
  {
    name: "dnata",
    logo: "/customers/dnata.png",
    aspect: 3.6,
    sector: "Aviation",
    figure: "Aviation",
    figureLabel: "Airport ground handling",
    body: "Airport ground handling captured for the next generation of autonomous operations.",
  },
  {
    name: "Emirates NBD",
    logo: "/customers/emirates-nbd.png",
    aspect: 3.6,
    sector: "Banking",
    figure: "Banking",
    figureLabel: "Customer service & operations",
    body: "Agentic AI deployed on-premise across customer service and operations.",
  },
  {
    name: "TII",
    logo: "/customers/tii.png",
    aspect: 1.81,
    sector: "Research partner",
    figure: "Research",
    figureLabel: "Arabic language models",
    body: "Research partner on Arabic-centric language models: specialised linguistic datasets, multilingual annotation frameworks and evaluation methods.",
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
              <img src={spot.logo} alt={spot.name} style={logoSize(spot.aspect, spot.weight)} />
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
          <img className={styles.brandBg} src="/healthcare/brand-bg.webp" alt="" />
          {item.logo ? (
            <span className={styles.brandCard}>
              <img src={item.logo} alt={item.name} />
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
