"use client";

import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { when } from "./shared";
import styles from "./admin.module.css";

/*
 * Live traffic and AI visibility for the SEO & GEO tab: how many people came,
 * where from (AI engines, search, social, other sites, direct), which pages they
 * landed on, which AI crawlers read the site, and where CNTXT shows up in AI answers.
 */

type Source = "ai" | "search" | "social" | "referral" | "campaign" | "direct";
type Count = { views: number; visitors: number };
export type Summary = {
  views: number;
  visitors: number;
  bySource: Partial<Record<Source, Count>>;
  byEngine: { source: Source; engine: string; views: number; visitors: number; topPage?: string }[];
  topPages: { path: string; views: number; visitors?: number }[];
  aiLanding: { path: string; views: number }[];
  countries: { country: string; views: number }[];
  devices: Record<string, number>;
  crawlers: { bot: string; hits: number; pages?: number }[];
  daily: { day: string; views: number; visitors: number; ai: number; search: number }[];
};
type Live = { days: number; from: string; to: string; current: Summary; previous: Summary | null };

export type Visibility = {
  checkedAt: string;
  engine: string;
  asked: number;
  mentioned: number;
  cited: number;
  note?: string;
  results: { query: string; mentioned: boolean; brands: string[]; cited: boolean; citedUrls?: string[]; rank: number | null; sources: string[]; snippet?: string }[];
};

// Visit counting went live on 21 Oct 2026; a window before that has nothing to compare.
const TRACKING_START = Date.parse("2026-10-21T00:00:00Z");

const regionNames = typeof Intl !== "undefined" && "DisplayNames" in Intl ? new Intl.DisplayNames(["en-GB"], { type: "region" }) : null;
const countryName = (code: string) => {
  if (!code || code === "??") return "Unknown";
  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
};

const empty: Summary = { views: 0, visitors: 0, bySource: {}, byEngine: [], topPages: [], aiLanding: [], countries: [], devices: {}, crawlers: [], daily: [] };
const ranges = [
  { days: 1, label: "24 hours" },
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
];

// Older rows stored a plain number per source; newer ones store views and visitors.
const count = (value: Count | number | undefined): Count =>
  typeof value === "number" ? { views: value, visitors: 0 } : { views: value?.views ?? 0, visitors: value?.visitors ?? 0 };

function Change({ now, before, days }: { now: number; before: number | undefined; days: number }) {
  if (before === undefined) return <em>no earlier data</em>;
  const diff = now - before;
  const span = days === 1 ? "the day before" : `the ${days} days before`;
  if (diff === 0) return <em>same as {span}</em>;
  const pct = before > 0 ? ` (${diff > 0 ? "+" : ""}${Math.round((diff / before) * 100)}%)` : "";
  return (
    <em className={diff > 0 ? styles.up : styles.down}>
      {diff > 0 ? "+" : ""}
      {diff.toLocaleString()}
      {pct} vs {span}
    </em>
  );
}

const numeric = (cell: string | number | undefined) => typeof cell === "number" || cell === "—";

