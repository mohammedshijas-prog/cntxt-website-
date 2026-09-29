"use client";

import { useEffect, useRef } from "react";
import { drawContours } from "./contours";
import styles from "./layeredScene.module.css";

/** Binary labels on the back frame, as [left %, top %, text]. */
const labels: [number, number, string][] = [
  [10, 6, "11"],
  [36, 10, "011"],
  [84, 14, "1000"],
  [66, 38, "110"],
  [88, 56, "010"],
  [72, 74, "1000"],
  [90, 84, "10"],
];

/** Resting rotation: turned toward the text beside it, or square-on when centred. */
function baseAngle(facing: "left" | "right" | "center") {
  return facing === "right" ? 26 : facing === "left" ? -26 : 0;
}

/**
 * Exploded 3D view of the hero footage: the video, its traced contour lines
 * and outlined frames stacked in depth. Tilts slowly toward the pointer.
 */
export function LayeredScene({
  className,
  facing = "right",
}: {
  className?: string;
  /** Which way the stack turns: toward text on its right or on its left. */
  facing?: "left" | "right" | "center";
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const facingRef = useRef(facing);

  useEffect(() => {
    facingRef.current = facing;
  }, [facing]);

  useEffect(() => {
    const root = rootRef.current;
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    if (!root || !scene || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const poster = new Image();
    poster.src = "/hero-bg.png";
    const tilt = { x: 0, y: 0, tx: 0, ty: 0, base: baseAngle(facingRef.current), spread: 1, hover: 0 };
    let visible = true;
    let frame = 0;
    let lastTrace = 0;

    const trace = () => {
      const video = videoRef.current;
      const source = video && video.readyState >= 2 ? video : poster.complete ? poster : null;
      if (source) drawContours(canvas, source, "125, 82, 244");
    };

    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      tilt.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      tilt.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      tilt.hover = 1;
    };
    const onLeave = () => {
      tilt.tx = 0;
      tilt.ty = 0;
      tilt.hover = 0;
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!visible) return;
      // Slow easing toward the pointer, plus a gentle idle drift.
      tilt.x += (tilt.tx - tilt.x) * 0.05;
      tilt.y += (tilt.ty - tilt.y) * 0.05;
      // Turn smoothly to face the text when the stack changes sides.
      const base = baseAngle(facingRef.current);
      tilt.base += (base - tilt.base) * 0.06;
      // Layers fan further apart while hovered.
      tilt.spread += (1 + tilt.hover * 0.45 - tilt.spread) * 0.06;
      const drift = reduced ? 0 : Math.sin(now / 2600) * 1.5;
      const ry = tilt.base + tilt.x * 14 + drift;
      const rx = 8 - tilt.y * 10;
      scene.style.transform = `rotateY(${ry}deg) rotateX(${rx}deg) scale(${1 + tilt.hover * 0.03})`;
      scene.style.setProperty("--spread", tilt.spread.toFixed(3));
      if (now - lastTrace > 160) {
        lastTrace = now;
        trace();
      }
    };

    poster.onload = trace;
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    seen.observe(root);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      seen.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className={`${styles.root} ${className ?? ""}`} data-facing={facing} aria-hidden="true">
      {/* Untransformed box matching the scene: the hero video flies into it. */}
      <div className={styles.sceneBox} data-hero-target="" />
      <div ref={sceneRef} className={styles.scene}>
        <div className={`${styles.layer} ${styles.frame} ${styles.back}`}>
          {labels.map(([left, top, text]) => (
            <span key={`${left}-${top}`} style={{ left: `${left}%`, top: `${top}%` }}>
              {text}
            </span>
          ))}
        </div>
        <div className={`${styles.layer} ${styles.photo}`}>
          <video ref={videoRef} autoPlay muted loop playsInline preload="metadata" poster="/hero-bg.png">
            <source src="/home/hero-video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className={`${styles.layer} ${styles.frame} ${styles.mid}`}>
          <i style={{ top: "24%" }} />
          <i style={{ top: "50%" }} />
          <i style={{ top: "76%" }} />
        </div>
        <canvas ref={canvasRef} className={`${styles.layer} ${styles.contours}`} />
        <div className={`${styles.layer} ${styles.frame} ${styles.front1}`} />
        <div className={`${styles.layer} ${styles.frame} ${styles.front2}`} />
        <div className={`${styles.layer} ${styles.frame} ${styles.front3}`} />
      </div>
    </div>
  );
}
