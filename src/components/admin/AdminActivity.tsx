"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { downloadCsv, when } from "./shared";
import styles from "./admin.module.css";

/*
 * Activity log, for admins: who signed in (when, where, on what device) and
 * who changed what in the portal. Entries are written by the server and the
 * database; nobody can edit or delete them from here.
 */

type Entry = {
  id: number;
  at: string;
  actor: string | null;
  action: string;
  area: string;
  target: string | null;
  target_id: string | null;
  detail: { changes?: Record<string, { from: unknown; to: unknown }>; fields?: string[]; role?: string; from?: string; method?: string; session?: string };
  ip: string | null;
  country: string | null;
  device: string | null;
};
type Member = { email: string; role: string; name: string | null };

const areaNames: Record<string, string> = {
  session: "Sign-in",
  applications: "Applications",
  roles: "Roles",
  posts: "Blog posts",
  datasets: "Catalogue",
  dataset_requests: "Data requests",
  submissions: "Form submissions",
  admins: "Team",
  team: "Team",
  app_secrets: "Settings",
  settings: "Settings",
  seo_reports: "SEO & GEO",
};
const roleNames: Record<string, string> = {
  admin: "Admin",
  marketing: "Marketing",
  hr_head: "Head of HR",
  recruiter: "Recruiting manager",
  data_head: "Head of data",
  data_manager: "Data manager",
};
const fieldNames: Record<string, string> = { fit_label: "fit", published_at: "published" };
const ranges = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
  { days: 0, label: "All" },
];
const isSession = (entry: Entry) => entry.area === "session";

function show(value: unknown) {
  if (value === null || value === undefined || value === "") return "empty";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) return when(value);
  return String(value);
}

/** "status: new → reviewing · edited notes" */
function describe(entry: Entry) {
  const parts: string[] = [];
  for (const [field, change] of Object.entries(entry.detail?.changes ?? {})) parts.push(`${fieldNames[field] ?? field}: ${show(change.from)} → ${show(change.to)}`);
  if (entry.detail?.fields?.length) parts.push(`edited ${entry.detail.fields.map((field) => fieldNames[field] ?? field.replace(/_/g, " ")).join(", ")}`);
  const role = (key?: string) => (key ? roleNames[key] ?? key : "");
  if (entry.area === "team" && entry.detail?.role) parts.push(entry.detail.from ? `${role(entry.detail.from)} → ${role(entry.detail.role)}` : `as ${role(entry.detail.role)}`);
  return parts.join(" · ");
}