function Table({ head, rows, empty: none = "Nothing yet." }: { head: string[]; rows: (string | number)[][]; empty?: string }) {
  if (rows.length === 0) return <p className={styles.emptySmall}>{none}</p>;
  return (
    <table className={styles.miniTable}>
      <thead>
        <tr>
          {head.map((cell, index) => (
            <th key={cell} className={index > 0 && numeric(rows[0][index]) ? styles.num : undefined}>
              {cell}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, column) => (
              <td key={column} className={column > 0 && numeric(cell) ? styles.num : undefined}>
                {typeof cell === "number" ? cell.toLocaleString() : cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Day-by-day visits, split into AI engines, search and everything else. */
function Daily({ days }: { days: Summary["daily"] }) {
  if (days.length === 0) return <p className={styles.emptySmall}>No visits in this window yet.</p>;
  const max = Math.max(1, ...days.map((day) => day.views));
  return (
    <div className={styles.chart} role="img" aria-label={`Daily visits over ${days.length} days`}>
      {days.map((day) => {
        const other = Math.max(0, day.views - day.ai - day.search);
        return (
          <div key={day.day} className={styles.chartCol} title={`${day.day}: ${day.views} visits, ${day.visitors} visitors, ${day.ai} from AI, ${day.search} from search`}>
            <div className={styles.chartBar} style={{ height: `${(day.views / max) * 100}%` }}>
              <i className={styles.segOther} style={{ flexGrow: other }} />
              <i className={styles.segSearch} style={{ flexGrow: day.search }} />
              <i className={styles.segAi} style={{ flexGrow: day.ai }} />
            </div>
            <span>{new Date(day.day).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
          </div>
        );
      })}
    </div>
  );
}

export function LiveTraffic({ session }: { session: Session }) {
  const [days, setDays] = useState(7);
  const [live, setLive] = useState<Live | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/traffic?days=${days}`, { headers: { Authorization: `Bearer ${session.access_token}` } })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (cancelled) return;
        if (!response.ok) {
          setError(body.error ?? "Could not load traffic.");
          return;
        }
        setError("");
        setLive({ ...body, current: { ...empty, ...body.current }, previous: body.previous ? { ...empty, ...body.previous } : null });
      })
      .catch(() => !cancelled && setError("Could not load traffic."));
    return () => {
      cancelled = true;
    };
  }, [days, session.access_token]);

  const now = live?.current ?? empty;
  const before = live?.previous && live && Date.parse(live.from) > TRACKING_START ? live.previous : undefined;
  const source = (summary: Summary | undefined, key: Source) => count(summary?.bySource[key]);
  const crawlHits = (summary: Summary | undefined) => (summary?.crawlers ?? []).reduce((sum, row) => sum + row.hits, 0);
  const elsewhere = (summary: Summary | undefined) => {
    const parts = (["social", "referral", "campaign"] as Source[]).map((key) => source(summary, key));
    return { views: parts.reduce((sum, part) => sum + part.views, 0), visitors: parts.reduce((sum, part) => sum + part.visitors, 0) };
  };

  // Visitor ids started on 22 Oct 2026; before that only visits were counted.
  const hasVisitors = now.visitors > 0;
  const visitorsOf = (part: Count) => (hasVisitors ? `${part.visitors.toLocaleString()} visitors` : undefined);
  const tiles: { label: string; value: number | null; before?: number; hint?: string }[] = [
    { label: "Visitors", value: hasVisitors ? now.visitors : null, before: before?.visitors || undefined, hint: hasVisitors ? "unique per day, no cookies" : "counting started today; fills in from here" },
    { label: "Visits", value: now.views, before: before?.views, hint: "every page view" },
    { label: "From AI engines", value: source(now, "ai").views, before: before ? source(before, "ai").views : undefined, hint: visitorsOf(source(now, "ai")) },
    { label: "From search", value: source(now, "search").views, before: before ? source(before, "search").views : undefined, hint: visitorsOf(source(now, "search")) },
    { label: "Social and other sites", value: elsewhere(now).views, before: before ? elsewhere(before).views : undefined, hint: visitorsOf(elsewhere(now)) },
    { label: "Direct", value: source(now, "direct").views, before: before ? source(before, "direct").views : undefined, hint: visitorsOf(source(now, "direct")) },
    { label: "AI crawler reads", value: crawlHits(now), before: before ? crawlHits(before) : undefined, hint: "bots reading pages" },
  ];

  const engines = (kind: Source[]) =>
    now.byEngine.filter((row) => kind.includes(row.source)).map((row) => [row.engine, row.views, hasVisitors ? row.visitors ?? 0 : "—", row.topPage ?? "—"] as (string | number)[]);

  return (
    <div className={styles.department}>
      <header className={styles.liveHead}>
        <div>
          <h2>Traffic</h2>
          <p>{live ? `${when(live.from)} to ${when(live.to)}. Live, counted without cookies; bots are kept out of visitor numbers.` : "Loading live numbers…"}</p>
        </div>
        <div className={styles.segmented} role="group" aria-label="Time window">
          {ranges.map((range) => (
            <button key={range.days} aria-pressed={days === range.days} className={days === range.days ? styles.segOn : ""} onClick={() => setDays(range.days)}>
              {range.label}
            </button>
          ))}
        </div>
      </header>
      {error ? <p className={styles.hint}>{error}</p> : null}

      <div className={styles.scoreRow}>
        {tiles.map((tile) => (
          <div key={tile.label} className={styles.scoreTile}>
            <span>{tile.label}</span>
            <strong>{tile.value === null ? "—" : tile.value.toLocaleString()}</strong>
            {!live ? <em>…</em> : tile.value === null ? null : <Change now={tile.value} before={tile.before} days={days} />}
            {tile.hint ? <small className={styles.tileHint}>{tile.hint}</small> : null}
          </div>
        ))}
      </div>

      <div className={styles.legend}>
        <span><i className={styles.segAi} /> AI engines</span>
        <span><i className={styles.segSearch} /> Search</span>
        <span><i className={styles.segOther} /> Everything else</span>
      </div>
      <Daily days={now.daily} />

      <div className={styles.trafficGrid}>
        <section>
          <h3>AI engines that sent people</h3>
          <Table head={["Engine", "Visits", "Visitors", "Landed on"]} rows={engines(["ai"])} empty="No visits from AI engines in this window yet." />
        </section>
        <section>
          <h3>Search engines</h3>
          <Table head={["Engine", "Visits", "Visitors", "Landed on"]} rows={engines(["search"])} empty="No search visits in this window yet." />
        </section>
        <section>
          <h3>Social and other sites</h3>
          <Table head={["Site", "Visits", "Visitors", "Landed on"]} rows={engines(["social", "referral", "campaign"])} empty="No visits from other sites yet." />
        </section>
        <section>
          <h3>AI and search crawlers reading the site</h3>
          <Table head={["Crawler", "Reads", "Pages"]} rows={now.crawlers.map((row) => [row.bot, row.hits, row.pages ?? 0])} empty="No crawler visits logged yet." />
        </section>
        <section>
          <h3>Top pages</h3>
          <Table head={["Page", "Visits", "Visitors"]} rows={now.topPages.map((row) => [row.path, row.views, hasVisitors ? row.visitors ?? 0 : "—"])} />
        </section>
        <section>
          <h3>Where AI engines send people</h3>
          <Table head={["Page", "Visits"]} rows={now.aiLanding.map((row) => [row.path, row.views])} empty="No AI referrals yet." />
        </section>
        <section>
          <h3>Countries</h3>
          <Table head={["Country", "Views"]} rows={now.countries.map((row) => [countryName(row.country), row.views])} />
        </section>
        <section>
          <h3>Devices</h3>
          <Table head={["Device", "Views"]} rows={Object.entries(now.devices).map(([device, views]) => [device[0].toUpperCase() + device.slice(1), views])} />
        </section>
      </div>
    </div>
  );
}

/** Where CNTXT shows up when buyers ask an AI assistant, from the latest report. */
export function AiVisibility({ data }: { data: Visibility | null }) {
  if (!data) {
    return (
      <div className={styles.department}>
        <header>
          <h2>Where we appear in AI answers</h2>
          <p>The next report asks 10 buyer questions with live web search and records whether CNTXT is named or cited. Press Run now to check today.</p>
        </header>
      </div>
    );
  }
  return (
    <div className={styles.department}>
      <header>
        <h2>Where we appear in AI answers</h2>
        <p>
          {data.asked} buyer questions asked with {data.engine}, {when(data.checkedAt)}. ChatGPT, Perplexity and Gemini aren&rsquo;t queried directly; their visits and crawlers show under Traffic.
        </p>
      </header>
      <div className={styles.scoreRow}>
        <div className={styles.scoreTile}>
          <span>Named in the answer</span>
          <strong>
            {data.mentioned}
            <small className={styles.of}> of {data.asked}</small>
          </strong>
          <em>CNTXT, Munsit, Agentix or KLKT</em>
        </div>
        <div className={styles.scoreTile}>
          <span>Our site in its sources</span>
          <strong>
            {data.cited}
            <small className={styles.of}> of {data.asked}</small>
          </strong>
          <em>cntxt.tech, munsit.com or klkt.app came up in the search</em>
        </div>
      </div>
      {data.note ? <p className={styles.reportSummary}>{data.note}</p> : null}
      <ul className={styles.visibility}>
        {data.results.map((item) => (
          <li key={item.query}>
            <span className={styles.visQuery}>
              <strong>{item.query}</strong>
              <em>{item.sources.length ? `Sources it read: ${item.sources.join(", ")}` : "No other sources."}</em>
            </span>
            <b className={`${styles.status} ${item.mentioned ? styles.hired : styles.rejected}`}>{item.mentioned ? `Named: ${item.brands.join(", ")}` : "Not named"}</b>
            <b className={`${styles.status} ${item.cited ? styles.hired : styles.rejected}`}>
              {item.cited ? `In sources${item.rank ? ` · #${item.rank}` : ""}` : "Not in sources"}
            </b>
          </li>
        ))}
      </ul>
    </div>
  );
}
