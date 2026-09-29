"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { DocIcon } from "./DocIcon";
import styles from "./docs.module.css";

type DocItem = { id: string; title: string; icon: string };

const groups: { title: string; items: DocItem[] }[] = [
  {
    title: "Introduction",
    items: [
      { id: "getting-started", title: "Getting Started", icon: "info" },
      { id: "quick-start", title: "Quick Start", icon: "rocket" },
      { id: "concepts", title: "Concepts", icon: "book" },
      { id: "roadmap", title: "Roadmap", icon: "map" },
      { id: "community", title: "Community", icon: "users" },
    ],
  },
  {
    title: "Setup Tutorials",
    items: [
      { id: "overview", title: "Overview", icon: "list" },
      { id: "sign-up", title: "Sign Up with Email", icon: "mail" },
      { id: "verification", title: "Server-side Verification", icon: "shield" },
      { id: "recovery", title: "Account Recovery", icon: "key" },
      { id: "installation", title: "Installation", icon: "download" },
      { id: "upgrade", title: "Upgrade Guide", icon: "upgrade" },
    ],
  },
  {
    title: "Customizations",
    items: [
      { id: "design-tutorial", title: "Design Tutorial", icon: "palette" },
      { id: "themes", title: "Themes & Settings", icon: "settings" },
      { id: "custom-css", title: "Custom CSS", icon: "code" },
      { id: "layout", title: "Layout", icon: "layout" },
      { id: "basic-sizing", title: "Basic Sizing", icon: "ruler" },
      { id: "flexbox", title: "Flexbox & Grid", icon: "grid" },
      { id: "typography", title: "Typography", icon: "type" },
      { id: "backgrounds", title: "Backgrounds", icon: "image" },
      { id: "borders", title: "Borders", icon: "square" },
      { id: "plugins", title: "Plugins", icon: "plug" },
      { id: "presets", title: "Presets", icon: "sparkle" },
    ],
  },
];

const toc = [
  {
    id: "width",
    title: "How to set an element to a width?",
    items: [
      "Fixed widths",
      "Percentage widths",
      "Resetting the width",
      "Min-Width",
      "Max-Width",
    ],
  },
  {
    id: "height",
    title: "How to set an element to a height?",
    items: [
      "Fixed heights",
      "Percentage heights",
      "Resetting the heights",
      "Min-Height",
      "Max-Heights",
    ],
  },
  {
    id: "size",
    title: "How to set an element to a size?",
    items: [
      "Class & properties",
      "Fixed sizes",
      "Percentage sizes",
      "Resetting the size",
      "Hover, focus, and other states",
      "Customizing your theme",
    ],
  },
];

const flat = groups.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.title })),
);

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function CodeLine({ klass, tail }: { klass: string; tail?: string }) {
  return (
    <p>
      <span className={styles.tag}>&lt;div</span>
      <span className={styles.plain}>{` class="`}</span>
      <span className={styles.cls}>{klass}</span>
      <span className={styles.plain}>{tail ?? '">'}</span>
    </p>
  );
}

