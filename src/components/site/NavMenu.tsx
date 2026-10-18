"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./navMenu.module.css";

type Column = {
  heading: string;
  items: { title: string; href: string; icon?: string; desc?: string }[];
};

type Feature = { eyebrow: string; title: string; cta: string; href: string; image?: string; stat?: string; statLabel?: string };

/** A "browse by" tab: its label and hint in the left rail, its links on the right. */
type Browse = { title: string; hint: string; heading: string; items: { title: string; href: string }[] };

type Menu = {
  label: string;
  href: string;
  columns: Column[];
  /** Single column with icons. */
  rich?: boolean;
  /** Category panel: products on the left, services and platform stacked beside it, a featured card on the right. */
  mega?: boolean;
  feature?: Feature;
  /** Left rail of categories that switch the list beside it. */
  browse?: Browse[];
};

export const menus: Record<MenuId, Menu> = {
  lab: {
    label: "AI Lab",
    href: "/products",
    mega: true,
    columns: [
      {
        heading: "Products",
        items: [
          { title: "Munsit", href: "https://munsit.com", icon: "/nav/munsit-icon.svg", desc: "Arabic speech-to-text and text-to-speech across 25+ dialects" },
          { title: "Agentix", href: "/agentix", icon: "/nav/agentix-icon.svg", desc: "Arabic voice and chat agents with GCC telephony" },
          { title: "KLKT", href: "https://klkt.app", icon: "/nav/klkt-icon.svg", desc: "Record everyday work and get paid for accepted hours" },
        ],
      },
      {
        heading: "Data-as-a-service",
        items: [
          { title: "Data annotation", href: "/data-hub" },
          { title: "Physical AI data", href: "/physical-ai" },
          { title: "Custom AI solutions", href: "/solutions" },
        ],
      },
      {
        heading: "Platform",
        items: [
          { title: "AI Lab overview", href: "/products" },
          { title: "Security", href: "/security" },
          { title: "Documentation", href: "/documentation" },
        ],
      },
    ],
    feature: {
      eyebrow: "Inside the lab",
      title: "Data, models and agents in one stack",
      cta: "Explore the AI Lab",
      href: "/products",
      image: "/art/agentix-ops.svg",
    },
  },
  industries: {
    label: "Solutions",
    href: "/solutions",
    columns: [],
    browse: [
      {
        title: "Industries",
        hint: "By sector and use case",
        heading: "Industries",
        items: [
          { title: "Financial services", href: "/industries/financial-services" },
          { title: "Public sector", href: "/industries/public-sector" },
          { title: "Healthcare", href: "/healthcare" },
          { title: "Real estate", href: "/industries/real-estate" },
          { title: "Insurance", href: "/industries/insurance" },
          { title: "All solutions", href: "/solutions" },
        ],
      },
      {
        title: "Physical AI",
        hint: "Robotics and embodied AI",
        heading: "Physical AI",
        items: [
          { title: "Physical AI overview", href: "/physical-ai" },
          { title: "Robotics & humanoids", href: "/physical-ai/robotics-humanoids" },
          { title: "World models & foundation models", href: "/physical-ai/world-models" },
          { title: "Autonomous systems & perception", href: "/physical-ai/autonomous-systems" },
          { title: "Logistics & warehousing", href: "/physical-ai/logistics-warehousing" },
          { title: "Healthcare & service robotics", href: "/physical-ai/healthcare-service-robotics" },
        ],
      },
      {
        title: "Modalities",
        hint: "Every data type",
        heading: "Modalities",
        items: [
          { title: "Audio and speech", href: "/data-hub?category=Audio" },
          { title: "Text", href: "/data-hub?category=Text" },
          { title: "Documents", href: "/data-hub?category=Document" },
          { title: "Image", href: "/data-hub?category=Image" },
          { title: "Video", href: "/data-hub?category=Video" },
          { title: "Model evaluation", href: "/data-hub?category=Evaluation" },
        ],
      },
    ],
    feature: {
      eyebrow: "Customer story",
      title: "Judicial claims for a financial jurisdiction",
      cta: "Read case study",
      href: "/industries/financial-services",
      stat: "83%",
      statLabel: "less processing time",
    },
  },
  company: {
    label: "Company",
    href: "/about",
    columns: [
      {
        heading: "Company",
        items: [
          { title: "About", href: "/about" },
          { title: "Careers", href: "/careers" },
          { title: "Partners", href: "/partners" },
        ],
      },
      {
        heading: "Get in touch",
        items: [
          { title: "Contact us", href: "/contact" },
          { title: "Security", href: "/security" },
        ],
      },
    ],
  },
  resources: {
    label: "Resources",
    href: "/blog",
    columns: [
      {
        heading: "Learn",
        items: [
          { title: "Blog", href: "/blog" },
          { title: "Documentation", href: "/documentation" },
        ],
      },
      {
        heading: "Research",
        items: [
          { title: "Our research", href: "/products#research" },
          { title: "RAGMeter on PyPI", href: "https://pypi.org/project/rag-meter/" },
        ],
      },
    ],
  },
};

