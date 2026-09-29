"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { menus, type MenuId } from "./NavMenu";
import styles from "./mobileMenu.module.css";

const sections: { label: string; menu?: MenuId; href?: string }[] = [
  { label: "Products", menu: "products" },
  { label: "Solutions", menu: "solutions" },
  { label: "Data Hub", href: "/data-hub" },
  { label: "Resources", menu: "resources" },
];

/** Menu button and full-screen link list for screens where the header links are hidden. */
export function MobileMenu({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const wide = window.matchMedia("(min-width: 1201px)");
    const onWide = () => wide.matches && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={`${styles.toggle} ${dark ? styles.toggleDark : ""}`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span data-open={open} />
      </button>

      {/* Rendered at the end of <body>: the header's backdrop blur would trap a fixed panel inside it. */}
      {open
        ? createPortal(
            <div id="mobile-menu" className={styles.panel}>
              <nav aria-label="Mobile">
                <ul className={styles.list}>
                  {sections.map((section) => {
                    if (!section.menu) {
                      return (
                        <li key={section.label}>
                          <a className={styles.top} href={section.href}>
                            {section.label}
                          </a>
                        </li>
                      );
                    }
                    const isOpen = expanded === section.label;
                    return (
                      <li key={section.label}>
                        <button
                          type="button"
                          className={styles.top}
                          aria-expanded={isOpen}
                          onClick={() =>
                            setExpanded(isOpen ? null : section.label)
                          }
                        >
                          {section.label}
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M4 6l4 4 4-4"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        {isOpen ? (
                          <div className={styles.sub}>
                            {menus[section.menu].columns.map((column) => (
                              <div key={column.heading}>
                                <p>{column.heading}</p>
                                <ul>
                                  {column.items.map((item) => (
                                    <li key={item.title}>
                                      <a href={item.href}>{item.title}</a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
                <a className={styles.cta} href="/contact">
                  Talk to us
                </a>
              </nav>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