export function DocsPage() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState("basic-sizing");
  const [tocId, setTocId] = useState("fixed-widths");

  const needle = query.trim().toLowerCase();
  const visibleGroups = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            item.title.toLowerCase().includes(needle),
          ),
        }))
        .filter((group) => group.items.length > 0),
    [needle],
  );

  const active = flat.find((item) => item.id === activeId) ?? flat[0];
  const activeIndex = flat.findIndex((item) => item.id === active.id);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function openToc(id: string) {
    setTocId(id);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    });
  }

  function step(direction: -1 | 1) {
    const next = flat[activeIndex + direction];
    if (!next) return;
    setActiveId(next.id);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0 });
    });
  }

  return (
    <main className={styles.page}>
      <SiteNav />

      <div className={styles.docs}>
        <aside className={styles.sidebar} aria-label="Documentation">
          <label className={styles.search}>
            <span className={styles.searchField}>
              <img src="/documentation/search.svg" alt="" width={18} height={18} />
              <input
                ref={searchRef}
                type="search"
                placeholder="Search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search documentation"
              />
            </span>
            <kbd>⌘ K</kbd>
          </label>

          {visibleGroups.length === 0 ? (
            <p className={styles.empty}>No matching pages.</p>
          ) : (
            visibleGroups.map((group) => (
              <section key={group.title} className={styles.group}>
                <h2>{group.title}</h2>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        aria-current={item.id === active.id ? "page" : undefined}
                        onClick={() => setActiveId(item.id)}
                      >
                        <span aria-hidden="true"><DocIcon name={item.icon} /></span>
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </aside>

        <article className={styles.article}>
          <p className={styles.crumbs}>
            <span>Overview</span>
            <span aria-hidden="true">›</span>
            <span>{active.group}</span>
            <span aria-hidden="true">›</span>
            <span className={styles.crumbCurrent}>{active.title}</span>
          </p>

          {active.id === "basic-sizing" ? (
            <>
              <h1>Basic Width, Height & Size</h1>
              <p className={styles.lead}>
                Customizations for setting the width and height of an element at the same time.
              </p>

              <div className={styles.preview}>
                <img
                  className={styles.previewPhoto}
                  src="/documentation/preview-photo.png"
                  alt=""
                />
                <img
                  className={styles.previewWash}
                  src="/partners/panel-color.jpg"
                  alt=""
                />
                <div className={styles.snippet}>
                  <p className={styles.fileTab}>
                    percentage-
                    <br />
                    widths
                  </p>
                  <div className={styles.code}>
                    <CodeLine klass="flex ..." />
                    <p>
                      <span className={styles.indent}>{"  "}</span>
                      <span className={styles.tag}>&lt;div</span>
                      <span className={styles.plain}>{` class="`}</span>
                      <span className={styles.cls}>w-1/2 ...</span>
                      <span className={styles.plain}>{` ">`}</span>
                      <span className={styles.val}>w-1/2</span>
                      <span className={styles.plain}>&lt;/div&gt;</span>
                    </p>
                    <p>
                      <span className={styles.indent}>{"  "}</span>
                      <span className={styles.tag}>&lt;div</span>
                      <span className={styles.plain}>{` class="`}</span>
                      <span className={styles.cls}>w-1/2 ...</span>
                      <span className={styles.plain}>{` ">`}</span>
                      <span className={styles.val}>w-1/2</span>
                      <span className={styles.plain}>&lt;/div&gt;</span>
                    </p>
                    <p>
                      <span className={styles.tag}>&lt;/div&gt;</span>
                    </p>
                    <CodeLine klass="flex ..." />
                    <p>
                      <span className={styles.indent}>{"  "}</span>
                      <span className={styles.tag}>&lt;div</span>
                      <span className={styles.plain}>{` class="`}</span>
                      <span className={styles.cls}>w-2/5 ...</span>
                      <span className={styles.plain}>&quot;&gt;</span>
                      <span className={styles.val}>w-2/5</span>
                      <span className={styles.plain}>&lt;/div&gt;</span>
                    </p>
                  </div>
                </div>
              </div>

              <h2 id="width">How to set an element to a width?</h2>
              <p>
                The CSS width property sets the width of the element. By default it sets the
                width of the content area, but if box-size is set to border-box it sets the
                width of the border area.
              </p>
              <p>
                Use <code>w-{"{number}"}</code> or <code className={styles.px}>w-px</code> to
                set an element to a fixed width:
              </p>

              <div className={styles.pair}>
                <section className={styles.card} id="fixed-widths">
                  <div className={styles.cardCode}>
                    <div className={styles.cardFrame}>
                      <p className={styles.cardTab}>fixed-widths-1</p>
                      <div className={styles.cardLines}>
                        <CodeLine klass="w-96 ..." tail='">w-96</div>' />
                        <CodeLine klass="w-80 ..." tail='">w-80</div>' />
                        <CodeLine klass="w-72 ..." tail='">w-72</div>' />
                      </div>
                    </div>
                  </div>
                  <h3>Basic Usage of Fixed Width #1</h3>
                  <p>Use w-{"{number}"} inside your class to set an element to a fixed width.</p>
                </section>
                <section className={styles.card}>
                  <div className={styles.cardCode}>
                    <div className={styles.cardFrame}>
                      <p className={styles.cardTab}>fixed-widths-2</p>
                      <div className={styles.cardLines}>
                        <CodeLine klass="w-[32rem] ..." tail='">w-[32rem]</div>' />
                        <CodeLine klass="w-[36rem] ..." tail='">w-[36rem]</div>' />
                        <CodeLine klass="w-[40rem] ..." tail='">w-[40rem]</div>' />
                      </div>
                    </div>
                  </div>
                  <h3>Basic Usage of Fixed Width #2</h3>
                  <p>Use another w-px inside your class to set an element to a fixed width.</p>
                </section>
              </div>

              <h2 id="percentage-widths">Element to a percentage width</h2>
              <p className={styles.wide}>
                The CSS width property can also be defined as a percentage, allowing the element
                to scale relative to its parent container. When set to a percentage, the width
                adjusts dynamically, ensuring that the element maintains its proportional size
                within the layout.
              </p>
            </>
          ) : (
            <>
              <h1>{active.title}</h1>
              <p className={styles.lead}>
                {active.title} in {active.group}. Open Basic Sizing for the width and height guide.
              </p>
            </>
          )}

          <div className={styles.pager}>
            <button type="button" onClick={() => step(-1)} disabled={activeIndex === 0}>
              Authentication
            </button>
            <button
              type="button"
              className={styles.next}
              onClick={() => step(1)}
              disabled={activeIndex === flat.length - 1}
            >
              Streaming
              <img src="/documentation/caret.svg" alt="" width={25} height={25} />
            </button>
          </div>
        </article>

        <aside className={styles.toc} aria-label="On this page">
          <h2>On this page</h2>
          {active.id === "basic-sizing"
            ? toc.map((section) => (
                <section key={section.id}>
                  <h3>
                    <button type="button" onClick={() => openToc(section.id)}>
                      {section.title}
                    </button>
                  </h3>
                  <ul>
                    {section.items.map((item) => {
                      const id = slug(item);
                      const current = tocId === id;
                      return (
                        <li key={item} data-current={current || undefined}>
                          <button type="button" onClick={() => openToc(id)}>
                            {item}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))
            : null}
        </aside>
      </div>

      <SiteClose current="Documentation" hideBand />
    </main>
  );
}
