"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { agentHub, frames, network, rain, worker } from "../three/shapes";
import type { Place } from "../three/ParticleField";
import styles from "./sections.module.css";

const ParticleField = dynamic(() => import("../three/ParticleField"), { ssr: false });

const COUNT = 3600;
// Rain over the hero, then one form per stage: a worker, labelled frames,
// a neural network, and an agent wired into the systems it runs.
const shapes = [rain(COUNT), worker(COUNT), frames(COUNT), network(COUNT), agentHub(COUNT)];

export type Stage = {
  label: string;
  title: string;
  body: string;
  stat: ReactNode;
  cta: { label: string; href: string };
};

/**
 * The home page's "what we do" story. A fixed layer of particles falls like
 * rain over the hero, pours down as the page scrolls, and settles into the
 * story's first form when it pins. It then reforms at each stage: a worker carrying a box (real work), a stack of
 * labelled video frames (verified data), a neural network (models) and an
 * agent core wired to the systems it works across (agents).
 */
export function StackStory({ stages }: { stages: Stage[] }) {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const level = useRef(0.15);
  const place: Place = useRef({ x: 0, y: 0, scale: 1 });
  const layer = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [faded, setFaded] = useState(false);
  const last = stages.length - 1;

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    // Measured from the section itself on every frame that scrolls, so the
    // stages stay in step even when the page above changes height.
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = node.getBoundingClientRect();
      const view = window.innerHeight;
      // Rect sizes, not offsetHeight: the body is zoomed on mid-size screens.
      const range = box.height - view;
      const t = range > 0 ? Math.min(1, Math.max(0, -box.top / range)) : 0;
      // Each stage gets an equal share of the scroll, so the first and last
      // hold as long as the middle ones.
      const p = Math.min(last, Math.max(0, t * (last + 1) - 0.5));
      // Before the section pins, the rain pours toward the first form.
      const top = box.top + window.scrollY;
      const approach = top > 0 ? Math.min(1, Math.max(0, window.scrollY / top)) : 1;
      progress.current = approach < 1 ? approach : 1 + p;

      // Rain fills the screen; the forms sit to the right of the copy
      // (below it on phones).
      const phone = window.innerWidth <= 734;
      const settle = approach * approach;
      place.current = phone
        ? { x: 0, y: -1.0 * settle, scale: 1 - 0.4 * settle }
        : { x: 1.35 * settle, y: 0, scale: 1 - 0.12 * settle };

      // Fade the layer out once the story has scrolled past.
      const end = box.bottom - view;
      const opacity = Math.min(1, Math.max(0, 1 + end / (view * 0.45)));
      if (layer.current) {
        layer.current.style.opacity = String(approach < 1 ? 0.45 + 0.55 * approach : opacity);
        layer.current.style.visibility = opacity === 0 ? "hidden" : "visible";
      }
      setFaded(opacity === 0);
      // The agent core pulses once it has formed.
      level.current = p > last - 0.3 ? 0.3 : 0.12;
      setActive(Math.min(last, Math.round(p)));
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

  return (
    <section
      ref={section}
      className={styles.story}
      style={{ "--stages": stages.length } as React.CSSProperties}
      aria-labelledby="story-heading"
      data-motion="off"
    >
      <div ref={layer} className={styles.storyLayer} aria-hidden="true">
        <ParticleField
          className={styles.storyField}
          shapes={shapes}
          progress={progress}
          level={level}
          place={place}
          fall
          paused={faded}
          sway={0.4}
          yaw={-0.45}
          pointSize={17}
        />
      </div>
      <div className={styles.storySticky}>
        <div className={styles.storyCopy}>
          <h2 id="story-heading" className={styles.srOnly}>
            From real work to working AI
          </h2>
          <div className={styles.storyPanels}>
            {stages.map((stage, index) => (
              <div
                key={stage.label}
                className={`${styles.storyPanel} ${index === active ? styles.storyPanelActive : ""}`}
                aria-hidden={index !== active}
              >
                <h3>{stage.title}</h3>
                <p>{stage.body}</p>
                <p className={styles.storyStat}>{stage.stat}</p>
                <a href={stage.cta.href} tabIndex={index === active ? 0 : -1}>
                  {stage.cta.label}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
