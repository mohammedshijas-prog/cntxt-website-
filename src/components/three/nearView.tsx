"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentType } from "react";

/*
 * three.js is the heaviest code on the site (about 230 KB compressed). A scene
 * built with nearView only downloads it when the scene is about to scroll into
 * view; `idle` also waits for a quiet moment, so a scene at the top of a page
 * never delays the headline and copy from painting.
 */
export function nearView<P extends { className?: string }>(
  load: () => Promise<{ default: ComponentType<P> }>,
  { margin = "600px", idle = false }: { margin?: string; idle?: boolean } = {},
) {
  const Scene = dynamic(load, { ssr: false });
  function Near(props: P) {
    const holder = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);
    useEffect(() => {
      const node = holder.current;
      if (!node) return;
      let handle = 0;
      const show = () => {
        if (!idle) return setReady(true);
        if (typeof window.requestIdleCallback === "function") handle = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
        else handle = window.setTimeout(() => setReady(true), 400);
      };
      const seen = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          seen.disconnect();
          show();
        },
        { rootMargin: margin },
      );
      seen.observe(node);
      return () => {
        seen.disconnect();
        if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(handle);
        window.clearTimeout(handle);
      };
    }, []);
    return ready ? <Scene {...props} /> : <div ref={holder} className={props.className} aria-hidden="true" />;
  }
  return Near;
}
