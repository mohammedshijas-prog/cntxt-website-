"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { NavMenu, menuOrder, menus, type MenuId } from "./NavMenu";
import styles from "./siteNav.module.css";

type Current = "products" | "solutions" | "data-hub";

// Older page ids map onto the new top-level menus.
const currentMenu: Record<Current, MenuId> = { products: "lab", solutions: "industries", "data-hub": "lab" };


export function SiteNav({
  current,
  pinAfterHero = false,
}: {
  current?: Current;
  pinAfterHero?: boolean;
}) {
  const [dark, setDark] = useState(false);
  const [shown, setShown] = useState(!pinAfterHero);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (pinAfterHero) {
        const pastHero = y > window.innerHeight * 0.72;
        setShown(pastHero);
        setDark(pastHero);
        return;
      }
      setDark(y > 8);
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
    <header className={`${styles.navWrap} ${dark ? styles.dark : ""} ${shown ? "" : styles.pending}`}>
      <div className={styles.nav}>
        <Link href="/" aria-label="CNTXT AI">
          <img
            src={dark ? "/nav/logo-white.svg" : "/partners/nav-logo.svg"}
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
          <MobileMenu dark={dark} />
        </div>
      </div>
    </header>
  );
}
