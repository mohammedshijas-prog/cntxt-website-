"use client";

import { nearView } from "../three/nearView";
import { useRef } from "react";
import type { Shot } from "../three/FactoryScene";
import styles from "./verticalHero.module.css";

const FactoryScene = nearView(() => import("../three/FactoryScene"), { idle: true });

/* Where each vertical sits in the Physical AI world. */
const framing: Record<string, { shot: Shot; station: number; label: string }> = {
  "robotics-humanoids": { shot: { x: 27, z: -1, y: 0.9, width: 13 }, station: 3, label: "Production · humanoids on the line" },
  "world-models": { shot: { x: 12, z: -6, y: 0.6, width: 40 }, station: 0, label: "Every environment we record in" },
  "autonomous-systems": { shot: { x: 1, z: 13, y: 0.6, width: 24 }, station: 0, label: "LiDAR and 3D boxes on the road" },
  "logistics-warehousing": { shot: { x: 0, z: -10, y: 0.9, width: 13 }, station: 0, label: "Warehouse · picking and packing" },
  "healthcare-service-robotics": { shot: { x: 24, z: -10, y: 0.9, width: 13 }, station: 0, label: "Hospital · portering and support" },
  "ai-lab": { shot: { x: 12, z: -1, y: 0.8, width: 30 }, station: 1, label: "The data factory · capture to production" },
};

type Action = { label: string; href: string; primary?: boolean };

/** A full-screen hero inside the factory world, the way the Physical AI page opens. */
export function VerticalHero({
  slug,
  id,
  kicker,
  title,
  lead,
  actions,
}: {
  slug: string;
  id: string;
  kicker: string;
  title: string;
  lead: string;
  actions: Action[];
}) {
  const lines = splitTitle(title);
  const frame = framing[slug] ?? framing["robotics-humanoids"];
  const progress = useRef(0);
  const a0 = useRef(frame.station === 0 ? 1 : 0.35);
  const a1 = useRef(frame.station === 1 ? 1 : 0.35);
  const a2 = useRef(frame.station === 2 ? 1 : 0.35);
  const a3 = useRef(frame.station === 3 ? 1 : 0.35);

  return (
    <section className={styles.hero} aria-labelledby={id} data-motion="off">
      <FactoryScene className={styles.scene} progress={progress} activity={[a0, a1, a2, a3]} shots={[frame.shot, frame.shot]} />
      <div className={styles.copy}>
        <p className={styles.kicker}>{kicker}</p>
        <h1 id={id} className={styles.title}>
          <span>{lines[0]}</span> {lines[1]}
        </h1>
        <p className={styles.lead}>{lead}</p>
        <div className={styles.actions}>
          {actions.map((action) => (
            <a key={action.label} className={action.primary ? styles.primary : styles.textLink} href={action.href}>
              {action.label}
              {action.primary ? null : <span aria-hidden="true"> →</span>}
            </a>
          ))}
        </div>
      </div>
      <span className={styles.label}>{frame.label}</span>
    </section>
  );
}

/** Split a headline into two stickers, the first a little shorter. */
function splitTitle(title: string): [string, string] {
  const words = title.split(" ");
  let cut = 1;
  while (cut < words.length - 1 && words.slice(0, cut + 1).join(" ").length <= title.length * 0.45) cut++;
  return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
}
