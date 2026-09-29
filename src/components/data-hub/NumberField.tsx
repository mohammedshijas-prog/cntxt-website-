"use client";

import { useEffect, useRef } from "react";

const CELL = 28;
const FONT = '500 13px "Geist Mono", ui-monospace, monospace';

/** Soft grid of random digits that keep changing; a few light up and fade. */
export function NumberField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cols = 0;
    let rows = 0;
    let digits: string[] = [];
    let glow: number[] = [];
    let frame = 0;
    let last = 0;
    let visible = true;

    const randomDigit = () => String(Math.floor(Math.random() * 10));

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
      digits = Array.from({ length: cols * rows }, randomDigit);
      glow = Array.from({ length: cols * rows }, () => 0);
      draw();
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      ctx.font = FONT;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          // Fade the field toward the centre so the headline stays readable.
          const dx = (c * CELL - width / 2) / (width / 2);
          const dy = (r * CELL - height * 0.45) / (height / 2);
          const edge = Math.min(1, Math.hypot(dx * 0.9, dy * 1.2));
          const base = 0.06 + edge * 0.16;
          const alpha = Math.min(0.85, base + glow[i] * 0.6);
          ctx.fillStyle = glow[i] > 0.05 ? `rgba(125, 82, 244, ${alpha})` : `rgba(125, 82, 244, ${base})`;
          ctx.fillText(digits[i], c * CELL + CELL / 2, r * CELL + CELL / 2);
        }
      }
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!visible || now - last < 90) return;
      last = now;
      const total = digits.length;
      // Change a handful of digits and light a few up each step.
      for (let k = 0; k < Math.ceil(total * 0.02); k++) digits[Math.floor(Math.random() * total)] = randomDigit();
      for (let k = 0; k < Math.ceil(total * 0.004); k++) glow[Math.floor(Math.random() * total)] = 1;
      for (let i = 0; i < total; i++) if (glow[i] > 0) glow[i] = Math.max(0, glow[i] - 0.06);
      draw();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    seen.observe(canvas);
    if (!reduced) frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      seen.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