export function ActivityLog() {
  const db = useMemo(() => supabaseBrowser(), []);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [team, setTeam] = useState<Member[]>([]);
  const [view, setView] = useState<"people" | "signins" | "changes">("people");
  const [days, setDays] = useState(30);
  const [person, setPerson] = useState("all");
  const [area, setArea] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    let request = db.from("portal_audit").select("*").order("at", { ascending: false }).limit(2000);
    if (days) request = request.gte("at", new Date(Date.now() - days * 86_400_000).toISOString());
    const [{ data }, { data: members }] = await Promise.all([request, db.from("admins").select("email, role, name").order("email")]);
    setEntries((data as Entry[]) ?? []);
    setTeam((members as Member[]) ?? []);
    setLoading(false);
  }, [db, days]);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  const people = [...new Set([...team.map((member) => member.email), ...entries.map((entry) => entry.actor ?? "").filter(Boolean)])].sort();
  const areas = [...new Set(entries.filter((entry) => !isSession(entry)).map((entry) => entry.area))].sort();
  const filtered = entries.filter((entry) => {
    if (person !== "all" && entry.actor !== person) return false;
    if (view === "signins" && !isSession(entry)) return false;
    if (view === "changes" && (isSession(entry) || (area !== "all" && entry.area !== area))) return false;
    const text = `${entry.actor} ${entry.action} ${entry.target} ${entry.ip} ${entry.country} ${entry.device} ${describe(entry)}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const summary = people.map((email) => {
    const mine = entries.filter((entry) => entry.actor === email);
    const signIns = mine.filter((entry) => entry.action === "signed in");
    const changes = mine.filter((entry) => !isSession(entry));
    const member = team.find((item) => item.email === email);
    return {
      email,
      name: member?.name ?? null,
      role: member?.role ?? (mine.some((entry) => entry.action === "access denied") ? "not on the team" : "removed"),
      lastSignIn: signIns[0] ?? null,
      signIns: signIns.length,
      changes: changes.length,
      lastChange: changes[0] ?? null,
      denied: mine.filter((entry) => entry.action === "access denied").length,
    };
  });
  const denied = entries.filter((entry) => entry.action === "access denied");

  const exportCsv = () =>
    downloadCsv(
      `portal-activity-${new Date().toISOString().slice(0, 10)}.csv`,
      ["When", "Who", "Action", "Area", "What", "Details", "IP", "Country", "Device"],
      filtered.map((entry) => [entry.at, entry.actor ?? "", entry.action, areaNames[entry.area] ?? entry.area, entry.target ?? "", describe(entry), entry.ip ?? "", entry.country ?? "", entry.device ?? ""]),
    );

  return (
    <section>
      <div className={styles.head}>
        <div>
          <h1>Activity log</h1>
          <p>Who signed in to the portal and what they changed. Entries are written automatically and can&rsquo;t be edited or deleted from the portal.</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.secondary} onClick={load}>
            Refresh
          </button>
          <button className={styles.secondary} onClick={exportCsv} disabled={filtered.length === 0}>
            Export CSV
          </button>
        </div>
      </div>

      {denied.length > 0 ? (
        <p className={styles.hint}>
          {denied.length} sign-in {denied.length === 1 ? "attempt" : "attempts"} by people not on the portal team in this window: {[...new Set(denied.map((entry) => entry.actor))].join(", ")}.
        </p>
      ) : null}

      <div className={styles.liveHead}>
        <div className={styles.segmented} role="group" aria-label="View">
          {(
            [
              ["people", "People"],
              ["signins", "Sign-ins"],
              ["changes", "Changes"],
            ] as const
          ).map(([key, label]) => (
            <button key={key} aria-pressed={view === key} className={view === key ? styles.segOn : ""} onClick={() => setView(key)}>
              {label}
            </button>
          ))}
        </div>
        <div className={styles.segmented} role="group" aria-label="Time window">
          {ranges.map((range) => (
            <button key={range.days} aria-pressed={days === range.days} className={days === range.days ? styles.segOn : ""} onClick={() => setDays(range.days)}>
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {view !== "people" ? (
        <div className={styles.filters}>
          <input className={styles.input} placeholder="Search person, action, IP, device or detail" value={query} onChange={(event) => setQuery(event.target.value)} />
          <select className={styles.input} value={person} onChange={(event) => setPerson(event.target.value)}>
            <option value="all">Everyone</option>
            {people.map((email) => (
              <option key={email}>{email}</option>
            ))}
          </select>
          {view === "changes" ? (
            <select className={styles.input} value={area} onChange={(event) => setArea(event.target.value)}>
              <option value="all">All areas</option>
              {areas.map((item) => (
                <option key={item} value={item}>
                  {areaNames[item] ?? item}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      ) : null}

      {loading ? <p className={styles.emptySmall}>Loading…</p> : null}

      {!loading && view === "people" ? (
        <div className={styles.department}>
          <table className={`${styles.miniTable} ${styles.auditTable} ${styles.peopleTable}`}>
            <thead>
              <tr>
                <th>Person</th>
                <th>Role</th>
                <th>Last sign-in</th>
                <th className={styles.num}>Sign-ins</th>
                <th className={styles.num}>Changes</th>
                <th>Last change</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((row) => (
                <tr key={row.email}>
                  <td>
                    <button
                      className={styles.link}
                      onClick={() => {
                        setPerson(row.email);
                        setView("changes");
                      }}
                    >
                      {row.name ? <strong className={styles.auditName}>{row.name}</strong> : null}
                      {row.email}
                    </button>
                  </td>
                  <td>{row.denied && row.role === "not on the team" ? <b className={`${styles.status} ${styles.new}`}>Not on the team</b> : roleNames[row.role] ?? row.role}</td>
                  <td>
                    {row.lastSignIn ? (
                      <>
                        {when(row.lastSignIn.at)}
                        <em className={styles.auditMeta}>
                          {[row.lastSignIn.device, row.lastSignIn.country, row.lastSignIn.ip].filter(Boolean).join(" · ")}
                        </em>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className={styles.num}>{row.signIns}</td>
                  <td className={styles.num}>{row.changes}</td>
                  <td>{row.lastChange ? `${row.lastChange.action} · ${areaNames[row.lastChange.area] ?? row.lastChange.area} · ${when(row.lastChange.at)}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.fitMuted}>Sign-ins are recorded from 23 Oct 2026, when the log started.</p>
        </div>
      ) : null}

      {!loading && view !== "people" ? (
        filtered.length === 0 ? (
          <p className={styles.empty}>Nothing in this window yet.</p>
        ) : (
          <div className={styles.department}>
            <table className={`${styles.miniTable} ${styles.auditTable} ${styles.logTable}`}>
              <thead>
                <tr>
                  <th>When</th>
                  <th>Who</th>
                  <th>{view === "signins" ? "Event" : "Action"}</th>
                  <th>{view === "signins" ? "Device · Country · IP" : "What"}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={entry.id}>
                    <td>{when(entry.at)}</td>
                    <td>{entry.actor ?? "System"}</td>
                    <td>
                      {view === "signins" ? (
                        <b className={`${styles.status} ${entry.action === "signed in" ? styles.hired : entry.action === "access denied" ? styles.new : styles.rejected}`}>{entry.action}</b>
                      ) : (
                        <>
                          {entry.action}
                          <em className={styles.auditMeta}>{areaNames[entry.area] ?? entry.area}</em>
                        </>
                      )}
                    </td>
                    <td>
                      {view === "signins" ? (
                        [entry.device, entry.country, entry.ip].filter(Boolean).join(" · ") || "—"
                      ) : (
                        <>
                          {entry.target ?? "—"}
                          {describe(entry) ? <em className={styles.auditMeta}>{describe(entry)}</em> : null}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length >= 2000 ? <p className={styles.fitMuted}>Showing the latest 2,000 entries. Narrow the window or export to see more.</p> : null}
          </div>
        )
      ) : null}
    </section>
  );
}
