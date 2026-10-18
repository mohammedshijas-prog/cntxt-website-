"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import styles from "./motion.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Elements that run their own motion or must never move. */
const SKIP = "[data-motion='off'], nav, header, [role='dialog']";

/**
 * Site-wide motion, applied the same way on every page so sections feel like
 * one system:
 * - Lenis smooth scrolling, driven by GSAP's ticker.
 * - Section titles rise line by line from behind a mask.
 * - Eyebrows, intros, cards and list items fade up in a stagger.
 * - Images unmask and settle from a slight zoom.
 * - Full-width rounded bands grow into place as they arrive.
 * - A thin progress line tracks how far down the page you are.
 * The first section (the hero) is left to its own entrance.
 */
export function MotionProvider() {
  const pathname = usePathname();

  // Smooth scroll lives for the whole visit.
  useEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -80 }, prevent: (node) => !!node.closest("[data-lenis-prevent]") });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // Reveals are rebuilt for each page.
  useEffect(() => {
    if (reduced()) return;
    const main = document.querySelector("main");
    if (!main) return;
    const splits: SplitText[] = [];
    // Items still waiting to reveal; anything left when the page bottoms out is shown.
    const pending: HTMLElement[] = [];

    const phone = window.matchMedia("(max-width: 734px)").matches;
    const ctx = gsap.context(() => {
      const sections = [...main.querySelectorAll<HTMLElement>(":scope > section, :scope > div > section, :scope > footer, :scope > section ~ div")];
      const hero = sections[0];

      sections.forEach((section) => {
        if (section === hero || section.matches(SKIP)) return;
        const keep = (el: Element) => !el.closest(SKIP) && !el.closest("footer");

        // Bands with rounded corners that span the page grow into place.
        const style = getComputedStyle(section);
        const wide = section.getBoundingClientRect().width > window.innerWidth * 0.85;
        // Skipped on phones, and near the page end where the scrub could never finish.
        const nearEnd = section.offsetTop > document.documentElement.scrollHeight - window.innerHeight * 1.6;
        if (
          wide &&
          !phone &&
          !nearEnd &&
          parseFloat(style.borderTopLeftRadius) >= 16 &&
          !section.querySelector("[style*='sticky'], canvas")
        ) {
          gsap.fromTo(
            section,
            { scale: 0.96, transformOrigin: "50% 0%" },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top bottom", end: "top 70%", scrub: 0.4 },
            },
          );
        }

        // Section titles: lines rise from behind a mask.
        section.querySelectorAll<HTMLElement>("h2").forEach((title) => {
          if (!keep(title) || title.getBoundingClientRect().top < window.innerHeight * 0.9) return;
          const split = SplitText.create(title, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 100,
                duration: 0.7,
                stagger: 0.06,
                ease: "expo.out",
                scrollTrigger: { trigger: title, start: "top 88%", once: true },
              }),
          });
          splits.push(split);
        });

        // Copy and cards fade up in order.
        const items = [
          ...section.querySelectorAll<HTMLElement>(
            "h2 ~ p, [class*='eyebrow'], [class*='dek'], :scope ul > li, :scope ol > li, :scope dl > div, article, details",
          ),
        ].filter((el) => keep(el) && el.getBoundingClientRect().top > window.innerHeight * 0.92);
        if (items.length) {
          pending.push(...items);
          ScrollTrigger.batch(items, {
            start: "top 96%",
            once: true,
            onEnter: (batch) => {
              batch.forEach((el) => {
                const at = pending.indexOf(el as HTMLElement);
                if (at >= 0) pending.splice(at, 1);
              });
              return gsap.fromTo(
                batch,
                { autoAlpha: 0, y: 16 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.5,
                  stagger: 0.04,
                  ease: "power3.out",
                  overwrite: true,
                  // Hand control back to the page's own CSS states afterwards.
                  clearProps: "opacity,visibility,transform",
                },
              );
            },
          });
          gsap.set(items, { autoAlpha: 0, y: 16 });
        }

        // Images unmask and settle.
        section.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
          if (!keep(img) || img.width < 160 || img.getBoundingClientRect().top < window.innerHeight) return;
          gsap.fromTo(
            img,
            { clipPath: "inset(6% 4% 6% 4% round 18px)", scale: 1.04 },
            {
              clipPath: "inset(0% 0% 0% 0% round 0px)",
              scale: 1,
              duration: 0.7,
              ease: "expo.out",
              clearProps: "clipPath,transform",
              scrollTrigger: { trigger: img, start: "top 88%", once: true },
            },
          );
        });
      });
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "bottom bottom+=4",
        onEnter: () => {
          if (pending.length) gsap.to(pending.splice(0), { autoAlpha: 1, y: 0, duration: 0.6, clearProps: "opacity,visibility,transform" });
        },
      });
    }, main);

    // Motion must never be the only way content appears: after an anchor
    // jump, find-in-page or a fast flick, show anything already passed.
    let settle = 0;
    const catchUp = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        const passed = pending.filter((el) => el.getBoundingClientRect().top < window.innerHeight);
        if (!passed.length) return;
        passed.forEach((el) => pending.splice(pending.indexOf(el), 1));
        gsap.to(passed, { autoAlpha: 1, y: 0, duration: 0.3, overwrite: true, clearProps: "opacity,visibility,transform" });
      }, 160);
    };
    window.addEventListener("scroll", catchUp, { passive: true });

    // Layout shifts (fonts, images) move trigger points; recalculate once settled.
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => {
      window.clearTimeout(refresh);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", catchUp);
      splits.forEach((split) => split.revert());
      ctx.revert();
    };
  }, [pathname]);

  // Progress line.
  useEffect(() => {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
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
    };
  }, [pathname]);

  return <div id="scroll-progress" className={styles.progress} aria-hidden="true" />;
}
