"use client";

import { useEffect, useRef } from "react";
import styles from "./pipelineBand.module.css";

const stages = ["Raw data", "Capture", "Verify", "Label", "Train", "Deploy"];

/** How strongly each cell of a stage's zone is lit, before the sweep. */
function pattern(zone: number, u: number, v: number, seed: number): number {
  switch (zone) {
    case 0: // Real work: loose, uneven specks.
      return seed > 0.86 ? 0.25 + seed * 0.5 : 0;
    case 1: // Capture: film strips.
      return Math.floor(u * 7) % 2 === 0 && Math.abs(v - 0.5) < 0.36 ? 0.75 : 0;
    case 2: // Verify: fine ruled lines, a few gaps where review rejected a clip.
      return Math.floor(u * 12) % 2 === 0 && Math.abs(v - 0.5) < 0.4 && seed > 0.08 ? 0.6 : 0;
    case 3: // Label: blocky boxes.
      return Math.abs(v - 0.5) < 0.32 && (Math.floor(v * 9) + Math.floor(u * 4)) % 2 === 0 ? 0.8 : seed > 0.9 ? 0.3 : 0;
    case 4: // Train: a model's frame.
      return Math.abs(v - 0.5) < 0.32 && (u < 0.12 || u > 0.88 || Math.abs(v - 0.5) > 0.27) ? 0.85 : 0;
    default: {
      // Deploy: a chevron of horizontal lines pointing right.
      const dist = Math.abs(v - 0.5) * 2;
      return Math.floor(v * 30) % 2 === 0 && u < 1 - dist * 0.75 && dist < 0.7 ? 0.9 : 0;
    }
  }
}

/**
 * "One platform. Full data pipeline.": the pipeline drawn as a dot matrix, with
 * a band of light sweeping from raw work to deployed AI.
 */
export function PipelineBand() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = canvas.current;
    const ctx = node?.getContext("2d");
    if (!node || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cell = 6;
    let cols = 0;
    let rows = 0;
    let base = new Float32Array(0);
    let dpr = 1;

    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      node.width = Math.round(node.clientWidth * dpr);
      node.height = Math.round(node.clientHeight * dpr);
      cols = Math.floor(node.clientWidth / cell);
      rows = Math.floor(node.clientHeight / cell);
      base = new Float32Array(cols * rows);
      const zoneWidth = cols / stages.length;
      for (let x = 0; x < cols; x++) {
        const zone = Math.min(stages.length - 1, Math.floor(x / zoneWidth));
        const u = (x - zone * zoneWidth) / zoneWidth;
        for (let y = 0; y < rows; y++) {
          const seed = Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
          base[y * cols + x] = pattern(zone, u, y / rows, seed);
        }
      }
    };
    layout();
    const sizer = new ResizeObserver(layout);
    sizer.observe(node);

    let frame = 0;
    let visible = false;
    let time = 0;
    const draw = () => {
      time += 0.016;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, node.clientWidth, node.clientHeight);
      // The sweep crosses the whole pipeline every few seconds.
      const sweep = ((time * 0.22) % 1.3) - 0.15;
      for (let x = 0; x < cols; x++) {
        const d = x / cols - sweep;
        const glow = reduced ? 0.6 : 0.32 + 0.68 * Math.exp(-(d * d) / 0.012);
        for (let y = 0; y < rows; y++) {
          const a = base[y * cols + x];
          if (!a) continue;
          // Raw specks drift a little; everything after capture holds still.
          const jitter = x < cols / stages.length && !reduced ? Math.sin(time * 2 + y * 0.7 + x) * 1.2 : 0;
          ctx.fillStyle = `rgba(125, 82, 244, ${(a * glow).toFixed(3)})`;
          ctx.fillRect(x * cell + jitter, y * cell, cell - 2, cell - 2);
        }
      }
      frame = visible && !reduced ? requestAnimationFrame(draw) : 0;
    };

    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(draw);
    });
    seen.observe(node);
    draw();

    return () => {
      cancelAnimationFrame(frame);
      seen.disconnect();
      sizer.disconnect();
    };
  }, []);

  return (
    <section className={styles.band} aria-labelledby="pipeline-heading">
      <h2 id="pipeline-heading">
        One platform.
        <br />
        Full data pipeline.
      </h2>
      <div className={styles.flow}>
        <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
        <ol className={styles.stages}>
          {stages.map((stage) => (
            <li key={stage}>{stage}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
