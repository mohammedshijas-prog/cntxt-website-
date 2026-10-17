"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import styles from "./videoToggle.module.css";

/** Videos the viewer (or reduced motion) has paused; observers must not restart them. */
const userPaused = new WeakSet<HTMLVideoElement>();
export const isUserPaused = (video: HTMLVideoElement) => userPaused.has(video);

/**
 * Pause/play control for a decorative background video (WCAG 2.2.2). With
 * reduced motion requested, the video starts paused.
 */
export function VideoToggle({ video, tone = "light" }: { video: RefObject<HTMLVideoElement | null>; tone?: "light" | "dark" }) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const onPlay = () => setPaused(false);
    const onPause = () => setPaused(true);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      userPaused.add(el);
      el.pause();
    }
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, [video]);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      userPaused.delete(el);
      el.play().catch(() => {});
    } else {
      userPaused.add(el);
      el.pause();
    }
  };

  return (
    <button type="button" className={`${styles.toggle} ${tone === "dark" ? styles.dark : ""}`} onClick={toggle} aria-label={paused ? "Play background video" : "Pause background video"}>
      {paused ? (
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="currentColor" /></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5h3v11H3zM8 1.5h3v11H8z" fill="currentColor" /></svg>
      )}
    </button>
  );
}

/** A background video with its own pause control, for server-rendered pages. */
export function BackgroundVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  return <BackgroundVideoInner src={src} poster={poster} className={className} />;
}


function BackgroundVideoInner({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  return (
    <>
      <video ref={ref} className={className} autoPlay muted loop playsInline preload="metadata" poster={poster} aria-hidden="true">
        <source src={src} type="video/mp4" />
      </video>
      <VideoToggle video={ref} />
    </>
  );
}
