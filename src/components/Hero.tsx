"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { MobileMenu } from "./site/MobileMenu";
import { NavMenu, menuOrder, menus } from "./site/NavMenu";
import styles from "./Hero.module.css";


const clamp = (value: number) => Math.min(1, Math.max(0, value));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  // Scrolling into the next section shrinks the hero video and flies it into
  // the layered scene, then hands over to the scene's own video.
  useEffect(() => {
    const hero = sectionRef.current;
    const video = videoRef.current;
    if (!hero || !video) return;
    const root = document.documentElement;
    let frame = 0;
    let landed = false;

    const reset = () => {
      video.removeAttribute("style");
      root.style.setProperty("--scene-reveal", "0");
      root.style.setProperty("--scene-photo", "0");
    };

    const update = () => {
      frame = 0;
      const end = document.querySelector<HTMLElement>("[data-hero-end]");
      const target = document.querySelector<HTMLElement>("[data-hero-target]");
      // Phones and tablets don't pin the next section, so skip the fly-in there.
      const flat =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.matchMedia("(max-width: 1200px)").matches;
      if (!end || !target || flat) {
        video.removeAttribute("style");
        root.style.removeProperty("--scene-reveal");
        root.style.removeProperty("--scene-photo");
        return;
      }
      // The body is CSS-zoomed on mid-size desktops; convert screen px to CSS px.
      const ratio = hero.getBoundingClientRect().width / hero.offsetWidth || 1;
      const endTop = end.getBoundingClientRect().top / ratio + window.scrollY / ratio;
      const p = clamp(window.scrollY / ratio / Math.max(1, endTop));
      const eased = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;

      if (fadeRef.current) fadeRef.current.style.opacity = `${1 - clamp(p * 3)}`;

      if (p <= 0.001) {
        landed = false;
        reset();
        return;
      }

      const box = target.getBoundingClientRect();
      const vw = window.innerWidth / ratio;
      const vh = window.innerHeight / ratio;
      const tx = box.left / ratio;
      const ty = box.top / ratio;
      const tw = box.width / ratio;
      const th = box.height / ratio;

      if (p >= 0.99) {
        if (!landed) {
          landed = true;
          const sceneVideo = target.parentElement?.querySelector("video");
          if (sceneVideo) sceneVideo.currentTime = video.currentTime;
        }
        video.style.visibility = "hidden";
        root.style.setProperty("--scene-photo", "1");
        root.style.setProperty("--scene-reveal", "1");
        return;
      }

      landed = false;
      root.style.setProperty("--scene-photo", "0");
      root.style.setProperty("--scene-reveal", `${clamp((p - 0.55) / 0.45)}`);
      Object.assign(video.style, {
        position: "fixed",
        zIndex: "30",
        visibility: "visible",
        left: `${mix(0, tx, eased)}px`,
        top: `${mix(0, ty, eased)}px`,
        width: `${mix(vw, tw, eased)}px`,
        height: `${mix(vh, th, eased)}px`,
        right: "auto",
        bottom: "auto",
        borderRadius: `${22 * eased}px`,
        transform: `perspective(1600px) rotateY(${26 * eased}deg) rotateX(${8 * eased}deg)`,
        boxShadow: `0 30px 60px rgba(76, 46, 170, ${0.18 * eased})`,
      });
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      video.removeAttribute("style");
      root.style.removeProperty("--scene-reveal");
      root.style.removeProperty("--scene-photo");
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero} aria-labelledby="hero-heading">
      <video
        ref={videoRef}
        className={styles.backgroundVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero-bg.png"
        aria-hidden="true"
      >
        <source src="/home/hero-video.mp4" type="video/mp4" />
      </video>
      <div ref={fadeRef} className={styles.fade}>
      <div className={styles.overlay} aria-hidden="true" />
      <header className={styles.header}>
        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {menuOrder.map((id) => (
              <li key={id}>
                <NavMenu menu={id} className={styles.navLink} placement="side">
                  <span className={styles.navLabel}>{menus[id].label}</span>
                  <img className={styles.chevron} src="/chevron.svg" alt="" />
                </NavMenu>
              </li>
            ))}
          </ul>
        </nav>
        <Link className={styles.logo} href="/" aria-label="CNTXT AI">
          <img className={styles.logoImage} src="/logo.svg" alt="" />
        </Link>
        <div className={styles.actions}>
          <MobileMenu dark />
        </div>
      </header>
      <div className={styles.headline}>
        <h1 id="hero-heading">Real-world AI for the world&apos;s most important work.</h1>
        <a className={styles.cta} href="/contact">
          Get started
          <img src="/healthcare/caret.svg" alt="" width={20} height={20} />
        </a>
      </div>
      <p className={styles.srOnly}>
        The appearance of U.S. Department of War (DoW) visual information does
        not imply or constitute DoW endorsement.
      </p>
      </div>
    </section>
  );
}
