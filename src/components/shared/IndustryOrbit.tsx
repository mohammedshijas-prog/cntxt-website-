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
  { label: "Energy", href: "/solutions", image: "/healthcare/tile-energy.png", x: 3, y: 14, size: 210, drift: 14, speed: 0.9, phase: 0 },
  { label: "Government", href: "/solutions", image: "/healthcare/tile-gov.jpg", x: 27, y: 8, size: 154, drift: 12, speed: 1.1, phase: 1.7 },
  { label: "Healthcare", href: "/healthcare", image: "/healthcare/tile-lab.jpg", x: 60, y: 7, size: 158, drift: 13, speed: 0.8, phase: 3.1 },
  { label: "Logistics", href: "/solutions", image: "/healthcare/tile-ship.jpg", x: 81, y: 27, size: 176, drift: 15, speed: 1, phase: 4.4 },
  { label: "Robotics", href: "/solutions", image: "/healthcare/tile-robot.jpg", x: 83, y: 63, size: 214, drift: 12, speed: 0.7, phase: 2.2 },
  { label: "Finance", href: "/solutions", image: "/healthcare/tile-chart.jpg", x: 14, y: 67, size: 184, drift: 13, speed: 0.95, phase: 0.8 },
];

/** Pairs of industry indexes joined by a line. */
const edges: [number, number][] = [
  [0, 1],
  [0, 5],
  [2, 3],
  [2, 4],
  [3, 4],
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

    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    seen.observe(root);

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (!visible || stacked.matches) return;
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

      edges.forEach(([from, to], i) => {
        const a = industries[from];
        const b = industries[to];
        const x1 = (a.x / 100) * size.w + a.size / 2 + offsets[from].x;
        const y1 = (a.y / 100) * size.h + a.size / 2 + offsets[from].y;
        const x2 = (b.x / 100) * size.w + b.size / 2 + offsets[to].x;
        const y2 = (b.y / 100) * size.h + b.size / 2 + offsets[to].y;
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
