"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Shot } from "../three/FactoryScene";
import styles from "./factoryWalkthrough.module.css";

const FactoryScene = dynamic(() => import("../three/FactoryScene"), { ssr: false });

type Chapter = {
  group: "Overview" | "The kit" | "Environments" | "Process";
  shot: Shot;
  title: string;
  body: string;
  stat?: string;
  link?: { label: string; href: string };
  /** A real photo of the product or place, shown in the card. */
  image?: string;
  imageFit?: "cover" | "contain";
  /** Which station animates hardest in this chapter. */
  station: number;
};

/* Every line here is from docs/content-brief.md (physical AI data, KLKT). */
const chapters: Chapter[] = [
  {
    group: "Overview",
    // Open on one clear subject: a worker recording at the bench, data streaming out.
    shot: { x: -0.9, z: 0.2, y: 1.6, width: 12.5 },
    title: "",
    body: "",
    station: 0,
  },
  {
    group: "The kit",
    shot: { x: -9.5, z: 0.5, y: 1.4, width: 5.5 },
    title: "Your phone, on a head strap",
    body: "Contributors record on their own phone, sideways on a head strap we supply, with both hands in view. iPhone 11 to 17, Pixel 6 to 9, Galaxy S21 to S24 and more.",
    image: "/brand/klkt/klkt-app-start-screen.webp",
    imageFit: "contain",
    station: 0,
  },
  {
    group: "The kit",
    shot: { x: -8, z: 0.5, y: 1.4, width: 5.5 },
    title: "Roboband",
    body: "A light headband with up to eight clip-on camera units, synced to under a millisecond. Each unit pairs a 1.5 MP global-shutter camera with a motion sensor that samples 400 times a second.",
    stat: "Under 150 g · 30 FPS · 90° view per camera",
    image: "/brand/klkt/roboband-hero.webp",
    station: 0,
  },
  {
    group: "The kit",
    shot: { x: -6.5, z: 0.5, y: 1, width: 5.5 },
    title: "The wristband",
    body: "A 154° camera that sees what the hands do, linked to the headband over Wi-Fi. It runs up to 12 hours on its own.",
    image: "/brand/klkt/roboband-hands-card.webp",
    station: 0,
  },
  {
    group: "The kit",
    shot: { x: -8, z: 0.5, y: 1, width: 9 },
    title: "Captured with KLKT",
    body: "The KLKT app shows each task step by step. People record their everyday work and are paid for every accepted hour, with no fees to join, work or cash out.",
    stat: "67,795+ people have joined, in more than 20 countries",
    image: "/brand/klkt/roboband-sync.webp",
    link: { label: "Explore KLKT", href: "https://klkt.app" },
    station: 0,
  },
  {
    group: "Environments",
    shot: { x: 0, z: -10, y: 0.9, width: 11 },
    title: "Warehouses",
    body: "Picking, packing and shelf stocking, recorded first-person by the people who do it every day.",
    station: 0,
  },
  {
    group: "Environments",
    shot: { x: 8, z: -10, y: 0.9, width: 11 },
    title: "Kitchens",
    body: "Line cooking and kitchen portering: the real work humanoid robots are learning for restaurants.",
    station: 0,
  },
  {
    group: "Environments",
    shot: { x: 16, z: -10, y: 0.9, width: 11 },
    title: "Hotels",
    body: "Housekeeping, laundry and cleaning, captured room by room.",
    station: 0,
  },
  {
    group: "Environments",
    shot: { x: 24, z: -10, y: 0.9, width: 11 },
    title: "Hospitals",
    body: "Portering and support work, captured with consent for robots that assist on the ward.",
    station: 0,
  },
  {
    group: "Environments",
    shot: { x: 32, z: -10, y: 0.9, width: 11 },
    title: "And at home",
    body: "Anyone can become a collector. KLKT shows tasks open where you live, so people record the work they already do at home, like cleaning, cooking or folding laundry, and are paid for every accepted task.",
    stat: "Earn at work or at home",
    station: 0,
  },
  {
    group: "Process",
    shot: { x: 0, z: 0, width: 12 },
    title: "Capture layer",
    body: "Real work recorded hands-free on a phone, Roboband or wristband, with every worker's consent. Each person agrees in the app, in their own language, before recording.",
    stat: "Consent in 4 languages: Arabic, English, Filipino and Urdu",
    station: 0,
  },
  {
    group: "Process",
    shot: { x: 10.5, z: 0, width: 13 },
    title: "Reviewed, then labelled",
    body: "Review teams check every recording before it is accepted. Accepted clips are broken into the actions a robot has to learn, with hands and objects marked up.",
    stat: "98% labelling accuracy, 100% of hours reviewed",
    station: 1,
  },
  {
    group: "Process",
    shot: { x: 18, z: 0, width: 12 },
    title: "Train and set up",
    body: "Robotics teams train manipulation and embodied-AI models on the verified dataset, then set the robot up in its cell.",
    station: 2,
  },
  {
    group: "Process",
    shot: { x: 27, z: -1, width: 12 },
    title: "Into production, on robots",
    body: "Humanoids and arms on the line, picking and placing parts that vary in angle, occlusion and orientation, because they learned from real work.",
    stat: "Published case: 1.8M frames annotated in six months for a GCC humanoid robotics lab",
    station: 3,
  },
];

