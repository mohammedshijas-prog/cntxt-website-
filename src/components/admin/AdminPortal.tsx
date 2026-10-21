"use client";

import type { Session } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { renderMarkdown } from "@/lib/markdown";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Applications, Roles } from "./AdminCareers";
import { Catalogue, DataRequests } from "./AdminCatalogue";
import { SeoReports } from "./AdminSeo";
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
  seo: "SEO & GEO",
  team: "Team",
  settings: "Settings",
} as const;
type Tab = keyof typeof tabs;

/** Sidebar sections, Mac-style: grouped by what the work is. */
const groups: { name: string; items: Tab[] }[] = [
  { name: "Inbox", items: ["submissions", "applications", "requests"] },
  { name: "Workspace", items: ["roles", "catalogue", "posts"] },
  { name: "Insights", items: ["seo"] },
  { name: "Admin", items: ["team", "settings"] },
];

/* Rounded-stroke icons drawn to sit with SF Symbols (Apple's symbol files are licensed for Apple platforms only). */
const icons: Record<Tab, string> = {
  submissions: "M4 6h16v12H4zM4 7l8 6 8-6",
  applications: "M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M4 7h16v12H4zM4 12h16",
  requests: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  roles: "M9 7a3 3 0 1 0 6 0 3 3 0 0 0-6 0M5 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1",
  catalogue: "M4 5h16v4H4zM4 11h16v4H4zM4 17h16v2H4z",
  posts: "M5 4h10l4 4v12H5zM14 4v5h5M8 13h8M8 17h6",
  seo: "M4 19V9M10 19V5M16 19v-7M3 21h18",
  team: "M7 9a3 3 0 1 0 6 0 3 3 0 0 0-6 0M15 7a3 3 0 1 1 3 5M2 20a6 6 0 0 1 12 0M16 14a5 5 0 0 1 6 6",
  settings: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.6 1.1V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.6-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 4.6 15H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.6l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.6-1.1V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.6 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z",
};

/** What each role can open. The database enforces the same split. */
export type PortalRole = "admin" | "marketing" | "hr_head" | "recruiter" | "data_head" | "data_manager";
export const roleNames: Record<PortalRole, string> = {
  admin: "Admin",
  marketing: "Marketing",
  hr_head: "Head of HR",
  recruiter: "Recruiting manager",
  data_head: "Head of data",
  data_manager: "Data manager",
};
const access: Record<PortalRole, Tab[]> = {
  admin: ["submissions", "applications", "roles", "requests", "catalogue", "posts", "seo", "team", "settings"],
  marketing: ["submissions", "posts", "seo"],
  hr_head: ["applications", "roles", "team"],
  recruiter: ["applications", "roles"],
  data_head: ["requests", "catalogue", "team"],
  data_manager: ["requests", "catalogue"],
};

