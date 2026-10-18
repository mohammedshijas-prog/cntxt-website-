"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import type { Shot } from "../three/FactoryScene";
import styles from "./verticalWorld.module.css";

const FactoryScene = dynamic(() => import("../three/FactoryScene"), { ssr: false });

/* Where each vertical sits in the Physical AI world. */
const framing: Record<string, { shot: Shot; station: number; label: string }> = {
  "robotics-humanoids": { shot: { x: 27, z: -1, y: 0.9, width: 11 }, station: 3, label: "Production · humanoids on the line" },
  "world-models": { shot: { x: 12, z: -6, y: 0.6, width: 34 }, station: 0, label: "Every environment we record in" },
  "autonomous-systems": { shot: { x: 10.5, z: 0, y: 0.8, width: 12 }, station: 1, label: "Review and labelling floor" },
  "logistics-warehousing": { shot: { x: 0, z: -10, y: 0.9, width: 10 }, station: 0, label: "Warehouse · picking and packing" },
  "ai-lab": { shot: { x: 12, z: -1, y: 0.8, width: 26 }, station: 1, label: "The data factory · capture to production" },
  "healthcare-service-robotics": { shot: { x: 24, z: -10, y: 0.9, width: 10 }, station: 0, label: "Hospital · portering and support" },
};

/** The vertical's own corner of the factory world, framed for a hero panel. */
export function VerticalWorld({ slug }: { slug: string }) {
  const frame = framing[slug] ?? framing["robotics-humanoids"];
  const progress = useRef(0);
  const a0 = useRef(frame.station === 0 ? 1 : 0.3);
  const a1 = useRef(frame.station === 1 ? 1 : 0.3);
  const a2 = useRef(frame.station === 2 ? 1 : 0.3);
  const a3 = useRef(frame.station === 3 ? 1 : 0.3);

  return (
    <div className={styles.world}>
      <FactoryScene
        className={styles.scene}
        progress={progress}
        activity={[a0, a1, a2, a3]}
        shots={[frame.shot, frame.shot]}
        centred
      />
      <span className={styles.label}>{frame.label}</span>
    </div>
  );
}
