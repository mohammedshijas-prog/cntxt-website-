"use client";

import type { Session } from "@supabase/supabase-js";
import Link from "next/link";
import { renderMarkdown } from "@/lib/markdown";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Applications, Roles } from "./AdminCareers";
import { Catalogue, DataRequests } from "./AdminCatalogue";
import { slugify, when } from "./shared";
import styles from "./admin.module.css";

type Submission = {
  id: string;
  form: "contact" | "partner";
  first_name: string;
  last_name: string | null;
  email: string;
  company: string | null;
  website: string | null;
  topic: string | null;
  message: string | null;
  page: string | null;
  status: "new" | "contacted" | "closed";
  created_at: string;
};

type Post = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover_url: string | null;
  body: string;
  author: string;
  status: "draft" | "published";
  published_at: string | null;
  updated_at?: string;
};

const categories = ["Arabic AI", "Data", "Evaluation", "Agents", "Industry"];
const blank: Post = { slug: "", title: "", excerpt: "", category: "Data", cover_url: null, body: "", author: "CNTXT AI", status: "draft", published_at: null };

const tabs = {
  submissions: "Form submissions",
  applications: "Applications",
  roles: "Roles",
  requests: "Data requests",
  catalogue: "Catalogue",
  posts: "Blog posts",
  team: "Team",
} as const;
type Tab = keyof typeof tabs;

/** What each role can open. The database enforces the same split. */
export type PortalRole = "admin" | "marketing" | "hr_head" | "recruiter";
export const roleNames: Record<PortalRole, string> = {
  admin: "Admin",
  marketing: "Marketing",
  hr_head: "Head of HR",
  recruiter: "Recruiting manager",
};
const access: Record<PortalRole, Tab[]> = {
  admin: ["submissions", "applications", "roles", "requests", "catalogue", "posts", "team"],
  marketing: ["submissions", "requests", "catalogue", "posts"],
  hr_head: ["applications", "roles", "team"],
  recruiter: ["applications", "roles"],
};

