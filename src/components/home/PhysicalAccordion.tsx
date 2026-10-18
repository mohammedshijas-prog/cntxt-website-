"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import styles from "./physicalAccordion.module.css";

type Segment = {
  name: string;
  body: string;
  /** Line-art illustration of the vertical. */
  art: string;
  href: string;
  tone: "lilac" | "mist" | "violet" | "pearl";
};

const segments: Segment[] = [
  {
    name: "Robotics & humanoids",
    body: "Train manipulation and embodied AI on first-person video of real tasks, with hands, objects and actions marked up. 1.8 million frames annotated in six months for one humanoid robotics lab.",
    art: "/art/lines/humanoids.webp",
    href: "/physical-ai/robotics-humanoids",
    tone: "lilac",
  },
  {
    name: "World models & foundation models",
    body: "Large volumes of real-world footage across warehouses, kitchens, hotels and hospitals, for models that learn how the physical world behaves.",
    art: "/art/lines/world.webp",
    href: "/physical-ai/world-models",
    tone: "mist",
  },
  {
    name: "Autonomous systems & perception",
    body: "LiDAR, bounding boxes and segmentation masks, labelled by people and checked with a human in the loop at 98% accuracy.",
    art: "/art/lines/perception.webp",
    href: "/physical-ai/autonomous-systems",
    tone: "violet",
  },
  {
    name: "Logistics & warehousing",
    body: "Picking, packing and shelf stocking recorded first-person and broken into the steps a warehouse robot has to learn.",
    art: "/art/lines/warehouses.webp",
    href: "/physical-ai/logistics-warehousing",
    tone: "pearl",
  },
  {
    name: "Healthcare & service robotics",
    body: "Hospital portering, housekeeping and kitchen work, captured with consent for robots that assist where people care for others.",
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
export function PhysicalAccordion() {
  const [open, setOpen] = useState(0);

  const onClick = (index: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (index !== open) {
      event.preventDefault();
      setOpen(index);
    }
  };

  return (
    <section className={styles.section} aria-labelledby="physical-heading">
      <header className={styles.head}>
        <h2 id="physical-heading">Built for physical AI</h2>
        <p>First-person data from real work, recorded with consent and labelled for robotics teams.</p>
        <Link className={styles.button} href="/physical-ai">
          Explore Physical AI
        </Link>
      </header>
      <ul className={styles.cards}>
        {segments.map((item, index) => (
          <li key={item.name} className={`${styles[item.tone]} ${index === open ? styles.open : ""}`}>
            <a
              href={item.href}
              className={styles.card}
              onMouseEnter={() => setOpen(index)}
              onFocus={() => setOpen(index)}
              onClick={onClick(index)}
              aria-expanded={index === open}
            >
              <img className={styles.art} src={item.art} alt="" />
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
