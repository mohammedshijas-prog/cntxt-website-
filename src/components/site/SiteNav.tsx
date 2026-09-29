"use client";

import { useEffect, useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { NavMenu } from "./NavMenu";
import styles from "./siteNav.module.css";

type Current = "products" | "solutions" | "data-hub";

const links = [
  { label: "Products", href: "/products", id: "products" as const, caret: true },
  { label: "Solutions", href: "/solutions", id: "solutions" as const, caret: true },
  { label: "Data Hub", href: "/data-hub", id: "data-hub" as const, caret: false },
  { label: "Resources", href: "/blog", id: "resources" as const, caret: true },
];

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
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinAfterHero]);

  return (
    <header className={`${styles.navWrap} ${dark ? styles.dark : ""} ${shown ? "" : styles.pending}`}>
      <div className={styles.nav}>
        <a href="/" aria-label="CNTXT AI">
          <img
            src={dark ? "/nav/logo-white.svg" : "/partners/nav-logo.svg"}
            alt=""
            width={145}
            height={22}
          />
        </a>
        <nav aria-label="Primary">
          {links.map((link) => {
            const content = (
              <>
                {link.label}
                {link.caret ? (
                  <img src="/partners/nav-caret.svg" alt="" width={20} height={20} />
                ) : null}
              </>
            );
            return link.id === "products" || link.id === "solutions" || link.id === "resources" ? (
              <NavMenu key={link.label} menu={link.id} className={styles.link} current={current === link.id}>
                {content}
              </NavMenu>
            ) : (
              <a key={link.label} className={styles.link} href={link.href} aria-current={current === link.id ? "page" : undefined}>
                {content}
              </a>
            );
          })}
        </nav>
        <div className={styles.actions}>
          <a className={styles.talk} href="/contact">
          Talk to us
          <span>
            <img src="/partners/nav-arrow.svg" alt="" width={17} height={17} />
          </span>
        </a>
          <MobileMenu dark={dark} />
        </div>
      </div>
    </header>
  );
}
