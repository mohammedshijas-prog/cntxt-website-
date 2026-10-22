"use client";

import { useEffect, useRef, useState } from "react";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { NumberField } from "./NumberField";
import { RequestPanel } from "./RequestPanel";
import { SampleViewer } from "./SampleViewer";
import { IconChip } from "../shared/graphics";
import styles from "./data-hub.module.css";
import { CtaBand } from "../shared/CtaBand";
import { faqs } from "../shared/faqs";
import { Faq } from "../shared/Faq";

const glyphs: Record<string, "wave" | "text" | "image" | "camera" | "lidar" | "check" | "consent" | "floor"> = {
  Audio: "wave",
  "3D": "lidar",
  Document: "text",
  Text: "text",
  Image: "image",
  Video: "camera",
  LiDAR: "lidar",
  Evaluation: "check",
  "Data services": "image",
  "AI evaluation": "check",
  "Arabic voice AI": "wave",
  "Physical AI data": "camera",
};

const categories = [
  "All",
  "Audio",
  "Document",
  "Image",
  "Text",
  "Video",
  "3D",
  "Evaluation",
];

const sorts = ["A to Z", "Z to A"];
const kinds = ["All types", "Captured data", "Labelled data"];

type Sample = { sample_url?: string | null; sample_name?: string | null };

type CodeSet = Sample & {
  id: string;
  kind: "code";
  title: string;
  category: string;
  badge: string;
  blurb: string;
  capture: string;
  age: number;
};

type AgentSet = Sample & {
  id: string;
  kind: "agent";
  title: string;
  category: string;
  blurb: string;
  labels: [string, string];
  age: number;
};


/** A dataset as the catalogue receives it from the portal (Supabase). */
export type CatalogueItem = {
  id: string;
  title: string;
  kind: "captured" | "labelled";
  category: string;
  blurb: string;
  capture: string;
  labels: string[];
  sample_url: string | null;
  sample_name: string | null;
};

function matchesQuery(text: string, query: string) {
  return text.toLowerCase().includes(query.trim().toLowerCase());
}

