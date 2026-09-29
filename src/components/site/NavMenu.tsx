"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./navMenu.module.css";

type Column = { heading: string; items: { title: string; href: string }[] };

export const menus: Record<MenuId, { href: string; columns: Column[]; rich?: boolean }> = {
  products: {
    href: "/products",
    rich: true,
    columns: [
      {
        heading: "Build AI",
        items: [
          { title: "Build AI (overview)", href: "/products" },
          { title: "Physical AI", href: "/products" },
          { title: "Data Engine", href: "/products" },
          { title: "For Governments", href: "/products" },
        ],
      },
      {
        heading: "Application AI",
        items: [
          { title: "Munsit", href: "/products" },
          { title: "Klkt", href: "/klkt" },
          { title: "Agentix", href: "/products" },
        ],
      },
      {
        heading: "Evaluate AI",
        items: [
          { title: "Evaluate AI", href: "/evaluate-ai" },
          { title: "For Model Developers", href: "/evaluate-ai" },
          { title: "For Enterprises", href: "/evaluate-ai" },
        ],
      },
    ],
  },
  solutions: {
    href: "/solutions",
    columns: [
      {
        heading: "Solutions",
        items: [{ title: "For Enterprises", href: "/solutions" }],
      },
      {
        heading: "By industry",
        items: [
          { title: "Healthcare", href: "/healthcare" },
          { title: "Logistics", href: "/solutions" },
          { title: "Government", href: "/solutions" },
          { title: "Finance", href: "/solutions" },
          { title: "Energy", href: "/solutions" },
          { title: "Retail", href: "/solutions" },
        ],
      },
    ],
  },
  resources: {
    href: "/blog",
    columns: [
      {
        heading: "Resources",
        items: [
          { title: "Blog", href: "/blog" },
          { title: "Events", href: "/blog" },
          { title: "Documentation", href: "/documentation" },
          { title: "Partnerships", href: "/partners" },
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

export type MenuId = "products" | "solutions" | "resources";

const subtitle = "Save money and time";

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
        className={`${styles.panel} ${rich ? "" : styles.simple}`}
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
                        <span className={styles.icon} aria-hidden="true">
                          <CubeIcon />
                        </span>
                        <span>
                          <strong>{item.title}</strong>
                          <small>{subtitle}</small>
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
