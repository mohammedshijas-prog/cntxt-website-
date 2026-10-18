"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./home.module.css";

const posts: { category: string; title: string; image: string; href: string; body?: string }[] = [
  {
    category: "Arabic AI",
    title: "The Arabic AI performance gap: why global models fail in MEA",
    image: "/art/cover-2.svg",
    href: "https://www.cntxt.tech/insight-hub/the-arabic-ai-performance-gap-why-global-models-fail-in-mea",
  },
  {
    category: "Munsit",
    title: "Why Arabic voice AI needs 25 dialects, not one",
    image: "/art/cover-1.svg",
    href: "/blog/why-arabic-voice-ai-needs-25-dialects-not-one",
  },
  {
    category: "Data",
    title: "Human in the loop: data quality with human and machine collaboration",
    image: "/art/cover-6.svg",
    href: "https://www.cntxt.tech/insight-hub/human-in-the-loop-data-quality-with-human-and-machine-collaboration",
  },
  {
    category: "Evaluation",
    title: "6 steps to build a strong AI testing and validation framework",
    image: "/art/cover-9.svg",
    href: "https://www.cntxt.tech/insight-hub/6-steps-to-build-a-strong-ai-testing-and-validation-framework-",
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

export function BlogRail({ eyebrow, title = "From the blog" }: { eyebrow: ReactNode; title?: ReactNode }) {
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
    let lastProgress = -2;

    const update = () => {
      frame = 0;
      if (carousel.matches) {
        if (lastProgress !== -1) cardRefs.current.forEach((card) => card?.removeAttribute("style"));
        lastProgress = -1;
        return;
      }
      const rect = section.getBoundingClientRect();
      const range = rect.height - sticky.getBoundingClientRect().height;
      const progress = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0;
      // Away from the section the rail rests at one end: nothing to move.
      if (progress === lastProgress) return;
      lastProgress = progress;
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
        <h2 id="blogs-heading">{title}</h2>
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
                <img loading="lazy" decoding="async" src={post.image} alt="" />
                <strong>{post.title}</strong>
              </div>
              {post.body ? <p className={styles.cardBody}>{post.body}</p> : null}
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
