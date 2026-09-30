"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./navMenu.module.css";

type Column = {
  heading: string;
  items: { title: string; href: string; icon?: string; desc?: string }[];
};

export const menus: Record<MenuId, { label: string; href: string; columns: Column[]; rich?: boolean }> = {
  data: {
    label: "Data",
    href: "/data-hub",
    columns: [
      {
        heading: "Data",
        items: [
          { title: "AI Lab", href: "/products" },
          { title: "Data Hub", href: "/data-hub" },
          { title: "Evaluate AI", href: "/evaluate-ai" },
        ],
      },
      {
        heading: "Guides",
        items: [
          { title: "Data labelling", href: "/data-hub" },
          { title: "Physical AI data", href: "/products" },
          { title: "Data partnerships", href: "/partners" },
        ],
      },
    ],
  },
  models: {
    label: "Models",
    href: "/products",
    rich: true,
    columns: [
      {
        heading: "Models",
        items: [
          {
            title: "Munsit",
            href: "/products",
            icon: "/nav/munsit-icon.svg",
            desc: "Arabic speech-to-text and text-to-speech",
          },
          { title: "Physical AI models", href: "/products", desc: "Foundation models for robotics" },
        ],
      },
    ],
  },
  agents: {
    label: "Agents",
    href: "/products",
    rich: true,
    columns: [
      {
        heading: "Agents",
        items: [
          { title: "Agentix", href: "/products", desc: "Agents built without code, deployed on-premise" },
          { title: "KLKT", href: "/klkt", icon: "/nav/klkt-icon.svg", desc: "Turn any workflow into an AI app" },
          { title: "Enterprise agents", href: "/solutions", desc: "Customer service and operations" },
        ],
      },
    ],
  },
  industries: {
    label: "Industries",
    href: "/solutions",
    columns: [
      {
        heading: "Industries",
        items: [
          { title: "Enterprise", href: "/solutions" },
          { title: "Healthcare", href: "/healthcare" },
          { title: "Logistics", href: "/solutions" },
          { title: "Finance", href: "/solutions" },
        ],
      },
      {
        heading: "More",
        items: [
          { title: "Public Sector", href: "/solutions" },
          { title: "Robotics", href: "/solutions" },
          { title: "Retail", href: "/solutions" },
          { title: "Energy", href: "/solutions" },
        ],
      },
    ],
  },
  resources: {
    label: "Resources",
    href: "/blog",
    columns: [
      {
        heading: "Resources",
        items: [
          { title: "Blog", href: "/blog" },
          { title: "Events", href: "/blog" },
          { title: "Documentation", href: "/documentation" },
          { title: "Data partnerships", href: "/partners" },
        ],
      },
      {
        heading: "Company",
        items: [
          { title: "About", href: "/about" },
          { title: "Careers", href: "/careers" },
          { title: "Contact us", href: "/contact" },
          { title: "Security", href: "/security" },
        ],
      },
    ],
  },
};

export type MenuId = "data" | "models" | "agents" | "industries" | "resources";

/** Header order, shared by the desktop header, the hero header and the mobile menu. */
export const menuOrder: MenuId[] = ["data", "models", "agents", "industries", "resources"];


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
  const { href, columns, rich } = menus[menu];
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
        className={`${styles.panel} ${rich ? styles.single : styles.simple}`}
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
                    {rich ? (
                      <>
                        <span className={`${styles.icon} ${item.icon ? styles.brandIcon : ""}`} aria-hidden="true">
                          {item.icon ? <img src={item.icon} alt="" width={54} height={54} /> : <CubeIcon />}
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
