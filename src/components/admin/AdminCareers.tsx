"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { renderMarkdown } from "@/lib/markdown";
import { supabaseBrowser } from "@/lib/supabase/browser";
import type { PortalRole } from "./AdminPortal";
import { downloadCsv, slugify, when } from "./shared";
import styles from "./admin.module.css";

type Role = {
  id?: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  terms: string;
  summary: string;
  description: string;
  status: "draft" | "open" | "closed";
  featured?: boolean;
  sort: number;
  updated_at?: string;
};

type Application = {
  id: string;
  role_id: string | null;
  role_title: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  cover_note: string | null;
  cv_path: string | null;
  status: "new" | "reviewing" | "interview" | "offer" | "hired" | "rejected";
  notes: string;
  created_at: string;
  fit_score: number | null;
  fit_label: "strong" | "possible" | "weak" | null;
  fit_summary: string | null;
  fit_strengths: string[];
  fit_gaps: string[];
  fit_questions: string[];
  fit_checked_at: string | null;
  fit_error: string | null;
  fit_flag: string | null;
};

const fitNames = { strong: "Strong fit", possible: "Possible fit", weak: "Weak fit" } as const;

/** The public link to a role, on whatever domain the portal is open on. */
const roleUrl = (slug: string) => `${window.location.origin}/careers/${slug}`;

/** Copies a role's public link, with a moment of "Copied ✓" feedback. */
function CopyLink({ slug, status }: { slug: string; status: Role["status"] }) {
  const [copied, setCopied] = useState(false);
  const live = status === "open";
  return (
    <button
      type="button"
      className={styles.copyLink}
      disabled={!slug}
      title={live ? roleUrl(slug) : "Only open roles are public. Open the role first, or copy now to share later."}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(roleUrl(slug));
        } catch {
          window.prompt("Copy this link", roleUrl(slug));
        }
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
    >
      {copied ? "Copied ✓" : live ? "Copy link" : "Copy link (not live)"}
    </button>
  );
}

const stages: Application["status"][] = ["new", "reviewing", "interview", "offer", "hired", "rejected"];
const blankRole: Role = { slug: "", title: "", department: "", location: "Remote", terms: "", summary: "", description: "", status: "draft", sort: 100 };

/* ------------------------------------------------------------ Applications */
/** Applications are grouped by the role they were sent to; removed roles fall back to their title. */
const roleKey = (row: { role_id: string | null; role_title: string }) => row.role_id ?? `title:${row.role_title}`;

