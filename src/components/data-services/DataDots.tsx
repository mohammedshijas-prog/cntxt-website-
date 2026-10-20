"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { ribbon, terrain } from "../three/shapes";

const ParticleField = dynamic(() => import("../three/ParticleField"), { ssr: false });

/** An abstract form in the site's purple dots: a flowing ribbon or a rolling surface. */
export function DataDots({ form, className }: { form: "ribbon" | "terrain"; className?: string }) {
  const [shapes] = useState(() => {
    const phone = typeof window !== "undefined" && window.innerWidth <= 734;
    const count = phone ? 2200 : 4200;
    return [form === "ribbon" ? ribbon(count) : terrain(count)];
  });
  const level = useRef(0.2);
  return <ParticleField className={className} shapes={shapes} level={level} sway={form === "ribbon" ? 0.4 : 0.22} yaw={form === "ribbon" ? -0.35 : 0.35} pointSize={form === "ribbon" ? 16 : 14} scale={form === "terrain" ? 0.95 : 1} light />;
}
