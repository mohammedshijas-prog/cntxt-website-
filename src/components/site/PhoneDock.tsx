"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./phoneDock.module.css";

/* Pages that are already the next step, or are not for buyers. */
const hiddenOn = ["/contact", "/admin", "/ai-klkt"];

/**
 * Phones only: the main action stays within thumb reach once the hero has
 * scrolled away. It steps aside wherever the page already offers the same
 * action (closing CTA band, footer) or needs the bottom of the screen
 * (sections marked data-dock="off", such as the Physical AI walkthrough).
 */
export function PhoneDock() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const hidden = hiddenOn.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  useEffect(() => {
    if (hidden) return;
    const phone = window.matchMedia("(max-width: 734px)");
    const blockers = new Set<Element>();
    let frame = 0;

    const update = () => {
      frame = 0;
      setShow(phone.matches && window.scrollY > window.innerHeight * 0.6 && blockers.size === 0);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const watch = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) blockers.add(entry.target);
        else blockers.delete(entry.target);
      }
      request();
    });
    const observeBlockers = () => {
      document.querySelectorAll('[data-dock="off"], footer').forEach((node) => watch.observe(node));
    };
    observeBlockers();
    // Pages render some sections after hydration; pick them up once.
    const late = window.setTimeout(observeBlockers, 1500);

    update();
    window.addEventListener("scroll", request, { passive: true });
    phone.addEventListener("change", request);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(late);
      watch.disconnect();
      window.removeEventListener("scroll", request);
      phone.removeEventListener("change", request);
    };
  }, [hidden, pathname]);

  if (hidden) return null;

  return (
    <div className={`${styles.dock} ${show ? styles.on : ""}`} aria-hidden={!show}>
      <a className={styles.primary} href="/contact" tabIndex={show ? 0 : -1}>
        Book a demo
      </a>
      <a className={styles.secondary} href="mailto:sales@cntxt.tech" tabIndex={show ? 0 : -1} aria-label="Email sales@cntxt.tech">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      </a>
    </div>
  );
}
