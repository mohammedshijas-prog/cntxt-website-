"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import styles from "./factoryWalkthrough.module.css";

const FactoryScene = dynamic(() => import("../three/FactoryScene"), { ssr: false });

const stages = [
  {
    step: "On the floor",
    title: "Real work, recorded",
    body: "A worker does the job as usual while a phone head strap, head camera or Roboband wrist cameras record it, with their consent.",
  },
  {
    step: "Verify and label",
    title: "Checked, then labelled",
    body: "A person reviews every recorded hour. Accepted clips are broken into the actions a robot has to learn and labelled at 98% accuracy.",
  },
  {
    step: "Train and set up",
    title: "Your robot learns the task",
    body: "Robotics teams train manipulation and embodied-AI models on the verified dataset, then set the robot up in its cell.",
  },
  {
    step: "Into production",
    title: "Real work, done by robots",
    body: "The robot picks and places parts that vary in angle, occlusion and orientation, because it learned from the real thing.",
  },
];

/**
 * A pinned, scroll-driven walk through one use case: from the factory floor,
 * to labelling, to training and set-up, to the robot on the line. The 3D
 * camera pans station to station; the card tells each step.
 */
export function FactoryWalkthrough() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const a0 = useRef(1);
  const a1 = useRef(0);
  const a2 = useRef(0);
  const a3 = useRef(0);
  const [active, setActive] = useState(0);
  const last = stages.length - 1;

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const activity = [a0, a1, a2, a3];
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = node.getBoundingClientRect();
      const range = box.height - window.innerHeight;
      const t = range > 0 ? Math.min(1, Math.max(0, -box.top / range)) : 0;
      const p = Math.min(last, Math.max(0, t * (last + 1) - 0.5));
      progress.current = p;
      activity.forEach((ref, i) => {
        ref.current = Math.max(0, 1 - Math.abs(p - i));
      });
      setActive(Math.round(p));
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [last]);

  const go = (index: number) => {
    const node = section.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    const range = box.height - window.innerHeight;
    window.scrollTo({ top: box.top + window.scrollY + (range * (index + 0.5)) / (last + 1), behavior: "smooth" });
  };

  return (
    <section ref={section} className={styles.walk} aria-labelledby="walk-heading" data-motion="off">
      <div className={styles.sticky}>
        <FactoryScene className={styles.scene} progress={progress} activity={[a0, a1, a2, a3]} />
        <h2 id="walk-heading" className={styles.title}>
          <span>From the factory floor</span>
          <span>to the final product</span>
        </h2>
        <div className={styles.card} aria-live="polite">
          <p className={styles.step}>
            {String(active + 1).padStart(2, "0")} · {stages[active].step}
          </p>
          <h3>{stages[active].title}</h3>
          <p className={styles.body}>{stages[active].body}</p>
          <div className={styles.pills} role="tablist" aria-label="Walkthrough steps">
            {stages.map((stage, index) => (
              <button
                key={stage.step}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={stage.step}
                className={index === active ? styles.pillActive : ""}
                onClick={() => go(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
