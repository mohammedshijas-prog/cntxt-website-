"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { MobileMenu } from "./site/MobileMenu";
import { VideoToggle, isUserPaused } from "./shared/VideoToggle";
import { NavMenu, menuOrder, menus } from "./site/NavMenu";
import styles from "./Hero.module.css";


const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  // Frame transition: the hero pins while the footage pulls back into a
  // rounded card on the page and the copy fades, then the card scrolls away
  // into the next section. Only one CSS variable changes per frame.
  useEffect(() => {
    const hero = sectionRef.current;
    const video = videoRef.current;
    if (!hero || !video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let last = -1;

    const update = () => {
      frame = 0;
      // The pinned distance is the extra track height beyond one screen.
      // Rect height, not offsetHeight: the body is zoomed on mid-size screens.
      const travel = hero.getBoundingClientRect().height - window.innerHeight;
      const lift = reduced.matches || travel <= 0 ? 0 : clamp(window.scrollY / travel);
      const rounded = Math.round(lift * 1000) / 1000;
      if (rounded === last) return;
      last = rounded;
      hero.style.setProperty("--lift", `${rounded}`);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // The footage only plays while some of the hero is on screen.
    const seen = new IntersectionObserver(([entry]) => {
      // Respect a pause from the viewer or from reduced motion.
      if (entry.isIntersecting && !isUserPaused(video)) video.play().catch(() => {});
      else video.pause();
    });
    seen.observe(hero);

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frame);
      seen.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      hero.style.removeProperty("--lift");
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.stage}>
      <video
        ref={videoRef}
        className={styles.backgroundVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero-bg.webp"
        aria-hidden="true"
      >
        <source src="/home/hero-video.mp4" type="video/mp4" />
      </video>
      <VideoToggle video={videoRef} />
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
          <a className={styles.demo} href="/contact">
            Book a demo
          </a>
          <MobileMenu dark />
        </div>
      </header>
      <div className={styles.headline}>
        <a
          className={styles.news}
          href="https://www.wamda.com/2026/06/cntxt-ai-closes-60-million-series-deploy-secure-ai-infrastructure-worldwide"
        >
          <span>News</span>
          CNTXT AI raises a $60M Series A, co-led by AI71 and BlueFive Capital
          <span aria-hidden="true">→</span>
        </a>
        <h1 id="hero-heading">Real-world AI, from data to deployment.</h1>
        <p className={styles.sub}>
          We capture and verify data from real work, train models on it, and deploy Arabic-first
          AI agents on your own infrastructure.
        </p>
        <div className={styles.ctaRow}>
          <a className={styles.cta} href="/contact">
            Book a demo
            <img src="/healthcare/caret.svg" alt="" width={20} height={20} />
          </a>
          <a className={styles.ghost} href="/products">
            Explore the AI Lab
          </a>
        </div>
      </div>
      </div>
      </div>
    </section>
  );
}