const shots = chapters.map((chapter) => chapter.shot);
const groups = ["The kit", "Environments", "Process"] as const;

/**
 * Physical AI as one connected world: the overview, the capture kit, four
 * real environments, then the process from capture to production. One pinned
 * 3D scene; the camera moves chapter to chapter as the page scrolls.
 */
export function PhysicalWorld() {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const a0 = useRef(1);
  const a1 = useRef(0);
  const a2 = useRef(0);
  const a3 = useRef(0);
  const [active, setActive] = useState(0);
  const last = chapters.length - 1;

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
      // The overview holds a little longer at the top.
      const p = Math.min(last, Math.max(0, t * (last + 0.6) - 0.3));
      progress.current = p;
      const index = Math.round(p);
      const station = chapters[index].station;
      activity.forEach((ref, i) => {
        ref.current = index === 0 ? 0.6 : i === station ? 1 : 0.25;
      });
      setActive(index);
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
    const t = (index + 0.3) / (last + 0.6);
    window.scrollTo({ top: box.top + window.scrollY + range * t, behavior: "smooth" });
  };

  const chapter = chapters[active];
  const inGroup = chapters.filter((item) => item.group === chapter.group);
  const position = inGroup.indexOf(chapter) + 1;

  return (
    <section ref={section} className={styles.world} aria-labelledby="physical-heading" data-motion="off">
      <div className={styles.sticky}>
        <FactoryScene className={styles.scene} progress={progress} activity={[a0, a1, a2, a3]} shots={shots} />

        {/* Overview: the page's headline over the whole world. */}
        <div className={`${styles.heroCopy} ${active === 0 ? "" : styles.hidden}`}>
          <h1 id="physical-heading" className={styles.title}>
            <span>Real work, recorded</span>
            <span>as training data for robots.</span>
          </h1>
          <div className={styles.heroActions}>
            <a className={styles.heroPrimary} href="/contact?topic=Physical%20AI%20data">
              Book a demo
            </a>
            <button type="button" className={styles.heroSecondary} onClick={() => go(1)}>
              Start the walkthrough
            </button>
          </div>
        </div>

        {/* Chapters: a sticker for the group, a card for the step. */}
        <div className={`${styles.chapterTag} ${active === 0 ? styles.hidden : ""}`} aria-hidden={active === 0}>
          <span>{chapter.group}</span>
          {inGroup.length > 1 ? (
            <span>
              {position} of {inGroup.length}
            </span>
          ) : null}
        </div>

        <div className={`${styles.card} ${active === 0 ? styles.hidden : ""}`} aria-live="polite">
          {chapter.image ? (
            <div key={chapter.image} className={`${styles.cardImage} ${chapter.imageFit === "contain" ? styles.cardImageContain : ""}`}>
              <img loading="lazy" decoding="async" src={chapter.image} alt="" />
            </div>
          ) : null}
          <h2 key={chapter.title}>{chapter.title}</h2>
          <p className={styles.body}>{chapter.body}</p>
          {chapter.stat ? <p className={styles.stat}>{chapter.stat}</p> : null}
          {chapter.link ? (
            <a className={styles.link} href={chapter.link.href}>
              {chapter.link.label} <span aria-hidden="true">→</span>
            </a>
          ) : null}
          <div className={styles.rail} role="tablist" aria-label="Walkthrough chapters">
            {groups.map((group) => {
              const first = chapters.findIndex((item) => item.group === group);
              const isCurrent = chapter.group === group;
              return (
                <button
                  key={group}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  className={isCurrent ? styles.railActive : ""}
                  onClick={() => go(first)}
                >
                  {group}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
