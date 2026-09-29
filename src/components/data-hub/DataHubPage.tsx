"use client";

import { useEffect, useRef, useState } from "react";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { NumberField } from "./NumberField";
import styles from "./data-hub.module.css";

const categories = [
  "All",
  "3D",
  "Audio",
  "Document",
  "Geospatial",
  "Image",
  "Tabular",
  "Text",
  "Time Series",
  "Video",
  "Text-to-Image",
  "Image-to-Text",
  "Image-to-3D",
];

const periods = ["Last 7 days", "Last 30 days", "All time"];
const sorts = ["Newest", "Oldest"];
const kinds = ["All types", "Code previews", "Agent datasets"];

const blurb =
  "Access a global network of hand-picked experts across diverse fields.";

type CodeSet = {
  id: string;
  kind: "code";
  title: string;
  category: string;
  badge: string;
  age: number;
};

type AgentSet = {
  id: string;
  kind: "agent";
  title: string;
  category: string;
  image: string;
  age: number;
};

const codeSets: CodeSet[] = [
  { id: "code-1", kind: "code", title: "Data set 1", category: "Text", badge: "Dataset 1", age: 2 },
  { id: "code-2", kind: "code", title: "Data set 1", category: "Image", badge: "Dataset 2", age: 3 },
  { id: "code-3", kind: "code", title: "Data set 1", category: "Audio", badge: "Dataset 3", age: 4 },
  { id: "code-4", kind: "code", title: "Data set 1", category: "Document", badge: "Dataset 4", age: 5 },
];

const agentSets: AgentSet[] = [
  { id: "agent-1", kind: "agent", title: "Data set 1", category: "Geospatial", image: "/data-hub/orb-pink.jpg", age: 1 },
  { id: "agent-2", kind: "agent", title: "Data set 1", category: "Tabular", image: "/data-hub/orb-blue.png", age: 2 },
  { id: "agent-3", kind: "agent", title: "Data set 1", category: "Time Series", image: "/data-hub/orb-red.jpg", age: 3 },
  { id: "agent-4", kind: "agent", title: "Data set 1", category: "Video", image: "/data-hub/orb-pink.jpg", age: 4 },
  { id: "agent-5", kind: "agent", title: "Data set 1", category: "Text-to-Image", image: "/data-hub/orb-pink.jpg", age: 6 },
  { id: "agent-6", kind: "agent", title: "Data set 1", category: "Image-to-Text", image: "/data-hub/orb-blue.png", age: 6 },
  { id: "agent-7", kind: "agent", title: "Data set 1", category: "Image-to-3D", image: "/data-hub/orb-red.jpg", age: 6 },
  { id: "agent-8", kind: "agent", title: "Data set 1", category: "3D", image: "/data-hub/orb-pink.jpg", age: 6 },
];

function matchesQuery(text: string, query: string) {
  return text.toLowerCase().includes(query.trim().toLowerCase());
}

