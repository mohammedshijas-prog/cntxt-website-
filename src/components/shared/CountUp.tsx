"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts from 1 up to `value` the first time it scrolls into view.
 * The final value is rendered on the server and read out to screen readers.
 */
export function CountUp({
  value,
  suffix = "",
  duration = 1600,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setShown(1);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, Math.max(0, (now - start) / duration));
          const eased = 1 - (1 - t) ** 3;
          setShown(Math.max(1, Math.round(1 + (value - 1) * eased)));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <p ref={ref} className={className} aria-label={`${value.toLocaleString()}${suffix}`}>
      <span aria-hidden="true" style={{ fontVariantNumeric: "tabular-nums" }}>
        {shown.toLocaleString()}
        {suffix}
      </span>
    </p>
  );
}
