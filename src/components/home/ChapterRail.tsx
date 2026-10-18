"use client";

import { useEffect, useState } from "react";
import styles from "./chapterRail.module.css";

const chapters = [
  { id: "story-heading", label: "How it works" },
  { id: "pipeline-heading", label: "One platform" },
  { id: "verticals-heading", label: "Physical AI" },
  { id: "industries-heading", label: "Industries" },
  { id: "customers-heading", label: "Customers" },
  { id: "results-heading", label: "Results" },
  { id: "security-heading", label: "Security" },
  { id: "ready-heading", label: "Get started" },
];

/**
 * A slim chapter index on the right of the home page: shows where you are,
 * jumps to a section on click. Hidden over the hero and the footer.
 */
export function ChapterRail() {
  const [active, setActive] = useState(-1);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id)?.closest("section"))
      .filter((node): node is HTMLElement => !!node);
    let frame = 0;
    const update = () => {
      frame = 0;
      const mid = window.innerHeight * 0.45;
      let current = -1;
      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top <= mid) current = index;
      });
      const last = sections[sections.length - 1];
      const pastEnd = last ? last.getBoundingClientRect().bottom < window.innerHeight * 0.4 : false;
      setActive(current);
      setShown(current >= 0 && !pastEnd);
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
  }, []);

  const go = (id: string) => {
    const section = document.getElementById(id)?.closest("section");
    if (!section) return;
    window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY - 24, behavior: "smooth" });
  };

  return (
    <nav className={`${styles.rail} ${shown ? styles.shown : ""}`} aria-label="Page sections">
      <ol>
        {chapters.map((chapter, index) => (
          <li key={chapter.id}>
            <button
              type="button"
              className={index === active ? styles.active : ""}
              aria-current={index === active ? "true" : undefined}
              onClick={() => go(chapter.id)}
            >
              <span className={styles.label}>{chapter.label}</span>
              <span className={styles.tick} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
