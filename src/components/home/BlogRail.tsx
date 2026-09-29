"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./home.module.css";

const posts = [
  {
    category: "Security",
    title: "Access control & auditing",
    image: "/security/practice-a.png",
    href: "/blog",
    body: "Who touched which data, when, and why. How role-based access and a complete audit trail keep enterprise AI accountable.",
  },
  {
    category: "Sovereignty",
    title: "Data residency & sovereignty",
    image: "/blog/feature.png",
    href: "/blog",
    body: "The top rep closes at three times the team average. Zaro reads every call, every email, and every deal, surfaces what the best do differently, and writes the playbook. The team coaches from the evidence.",
  },
  {
    category: "Security",
    title: "Encryption in transit & at rest",
    image: "/security/practice-b.png",
    href: "/blog",
    body: "Keys, protocols and storage: what end-to-end encryption actually covers across a production AI stack.",
  },
  {
    category: "Enterprise adoption",
    title: "Five hundred licences, almost no one uses them",
    image: "/blog/cover-summit.png",
    href: "/blog/five-hundred-licences",
    body: "The demo always lands. Three months later, nobody uses it. Why enterprise AI stalls after the pilot - and the context layer that makes it compound.",
  },
  {
    category: "Audio",
    title: "Universal Music Group and ElevenLabs",
    image: "/blog/cover-traffic.png",
    href: "/blog",
    body: "What a licensing deal between a major label and a voice-AI company means for training data, rights and consent.",
  },
  {
    category: "Geospatial",
    title: "Mapping what matters",
    image: "/blog/cover-causes.png",
    href: "/blog",
    body: "Satellite, drone and street-level imagery turned into ground truth that models can learn from.",
  },
];

/** Card width and spacing, in CSS px at full scale. */
const CARD = 746;
const GAP = 64;
/** Scale of the cards either side of the active one. */
const SIDE_SCALE = 0.8;
/** The rail travels from the second card to the second-to-last, so both sides stay filled. */
const FIRST = 1;
const LAST = posts.length - 2;

export function BlogRail({ eyebrow }: { eyebrow: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) return;

    const carousel = window.matchMedia("(max-width: 1200px)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (carousel.matches) {
        cardRefs.current.forEach((card) => card?.removeAttribute("style"));
        return;
      }
      const rect = section.getBoundingClientRect();
      const range = rect.height - sticky.getBoundingClientRect().height;
      const progress = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0;
      const active = FIRST + progress * (LAST - FIRST);

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const offset = i - active;
        const distance = Math.min(Math.abs(offset), 1.5);
        const scale = 1 - Math.min(distance, 1) * (1 - SIDE_SCALE);
        // Side cards sit closer in so the shrunk card keeps an even gap.
        const x = offset * (CARD * (1 + SIDE_SCALE) / 2 + GAP);
        card.style.transform = `translate3d(calc(-50% + ${x}px), 0, 0) scale(${scale})`;
        card.style.opacity = `${1 - Math.max(0, distance - 1) * 1.4}`;
        card.style.setProperty("--detail", `${Math.max(0, 1 - distance * 1.6)}`);
        card.style.zIndex = `${10 - Math.round(Math.abs(offset))}`;
      });

      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    carousel.addEventListener("change", request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      carousel.removeEventListener("change", request);
    };
  }, []);

  return (
    <section
      className={styles.blogs}
      ref={sectionRef}
      aria-labelledby="blogs-heading"
      style={{ "--steps": LAST - FIRST } as React.CSSProperties}
    >
      <div className={styles.blogsSticky} ref={stickyRef}>
        {eyebrow}
        <h2 id="blogs-heading">From the blog</h2>
        <div className={styles.rail}>
          {posts.map((post, i) => (
            <Link
              key={post.title}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={styles.card}
              href={post.href}
            >
              <p className={styles.category}><span />{post.category}</p>
              <div className={styles.photo}>
                <img src={post.image} alt="" />
                <strong>{post.title}</strong>
              </div>
              <p className={styles.cardBody}>{post.body}</p>
            </Link>
          ))}
        </div>
        <span className={styles.railProgress} aria-hidden="true">
          <span ref={barRef} />
        </span>
      </div>
    </section>
  );
}
