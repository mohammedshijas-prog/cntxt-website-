"use client";

import { useEffect, useRef } from "react";
import styles from "./home.module.css";
import { LOGO_HEIGHT, LOGO_WIDTH, logoPaths } from "./logoPaths";

/** Point inside the wordmark (logo units) the camera flies into: the X's crossing. */
const FOCUS = { x: 129.1, y: 24 };
/** How far the final frame is zoomed in, relative to the resting logo. */
const MAX_ZOOM = 180;
/** Share of the scroll spent revealing the logo before the zoom starts. */
const REVEAL = 0.2;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Pinned section: the wordmark grows in from the center, then scrolling flies
 * the camera into it until its white fills the screen and hands off to the
 * next section.
 */
export function LogoZoom() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const svg = svgRef.current;
    if (!section || !stage || !svg) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // `target`/`current`: progress through the pinned range. `entry`: how far
    // the section has risen into view before it pins (0 → 1).
    let target = 0;
    let current = -1;
    let entryTarget = 0;
    let entry = -1;
    let frame = 0;

    // The page is CSS-zoomed on mid-size desktops (see globals.css), which shrinks
    // 100vh; size the stage from the real window height so it fills the screen.
    const fitStage = () => {
      const ratio = stage.getBoundingClientRect().width / stage.offsetWidth || 1;
      stage.style.height = Math.abs(ratio - 1) > 0.01 ? `${window.innerHeight / ratio}px` : "";
    };

    const measure = () => {
      const rect = section.getBoundingClientRect();
      const range = rect.height - stage.getBoundingClientRect().height;
      target = range > 0 ? clamp(-rect.top / range) : 0;
      entryTarget = clamp(1 - rect.top / window.innerHeight);
    };

    const render = (progress: number, rise: number) => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const baseWidth = Math.min(w * (w < 720 ? 0.86 : 0.62), 1080);
      const baseHeight = (baseWidth * LOGO_HEIGHT) / LOGO_WIDTH;

      const reveal = clamp(progress / REVEAL);
      const zoom = clamp((progress - REVEAL) / (1 - REVEAL));
      // Exponential zoom reads as a steady fly-through.
      const scale = (0.82 + 0.18 * reveal) * MAX_ZOOM ** (zoom ** 1.15);
      const pxPerUnit = (baseWidth * scale) / LOGO_WIDTH;

      // Where the focus point sits on screen: on the resting logo at first,
      // drifting to the center of the screen as the zoom takes over.
      const restX = (w - baseWidth) / 2 + FOCUS.x * (baseWidth / LOGO_WIDTH);
      const restY = h * 0.54 - baseHeight / 2 + FOCUS.y * (baseWidth / LOGO_WIDTH);
      const drift = Math.min(1, zoom * 2.2);
      const screenX = restX + (w / 2 - restX) * drift;
      const screenY = restY + (h / 2 - restY) * drift;

      const vbX = FOCUS.x - screenX / pxPerUnit;
      const vbY = FOCUS.y - screenY / pxPerUnit;
      svg.setAttribute("viewBox", `${vbX} ${vbY} ${w / pxPerUnit} ${h / pxPerUnit}`);
      // The purple fades in from the page's off-white: part while the section
      // rises into view, the rest over the reveal. The logo follows once
      // there is colour behind it.
      const purple = clamp((rise - 0.35) / 0.65) * 0.45 + clamp(reveal / 0.7) * 0.55;
      if (fadeRef.current) fadeRef.current.style.opacity = `${1 - purple}`;
      const logo = clamp((reveal - 0.3) / 0.7);
      svg.style.opacity = `${logo}`;

      if (captionRef.current) {
        const fade = clamp(1 - zoom * 6);
        captionRef.current.style.opacity = `${logo * fade}`;
        captionRef.current.style.top = `${h * 0.54 - baseHeight / 2 - 44}px`;
        captionRef.current.style.transform = `translateX(-50%) translateY(${(1 - logo) * 12}px)`;
      }
      // Last stretch: settle on the page background so the next section follows on.
      if (washRef.current) washRef.current.style.opacity = `${clamp((zoom - 0.9) / 0.1)}`;
    };

    const tick = () => {
      frame = 0;
      const ease = (value: number, goal: number) =>
        reduced.matches || value < 0 ? goal : value + (goal - value) * 0.16;
      const next = ease(current, target);
      const nextEntry = ease(entry, entryTarget);
      const settled = Math.abs(next - target) < 0.0005 && Math.abs(nextEntry - entryTarget) < 0.0005;
      current = settled ? target : next;
      entry = settled ? entryTarget : nextEntry;
      render(current, entry);
      if (!settled) frame = requestAnimationFrame(tick);
    };

    const request = () => {
      measure();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onResize = () => {
      fitStage();
      request();
    };

    fitStage();
    request();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.logoZoom} aria-label="That’s why we created CNTXT AI">
      <div ref={stageRef} className={styles.logoStage}>
        <div ref={fadeRef} className={styles.logoFade} aria-hidden="true" />
        <p ref={captionRef} className={styles.logoCaption} aria-hidden="true">
          That’s why we created
        </p>
        <svg ref={svgRef} className={styles.logoArt} preserveAspectRatio="none" aria-hidden="true">
          {logoPaths.map((d) => (
            <path key={d.slice(0, 24)} d={d} />
          ))}
        </svg>
        <div ref={washRef} className={styles.logoWash} aria-hidden="true" />
      </div>
    </section>
  );
}
