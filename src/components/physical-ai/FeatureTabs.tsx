"use client";

import { useState, type ReactNode } from "react";
import styles from "./featureTabs.module.css";

export type FeatureTab = { title: string; body: string; icon?: ReactNode; visual: ReactNode };

/**
 * Feature list on the left, its visual on the right (after CNTXT's design file):
 * the open item shows its description and swaps the visual beside it.
 */
export function FeatureTabs({ items, label }: { items: FeatureTab[]; label: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.tabs}>
      <ul className={styles.list} aria-label={label}>
        {items.map((item, index) => {
          const open = index === active;
          return (
            <li key={item.title} data-open={open}>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`feature-visual-${label}`}
                onClick={() => setActive(index)}
                onMouseEnter={() => setActive(index)}
              >
                {item.icon ? <span className={styles.icon}>{item.icon}</span> : null}
                <span className={styles.text}>
                  <strong>{item.title}</strong>
                  <span className={styles.body}>
                    <span>{item.body}</span>
                  </span>
                </span>
                <span className={styles.bar} aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
      <div className={styles.stage} id={`feature-visual-${label}`}>
        {items.map((item, index) => (
          <div key={item.title} className={styles.visual} data-active={index === active} aria-hidden={index !== active}>
            {item.visual}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Isometric layer glyph, after the design file's stacked tiles. */
export function LayerGlyph({ tone }: { tone: "green" | "violet" | "ink" }) {
  const fill = tone === "green" ? "#c8f2c0" : tone === "violet" ? "#e9c8f7" : "#ffffff";
  const edge = tone === "green" ? "#7fcf74" : tone === "violet" ? "#c48ae0" : "#b9b4c4";
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
      {[30, 22, 14].map((y, i) => (
        <path
          key={y}
          d={`M24 ${y - 10} L42 ${y} L24 ${y + 10} L6 ${y} Z`}
          fill={i === 2 ? fill : "#ffffff"}
          stroke={i === 2 ? edge : "#ddd8e6"}
          strokeWidth="1.2"
          opacity={i === 2 ? 1 : 0.7}
        />
      ))}
    </svg>
  );
}

/** "Multiple data sets" coverage grid, drawn in code. Darker cells mean more coverage. */
export function HeatGrid({ title }: { title: string }) {
  const rows = [
    [0, 0, 0, 2, 0, 0, 0],
    [0, 0, 3, 3, 3, 0, 0],
    [0, 3, 3, 3, 3, 2, 0],
    [1, 1, 3, 4, 3, 3, 1],
    [0, 1, 1, 3, 4, 0, 0],
    [0, 0, 0, 2, 0, 0, 0],
  ];
  const shade = ["#f3effc", "#d9cbf7", "#c4b0f4", "#8f69f0", "#6a40e0"];
  return (
    <div className={styles.card}>
      <p>{title}</p>
      <div className={styles.heat}>
        {rows.flat().map((v, i) => (
          <i key={i} style={{ background: shade[v] }} />
        ))}
      </div>
      <span className={styles.legend}>
        Less
        {shade.slice(1).map((c) => (
          <i key={c} style={{ background: c }} />
        ))}
        More
      </span>
    </div>
  );
}

/** First-person clips with the action each one shows. */
export function EgoGrid({ clips }: { clips: { src: string; label: string }[] }) {
  return (
    <div className={styles.ego}>
      {clips.map((clip) => (
        <figure key={clip.src}>
          <img src={clip.src} alt="" />
          <figcaption>{clip.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}
