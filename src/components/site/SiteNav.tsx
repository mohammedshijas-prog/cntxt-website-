"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { NavMenu, menuOrder, menus, type MenuId } from "./NavMenu";
import styles from "./siteNav.module.css";

type Current = "products" | "solutions" | "data-hub";

// Older page ids map onto the new top-level menus.
const currentMenu: Record<Current, MenuId> = { products: "lab", solutions: "industries", "data-hub": "lab" };

/*
 * The liquid-glass lens. A displacement map that is neutral in the middle and
 * ramps toward the edges bends whatever scrolls under the bar, the way Apple's
 * Liquid Glass refracts at its rim. Chromium applies SVG filters in
 * backdrop-filter; other browsers fall back to a clear frosted pill.
 */
const lensMap = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 60" preserveAspectRatio="none">
    <defs>
      <linearGradient id="x" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#ff0000"/><stop offset="0.1" stop-color="#800000"/>
        <stop offset="0.9" stop-color="#800000"/><stop offset="1" stop-color="#000000"/>
      </linearGradient>
      <linearGradient id="y" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#008000"/><stop offset="1" stop-color="#008000"/>
      </linearGradient>
    </defs>
    <rect width="400" height="60" fill="url(#x)"/>
    <rect width="400" height="60" fill="url(#y)" style="mix-blend-mode:screen"/>
  </svg>`,
)}`;

function GlassLens() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <filter id="cntxt-lens" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feImage href={lensMap} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="soft" />
        <feDisplacementMap in="soft" in2="map" scale="28" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}


export function SiteNav({
  current,
  pinAfterHero = false,
}: {
  current?: Current;
  pinAfterHero?: boolean;
}) {
  const [glass, setGlass] = useState(false);
  const [lens, setLens] = useState(false);

  // Only Chromium refracts through an SVG backdrop filter.
  useEffect(() => {
    const id = requestAnimationFrame(() => setLens(/Chrome\//.test(navigator.userAgent)));
    return () => cancelAnimationFrame(id);
  }, []);
  const [shown, setShown] = useState(!pinAfterHero);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (pinAfterHero) {
        const pastHero = y > window.innerHeight * 0.72;
        setShown(pastHero);
        setGlass(pastHero);
        return;
      }
      setGlass(y > 8);
    };
    let frame = 0;
    const request = () => {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          onScroll();
        });
      }
    };
    onScroll();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [pinAfterHero]);

  return (
    <header className={`${styles.navWrap} ${glass ? styles.glass : ""} ${lens ? styles.lens : ""} ${shown ? "" : styles.pending}`}>
      <GlassLens />
      <div className={styles.nav}>
        <Link href="/" aria-label="CNTXT AI">
          <img
            src="/partners/nav-logo.svg"
            alt=""
            width={145}
            height={22}
          />
        </Link>
        <nav aria-label="Primary">
          {menuOrder.map((id) => (
            <NavMenu
              key={id}
              menu={id}
              className={styles.link}
              current={current ? currentMenu[current] === id : false}
            >
              {menus[id].label}
              <img src="/partners/nav-caret.svg" alt="" width={20} height={20} />
            </NavMenu>
          ))}
        </nav>
        <div className={styles.actions}>
          <a className={styles.talk} href="/contact">
            Book a demo
            <span>
              <img src="/partners/caret-right.svg" alt="" width={14} height={14} />
            </span>
          </a>
          <MobileMenu dark={false} />
        </div>
      </div>
    </header>
  );
}