function withinPeriod(age: number, period: string) {
  if (period === "Last 7 days") return age <= 7;
  if (period === "Last 30 days") return age <= 30;
  return true;
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
          <img src="/data-hub/filter.svg" alt="" width={20} height={20} />
        ) : null}
        <span>{value}</span>
        {icon === "filter" ? null : (
          <img src="/data-hub/caret.svg" alt="" width={20} height={20} />
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

function Snippet({ badge }: { badge: string }) {
  return (
    <div className={styles.preview}>
      <div className={styles.snippet} aria-hidden="true">
        <span className={styles.gutter}>1{"\n"}2{"\n"}3{"\n"}4{"\n"}5{"\n"}6</span>
        <pre>
          <span className={styles.kw}>import</span>
          <span>{" { streamText } "}</span>
          <span className={styles.kw}>from</span>
          <span> </span>
          <span className={styles.str}>{"'ai'"}</span>
          {"\n\n"}
          <span className={styles.kw}>const</span>
          <span>{" result = "}</span>
          <span className={styles.fn}>streamText</span>
          <span>{"({"}</span>
          {"\n"}
          <span>{"  dataset: "}</span>
          {"\n"}
          <span>{"  prompt: "}</span>
          <span className={styles.str}>{"'Why is the sky blue?'"}</span>
          {"\n"}
          <span>{"})"}</span>
        </pre>
      </div>
      <span className={styles.badge}>{badge}</span>
      <span className={styles.fold} aria-hidden="true" />
    </div>
  );
}

export function DataHubPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [period, setPeriod] = useState("Last 7 days");
  const [sort, setSort] = useState("Newest");
  const [kind, setKind] = useState("All types");
  const [requested, setRequested] = useState<string[]>([]);

  const queryHit = (item: { title: string; category: string }) =>
    query.trim() === "" ||
    matchesQuery(`${item.title} ${item.category} ${blurb}`, query);

  const code = codeSets.filter(
    (item) =>
      (kind === "All types" || kind === "Code previews") &&
      (category === "All" || item.category === category) &&
      withinPeriod(item.age, period) &&
      queryHit(item),
  );
  const agents = agentSets.filter(
    (item) =>
      (kind === "All types" || kind === "Agent datasets") &&
      (category === "All" || item.category === category) &&
      withinPeriod(item.age, period) &&
      queryHit(item),
  );

  const orderedCode = sort === "Oldest" ? [...code].reverse() : code;
  const orderedAgents = sort === "Oldest" ? [...agents].reverse() : agents;
  const empty = orderedCode.length === 0 && orderedAgents.length === 0;

  return (
    <main className={styles.page}>
      <SiteNav current="data-hub" />

      <section className={styles.hero} aria-labelledby="data-hub-heading">
        <NumberField className={styles.heroArt} />
        <div className={styles.heroCopy}>
          <h1 id="data-hub-heading">Request the data your model actually needs.</h1>
          <p>
            Browse curated datasets collected and annotated by cntxt. Request
            access or a custom collection.
          </p>
          <form
            className={styles.heroSearch}
            onSubmit={(event) => {
              event.preventDefault();
              document.getElementById("request")?.scrollIntoView({ block: "start" });
            }}
          >
            <label>
              <img src="/data-hub/search.svg" alt="" width={20} height={20} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
              />
            </label>
            <a href="#request">Request data</a>
          </form>
        </div>
      </section>

      <section className={styles.catalog} id="request" aria-labelledby="catalog-heading">
        <h2 id="catalog-heading">
          Explore & curate billions of data{" "}
          <span>points at scale with ease</span>
        </h2>
        <div className={styles.toolbar}>
          <label className={styles.search}>
            <img src="/data-hub/search.svg" alt="" width={20} height={20} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products..."
              aria-label="Search datasets"
            />
          </label>
          <div className={styles.tools}>
            <Menu
              label="Updated"
              options={periods}
              value={period}
              onChange={setPeriod}
            />
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
              <li key={item.id}>
                <Snippet badge={item.badge} />
                <div className={styles.codeCopy}>
                  <div>
                    <h3>{item.title}</h3>
                    <img src="/data-hub/arrow.svg" alt="" width={24} height={24} />
                  </div>
                  <p>{blurb}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {orderedAgents.length > 0 ? (
          <ul className={styles.agentGrid}>
            {orderedAgents.map((item) => {
              const isRequested = requested.includes(item.id);
              return (
                <li key={item.id}>
                  <p className={styles.tag}>
                    <img src="/data-hub/dot.svg" alt="" width={8} height={8} />
                    Generative Agent AI
                  </p>
                  <span className={styles.orb}>
                    <img src={item.image} alt="" />
                  </span>
                  <div className={styles.agentCopy}>
                    <h3>{item.title}</h3>
                    <p>{blurb}</p>
                    <ul>
                      <li>Invoice Auditing</li>
                      <li>Guideline Enforcement</li>
                    </ul>
                    <button
                      type="button"
                      aria-pressed={isRequested}
                      onClick={() =>
                        setRequested((current) =>
                          current.includes(item.id)
                            ? current.filter((id) => id !== item.id)
                            : [...current, item.id],
                        )
                      }
                    >
                      {isRequested ? "Requested" : "Request to buy →"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </section>

      <SiteClose current="Browse datasets" packHref="/security#procurement" />
    </main>
  );
}
