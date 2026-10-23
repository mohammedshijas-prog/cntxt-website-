"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { liteDevice } from "@/lib/device";
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
    // Touch screens keep native scrolling: it is what people expect there.
    if (reduced() || !window.matchMedia("(pointer: fine)").matches) return;
    const lenis = new Lenis({ lerp: 0.16, anchors: { offset: -80 }, prevent: (node) => !!node.closest("[data-lenis-prevent]") });
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
    const counters: { el: HTMLElement; original: string }[] = [];
    const observers: IntersectionObserver[] = [];
    // Items still waiting to reveal; anything left when the page bottoms out is shown.
    const pending: HTMLElement[] = [];

    const phone = window.matchMedia("(max-width: 734px)").matches;
    // Slow phones and networks get the content as-is: no hidden-then-revealed items.
    const lite = liteDevice();
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
          if (lite || !keep(title) || title.getBoundingClientRect().top < window.innerHeight * 0.9) return;
          const split = SplitText.create(title, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 105,
                duration: 0.5,
                stagger: 0.05,
                ease: "expo.out",
                scrollTrigger: { trigger: title, start: "top bottom", once: true },
              }),
          });
          splits.push(split);
        });

        // Copy and cards fade up in order.
        const items = [
          ...section.querySelectorAll<HTMLElement>(
            "h2 ~ p, [class*='eyebrow'], [class*='dek'], :scope ul > li, :scope ol > li, :scope dl > div, article, details",
          ),
        ]
          // Long lists (role boards, tables of results) show at once: animating dozens of rows only delays them.
          .filter((el) => !(el.tagName === "LI" && (el.parentElement?.children.length ?? 0) > 8))
          .filter((el) => !lite && keep(el) && el.getBoundingClientRect().top > window.innerHeight * 0.92);
        if (items.length) {
          pending.push(...items);
          ScrollTrigger.batch(items, {
            // Start just before an item scrolls in, so it is already landing as it appears.
            start: "top bottom+=80",
            once: true,
            onEnter: (batch) => {
              batch.forEach((el) => {
                const at = pending.indexOf(el as HTMLElement);
                if (at >= 0) pending.splice(at, 1);
              });
              // Rise and settle. Short, and the whole group lands within 0.3s of the first card.
              return gsap.fromTo(
                batch,
                { autoAlpha: 0, y: 14 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: phone ? 0.32 : 0.4,
                  stagger: batch.length > 5 ? { amount: 0.18 } : 0.04,
                  ease: "expo.out",
                  overwrite: true,
                  // Hand control back to the page's own CSS states afterwards.
                  clearProps: "opacity,visibility,transform",
                },
              );
            },
          });
          gsap.set(items, { autoAlpha: 0, y: 14 });
        }

        // Big figures count up from zero the first time they are seen.
        section.querySelectorAll<HTMLElement>("dt, [class*='stat'] strong, [class*='Stats'] strong, [class*='result'] strong").forEach((el) => {
          if (!keep(el) || el.children.length || el.getBoundingClientRect().top < window.innerHeight) return;
          const match = (el.textContent ?? "").match(/^([^0-9]*)([0-9][0-9,]*\.?[0-9]*)(.*)$/);
          if (!match) return;
          const [, prefix, digits, suffix] = match;
          const target = parseFloat(digits.replace(/,/g, ""));
          if (!Number.isFinite(target) || target === 0) return;
          const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;
          const commas = digits.includes(",");
          const format = (value: number) => {
            const fixed = value.toFixed(decimals);
            return commas ? Number(fixed).toLocaleString("en-GB", { minimumFractionDigits: decimals }) : fixed;
          };
          // Count with a plain timer, and always put the real figure back:
          // a figure must never be left showing a partial or zero value.
          const original = el.textContent ?? "";
          counters.push({ el, original });
          const seen = new IntersectionObserver(
            ([entry]) => {
              if (!entry.isIntersecting) return;
              seen.disconnect();
              const start = performance.now();
              el.style.fontVariantNumeric = "tabular-nums";
              const tick = (now: number) => {
                const t = Math.min(1, Math.max(0, (now - start) / 1400));
                const eased = 1 - Math.pow(1 - t, 3);
                if (t < 1) {
                  el.textContent = `${prefix}${format(target * eased)}${suffix}`;
                  requestAnimationFrame(tick);
                } else {
                  el.textContent = original;
                }
              };
              requestAnimationFrame(tick);
              window.setTimeout(() => {
                el.textContent = original;
              }, 1800);
            },
            { threshold: 0.4 },
          );
          seen.observe(el);
          observers.push(seen);
        });

        // Images unmask and settle.
        section.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
          if (lite || !keep(img) || img.width < 160 || img.getBoundingClientRect().top < window.innerHeight) return;
          gsap.fromTo(
            img,
            { clipPath: "inset(6% 4% 6% 4% round 18px)", scale: 1.04 },
            {
              clipPath: "inset(0% 0% 0% 0% round 0px)",
              scale: 1,
              duration: 0.5,
              ease: "expo.out",
              clearProps: "clipPath,transform",
              scrollTrigger: { trigger: img, start: "top bottom+=60", once: true },
            },
          );
        });
      });
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "bottom bottom+=4",
        onEnter: () => {
          if (pending.length) gsap.to(pending.splice(0), { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, clearProps: "opacity,visibility,transform" });
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
        gsap.to(passed, { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, overwrite: true, clearProps: "opacity,visibility,transform" });
      }, 80);
    };
    window.addEventListener("scroll", catchUp, { passive: true });

    // Layout shifts (fonts, images) move trigger points; recalculate once settled.
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => {
      window.clearTimeout(refresh);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", catchUp);
      splits.forEach((split) => split.revert());
      observers.forEach((observer) => observer.disconnect());
      counters.forEach(({ el, original }) => {
        el.textContent = original;
      });
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

  // Cards marked data-tilt lean toward the cursor and catch a soft light.
  useEffect(() => {
    if (reduced() || !window.matchMedia("(pointer: fine)").matches) return;
    let current: HTMLElement | null = null;
    const move = (event: PointerEvent) => {
      const card = (event.target as Element | null)?.closest<HTMLElement>("[data-tilt]") ?? null;
      if (current && current !== card) {
        current.style.removeProperty("--rx");
        current.style.removeProperty("--ry");
      }
      current = card;
      if (!card) return;
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width;
      const y = (event.clientY - box.top) / box.height;
      card.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      card.style.setProperty("--rx", `${((0.5 - y) * 4).toFixed(2)}deg`);
      card.style.setProperty("--ry", `${((x - 0.5) * 5).toFixed(2)}deg`);
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => document.removeEventListener("pointermove", move);
  }, [pathname]);

  return <div id="scroll-progress" className={styles.progress} aria-hidden="true" />;
}
