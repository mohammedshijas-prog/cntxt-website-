"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { LayeredScene } from "../shared/LayeredScene";
import styles from "./home.module.css";

type Step = {
  /** Small label above the title; also names this step's layer in the strip. */
  eyebrow?: string;
  title: string;
  body: string;
  /** Highlighted figure under the body, e.g. "1000+ data types". */
  stat?: ReactNode;
  cta?: ReactNode;
  /** Extra content under the link, such as a logo row. */
  extra?: ReactNode;
  /** Centers the image with the copy underneath, instead of side by side. */
  center?: boolean;
  /** Swaps in a different image while this step is active. */
  image?: string;
};

/**
 * One pinned section: as the page scrolls, the image swaps sides and the copy
 * steps through. While pinned, scrolling is locked to one step per gesture.
 */
export function ScrollStory({ steps }: { steps: Step[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) return;

    const last = steps.length - 1;
    const pinned = window.matchMedia("(min-width: 1201px)");

    /** Page scroll offsets where the section pins and unpins. */
    const bounds = () => {
      const rect = section.getBoundingClientRect();
      const start = rect.top + window.scrollY;
      const range = Math.max(0, rect.height - sticky.getBoundingClientRect().height);
      return { start, end: start + range, range };
    };

    // Each step sits at an even share of the pinned scroll range.
    const stepAt = (y: number) => {
      const { start, range } = bounds();
      const progress = range > 0 ? Math.min(1, Math.max(0, (y - start) / range)) : 0;
      return Math.round(progress * last);
    };

    const goTo = (step: number) => {
      const { start, range } = bounds();
      window.scrollTo({ top: start + (range * step) / last, behavior: "instant" });
      setActive(step);
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      setActive(stepAt(window.scrollY));
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    /*
     * Scroll lock: scrolling toward the section glides it into place, then one
     * gesture moves one step and its remaining momentum is swallowed. Past the
     * first or last step the page scrolls on normally.
     */
    const GESTURE_GAP = 180;
    let lastInput = 0;
    let stepped = false;
    let gliding = 0;

    /** Eased scroll into the section; input is held until it lands. */
    const glideTo = (target: number, step: number) => {
      const from = window.scrollY;
      const distance = target - from;
      const duration = Math.min(900, 350 + Math.abs(distance) * 0.5);
      const begin = performance.now();
      setActive(step);
      const tick = (now: number) => {
        const t = Math.min(1, (now - begin) / duration);
        const eased = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
        window.scrollTo({ top: from + distance * eased, behavior: "instant" });
        gliding = t < 1 ? requestAnimationFrame(tick) : 0;
      };
      cancelAnimationFrame(gliding);
      gliding = requestAnimationFrame(tick);
    };

    const handle = (direction: 1 | -1, delta: number, event: Event) => {
      if (!pinned.matches) return;
      const now = performance.now();
      const newGesture = now - lastInput > GESTURE_GAP;
      lastInput = now;
      if (newGesture) stepped = false;

      if (gliding) {
        event.preventDefault();
        return;
      }

      const { start, end } = bounds();
      const y = window.scrollY;
      const view = window.innerHeight;

      // Section coming into view: glide it into place and lock on its first or last step.
      if (direction > 0 && y < start - 1 && (start - y <= view + 1 || y + delta > start)) {
        event.preventDefault();
        glideTo(start, 0);
        stepped = true;
        return;
      }
      if (direction < 0 && y > end + 1 && (y - end <= view + 1 || y + delta < end)) {
        event.preventDefault();
        glideTo(end, last);
        stepped = true;
        return;
      }
      const inside =
        direction > 0 ? y >= start - 1 && y < end - 1 : y > start + 1 && y <= end + 1;
      if (!inside) {
        // Still the gesture that reached the edge: hold until a fresh one.
        if (stepped && !newGesture) event.preventDefault();
        return;
      }

      event.preventDefault();
      if (stepped) return;
      const current = stepAt(y);
      const next = Math.min(last, Math.max(0, current + direction));
      if (next !== current) goTo(next);
      stepped = true;
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      if (event.deltaY === 0) return;
      handle(event.deltaY > 0 ? 1 : -1, event.deltaY, event);
    };

    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      // Space is left alone so it can still press focused buttons and links.
      const down = ["ArrowDown", "PageDown"].includes(event.key);
      const up = ["ArrowUp", "PageUp"].includes(event.key);
      if (!down && !up) return;
      // Keys repeat when held; treat every press as its own gesture.
      lastInput = 0;
      handle(down ? 1 : -1, down ? 120 : -120, event);
    };

    let touchY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0].clientY;
      lastInput = 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      const delta = touchY - event.touches[0].clientY;
      if (Math.abs(delta) < 12) return;
      handle(delta > 0 ? 1 : -1, delta, event);
      lastInput = performance.now();
    };

    /*
     * Blocking wheel and touch listeners make the browser wait on this script
     * before every scroll, so they are only attached while the section is
     * within a screen of the viewport, and never on layouts that don't pin.
     */
    let near = false;
    let locking = false;
    const syncLock = () => {
      const want = near && pinned.matches;
      if (want === locking) return;
      locking = want;
      if (want) {
        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("keydown", onKey);
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
      } else {
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
      }
    };
    const nearby = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        syncLock();
      },
      { rootMargin: "120% 0px" },
    );
    nearby.observe(section);
    pinned.addEventListener("change", syncLock);

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(gliding);
      nearby.disconnect();
      pinned.removeEventListener("change", syncLock);
      near = false;
      syncLock();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [steps.length]);

  return (
    <section
      ref={sectionRef}
      className={styles.story}
      data-hero-end=""
      style={{ "--story-steps": steps.length } as React.CSSProperties}
    >
      <div ref={stickyRef} className={styles.storySticky}>
        {/* Even steps put the image on the left, odd steps on the right. */}
        <div className={styles.cube} data-step={active} data-side={sideOf(active, steps[active])}>
          <div className={styles.cubeScene} data-shown={!steps[active].image}>
            <LayeredScene
              facing={
                sideOf(active, steps[active]) === "center"
                  ? "center"
                  : sideOf(active, steps[active]) === "right"
                    ? "left"
                    : "right"
              }
            />
          </div>
          {steps.map((step) =>
            step.image ? (
              <img
                key={step.image}
                className={styles.cubeTop}
                src={step.image}
                alt=""
                data-shown={steps[active].image === step.image}
              />
            ) : null,
          )}
        </div>

        {steps.map((step, i) => (
          <div
            key={step.title}
            className={`${styles.copy} ${styles.storyStep}`}
            data-side={step.center ? "center" : sideOf(i, step) === "left" ? "right" : "left"}
            data-state={i === active ? "active" : i < active ? "past" : "next"}
          >
            {step.eyebrow ? <p className={styles.storyEyebrow}>{step.eyebrow}</p> : null}
            <h2>{step.title}</h2>
            <p>{step.body}</p>
            {step.stat ? <p className={styles.storyStat}>{step.stat}</p> : null}
            {step.cta}
            {step.extra}
          </div>
        ))}
      </div>
    </section>
  );
}

/** Where the image sits for a step; the copy takes the other side. */
function sideOf(index: number, step: Step) {
  if (step.center) return "center";
  return index % 2 === 0 ? "left" : "right";
}
