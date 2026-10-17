"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./industries.module.css";

type Industry = {
  label: string;
  href: string;
  image: string;
  /** Resting position, as a percentage of the section. */
  x: number;
  y: number;
  /** Tile edge length in px. */
  size: number;
  /** Drift radius in px and speed multiplier. */
  drift: number;
  speed: number;
  phase: number;
};

const industries: Industry[] = [
  // Left side
  { label: "AI labs", href: "/physical-ai", image: "/art/cover-12.svg", x: 3, y: 6, size: 132, drift: 10, speed: 0.9, phase: 0 },
  { label: "Government", href: "/industries/public-sector", image: "/industries/government.jpg", x: 19, y: 3, size: 116, drift: 10, speed: 1.05, phase: 1.7 },
  { label: "Energy", href: "/solutions", image: "/healthcare/tile-energy.webp", x: 13, y: 33, size: 128, drift: 11, speed: 0.85, phase: 3.1 },
  { label: "Finance", href: "/industries/financial-services", image: "/healthcare/tile-chart.webp", x: 2, y: 55, size: 112, drift: 10, speed: 1.1, phase: 0.8 },
  { label: "Healthcare", href: "/healthcare", image: "/healthcare/tile-lab.webp", x: 20, y: 64, size: 124, drift: 11, speed: 0.95, phase: 2.4 },
  { label: "Insurance", href: "/industries/insurance", image: "/security/practice-a.png", x: 6, y: 80, size: 108, drift: 10, speed: 1, phase: 4.6 },
  // Right side
  { label: "Logistics", href: "/solutions", image: "/healthcare/tile-ship.webp", x: 72, y: 3, size: 120, drift: 10, speed: 1, phase: 4.4 },
  { label: "Hospitality", href: "/solutions", image: "/industries/hospitality.jpg", x: 88, y: 8, size: 128, drift: 11, speed: 0.95, phase: 2.2 },
  { label: "Robotics", href: "/physical-ai", image: "/healthcare/tile-robot.webp", x: 79, y: 36, size: 132, drift: 11, speed: 0.75, phase: 5.1 },
  { label: "Real estate", href: "/industries/real-estate", image: "/solutions/study-4.webp", x: 90, y: 56, size: 108, drift: 10, speed: 1.05, phase: 1.1 },
  { label: "Retail", href: "/solutions", image: "/security/practice-b.png", x: 73, y: 66, size: 120, drift: 10, speed: 1.1, phase: 3.6 },
  { label: "Aviation", href: "/solutions", image: "/solutions/study-3.webp", x: 87, y: 81, size: 108, drift: 10, speed: 0.9, phase: 0.4 },
];

/** Meeting points where the two sides join, above and below the copy (% of the section). */
const hubs = [
  { x: 50, y: 9 },
  { x: 50, y: 94 },
];
const TOP = industries.length;
const BOTTOM = industries.length + 1;

/**
 * Each side is one unbroken chain through all of its tiles; the chains split
 * from the top hub and rejoin at the bottom hub.
 */
const edges: [number, number][] = [
  // Left: Government → AI → Energy → Finance → Sovereignty → Healthcare
  [TOP, 1],
  [1, 0],
  [0, 2],
  [2, 3],
  [3, 5],
  [5, 4],
  [4, BOTTOM],
  // Right: Logistics → Hospitality → Robotics → Research → Operations → Retail
  [TOP, 6],
  [6, 7],
  [7, 8],
  [8, 9],
  [9, 11],
  [11, 10],
  [10, BOTTOM],
];

const DASH = 26;

