"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import styles from "./physicalAccordion.module.css";

export type Segment = {
  name: string;
  body: string;
  /** Line-art illustration of the vertical. */
  art: string;
  href: string;
  tone: "lilac" | "mist" | "violet" | "pearl";
  /** A photograph rather than line art: shown full-bleed under a soft fade. */
  photo?: boolean;
};

const segments: Segment[] = [
  {
    name: "Robotics & humanoids",
    body: "First-person video of real tasks, with hands, objects and actions marked up.",
    art: "/art/lines/humanoids.webp",
    href: "/physical-ai/robotics-humanoids",
    tone: "lilac",
  },
  {
    name: "World models & foundation models",
    body: "Real-world footage from warehouses, kitchens, hotels and hospitals, at volume.",
    art: "/art/lines/world.webp",
    href: "/physical-ai/world-models",
    tone: "mist",
  },
  {
    name: "Autonomous systems & perception",
    body: "LiDAR, boxes and masks, labelled by people at 98% accuracy.",
    art: "/art/lines/perception.webp",
    href: "/physical-ai/autonomous-systems",
    tone: "violet",
  },
  {
    name: "Logistics & warehousing",
    body: "Picking, packing and stocking, broken into the steps a robot learns.",
    art: "/art/lines/warehouses.webp",
    href: "/physical-ai/logistics-warehousing",
    tone: "pearl",
  },
  {
    name: "Healthcare & service robotics",
    body: "Portering and support work, captured with consent.",
    art: "/art/lines/hospitals.webp",
    href: "/physical-ai/healthcare-service-robotics",
    tone: "lilac",
  },
];

/**
 * Encord-style vertical cards: narrow tinted panels with rotated titles; the
 * open one shows its line art, description and link. Hover or focus opens a
 * panel; on touch the first tap opens it and the second follows the link.
 */
export function PhysicalAccordion({
  title = "Built for physical AI",
  body = "Data from real work, for robotics teams.",
  button = true,
  items = segments,
  headingId = "verticals-heading",
}: {
  items?: Segment[];
  headingId?: string;
  title?: string;
  body?: string;
  /** Hide the link to /physical-ai when already on that page. */
  button?: boolean;
} = {}) {
  const [open, setOpen] = useState(0);

  const onClick = (index: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (index !== open) {
      event.preventDefault();
      setOpen(index);
    }
  };

  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <header className={styles.head}>
        <h2 id={headingId}>{title}</h2>
        <p>{body}</p>
        {button ? (
          <Link className={styles.button} href="/physical-ai">
            Explore Physical AI
          </Link>
        ) : null}
      </header>
      <ul className={styles.cards}>
        {items.map((item, index) => (
          <li key={item.name} className={`${styles[item.tone]} ${item.photo ? styles.photo : ""} ${index === open ? styles.open : ""}`}>
            <a
              href={item.href}
              className={styles.card}
              onMouseEnter={() => setOpen(index)}
              onFocus={() => setOpen(index)}
              onClick={onClick(index)}
              aria-expanded={index === open}
            >
              <img loading="lazy" decoding="async" className={styles.art} src={item.art} alt="" />
              <span className={styles.label}>{item.name}</span>
              <span className={styles.body}>
                <strong>{item.name}</strong>
                <span>{item.body}</span>
                <em>
                  Read more <span aria-hidden="true">→</span>
                </em>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