function Menu({
  label,
  options,
  value,
  onChange,
  icon,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  icon?: "filter";
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function close(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className={styles.menu} ref={root}>
      <button
        type="button"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((current) => !current)}
      >
        {icon === "filter" ? (
          <img loading="lazy" decoding="async" src="/data-hub/filter.svg" alt="" width={20} height={20} />
        ) : null}
        <span>{value}</span>
        {icon === "filter" ? null : (
          <img loading="lazy" decoding="async" src="/data-hub/caret.svg" alt="" width={20} height={20} />
        )}
      </button>
      {open ? (
        <ul>
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                aria-current={option === value ? "true" : undefined}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function Snippet({ item }: { item: CodeSet }) {
  return (
    <div className={styles.preview}>
      <div className={styles.snippet} aria-hidden="true">
        <span className={styles.gutter}>1{"\n"}2{"\n"}3{"\n"}4{"\n"}5{"\n"}6</span>
        <pre>
          <span className={styles.kw}>request</span>
          <span>{" "}</span>
          <span className={styles.fn}>dataset</span>
          <span>{" {"}</span>
          {"\n\n"}
          <span>{"  modality: "}</span>
          <span className={styles.str}>{`'${item.category}'`}</span>
          {"\n"}
          <span>{"  capture: "}</span>
          <span className={styles.str}>{`'${item.capture}'`}</span>
          {"\n"}
          <span>{"  review: "}</span>
          <span className={styles.str}>{"'Human'"}</span>
          {"\n"}
          <span>{"}"}</span>
        </pre>
      </div>
      <span className={styles.badge}>{item.badge}</span>
      <span className={styles.fold} aria-hidden="true" />
    </div>
  );
}

export function DataHubPage({ initialCategory, datasets }: { initialCategory?: string; datasets: CatalogueItem[] }) {
  const codeSets: CodeSet[] = datasets
    .filter((item) => item.kind === "captured")
    .map((item, age) => ({ ...item, kind: "code", badge: item.category, age }));
  const agentSets: AgentSet[] = datasets
    .filter((item) => item.kind === "labelled")
    .map((item, age) => ({ ...item, kind: "agent", labels: [item.labels[0] ?? "", item.labels[1] ?? ""], age }));
  const [asking, setAsking] = useState(false);
  const [viewing, setViewing] = useState<string | null>(null);
  const viewed = datasets.find((item) => item.id === viewing);
  const toggle = (id: string) =>
    setRequested((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(
    initialCategory && categories.includes(initialCategory) ? initialCategory : "All",
  );
  // Menu links such as /data-hub?category=Audio open with that category chosen (read in the browser, so the page can be cached).
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("category");
    if (wanted && categories.includes(wanted)) queueMicrotask(() => setCategory(wanted));
  }, []);
  const [sort, setSort] = useState("A to Z");
  const [kind, setKind] = useState("All types");
  const [requested, setRequested] = useState<string[]>([]);

  const queryHit = (item: CodeSet | AgentSet) =>
    query.trim() === "" ||
    matchesQuery(
      `${item.title} ${item.category} ${item.blurb} ${
        item.kind === "agent" ? item.labels.join(" ") : item.capture
      }`,
      query,
    );

  const code = codeSets.filter(
    (item) =>
      (kind === "All types" || kind === "Captured data") &&
      (category === "All" || item.category === category) &&
      queryHit(item),
  );
  const agents = agentSets.filter(
    (item) =>
      (kind === "All types" || kind === "Labelled data") &&
      (category === "All" || item.category === category) &&
      queryHit(item),
  );

  const byTitle = <T extends { title: string }>(items: T[]) =>
    [...items].sort((a, b) => (sort === "Z to A" ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title)));
  const orderedCode = byTitle(code);
  const orderedAgents = byTitle(agents);
  const empty = orderedCode.length === 0 && orderedAgents.length === 0;

  return (
    <main className={styles.page}>
      <SiteNav current="data-hub" />

      <section className={styles.hero} aria-labelledby="data-hub-heading">
        <NumberField className={styles.heroArt} />
        <div className={styles.heroCopy}>
          <h1 id="data-hub-heading">
            <span>Request the data</span>
            <span>your model actually needs.</span>
          </h1>
          <p>
            Browse the kinds of data CNTXT captures and labels. Request a
            category or a custom collection.
          </p>
          <form
            className={styles.heroSearch}
            onSubmit={(event) => {
              event.preventDefault();
              document.getElementById("request")?.scrollIntoView({ block: "start" });
            }}
          >
            <label>
              <img loading="lazy" decoding="async" src="/data-hub/search.svg" alt="" width={20} height={20} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search datasets..."
                aria-label="Search datasets"
              />
            </label>
            <a href="#request">Request data</a>
          </form>
        </div>
      </section>


      <section className={styles.catalog} id="request" aria-labelledby="catalog-heading">
        <h2 id="catalog-heading">
          Data captured from real work,{" "}
          <span>labelled and checked by people</span>
        </h2>
        <div className={styles.toolbar}>
          <label className={styles.search}>
            <img loading="lazy" decoding="async" src="/data-hub/search.svg" alt="" width={20} height={20} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search datasets..."
              aria-label="Search datasets"
            />
          </label>
          <div className={styles.tools}>
            <Menu label="Sort" options={sorts} value={sort} onChange={setSort} />
            <Menu
              label="Filter"
              options={kinds}
              value={kind === "All types" ? "Filter" : kind}
              onChange={(value) => setKind(value === "Filter" ? "All types" : value)}
              icon="filter"
            />
          </div>
        </div>
        <div className={styles.chips} role="tablist" aria-label="Dataset category">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={item === category}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {empty ? <p className={styles.empty}>No datasets match this search.</p> : null}

        {orderedCode.length > 0 ? (
          <ul className={styles.codeGrid}>
            {orderedCode.map((item) => (
              <li key={item.id} data-tilt>
                <Snippet item={item} />
                <div className={styles.codeCopy}>
                  <div>
                    <h3>{item.title}</h3>
                    <img loading="lazy" decoding="async" src="/data-hub/arrow.svg" alt="" width={24} height={24} />
                  </div>
                  <p>{item.blurb}</p>
                  <div className={styles.cardActions}>
                    <button type="button" aria-pressed={requested.includes(item.id)} onClick={() => toggle(item.id)}>
                      {requested.includes(item.id) ? "Added ✓" : "Add to request"}
                    </button>
                    <button type="button" className={styles.viewSample} onClick={() => setViewing(item.id)}>
                      View sample
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {requested.length > 0 ? (
          <div className={styles.requestBar} role="status">
            <p>
              <strong>{requested.length}</strong> {requested.length === 1 ? "dataset" : "datasets"} in your request
            </p>
            <button type="button" className={styles.requestClear} onClick={() => setRequested([])}>
              Clear
            </button>
            <button type="button" className={styles.requestGo} onClick={() => setAsking(true)}>
              Request these →
            </button>
          </div>
        ) : null}

        {orderedAgents.length > 0 ? (
          <ul className={styles.agentGrid}>
            {orderedAgents.map((item) => {
              const isRequested = requested.includes(item.id);
              return (
                <li key={item.id} data-tilt>
                  <p className={styles.tag}>
                    <img loading="lazy" decoding="async" src="/data-hub/dot.svg" alt="" width={8} height={8} />
                    {item.category}
                  </p>
                  <IconChip name={glyphs[item.category] ?? "floor"} />
                  <div className={styles.agentCopy}>
                    <h3>{item.title}</h3>
                    <p>{item.blurb}</p>
                    <ul>
                      <li>{item.labels[0]}</li>
                      <li>{item.labels[1]}</li>
                    </ul>
                    <div className={styles.cardActions}>
                      <button type="button" aria-pressed={isRequested} onClick={() => toggle(item.id)}>
                        {isRequested ? "Added ✓" : "Add to request"}
                      </button>
                      <button type="button" className={styles.viewSample} onClick={() => setViewing(item.id)}>
                      View sample
                    </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </section>

      {viewed ? (
        <SampleViewer
          item={viewed}
          requested={requested.includes(viewed.id)}
          others={requested.filter((id) => id !== viewed.id).length}
          onToggle={() => toggle(viewed.id)}
          onRequest={() => {
            setRequested((current) => (current.includes(viewed.id) ? current : [...current, viewed.id]));
            setViewing(null);
            setAsking(true);
          }}
          onClose={() => setViewing(null)}
        />
      ) : null}

      {asking ? (
        <RequestPanel
          items={datasets.filter((item) => requested.includes(item.id))}
          onClose={() => setAsking(false)}
          onSent={() => setRequested([])}
        />
      ) : null}

      <Faq items={faqs.dataHub} topic="Data services" />

      <CtaBand
        id="data-hub-cta"
        title="Need data that is not in the catalogue?"
        body="Tell us the task, the environment and the labels. We will scope a custom collection with you."
        primary={{ label: "Speak to an expert", href: "/contact?topic=Data%20services" }}
        secondary={{ label: "Physical AI data", href: "/physical-ai" }}
      />

      <SiteClose current="Browse datasets" hideBand />
    </main>
  );
}