export type MenuId = "lab" | "industries" | "company" | "resources";

/** Header order, shared by the desktop header, the hero header and the mobile menu. */
export const menuOrder: MenuId[] = ["lab", "industries", "company", "resources"];


/**
 * A header link plus its mega menu. `placement` picks where the panel opens:
 * "below" centers it under the floating header, "side" opens it beside the hero's
 * vertical nav.
 */
export function NavMenu({
  menu,
  className,
  current,
  placement = "below",
  children,
}: {
  menu: MenuId;
  className?: string;
  current?: boolean;
  placement?: "below" | "side";
  children: ReactNode;
}) {
  const { href, columns, rich, mega, feature, browse } = menus[menu];
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  // A short delay lets the pointer cross the gap between the link and the panel.
  const hide = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  };

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <div
      ref={rootRef}
      className={styles.root}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node)) hide();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          rootRef.current?.querySelector("a")?.focus();
        }
      }}
    >
      <a
        className={className}
        href={href}
        aria-haspopup="true"
        aria-expanded={open}
        aria-current={current ? "page" : undefined}
      >
        {children}
      </a>
      <div
        className={`${styles.panel} ${browse ? styles.browse : mega ? styles.mega : rich ? styles.single : styles.simple}`}
        data-open={open}
        data-placement={placement}
      >
        {columns.map((column) => (
          <div key={column.heading} className={styles.column}>
            <p className={styles.heading}>{column.heading}</p>
            <ul>
              {column.items.map((item) => (
                <li key={item.title}>
                  <a className={styles.item} href={item.href} tabIndex={open ? 0 : -1}>
                    {mega ? (
                      <>
                        {item.icon ? <img loading="lazy" decoding="async" className={styles.productIcon} src={item.icon} alt="" width={36} height={36} /> : null}
                        <span>
                          <strong>{item.title}</strong>
                          {item.desc ? <small>{item.desc}</small> : null}
                        </span>
                      </>
                    ) : rich ? (
                      <>
                        <span className={`${styles.icon} ${item.icon ? styles.brandIcon : ""}`} aria-hidden="true">
                          {item.icon ? <img loading="lazy" decoding="async" src={item.icon} alt="" width={54} height={54} /> : <CubeIcon />}
                        </span>
                        <span>
                          <strong>{item.title}</strong>
                          {item.desc ? <small>{item.desc}</small> : null}
                        </span>
                      </>
                    ) : (
                      <strong>{item.title}</strong>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {browse ? (
          <>
            <div className={styles.rail}>
              <p className={styles.heading}>Browse by</p>
              <ul>
                {browse.map((item, index) => (
                  <li key={item.title}>
                    <button
                      type="button"
                      className={styles.railItem}
                      data-active={tab === index}
                      tabIndex={open ? 0 : -1}
                      onMouseEnter={() => setTab(index)}
                      onFocus={() => setTab(index)}
                      onClick={() => setTab(index)}
                    >
                      <strong>{item.title}</strong>
                      <small>{item.hint}</small>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.column}>
              <p className={styles.heading}>{browse[tab].heading}</p>
              <ul>
                {browse[tab].items.map((item) => (
                  <li key={item.title}>
                    <a className={styles.item} href={item.href} tabIndex={open ? 0 : -1}>
                      <strong>{item.title}</strong>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}
        {feature ? (
          <a className={styles.feature} href={feature.href} tabIndex={open ? 0 : -1}>
            <span className={styles.featureEyebrow}>{feature.eyebrow}</span>
            <strong>{feature.title}</strong>
            <span className={styles.featureCta}>
              {feature.cta} <span aria-hidden="true">→</span>
            </span>
            {feature.stat ? (
              <span className={styles.featureStat}>
                {feature.stat}
                {feature.statLabel ? <small>{feature.statLabel}</small> : null}
              </span>
            ) : null}
            {feature.image ? <img loading="lazy" decoding="async" src={feature.image} alt="" /> : null}
          </a>
        ) : null}
      </div>
    </div>
  );
}

function CubeIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path
        d="M15 3.5 25 9v12l-10 5.5L5 21V9l10-5.5Z M5 9l10 5.5L25 9 M15 14.5v12 M10 6.25 20 11.75v4.5 M20 6.25 10 11.75v4.5 M9 19.5l2.5 1.4 M18.5 20.9l2.5-1.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
