"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./delivery.module.css";

/* The AI Lab delivery process (docs/content-brief.md). */
const phases = [
  {
    name: "Discover",
    body: "We start with the problem, the systems it touches and the data behind it. The data foundation is examined first, because AI projects fail on messy data, not on models.",
    get: "A roadmap",
  },
  {
    name: "Build phase 1",
    body: "Data is sourced and prepared, models are built and trained on proprietary and regional data, and the work is integrated with your systems.",
    get: "A working first phase",
  },
  {
    name: "Review",
    body: "Phase 1 goes to review with your team. We iterate on what the review finds before anything more is built.",
    get: "Your feedback, built in",
  },
  {
    name: "Build and sign off",
    body: "The second phase completes the build, deployed on-premises, hybrid or in the cloud.",
    get: "The finished build",
  },
];

/** Four phases on one line; the line fills as the project moves on. */
export function Delivery() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const box = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = box.current;
    if (!node || !auto) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const seen = new IntersectionObserver(([entry]) => {
      clearInterval(timer);
      if (entry.isIntersecting && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        timer = setInterval(() => setActive((value) => (value + 1) % phases.length), 4200);
      }
    }, { threshold: 0.35 });
    seen.observe(node);
    return () => {
      seen.disconnect();
      clearInterval(timer);
    };
  }, [auto]);

  return (
    <section ref={box} className={styles.section} aria-labelledby="steps-heading">
      <header className={styles.head}>
        <p className={styles.kicker}>How we deliver</p>
        <h2 id="steps-heading">Four phases to sign-off.</h2>
      </header>

      <div className={styles.track} aria-hidden="true">
        <span style={{ width: `${(active / (phases.length - 1)) * 100}%` }} />
      </div>

      <ol className={styles.phases}>
        {phases.map((phase, index) => (
          <li key={phase.name} className={index === active ? styles.on : index < active ? styles.done : ""}>
            <button
              type="button"
              onClick={() => {
                setActive(index);
                setAuto(false);
              }}
              aria-pressed={index === active}
            >
              <span className={styles.dot}>{index < active ? "✓" : String(index + 1).padStart(2, "0")}</span>
              <span className={styles.phase}>Phase {index + 1}</span>
              <strong>{phase.name}</strong>
              <span className={styles.get}>{phase.get}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