/** The CNTXT portal: submissions, job applications, dataset requests, roles, the catalogue, blog posts and the team. */
export function AdminPortal() {
  const db = useMemo(() => supabaseBrowser(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [role, setRole] = useState<PortalRole | null>(null);
  const [chosen, setTab] = useState<Tab | null>(null);

  useEffect(() => {
    db.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = db.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, [db]);

  useEffect(() => {
    if (!session) return;
    db.rpc("portal_role").then(({ data }) => {
      setRole((data as PortalRole | null) ?? null);
      setIsAdmin(Boolean(data));
    });
  }, [db, session]);

  if (!ready) return <div className={styles.center}>Loading…</div>;
  if (!session) return <SignIn />;
  if (isAdmin === null) return <div className={styles.center}>Checking access…</div>;
  if (!isAdmin) {
    return (
      <div className={styles.center}>
        <div className={styles.card}>
          <h1>No access</h1>
          <p>{session.user.email} is not on the portal allowlist. Ask an admin to add you.</p>
          <button className={styles.secondary} onClick={() => db.auth.signOut()}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const allowed = access[role ?? "recruiter"];
  const tab: Tab = chosen && allowed.includes(chosen) ? chosen : allowed[0];

  return (
    <div className={styles.shell}>
      <header className={styles.top}>
        <Link href="/" className={styles.brand}>
          <img src="/partners/nav-logo.svg" alt="CNTXT AI" height={18} />
          <span>Portal</span>
        </Link>
        <nav className={styles.tabs} aria-label="Portal sections">
          {allowed.map((item) => (
            <button key={item} className={tab === item ? styles.tabOn : ""} onClick={() => setTab(item)}>
              {tabs[item]}
            </button>
          ))}
        </nav>
        <div className={styles.who}>
          <span>
            {session.user.email}
            {role ? <b className={styles.roleBadge}>{roleNames[role]}</b> : null}
          </span>
          <button className={styles.link} onClick={() => db.auth.signOut()}>
            Sign out
          </button>
        </div>
      </header>
      <main className={styles.main}>
        {tab === "submissions" ? <Submissions /> : null}
        {tab === "posts" ? <Posts /> : null}
        {tab === "applications" ? <Applications role={role ?? "recruiter"} /> : null}
        {tab === "roles" ? <Roles role={role ?? "recruiter"} /> : null}
        {tab === "requests" ? <DataRequests /> : null}
        {tab === "catalogue" ? <Catalogue /> : null}
        {tab === "team" ? <Team session={session} role={role ?? "recruiter"} /> : null}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------ Sign in */
function SignIn() {
  const db = useMemo(() => supabaseBrowser(), []);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  return (
    <div className={styles.center}>
      <form
        className={styles.card}
        onSubmit={async (event) => {
          event.preventDefault();
          setState("sending");
          const { error } = await db.auth.signInWithOtp({
            email: email.trim(),
            options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/admin` },
          });
          if (error) {
            setState("error");
            setMessage(/signups not allowed|not found/i.test(error.message) ? "That email does not have portal access." : error.message);
          } else setState("sent");
        }}
      >
        <img src="/partners/nav-logo.svg" alt="CNTXT AI" height={20} />
        <h1>Sign in to the portal</h1>
        {state === "sent" ? (
          <p>Check {email} for a sign-in link. It works once, for a short time.</p>
        ) : (
          <>
            <p>We will email you a one-time sign-in link.</p>
            <input className={styles.input} type="email" required placeholder="you@cntxt.tech" value={email} onChange={(event) => setEmail(event.target.value)} />
            <button className={styles.primary} disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Email me a link"}
            </button>
            {state === "error" ? <p className={styles.error}>{message}</p> : null}
          </>
        )}
      </form>
    </div>
  );
}

/* ------------------------------------------------------------ Submissions */
function Submissions() {
  const db = useMemo(() => supabaseBrowser(), []);
  const [rows, setRows] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<"all" | "new" | "contacted" | "closed">("all");
  const [form, setForm] = useState<"all" | "contact" | "partner">("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await db.from("submissions").select("*").order("created_at", { ascending: false }).limit(1000);
    setRows((data as Submission[]) ?? []);
  }, [db]);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  const visible = rows.filter((row) => {
    if (filter !== "all" && row.status !== filter) return false;
    if (form !== "all" && row.form !== form) return false;
    const text = `${row.first_name} ${row.last_name ?? ""} ${row.email} ${row.company ?? ""} ${row.topic ?? ""} ${row.message ?? ""}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const setStatus = async (id: string, status: Submission["status"]) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, status } : row)));
    await db.from("submissions").update({ status }).eq("id", id);
  };

  const exportCsv = () => {
    const header = ["Date", "Form", "First name", "Last name", "Email", "Company", "Website", "Topic", "Message", "Page", "Status"];
    const cell = (value: string | null) => `"${(value ?? "").replace(/"/g, '""')}"`;
    const lines = visible.map((row) =>
      [when(row.created_at), row.form, row.first_name, row.last_name, row.email, row.company, row.website, row.topic, row.message, row.page, row.status].map(cell).join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `cntxt-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const counts = { new: rows.filter((row) => row.status === "new").length, total: rows.length };

  return (
    <section>
      <div className={styles.head}>
        <div>
          <h1>Form submissions</h1>
          <p>
            {counts.total} total · {counts.new} new
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.secondary} onClick={load}>
            Refresh
          </button>
          <button className={styles.secondary} onClick={exportCsv} disabled={!visible.length}>
            Export CSV
          </button>
        </div>
      </div>
      <div className={styles.filters}>
        <input className={styles.input} placeholder="Search name, email, company or message" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className={styles.input} value={form} onChange={(event) => setForm(event.target.value as typeof form)}>
          <option value="all">All forms</option>
          <option value="contact">Contact</option>
          <option value="partner">Partner</option>
        </select>
        <select className={styles.input} value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}>
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      {visible.length === 0 ? (
        <p className={styles.empty}>No submissions yet. Anything sent from the contact or partner forms appears here.</p>
      ) : (
        <div className={styles.table}>
          <div className={`${styles.row} ${styles.rowHead}`}>
            <span>Person</span>
            <span>What they asked for</span>
            <span>Received</span>
            <span>Status</span>
          </div>
          {visible.map((row) => (
            <div key={row.id} className={styles.rowWrap}>
              <button className={styles.row} onClick={() => setOpen(open === row.id ? null : row.id)} aria-expanded={open === row.id}>
                <span>
                  <strong>
                    {row.first_name} {row.last_name}
                  </strong>
                  <em>
                    {row.email}
                    {row.company ? ` · ${row.company}` : ""}
                  </em>
                </span>
                <span>
                  <b className={styles.pill}>{row.form === "partner" ? "Partner" : "Contact"}</b> {row.topic ?? "General"}
                  <em className={styles.snippet}>{row.message ?? ""}</em>
                </span>
                <span className={styles.date}>{when(row.created_at)}</span>
                <span className={`${styles.status} ${styles[row.status]}`}>{row.status}</span>
              </button>
              {open === row.id ? (
                <div className={styles.detail}>
                  <p className={styles.messageFull}>{row.message || "No message."}</p>
                  <dl>
                    {row.website ? (
                      <>
                        <dt>Website</dt>
                        <dd>{row.website}</dd>
                      </>
                    ) : null}
                    <dt>Sent from</dt>
                    <dd>{row.page ?? "—"}</dd>
                  </dl>
                  <div className={styles.actions}>
                    <a className={styles.primary} href={`mailto:${row.email}?subject=${encodeURIComponent("Re: your enquiry to CNTXT AI")}`}>
                      Reply by email
                    </a>
                    {(["new", "contacted", "closed"] as const).map((status) => (
                      <button key={status} className={row.status === status ? styles.secondaryOn : styles.secondary} onClick={() => setStatus(row.id, status)}>
                        Mark {status}
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

/* ------------------------------------------------------------ Posts */
function Posts() {
  const db = useMemo(() => supabaseBrowser(), []);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);

  const load = useCallback(async () => {
    const { data } = await db.from("posts").select("*").order("updated_at", { ascending: false });
    setPosts((data as Post[]) ?? []);
  }, [db]);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  if (editing) {
    return (
      <Editor
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
          <h1>Blog posts</h1>
          <p>Published posts appear on /blog within a minute.</p>
        </div>
        <button className={styles.primary} onClick={() => setEditing({ ...blank })}>
          New post
        </button>
      </div>
      {posts.length === 0 ? (
        <p className={styles.empty}>No posts yet. Write the first one.</p>
      ) : (
        <ul className={styles.postList}>
          {posts.map((post) => (
            <li key={post.id}>
              <button onClick={() => setEditing(post)}>
                {post.cover_url ? <img src={post.cover_url} alt="" /> : <span className={styles.noCover} />}
                <span>
                  <strong>{post.title || "Untitled"}</strong>
                  <em>
                    {post.category} · /blog/{post.slug} · updated {post.updated_at ? when(post.updated_at) : ""}
                  </em>
                </span>
                <span className={`${styles.status} ${post.status === "published" ? styles.closed : styles.new}`}>{post.status}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Editor({ initial, onDone }: { initial: Post; onDone: () => void }) {
  const db = useMemo(() => supabaseBrowser(), []);
  const [post, setPost] = useState<Post>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const set = <K extends keyof Post>(key: K, value: Post[K]) => setPost((current) => ({ ...current, [key]: value }));

  const save = async (status: Post["status"]) => {
    if (!post.title.trim() || !post.slug) {
      setNote("Add a title first.");
      return;
    }
    setBusy(true);
    setNote("");
    const row = {
      slug: post.slug,
      title: post.title.trim(),
      excerpt: post.excerpt.trim(),
      category: post.category,
      cover_url: post.cover_url,
      body: post.body,
      author: post.author.trim() || "CNTXT AI",
      status,
      published_at: status === "published" ? (post.published_at ?? new Date().toISOString()) : post.published_at,
    };
    const result = post.id ? await db.from("posts").update(row).eq("id", post.id).select().single() : await db.from("posts").insert(row).select().single();
    setBusy(false);
    if (result.error) {
      setNote(/duplicate|unique/i.test(result.error.message) ? "Another post already uses that URL. Change the slug." : result.error.message);
      return;
    }
    setPost(result.data as Post);
    setSlugTouched(true);
    setNote(status === "published" ? "Published. It will show on /blog within a minute." : "Draft saved.");
  };

  const remove = async () => {
    if (!post.id || !window.confirm("Delete this post? This cannot be undone.")) return;
    await db.from("posts").delete().eq("id", post.id);
    onDone();
  };

  const upload = async (file: File) => {
    setBusy(true);
    const path = `${Date.now()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`;
    const { error } = await db.storage.from("blog").upload(path, file, { cacheControl: "31536000", upsert: false });
    setBusy(false);
    if (error) {
      setNote(error.message);
      return;
    }
    set("cover_url", db.storage.from("blog").getPublicUrl(path).data.publicUrl);
  };

  return (
    <section>
      <div className={styles.head}>
        <button className={styles.link} onClick={onDone}>
          ← All posts
        </button>
        <div className={styles.actions}>
          {post.id ? (
            <button className={styles.danger} onClick={remove}>
              Delete
            </button>
          ) : null}
          {post.status === "published" ? (
            <button className={styles.secondary} disabled={busy} onClick={() => save("draft")}>
              Unpublish
            </button>
          ) : (
            <button className={styles.secondary} disabled={busy} onClick={() => save("draft")}>
              Save draft
            </button>
          )}
          <button className={styles.primary} disabled={busy} onClick={() => save("published")}>
            {post.status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>
      {note ? <p className={styles.note}>{note}</p> : null}
      <div className={styles.editor}>
        <div className={styles.fields}>
          <label>
            Title
            <input
              className={`${styles.input} ${styles.titleInput}`}
              value={post.title}
              onChange={(event) => {
                set("title", event.target.value);
                if (!slugTouched) set("slug", slugify(event.target.value));
              }}
              placeholder="Why Arabic voice AI needs 25 dialects"
            />
          </label>
          <label>
            URL
            <span className={styles.slug}>
              /blog/
              <input
                className={styles.input}
                value={post.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  set("slug", slugify(event.target.value));
                }}
              />
            </span>
          </label>
          <label>
            Summary
            <textarea className={styles.input} rows={2} value={post.excerpt} onChange={(event) => set("excerpt", event.target.value)} placeholder="One or two sentences shown on the blog card." />
          </label>
          <div className={styles.twoCol}>
            <label>
              Category
              <select className={styles.input} value={post.category} onChange={(event) => set("category", event.target.value)}>
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label>
              Author
              <input className={styles.input} value={post.author} onChange={(event) => set("author", event.target.value)} />
            </label>
          </div>
          <label>
            Cover image
            <span className={styles.cover}>
              {post.cover_url ? <img src={post.cover_url} alt="" /> : <span className={styles.noCover} />}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => event.target.files?.[0] && upload(event.target.files[0])} />
              {post.cover_url ? (
                <button className={styles.link} onClick={() => set("cover_url", null)}>
                  Remove
                </button>
              ) : null}
            </span>
          </label>
        </div>
        <div className={styles.bodyCol}>
          <div className={styles.bodyTabs}>
            <button className={!preview ? styles.tabOn : ""} onClick={() => setPreview(false)}>
              Write
            </button>
            <button className={preview ? styles.tabOn : ""} onClick={() => setPreview(true)}>
              Preview
            </button>
            <span>Markdown: ## heading, **bold**, - list, [link](https://…)</span>
          </div>
          {preview ? (
            <div className={styles.preview} dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body || "_Nothing written yet._") }} />
          ) : (
            <textarea className={`${styles.input} ${styles.body}`} value={post.body} onChange={(event) => set("body", event.target.value)} placeholder="Write the article…" />
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Team */
type Member = { email: string; name: string | null; role: PortalRole };

/** Who may give each role: admins give any; the head of HR adds recruiting managers. */
const canGrant: Record<PortalRole, PortalRole[]> = {
  admin: ["admin", "marketing", "hr_head", "recruiter"],
  marketing: [],
  hr_head: ["recruiter"],
  recruiter: [],
};

const departments: { name: string; roles: PortalRole[]; note: string }[] = [
  { name: "Admin", roles: ["admin"], note: "Everything, including the team." },
  { name: "Marketing", roles: ["marketing"], note: "Form submissions, blog posts, data requests and the catalogue." },
  { name: "HR", roles: ["hr_head", "recruiter"], note: "Roles and applications. Only the head of HR opens or closes roles and deletes applications." },
];

function Team({ session, role }: { session: Session; role: PortalRole }) {
  const db = useMemo(() => supabaseBrowser(), []);
  const grantable = canGrant[role];
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [newRole, setNewRole] = useState<PortalRole>(grantable[grantable.length - 1] ?? "recruiter");
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    const { data } = await db.from("admins").select("email, name, role").order("created_at");
    setMembers((data as Member[]) ?? []);
  }, [db]);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  const call = async (method: "POST" | "PATCH" | "DELETE", body: object) => {
    const response = await fetch("/api/admin/invite", {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify(body),
    });
    const result = (await response.json().catch(() => ({}))) as { error?: string };
    return response.ok ? null : result.error || "Something went wrong.";
  };

  return (
    <section>
      <div className={styles.head}>
        <div>
          <h1>Team</h1>
          <p>{role === "admin" ? "Add people and choose what each of them can see." : "Add recruiting managers to help with applications."}</p>
        </div>
      </div>
      {grantable.length ? (
        <form
          className={styles.filters}
          onSubmit={async (event) => {
            event.preventDefault();
            setNote("");
            const error = await call("POST", { email, name, role: newRole });
            if (error) setNote(error);
            else {
              setNote(`${email} can now sign in at /admin as ${roleNames[newRole]}.`);
              setEmail("");
              setName("");
              load();
            }
          }}
        >
          <input className={styles.input} placeholder="Name (optional)" value={name} onChange={(event) => setName(event.target.value)} />
          <input className={styles.input} type="email" required placeholder="colleague@cntxt.tech" value={email} onChange={(event) => setEmail(event.target.value)} />
          <select className={styles.input} value={newRole} onChange={(event) => setNewRole(event.target.value as PortalRole)}>
            {grantable.map((item) => (
              <option key={item} value={item}>
                {roleNames[item]}
              </option>
            ))}
          </select>
          <button className={styles.primary}>Add to the portal</button>
        </form>
      ) : null}
      {note ? <p className={styles.note}>{note}</p> : null}
      <div className={styles.departments}>
        {departments.map((department) => {
          const people = members.filter((member) => department.roles.includes(member.role));
          if (!people.length && role !== "admin") return null;
          return (
            <section key={department.name} className={styles.department}>
              <header>
                <h2>{department.name}</h2>
                <p>{department.note}</p>
              </header>
              {people.length === 0 ? <p className={styles.emptySmall}>No one yet.</p> : null}
              <ul className={styles.members}>
                {people.map((member) => {
                  const mine = member.email === session.user.email?.toLowerCase();
                  const manageable = !mine && grantable.includes(member.role);
                  return (
                    <li key={member.email}>
                      <span>
                        <strong>{member.name || member.email}</strong>
                        {member.name ? <em>{member.email}</em> : null}
                      </span>
                      {manageable && grantable.length > 1 ? (
                        <select
                          className={styles.input}
                          value={member.role}
                          onChange={async (event) => {
                            const next = event.target.value as PortalRole;
                            const error = await call("PATCH", { email: member.email, role: next });
                            setNote(error ?? `${member.email} is now ${roleNames[next]}.`);
                            load();
                          }}
                        >
                          {grantable.map((item) => (
                            <option key={item} value={item}>
                              {roleNames[item]}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <b className={styles.roleBadge}>{roleNames[member.role]}</b>
                      )}
                      {manageable ? (
                        <button
                          className={styles.link}
                          onClick={async () => {
                            if (!window.confirm(`Remove ${member.email} from the portal?`)) return;
                            const error = await call("DELETE", { email: member.email });
                            setNote(error ?? `${member.email} no longer has access.`);
                            load();
                          }}
                        >
                          Remove
                        </button>
                      ) : mine ? (
                        <em className={styles.you}>You</em>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}
