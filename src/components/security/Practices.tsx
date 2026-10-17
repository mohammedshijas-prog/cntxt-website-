"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import styles from "./security.module.css";

const slides = [
  {
    category: "Access",
    title: "Access control and logging",
    image: "/security/practice-a.png",
    body: "Role-based access decides who can see which data, and access is logged. Identity validation and limited network connections are among our published controls.",
  },
  {
    category: "Sovereignty",
    title: "Data residency and sovereignty",
    image: "/industries/government.jpg",
    body: "Data is stored and processed in-region. Deployments can be configured to meet regional data-residency requirements such as the UAE and Saudi PDPL.",
  },
  {
    category: "Encryption",
    title: "Encryption in transit and at rest",
    image: "/art/cover-5.svg",
    body: "Data is encrypted at rest and in transit. The full list of controls, from anti-malware to breach notification, is published in our trust centre.",
  },
];

const GAP = 32;
const SIDE_SCALE = 0.86;
const AUTOPLAY_MS = 5000;

/** Draggable, auto-advancing slider: the centred card is full size, its neighbours shrink and fade. */
export function Practices() {
  const [active, setActive] = useState(1);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const [width, setWidth] = useState({ viewport: 1200, card: 640 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ startX: 0, moved: false, id: -1 });

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const measure = () => {
      const w = viewport.clientWidth;
      setWidth({ viewport: w, card: Math.min(640, w * (w < 720 ? 0.84 : 0.56)) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || dragging || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, dragging]);

  const go = (index: number) => setActive(Math.min(slides.length - 1, Math.max(0, index)));

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = { startX: event.clientX, moved: false, id: event.pointerId };
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging || event.pointerId !== drag.current.id) return;
    const dx = event.clientX - drag.current.startX;
    if (!drag.current.moved && Math.abs(dx) > 6) {
      drag.current.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    // Resist dragging past the first and last card.
    const atEdge = (dx > 0 && active === 0) || (dx < 0 && active === slides.length - 1);
    setDragX(atEdge ? dx * 0.3 : dx);
  };

  const onPointerUp = () => {
    if (!dragging) return;
    const threshold = width.card * 0.18;
    if (dragX < -threshold) go(active + 1);
    else if (dragX > threshold) go(active - 1);
    setDragX(0);
    setDragging(false);
  };

  const step = width.card + GAP;
  const offset = width.viewport / 2 - width.card / 2 - active * step + dragX;

  return (
    <section className={styles.practices} aria-labelledby="practices-heading">
      <div className={styles.practicesIntro}>
        <p className={styles.eyebrow}>
          <span className={styles.tag} aria-hidden="true">
            <span className={styles.tagBar} />
            <span className={styles.tagBarFlipped} />
          </span>
          Practices
        </p>
        <h2 id="practices-heading">How we secure your data</h2>
      </div>

      <div
        ref={viewportRef}
        className={styles.carousel}
        data-dragging={dragging && Math.abs(dragX) > 6}
        role="region"
        aria-roledescription="carousel"
        aria-label="Security practices"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") go(active + 1);
          if (event.key === "ArrowLeft") go(active - 1);
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className={styles.track} style={{ transform: `translate3d(${offset}px, 0, 0)`, gap: GAP }}>
          {slides.map((slide, index) => {
            const isActive = index === active;
            return (
              <article
                key={slide.title}
                className={styles.slide}
                data-active={isActive}
                style={{ width: width.card, transform: isActive ? undefined : `scale(${SIDE_SCALE})` }}
                aria-hidden={!isActive}
                onClick={() => {
                  if (!drag.current.moved && !isActive) go(index);
                }}
              >
                <span className={styles.kicker}>
                  <span className={styles.kickerDot} aria-hidden="true" />
                  {slide.category}
                </span>
                <span className={styles.slideMedia}>
                  <img src={slide.image} alt="" draggable={false} />
                  <span className={styles.slideTitle}>{slide.title}</span>
                </span>
                <p className={styles.slideBody}>{slide.body}</p>
              </article>
            );
          })}
        </div>
      </div>

      <div className={styles.dots}>
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Show ${slide.title}`}
            aria-current={index === active}
            onClick={() => go(index)}
          />
        ))}
      </div>
    </section>
  );
}
