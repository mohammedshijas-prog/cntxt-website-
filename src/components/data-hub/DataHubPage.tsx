"use client";

import { useEffect, useRef, useState } from "react";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { NumberField } from "./NumberField";
import styles from "./data-hub.module.css";
import { CtaBand } from "../shared/CtaBand";
import { faqs } from "../shared/faqs";
import { Faq } from "../shared/Faq";
import { ProofBar } from "../shared/ProofBar";

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

type CodeSet = {
  id: string;
  kind: "code";
  title: string;
  category: string;
  badge: string;
  blurb: string;
  capture: string;
  age: number;
};

type AgentSet = {
  id: string;
  kind: "agent";
  title: string;
  category: string;
  image: string;
  blurb: string;
  labels: [string, string];
  age: number;
};

// Data CNTXT captures itself. `age` only fixes the display order.
const codeSets: CodeSet[] = [
  {
    id: "code-1",
    kind: "code",
    title: "Arabic conversational speech",
    category: "Audio",
    badge: "Audio",
    blurb:
      "Recorded conversations across Arabic dialects, transcribed and checked by native Arabic annotators.",
    capture: "Recorded conversation",
    age: 1,
  },
  {
    id: "code-2",
    kind: "code",
    title: "Handwritten Arabic pages",
    category: "Document",
    badge: "Document",
    blurb:
      "Photographs of handwritten Arabic pages, submitted through the KLKT app and accepted only after human review.",
    capture: "Phone photograph",
    age: 2,
  },
  {
    id: "code-3",
    kind: "code",
    title: "First-person video of warehouse work",
    category: "Video",
    badge: "Video",
    blurb:
      "Head- and wrist-camera recordings of picking, packing and shelf stocking, made by consenting workers for robotics training.",
    capture: "Head and wrist cameras",
    age: 3,
  },
  {
    id: "code-4",
    kind: "code",
    title: "First-person video of service work",
    category: "Video",
    badge: "Video",
    blurb:
      "Hands-free recordings of kitchen work, housekeeping, laundry, cleaning and hospital portering, each confirmed by human review.",
    capture: "Head and wrist cameras",
    age: 4,
  },
];

// Labelling and evaluation work CNTXT carries out on request.
const agentSets: AgentSet[] = [
  {
    id: "agent-1",
    kind: "agent",
    title: "Transcribed audio",
    category: "Audio",
    image: "/data-hub/orb-pink.jpg",
    blurb:
      "Audio transcribed, timestamped and split by speaker. Native Arabic annotators cover more than 25 dialects.",
    labels: ["Transcription", "Diarisation"],
    age: 1,
  },
  {
    id: "agent-2",
    kind: "agent",
    title: "Sentiment and entity labels",
    category: "Text",
    image: "/data-hub/orb-blue.png",
    blurb:
      "Text labelled for sentiment and named entities, with human-in-the-loop quality assurance at 98% labelling accuracy.",
    labels: ["Sentiment", "Entities"],
    age: 2,
  },
  {
    id: "agent-3",
    kind: "agent",
    title: "Content moderation labels",
    category: "Text",
    image: "/data-hub/orb-red.jpg",
    blurb:
      "Text reviewed and labelled against your moderation policy, in Arabic and English, with human quality assurance.",
    labels: ["Moderation", "Policy review"],
    age: 3,
  },
  {
    id: "agent-4",
    kind: "agent",
    title: "Ranked model responses",
    category: "Text",
    image: "/data-hub/orb-pink.jpg",
    blurb:
      "Prompts annotated and model responses ranked by people, for fine-tuning and evaluation.",
    labels: ["Eval ranking", "Prompt annotation"],
    age: 4,
  },
  {
    id: "agent-5",
    kind: "agent",
    title: "Annotated images",
    category: "Image",
    image: "/data-hub/orb-pink.jpg",
    blurb:
      "Images labelled with bounding boxes and segmentation masks, with human-in-the-loop quality assurance at 98% labelling accuracy.",
    labels: ["Bounding boxes", "Segmentation"],
    age: 5,
  },
  {
    id: "agent-6",
    kind: "agent",
    title: "Action-labelled video",
    category: "Video",
    image: "/data-hub/orb-blue.png",
    blurb:
      "Video labelled frame by frame with the actions it shows, including first-person recordings of real work.",
    labels: ["Action labels", "Frame by frame"],
    age: 6,
  },
  {
    id: "agent-7",
    kind: "agent",
    title: "Annotated LiDAR",
    category: "3D",
    image: "/data-hub/orb-red.jpg",
    blurb:
      "LiDAR scans annotated for perception models, with human review before delivery.",
    labels: ["LiDAR", "Human review"],
    age: 7,
  },
  {
    id: "agent-8",
    kind: "agent",
    title: "Expert evaluation sets",
    category: "Evaluation",
    image: "/data-hub/orb-pink.jpg",
    blurb:
      "Test sets written and graded by domain experts in fields such as finance, healthcare, logistics and government.",
    labels: ["Domain experts", "Model evaluation"],
    age: 7,
  },
];

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

export function DataHubPage({ initialCategory }: { initialCategory?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(
    initialCategory && categories.includes(initialCategory) ? initialCategory : "All",
  );
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
          <h1 id="data-hub-heading">Request the data your model actually needs.</h1>
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
              <img src="/data-hub/search.svg" alt="" width={20} height={20} />
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

      <ProofBar />

      <section className={styles.catalog} id="request" aria-labelledby="catalog-heading">
        <h2 id="catalog-heading">
          Data captured from real work,{" "}
          <span>labelled and checked by people</span>
        </h2>
        <div className={styles.toolbar}>
          <label className={styles.search}>
            <img src="/data-hub/search.svg" alt="" width={20} height={20} />
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
              <li key={item.id}>
                <Snippet item={item} />
                <div className={styles.codeCopy}>
                  <div>
                    <h3>{item.title}</h3>
                    <img src="/data-hub/arrow.svg" alt="" width={24} height={24} />
                  </div>
                  <p>{item.blurb}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {requested.length > 0 ? (
          <div className={styles.requestBar} role="status">
            <p>
              <strong>{requested.length}</strong> {requested.length === 1 ? "category" : "categories"} in your request
            </p>
            <button type="button" className={styles.requestClear} onClick={() => setRequested([])}>
              Clear
            </button>
            <a
              href={`/contact?${new URLSearchParams({
                topic: "Data services",
                about: agentSets.filter((item) => requested.includes(item.id)).map((item) => item.title).join(", "),
              })}`}
            >
              Request these →
            </a>
          </div>
        ) : null}

        {orderedAgents.length > 0 ? (
          <ul className={styles.agentGrid}>
            {orderedAgents.map((item) => {
              const isRequested = requested.includes(item.id);
              return (
                <li key={item.id}>
                  <p className={styles.tag}>
                    <img src="/data-hub/dot.svg" alt="" width={8} height={8} />
                    {item.category}
                  </p>
                  <span className={styles.orb}>
                    <img src={item.image} alt="" />
                  </span>
                  <div className={styles.agentCopy}>
                    <h3>{item.title}</h3>
                    <p>{item.blurb}</p>
                    <ul>
                      <li>{item.labels[0]}</li>
                      <li>{item.labels[1]}</li>
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
                      {isRequested ? "Added ✓" : "Add to request"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </section>

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