/** The CNTXT portal: submissions, job applications, dataset requests, roles, the catalogue, blog posts and the team. */
export function AdminPortal() {
  const db = useMemo(() => supabaseBrowser(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [role, setRole] = useState<PortalRole | null>(null);
  // Each section has its own address (/admin/seo, /admin/roles…), so links,
  // bookmarks and reloads land in the right place.
  const pathname = usePathname();
  const search = useSearchParams();
  const section = pathname.split("/")[2] ?? "";
  const chosen = section in tabs ? (section as Tab) : null;
  // Set when HR jumps from a role to the people who applied for it.
  const roleFocus = chosen === "applications" ? search.get("role") ?? undefined : undefined;
  const go = (next: Tab, query = "") => window.history.pushState(null, "", `/admin/${next}${query}`);

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
      <aside className={styles.sidebar} aria-label="Portal">
        <Link href="/" className={styles.brand}>
          <img src="/partners/nav-logo.svg" alt="CNTXT AI" height={16} />
          <span>Portal</span>
        </Link>
        <nav className={styles.nav}>
          {groups.map((group) => {
            const items = group.items.filter((item) => allowed.includes(item));
            if (!items.length) return null;
            return (
              <div key={group.name} className={styles.navGroup}>
                <p>{group.name}</p>
                {items.map((item) => (
                  <button key={item} className={tab === item ? styles.navOn : ""} aria-current={tab === item ? "page" : undefined} onClick={() => {
                      go(item);
                    }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={icons[item]} />
                    </svg>
                    {tabs[item]}
                  </button>
                ))}
              </div>
            );
          })}
        </nav>
        <div className={styles.who}>
          <span className={styles.avatar} aria-hidden="true">
            {session.user.email?.[0]?.toUpperCase()}
          </span>
          <span className={styles.whoText}>
            <strong>{session.user.email}</strong>
            {role ? <em>{roleNames[role]}</em> : null}
          </span>
          <button className={styles.link} onClick={() => db.auth.signOut()}>
            Sign out
          </button>
        </div>
      </aside>
      <main className={styles.main}>
        {tab === "submissions" ? <Submissions /> : null}
        {tab === "posts" ? <Posts /> : null}
        {tab === "applications" ? <Applications key={roleFocus ?? "all"} role={role ?? "recruiter"} focus={roleFocus} /> : null}
        {tab === "roles" ? (
          <Roles
            role={role ?? "recruiter"}
            onApplicants={(roleId) => {
              go("applications", `?role=${encodeURIComponent(roleId)}`);
            }}
          />
        ) : null}
        {tab === "requests" ? <DataRequests role={role ?? "data_manager"} /> : null}
        {tab === "catalogue" ? <Catalogue role={role ?? "data_manager"} /> : null}
        {tab === "team" ? <Team session={session} role={role ?? "recruiter"} /> : null}
        {tab === "settings" ? <Settings session={session} /> : null}
        {tab === "seo" ? <SeoReports session={session} /> : null}
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
  admin: ["admin", "marketing", "hr_head", "recruiter", "data_head", "data_manager"],
  marketing: [],
  hr_head: ["recruiter"],
  recruiter: [],
  data_head: ["data_manager"],
  data_manager: [],
};

const departments: { name: string; roles: PortalRole[]; note: string }[] = [
  { name: "Admin", roles: ["admin"], note: "Everything, including the team." },
  { name: "Marketing", roles: ["marketing"], note: "Form submissions and blog posts." },
  { name: "Data", roles: ["data_head", "data_manager"], note: "The data catalogue and dataset requests. Only the head of data publishes datasets and deletes requests." },
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
          <p>{role === "admin" ? "Add people and choose what each of them can see." : role === "data_head" ? "Add data managers to help with the catalogue and requests." : "Add recruiting managers to help with applications."}</p>
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

/* ------------------------------------------------------------ Settings */
type KeyStatus = { set: boolean; source: "environment" | "portal" | null; last4: string | null; updatedBy: string | null; updatedAt: string | null };

/** Admin-only: the Anthropic key used to draft role descriptions. The key itself is never shown again. */
function Settings({ session }: { session: Session }) {
  const [status, setStatus] = useState<KeyStatus | null>(null);
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const call = useCallback(
    async (method: "GET" | "PUT" | "DELETE", body?: object) => {
      const response = await fetch("/api/admin/settings", {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: body ? JSON.stringify(body) : undefined,
      });
      const result = (await response.json().catch(() => ({}))) as { anthropic?: KeyStatus; error?: string };
      if (result.anthropic) setStatus(result.anthropic);
      return response.ok ? null : result.error || "Something went wrong.";
    },
    [session.access_token],
  );

  useEffect(() => {
    queueMicrotask(() => {
      call("GET");
    });
  }, [call]);

  return (
    <section>
      <div className={styles.head}>
        <div>
          <h1>Settings</h1>
          <p>Only admins see this page.</p>
        </div>
      </div>
      <div className={styles.department}>
        <header>
          <h2>Anthropic API key</h2>
          <p>Used to draft role summaries and descriptions with Claude. It is checked with Anthropic before it is saved, stored where no one can read it back, and only ever shown as its last four characters.</p>
        </header>
        <p className={styles.keyStatus}>
          {status === null
            ? "Checking…"
            : status.source === "environment"
              ? "Set in the site's environment (Vercel). That key is used, and this one is ignored."
              : status.set
                ? `Saved · ends in …${status.last4}${status.updatedBy ? ` · by ${status.updatedBy}` : ""}${status.updatedAt ? ` · ${when(status.updatedAt)}` : ""}`
                : "Not set yet. Role drafting is off until a key is added."}
        </p>
        <form
          className={styles.filters}
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setNote("");
            const error = await call("PUT", { anthropicApiKey: key });
            setBusy(false);
            setKey("");
            setNote(error ?? "Key checked and saved. Role drafting is on.");
          }}
        >
          <input
            className={styles.input}
            type="password"
            autoComplete="off"
            spellCheck={false}
            required
            placeholder={status?.set ? "Paste a new key to replace it" : "sk-ant-…"}
            value={key}
            onChange={(event) => setKey(event.target.value)}
          />
          <button className={styles.primary} disabled={busy || !key}>
            {busy ? "Checking…" : status?.set ? "Replace key" : "Save key"}
          </button>
          {status?.source === "portal" ? (
            <button
              type="button"
              className={styles.danger}
              onClick={async () => {
                if (!window.confirm("Remove the saved key? Role drafting will stop until a new key is added.")) return;
                const error = await call("DELETE");
                setNote(error ?? "Key removed.");
              }}
            >
              Remove
            </button>
          ) : null}
        </form>
        {note ? <p className={styles.note}>{note}</p> : null}
      </div>
    </section>
  );
}