export function Applications({ role: me, focus }: { role: PortalRole; focus?: string }) {
  const canDelete = me === "admin" || me === "hr_head";
  const db = useMemo(() => supabaseBrowser(), []);
  const [rows, setRows] = useState<Application[]>([]);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState(focus ?? "all");
  const [stage, setStage] = useState<"all" | Application["status"]>("all");
  const [open, setOpen] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    const { data } = await db.from("applications").select("*").order("created_at", { ascending: false }).limit(2000);
    setRows((data as Application[]) ?? []);
  }, [db]);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  const roleOptions = [...new Map(rows.map((row) => [roleKey(row), row.role_title])).entries()].sort((a, b) => a[1].localeCompare(b[1]));
  const visible = rows.filter((row) => {
    if (role !== "all" && roleKey(row) !== role) return false;
    if (stage !== "all" && row.status !== stage) return false;
    const text = `${row.name} ${row.email} ${row.location ?? ""} ${row.cover_note ?? ""} ${row.role_title}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const setStatus = async (id: string, status: Application["status"]) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, status } : row)));
    await db.from("applications").update({ status }).eq("id", id);
  };

  const saveNotes = async (id: string) => {
    const value = notes[id] ?? "";
    setRows((current) => current.map((row) => (row.id === id ? { ...row, notes: value } : row)));
    const { error } = await db.from("applications").update({ notes: value }).eq("id", id);
    setNote(error ? error.message : "Notes saved.");
  };

  // CVs live in a private bucket: open them through a link that expires after a minute.
  const openCv = async (path: string) => {
    const { data, error } = await db.storage.from("cvs").createSignedUrl(path, 60);
    if (error || !data) return setNote(error?.message ?? "Could not open the CV.");
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const remove = async (id: string, path: string | null) => {
    if (!window.confirm("Delete this application and its CV? This cannot be undone.")) return;
    if (path) await db.storage.from("cvs").remove([path]);
    await db.from("applications").delete().eq("id", id);
    setRows((current) => current.filter((row) => row.id !== id));
  };

  const [checking, setChecking] = useState<string | null>(null);

  // Re-run the AI fit check for one application.
  const checkFit = async (id: string) => {
    setChecking(id);
    setNote("");
    const { data } = await db.auth.getSession();
    const response = await fetch("/api/admin/screen-application", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token ?? ""}` },
      body: JSON.stringify({ id }),
    });
    const result = (await response.json().catch(() => ({}))) as Partial<Application> & { error?: string };
    setChecking(null);
    if (!response.ok) return setNote(result.error ?? "The fit check didn't finish.");
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...result } : row)));
  };

  const counts = { total: rows.length, new: rows.filter((row) => row.status === "new").length };

  return (
    <section>
      <div className={styles.head}>
        <div>
          <h1>Applications</h1>
          <p>
            {counts.total} total · {counts.new} new
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.secondary} onClick={load}>
            Refresh
          </button>
          <button
            className={styles.secondary}
            disabled={!visible.length}
            onClick={() =>
              downloadCsv(
                "applications",
                ["Date", "Role", "Name", "Email", "Phone", "Location", "LinkedIn", "Status", "Note from candidate", "Team notes"],
                visible.map((row) => [when(row.created_at), row.role_title, row.name, row.email, row.phone, row.location, row.linkedin, row.status, row.cover_note, row.notes]),
              )
            }
          >
            Export CSV
          </button>
        </div>
      </div>
      <div className={styles.filters}>
        <input className={styles.input} placeholder="Search name, email, location or note" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className={styles.input} value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="all">All roles</option>
          {roleOptions.map(([key, title]) => (
            <option key={key} value={key}>
              {title}
            </option>
          ))}
        </select>
        <select className={styles.input} value={stage} onChange={(event) => setStage(event.target.value as typeof stage)}>
          <option value="all">All stages</option>
          {stages.map((item) => (
            <option key={item} value={item}>
              {item[0].toUpperCase() + item.slice(1)}
            </option>
          ))}
        </select>
      </div>
      {note ? <p className={styles.note}>{note}</p> : null}
      {visible.length === 0 ? (
        <p className={styles.empty}>No applications yet. Anything sent from a role page on /careers appears here.</p>
      ) : (
        <div className={styles.table}>
          <div className={`${styles.row} ${styles.rowHead}`}>
            <span>Candidate</span>
            <span>Role</span>
            <span>Received</span>
            <span>Stage</span>
          </div>
          {visible.map((row) => (
            <div key={row.id} className={styles.rowWrap}>
              <button className={styles.row} onClick={() => setOpen(open === row.id ? null : row.id)} aria-expanded={open === row.id}>
                <span>
                  <strong>{row.name}</strong>
                  <em>
                    {row.email}
                    {row.location ? ` · ${row.location}` : ""}
                  </em>
                </span>
                <span>
                  {row.role_title}
                  {row.fit_label ? (
                    <b className={`${styles.fit} ${styles[`fit_${row.fit_label}`]}`}>
                      {fitNames[row.fit_label]} · {row.fit_score}
                    </b>
                  ) : null}
                  <em className={styles.snippet}>{row.cover_note ?? ""}</em>
                </span>
                <span className={styles.date}>{when(row.created_at)}</span>
                <span className={`${styles.status} ${styles[row.status]}`}>{row.status}</span>
              </button>
              {open === row.id ? (
                <div className={styles.detail}>
                  <div className={styles.fitCard}>
                    <header>
                      <strong>AI fit check</strong>
                      {row.fit_label ? (
                        <b className={`${styles.fit} ${styles[`fit_${row.fit_label}`]}`}>
                          {fitNames[row.fit_label]} · {row.fit_score}/100
                        </b>
                      ) : null}
                      <button className={styles.secondary} disabled={checking === row.id} onClick={() => checkFit(row.id)}>
                        {checking === row.id ? "Checking…" : row.fit_checked_at ? "Check again" : "Check fit"}
                      </button>
                    </header>
                    {row.fit_summary ? <p>{row.fit_summary}</p> : null}
                    {row.fit_error && !row.fit_summary ? <p className={styles.fitError}>{row.fit_error}</p> : null}
                    {row.fit_flag ? (
                      <p className={styles.fitError}>
                        This application contains text aimed at the AI reviewer, so the score is capped and needs a person&rsquo;s read: &ldquo;{row.fit_flag}&rdquo;
                      </p>
                    ) : null}
                    {!row.fit_checked_at && !checking ? <p className={styles.fitMuted}>Not checked yet.</p> : null}
                    {row.fit_summary ? (
                      <div className={styles.fitCols}>
                        <div>
                          <h4>Strengths</h4>
                          <ul>
                            {row.fit_strengths.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4>Gaps</h4>
                          <ul>
                            {row.fit_gaps.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4>Ask at interview</h4>
                          <ul>
                            {row.fit_questions.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : null}
                    <p className={styles.fitMuted}>Advice from AI, based only on job-relevant evidence. A person on the team makes the decision.</p>
                  </div>
                  {row.cover_note ? <p className={styles.messageFull}>{row.cover_note}</p> : null}
                  <dl>
                    <dt>Phone</dt>
                    <dd>{row.phone ?? "—"}</dd>
                    <dt>Location</dt>
                    <dd>{row.location ?? "—"}</dd>
                    <dt>LinkedIn / portfolio</dt>
                    <dd>
                      {row.linkedin ? (
                        <a href={row.linkedin} target="_blank" rel="noopener noreferrer">
                          {row.linkedin}
                        </a>
                      ) : (
                        "—"
                      )}
                    </dd>
                  </dl>
                  <label className={styles.notesField}>
                    Team notes
                    <textarea
                      className={styles.input}
                      rows={3}
                      value={notes[row.id] ?? row.notes}
                      onChange={(event) => setNotes((current) => ({ ...current, [row.id]: event.target.value }))}
                      placeholder="Interview feedback, next step, who owns it…"
                    />
                  </label>
                  <div className={styles.actions}>
                    {row.cv_path ? (
                      <button className={styles.primary} onClick={() => openCv(row.cv_path!)}>
                        Open CV
                      </button>
                    ) : null}
                    <a className={styles.secondary} href={`mailto:${row.email}?subject=${encodeURIComponent(`Your application: ${row.role_title}`)}`}>
                      Email candidate
                    </a>
                    <button className={styles.secondary} onClick={() => saveNotes(row.id)}>
                      Save notes
                    </button>
                    {canDelete ? (
                      <button className={styles.danger} onClick={() => remove(row.id, row.cv_path)}>
                        Delete
                      </button>
                    ) : null}
                  </div>
                  <div className={styles.stages} role="group" aria-label="Move to stage">
                    {stages.map((item) => (
                      <button key={item} className={row.status === item ? styles.secondaryOn : styles.secondary} onClick={() => setStatus(row.id, item)}>
                        {item[0].toUpperCase() + item.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------ Roles */
export function Roles({ role: me, onApplicants }: { role: PortalRole; onApplicants: (roleId: string) => void }) {
  const db = useMemo(() => supabaseBrowser(), []);
  const [roles, setRoles] = useState<Role[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState<Role | null>(null);

  const load = useCallback(async () => {
    const [{ data }, { data: apps }] = await Promise.all([
      db.from("roles").select("*").order("sort").order("title"),
      db.from("applications").select("role_id"),
    ]);
    setRoles((data as Role[]) ?? []);
    const tally: Record<string, number> = {};
    for (const app of (apps as { role_id: string | null }[]) ?? []) if (app.role_id) tally[app.role_id] = (tally[app.role_id] ?? 0) + 1;
    setCounts(tally);
  }, [db]);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  // Featured roles show first on /careers; the head of HR and admins choose them.
  const canFeature = me === "admin" || me === "hr_head";
  const toggleFeatured = async (role: Role) => {
    if (!role.id || !canFeature) return;
    const featured = !role.featured;
    setRoles((current) => current.map((item) => (item.id === role.id ? { ...item, featured } : item)));
    const { error } = await db.from("roles").update({ featured }).eq("id", role.id);
    if (error) {
      setRoles((current) => current.map((item) => (item.id === role.id ? { ...item, featured: !featured } : item)));
      window.alert("Couldn't change that. Try again.");
    }
  };
  const featuredCount = roles.filter((item) => item.featured && item.status === "open").length;

  if (editing) {
    return (
      <RoleEditor
        me={me}
        initial={editing}
        onDone={() => {
          setEditing(null);
          load();
        }}
      />
    );
  }

  return (
    <section>
      <div className={styles.head}>
        <div>
          <h1>Roles</h1>
          <p>
            Open roles show on /careers within a minute, each with its own application page. {featuredCount} featured at the top
            {canFeature ? "; use the star to change which." : "."}
          </p>
        </div>
        <button className={styles.primary} onClick={() => setEditing({ ...blankRole })}>
          New role
        </button>
      </div>
      {roles.length === 0 ? (
        <p className={styles.empty}>No roles yet. Add the first one.</p>
      ) : (
        <ul className={styles.postList}>
          {roles.map((role) => (
            <li key={role.id} className={styles.roleRow}>
              <div className={styles.roleActions}>
                {role.id && (canFeature || role.featured) ? (
                  <button
                    className={`${styles.featureToggle} ${role.featured ? styles.featureOn : ""}`}
                    aria-pressed={Boolean(role.featured)}
                    disabled={!canFeature}
                    title={role.featured ? "Featured at the top of /careers" + (canFeature ? ". Click to unfeature." : "") : "Feature at the top of /careers"}
                    aria-label={role.featured ? `Unfeature ${role.title}` : `Feature ${role.title}`}
                    onClick={() => toggleFeatured(role)}
                  >
                    {role.featured ? "★" : "☆"}
                  </button>
                ) : null}
                {role.id ? (
                <button
                  className={styles.applicantsLink}
                  onClick={() => onApplicants(role.id!)}
                  disabled={!counts[role.id]}
                  title={counts[role.id] ? `See the people who applied for ${role.title}` : "No applications yet"}
                >
                  {counts[role.id] ? `${counts[role.id]} applicant${counts[role.id] === 1 ? "" : "s"} →` : "No applicants"}
                </button>
                ) : null}
                <CopyLink slug={role.slug} status={role.status} />
              </div>
              <button onClick={() => setEditing(role)}>
                <span className={`${styles.countBadge} ${counts[role.id ?? ""] ? "" : styles.zero}`} aria-label={`${counts[role.id ?? ""] ?? 0} applications`}>
                  <b>{counts[role.id ?? ""] ?? 0}</b>
                  <small>applied</small>
                </span>
                <span>
                  <strong>{role.title || "Untitled role"}</strong>
                  <em>
                    {role.department} · {role.location} · /careers/{role.slug}
                  </em>
                </span>
                <span className={`${styles.status} ${styles[role.status]}`}>{role.status}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function RoleEditor({ initial, onDone, me }: { initial: Role; onDone: () => void; me: PortalRole }) {
  // Recruiting managers draft; the head of HR (or an admin) opens, closes and deletes.
  const publisher = me === "admin" || me === "hr_head";
  const db = useMemo(() => supabaseBrowser(), []);
  const [role, setRole] = useState<Role>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const set = <K extends keyof Role>(key: K, value: Role[K]) => setRole((current) => ({ ...current, [key]: value }));
  const [notes, setNotes] = useState("");
  const [drafting, setDrafting] = useState(false);

  // Ask Claude for a first draft from the title and details; HR edits it before saving.
  const draft = async () => {
    if (!role.title.trim()) return setNote("Add a title first, then draft the description.");
    if ((role.description.trim() || role.summary.trim()) && !window.confirm("Replace the current summary and description with a new draft?")) return;
    setDrafting(true);
    setNote("");
    const { data } = await db.auth.getSession();
    const response = await fetch("/api/admin/generate-role", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token ?? ""}` },
      body: JSON.stringify({ title: role.title, department: role.department, location: role.location, terms: role.terms, notes }),
    });
    const result = (await response.json().catch(() => ({}))) as { summary?: string; description?: string; error?: string };
    setDrafting(false);
    if (!response.ok || !result.description) return setNote(result.error ?? "Couldn't draft the description. Try again.");
    setRole((current) => ({ ...current, summary: result.summary ?? current.summary, description: result.description ?? current.description }));
    setPreview(true);
    setNote("Drafted. Read it through and edit anything that isn't right before saving.");
  };

  const save = async (status: Role["status"]) => {
    if (!role.title.trim() || !role.slug) return setNote("Add a title first.");
    setBusy(true);
    setNote("");
    const row = {
      slug: role.slug,
      title: role.title.trim(),
      department: role.department.trim(),
      location: role.location.trim() || "Remote",
      terms: role.terms.trim(),
      summary: role.summary.trim(),
      description: role.description,
      status,
      sort: Number.isFinite(role.sort) ? role.sort : 100,
    };
    const result = role.id ? await db.from("roles").update(row).eq("id", role.id).select().single() : await db.from("roles").insert(row).select().single();
    setBusy(false);
    if (result.error) return setNote(/duplicate|unique/i.test(result.error.message) ? "Another role already uses that URL. Change the slug." : result.error.message);
    setRole(result.data as Role);
    setSlugTouched(true);
    setNote(status === "open" ? "Open. It will show on /careers within a minute." : status === "closed" ? "Closed. It no longer takes applications." : "Draft saved.");
  };

  const remove = async () => {
    if (!role.id || !window.confirm("Delete this role? Its applications are kept.")) return;
    await db.from("roles").delete().eq("id", role.id);
    onDone();
  };

  return (
    <section>
      <div className={styles.head}>
        <button className={styles.link} onClick={onDone}>
          ← All roles
        </button>
        <div className={styles.actions}>
          {role.id && publisher ? (
            <button className={styles.danger} onClick={remove}>
              Delete
            </button>
          ) : null}
          {publisher || role.status === "draft" ? (
            <button className={publisher ? styles.secondary : styles.primary} disabled={busy} onClick={() => save(publisher ? "draft" : role.status)}>
              {publisher ? "Save draft" : "Save"}
            </button>
          ) : (
            <button className={styles.primary} disabled={busy} onClick={() => save(role.status)}>
              Save changes
            </button>
          )}
          {publisher && role.status === "open" ? (
            <button className={styles.secondary} disabled={busy} onClick={() => save("closed")}>
              Close role
            </button>
          ) : null}
          {publisher ? (
            <button className={styles.primary} disabled={busy} onClick={() => save("open")}>
              {role.status === "open" ? "Update" : "Open role"}
            </button>
          ) : null}
        </div>
      </div>
      {note ? <p className={styles.note}>{note}</p> : null}
      {!publisher ? <p className={styles.hint}>You can draft and edit roles. The head of HR opens and closes them on the careers page.</p> : null}
      <div className={styles.editor}>
        <div className={styles.fields}>
          <label>
            Title
            <input
              className={`${styles.input} ${styles.titleInput}`}
              value={role.title}
              onChange={(event) => {
                set("title", event.target.value);
                if (!slugTouched) set("slug", slugify(event.target.value));
              }}
              placeholder="AI evaluator, Biology"
            />
          </label>
          <label>
            <span className={styles.labelRow}>
              URL
              {role.id ? <CopyLink slug={role.slug} status={role.status} /> : null}
            </span>
            <span className={styles.slug}>
              /careers/
              <input
                className={styles.input}
                value={role.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  set("slug", slugify(event.target.value));
                }}
              />
            </span>
          </label>
          <div className={styles.twoCol}>
            <label>
              Department
              <input className={styles.input} value={role.department} onChange={(event) => set("department", event.target.value)} placeholder="AI evaluation" />
            </label>
            <label>
              Location
              <input className={styles.input} value={role.location} onChange={(event) => set("location", event.target.value)} placeholder="Remote" />
            </label>
          </div>
          <div className={styles.twoCol}>
            <label>
              Terms
              <input className={styles.input} value={role.terms} onChange={(event) => set("terms", event.target.value)} placeholder="Hourly contract" />
            </label>
            <label>
              Order
              <input className={styles.input} type="number" value={role.sort} onChange={(event) => set("sort", Number(event.target.value))} />
            </label>
          </div>
          <label>
            Summary
            <textarea className={styles.input} rows={2} value={role.summary} onChange={(event) => set("summary", event.target.value)} placeholder="One sentence shown at the top of the role page." />
          </label>
          <div className={styles.drafter}>
            <label>
              Notes for the AI draft <span>(optional)</span>
              <textarea
                className={styles.input}
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Seniority, tools, team, what makes this role different…"
              />
            </label>
            <button type="button" className={styles.primary} disabled={drafting} onClick={draft}>
              {drafting ? "Drafting…" : "✦ Draft summary and description"}
            </button>
          </div>
        </div>
        <div className={styles.bodyCol}>
          <div className={styles.bodyTabs}>
            <button className={!preview ? styles.tabOn : ""} onClick={() => setPreview(false)}>
              Write
            </button>
            <button className={preview ? styles.tabOn : ""} onClick={() => setPreview(true)}>
              Preview
            </button>
            <span>Markdown: ## What you will do, - list items</span>
          </div>
          {preview ? (
            <div className={styles.preview} dangerouslySetInnerHTML={{ __html: renderMarkdown(role.description || "_No description yet._") }} />
          ) : (
            <textarea
              className={`${styles.input} ${styles.body}`}
              value={role.description}
              onChange={(event) => set("description", event.target.value)}
              placeholder={"## What you will do\n- …\n\n## What you bring\n- …"}
            />
          )}
        </div>
      </div>
    </section>
  );
}