export function IndustryOrbit() {
  const rootRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const dashRefs = useRef<(SVGLineElement | null)[]>([]);
  const hoverRef = useRef<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    hoverRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const stacked = window.matchMedia("(max-width: 1200px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const size = { w: root.offsetWidth, h: root.offsetHeight };
    const offsets = industries.map(() => ({ x: 0, y: 0 }));
    let visible = true;
    let frame = 0;
    let start = 0;

    const resize = new ResizeObserver(([entry]) => {
      size.w = entry.contentRect.width;
      size.h = entry.contentRect.height;
    });
    resize.observe(root);

    // Off screen (or stacked on small screens) the loop stops entirely.
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(draw);
    });
    seen.observe(root);
    const onStacked = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    stacked.addEventListener("change", onStacked);

    const draw = (now: number) => {
      frame = visible && !stacked.matches ? requestAnimationFrame(draw) : 0;
      if (!frame) return;
      if (!start) start = now;
      const t = (now - start) / 1000;
      const still = reduced.matches;

      industries.forEach((item, i) => {
        // Hovered tile holds still so it is easy to click.
        if (!still && hoverRef.current !== i) {
          const a = t * 0.5 * item.speed + item.phase;
          offsets[i].x = Math.sin(a) * item.drift;
          offsets[i].y = Math.cos(a * 0.8) * item.drift * 0.8;
        }
        const tile = tileRefs.current[i];
        if (tile) tile.style.transform = `translate3d(${offsets[i].x}px, ${offsets[i].y}px, 0)`;
      });

      // Centre of a tile's frame, or a hub point, in px.
      const point = (i: number) => {
        const hub = hubs[i - industries.length];
        if (hub) return { x: (hub.x / 100) * size.w, y: (hub.y / 100) * size.h };
        const item = industries[i];
        return {
          x: (item.x / 100) * size.w + item.size / 2 + offsets[i].x,
          y: (item.y / 100) * size.h + item.size / 2 + offsets[i].y,
        };
      };

      edges.forEach(([from, to], i) => {
        const { x: x1, y: y1 } = point(from);
        const { x: x2, y: y2 } = point(to);
        const length = Math.hypot(x2 - x1, y2 - y1);

        for (const line of [lineRefs.current[i], dashRefs.current[i]]) {
          if (!line) continue;
          line.setAttribute("x1", `${x1}`);
          line.setAttribute("y1", `${y1}`);
          line.setAttribute("x2", `${x2}`);
          line.setAttribute("y2", `${y2}`);
        }

        // A short dark segment travels back and forth along each line.
        const dash = dashRefs.current[i];
        if (dash) {
          const travel = still ? 0.5 : (Math.sin(t * 0.6 + i * 1.3) + 1) / 2;
          const pos = 0.25 * length + travel * 0.5 * length;
          dash.style.strokeDasharray = `0 ${pos} ${DASH} ${length}`;
        }
      });
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      stacked.removeEventListener("change", onStacked);
      resize.disconnect();
      seen.disconnect();
    };
  }, []);

  return (
    <div className={styles.orbit} ref={rootRef}>
      <svg className={styles.orbitLines} aria-hidden="true">
        {edges.map(([from, to], i) => {
          const active = hovered === from || hovered === to;
          return (
            <g key={`${from}-${to}`} className={active ? styles.lineActive : undefined}>
              <line ref={(el) => { lineRefs.current[i] = el; }} className={styles.orbitLine} />
              <line ref={(el) => { dashRefs.current[i] = el; }} className={styles.orbitDash} />
            </g>
          );
        })}
        {hubs.map((hub) => (
          <circle key={`${hub.x}-${hub.y}`} className={styles.orbitHub} cx={`${hub.x}%`} cy={`${hub.y}%`} r="3" />
        ))}
      </svg>
      {industries.map((item, i) => (
        <a
          key={item.label}
          ref={(el) => { tileRefs.current[i] = el; }}
          className={styles.tile}
          href={item.href}
          style={{ left: `${item.x}%`, top: `${item.y}%`, width: item.size }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered(i)}
          onBlur={() => setHovered(null)}
        >
          <span className={styles.tileFrame} style={{ height: item.size }}>
            <img src={item.image} alt="" />
            <span className={styles.tileExplore}>
              Explore
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
          <span className={styles.tileLabel}>{item.label}</span>
        </a>
      ))}
    </div>
  );
}
