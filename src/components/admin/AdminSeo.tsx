"use client";

import type { Session } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { when } from "./shared";
import styles from "./admin.module.css";

type Issue = { severity: "high" | "medium" | "low"; area: "SEO" | "GEO" | "Speed"; page: string; issue: string; fix: string };
type Page = { url: string; status: number; ms: number; title: string; words: number; schema: string[]; h1: number };
type Report = {
  id: string;
  created_at: string;
  trigger: "schedule" | "manual";
  score: number | null;
  geo_score: number | null;
  pages: Page[];
  issues: Issue[];
  site_checks: { pagesInSitemap?: number; llmsTxt?: boolean; aiCrawlersAllowed?: string[]; averageMs?: number };
  summary: string | null;
  recommendations: { title: string; why: string; how: string; impact: "high" | "medium" | "low" }[];
  blog_ideas: { title: string; query: string; angle: string; whyNow?: string; source?: string; outline: string[] }[];
  draft_post_id: string | null;
  error: string | null;
};

const tone = (score: number | null) => (score === null ? "" : score >= 85 ? styles.scoreGood : score >= 65 ? styles.scoreOk : styles.scoreLow);

/** SEO and GEO reports: the 3-day automated audit, with the AI write-up and blog ideas. */
export function SeoReports({ session }: { session: Session }) {
  const db = useMemo(() => supabaseBrowser(), []);
  const [reports, setReports] = useState<Report[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [area, setArea] = useState<"all" | Issue["area"]>("all");
  const [running, setRunning] = useState(false);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    const { data } = await db.from("seo_reports").select("*").order("created_at", { ascending: false }).limit(30);
    setReports((data as Report[]) ?? []);
  }, [db]);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  const report = reports.find((item) => item.id === openId) ?? reports[0];
  const previous = report ? reports[reports.indexOf(report) + 1] : undefined;
  const delta = (now: number | null, before: number | null | undefined) =>
    now === null || before === null || before === undefined ? null : now - before;

  const runNow = async () => {
    setRunning(true);
    setNote("Crawling the site and writing the report. This takes a minute or two…");
    const response = await fetch("/api/admin/seo-report", { method: "POST", headers: { Authorization: `Bearer ${session.access_token}` } });
    const result = (await response.json().catch(() => ({}))) as { id?: string; error?: string };
    setRunning(false);
    setNote(response.ok ? "Report ready." : result.error ?? "The report didn't finish.");
    await load();
    if (result.id) setOpenId(result.id);
  };

  const issues = (report?.issues ?? []).filter((issue) => area === "all" || issue.area === area);

  return (
    <section>
      <div className={styles.head}>
        <div>
          <h1>SEO & GEO</h1>
          <p>Runs by itself every 3 days. Each run checks every page, scores search (SEO) and AI answer engines (GEO), and drafts one blog post for review.</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.primary} disabled={running} onClick={runNow}>
            {running ? "Running…" : "Run now"}
          </button>
        </div>
      </div>
      {note ? <p className={styles.note}>{note}</p> : null}

      {!report ? (
        <p className={styles.empty}>No reports yet. The first one runs on the next 3-day cycle, or press Run now.</p>
      ) : (
        <>
          <div className={styles.scoreRow}>
            {[
              { label: "SEO score", value: report.score, change: delta(report.score, previous?.score) },
              { label: "GEO score", value: report.geo_score, change: delta(report.geo_score, previous?.geo_score) },
              { label: "Pages checked", value: report.pages.length, change: null },
              { label: "Issues", value: report.issues.length, change: delta(report.issues.length, previous?.issues.length) },
            ].map((tile) => (
              <div key={tile.label} className={styles.scoreTile}>
                <span>{tile.label}</span>
                <strong className={tile.label.includes("score") ? tone(tile.value) : ""}>{tile.value ?? "—"}</strong>
                {tile.change !== null && tile.change !== 0 ? (
                  <em className={(tile.label === "Issues" ? -tile.change : tile.change) > 0 ? styles.up : styles.down}>
                    {tile.change > 0 ? "+" : ""}
                    {tile.change} since last
                  </em>
                ) : (
                  <em>{when(report.created_at)}</em>
                )}
              </div>
            ))}
          </div>

          {report.error ? <p className={styles.hint}>{report.error}</p> : null}
          {report.summary ? <p className={styles.reportSummary}>{report.summary}</p> : null}

          {report.recommendations.length ? (
            <div className={styles.department}>
              <header>
                <h2>What to do next</h2>
              </header>
              <ol className={styles.recs}>
                {report.recommendations.map((rec) => (
                  <li key={rec.title}>
                    <strong>
                      {rec.title} <b className={`${styles.status} ${rec.impact === "high" ? styles.hired : rec.impact === "medium" ? styles.reviewing : styles.rejected}`}>{rec.impact} impact</b>
                    </strong>
                    <span>{rec.why}</span>
                    <em>{rec.how}</em>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {report.blog_ideas.length ? (
            <div className={styles.department}>
              <header>
                <h2>Blog ideas</h2>
                <p>{report.draft_post_id ? "The first idea is already drafted. Find it in Blog posts as a draft, ready to edit and publish." : "Ideas from this run, built only on approved company facts."}</p>
              </header>
              <ul className={styles.ideas}>
                {report.blog_ideas.map((idea) => (
                  <li key={idea.title}>
                    <strong>{idea.title}</strong>
                    <em>Answers: {idea.query}</em>
                    <span>{idea.angle}</span>
                    {idea.whyNow ? (
                      <em>
                        Why now: {idea.whyNow}{" "}
                        {idea.source ? (
                          <a href={idea.source} target="_blank" rel="noopener noreferrer">
                            Source
                          </a>
                        ) : null}
                      </em>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className={styles.department}>
            <header>
              <h2>Issues to fix</h2>
            </header>
            <div className={styles.filters}>
              <select className={styles.input} value={area} onChange={(event) => setArea(event.target.value as typeof area)}>
                <option value="all">All areas</option>
                <option value="SEO">SEO</option>
                <option value="GEO">GEO</option>
                <option value="Speed">Speed</option>
              </select>
            </div>
            {issues.length === 0 ? (
              <p className={styles.emptySmall}>Nothing to fix here.</p>
            ) : (
              <ul className={styles.issues}>
                {issues.map((issue, index) => (
                  <li key={`${issue.page}-${issue.issue}-${index}`}>
                    <b className={`${styles.status} ${issue.severity === "high" ? styles.new : issue.severity === "medium" ? styles.reviewing : styles.rejected}`}>{issue.severity}</b>
                    <span>
                      <strong>{issue.issue}</strong>
                      <em>
                        {issue.area} · {issue.page} · {issue.fix}
                      </em>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <details className={styles.department}>
            <summary>
              <strong>All pages ({report.pages.length})</strong>
            </summary>
            <div className={styles.pagesTable}>
              {report.pages.map((page) => (
                <div key={page.url}>
                  <span>{page.url}</span>
                  <span>{page.status}</span>
                  <span>{page.ms} ms</span>
                  <span>{page.words} words</span>
                  <span>{page.schema.join(", ") || "no schema"}</span>
                </div>
              ))}
            </div>
          </details>

          <div className={styles.department}>
            <header>
              <h2>History</h2>
            </header>
            <ul className={styles.members}>
              {reports.map((item) => (
                <li key={item.id}>
                  <span>
                    <strong>{when(item.created_at)}</strong>
                    <em>{item.trigger === "schedule" ? "Scheduled" : "Run by hand"}</em>
                  </span>
                  <b className={styles.roleBadge}>
                    SEO {item.score ?? "—"} · GEO {item.geo_score ?? "—"}
                  </b>
                  <button className={styles.link} onClick={() => setOpenId(item.id)} disabled={item.id === report.id}>
                    {item.id === report.id ? "Showing" : "Open"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}
