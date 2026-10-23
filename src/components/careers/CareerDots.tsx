"use client";

import { nearView } from "../three/nearView";
import { useEffect, useRef, useState } from "react";
import { briefcase, growth, team } from "../three/shapes";

const ParticleField = nearView(() => import("../three/ParticleField"), { idle: true });

/** The careers hero in the site's dots: a team, then growth, then the work, and back. */
export function CareerDots({ className }: { className?: string }) {
  const [shapes] = useState(() => {
    const count = typeof window !== "undefined" && window.innerWidth <= 734 ? 1800 : 3000;
    return [team(count), growth(count), briefcase(count)];
  });
  const progress = useRef(0);
  const level = useRef(0.2);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Ping-pong through the shapes so each morph is a single step.
    const order = [0, 1, 2, 1];
    let step = 0;
    const id = window.setInterval(() => {
      step = (step + 1) % order.length;
      progress.current = order[step];
    }, 3600);
    return () => window.clearInterval(id);
  }, []);

  return <ParticleField className={className} shapes={shapes} progress={progress} level={level} sway={0.35} yaw={-0.3} pointSize={18} light />;
}
