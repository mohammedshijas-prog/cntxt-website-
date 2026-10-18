"use client";

import { useRef } from "react";
import type { PointerEvent, ReactNode } from "react";
import styles from "./pageHero.module.css";

type Action = { label: string; href: string; primary?: boolean };

/**
 * The site's one hero: dotted grid paper, a two-part sticker headline,
 * the lead in a white card, pill buttons, and page-specific art.
 */
export function PageHero({
  id,
  kicker,
  title,
  lead,
  actions,
  art,
  dark = false,
  variant = "clean",
}: {
  id: string;
  kicker: string;
  /** Two lines: the first sits on the purple sticker, the second on white. A plain string is split for you. */
  title: [string, string] | string;
  lead: string;
  actions: Action[];
  art?: ReactNode;
  /** Art panel on ink (for screens that need a dark stage). */
  dark?: boolean;
  /** "world" is the Physical AI sticker style; everything else uses the clean hero. */
  variant?: "clean" | "world";
}) {
  const hero = useRef<HTMLElement>(null);
  const lines = typeof title === "string" ? splitTitle(title) : title;
  // The dot grid lights up under the cursor and the art leans toward it.
  const track = (event: PointerEvent<HTMLElement>) => {
    const node = hero.current;
    if (!node || event.pointerType !== "mouse") return;
    const box = node.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    node.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    node.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    node.style.setProperty("--rx", `${((0.5 - y) * 6).toFixed(2)}deg`);
    node.style.setProperty("--ry", `${((x - 0.5) * 8).toFixed(2)}deg`);
  };
  const reset = () => {
    hero.current?.style.setProperty("--rx", "0deg");
    hero.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <section ref={hero} className={`${styles.hero} ${variant === "world" ? styles.world : styles.clean}`} aria-labelledby={id} onPointerMove={track} onPointerLeave={reset}>
      {variant === "world" ? <div className={styles.glow} aria-hidden="true" /> : null}
      <div className={styles.copy}>
        <p className={styles.kicker}>{kicker}</p>
        <h1 id={id} className={`${styles.title} ${Math.max(lines[0].length, lines[1].length) > 22 ? styles.long : ""}`}>
          <span>{lines[0]}</span>
          <span>{lines[1]}</span>
        </h1>
        <p className={styles.lead}>{lead}</p>
        <div className={styles.actions}>
          {actions.map((action) => (
            <a key={action.label} className={action.primary ? styles.primary : styles.secondary} href={action.href}>
              {action.label}
            </a>
          ))}
        </div>
      </div>
      {art ? (
        <div className={styles.artWrap}>
          <div className={`${styles.art} ${dark ? styles.artDark : ""}`}>{art}</div>
        </div>
      ) : null}
    </section>
  );
}

/** Break a headline into two stickers, the first a little shorter than the second. */
function splitTitle(title: string): [string, string] {
  const words = title.split(" ");
  let cut = 1;
  while (cut < words.length - 1 && words.slice(0, cut + 1).join(" ").length <= title.length * 0.45) cut++;
  return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
}
