"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import type { PortalRole } from "./AdminPortal";
import { downloadCsv, slugify, when } from "./shared";
import styles from "./admin.module.css";

type Dataset = {
  id?: string;
  slug: string;
  title: string;
  kind: "captured" | "labelled";
  category: string;
  blurb: string;
  capture: string;
  labels: string[];
  sample_url: string | null;
  sample_name: string | null;
  status: "draft" | "published";
  sort: number;
};

type DataRequest = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string | null;
  dataset_titles: string[];
  page: string | null;
  status: "new" | "contacted" | "scoping" | "delivered" | "closed";
  notes: string;
  created_at: string;
};

const modalities = ["Audio", "Document", "Image", "Text", "Video", "3D", "Evaluation"];
const requestStages: DataRequest["status"][] = ["new", "contacted", "scoping", "delivered", "closed"];
const blankDataset: Dataset = { slug: "", title: "", kind: "labelled", category: "Text", blurb: "", capture: "", labels: ["", ""], sample_url: null, sample_name: null, status: "draft", sort: 100 };

/* ------------------------------------------------------------ Data requests */
export function DataRequests({ role }: { role: PortalRole }) {
  void role; // Everyone on the data team works requests; deletes stay with the database rules.
  const db = useMemo(() => supabaseBrowser(), []);
  const [rows, setRows] = useState<DataRequest[]>([]);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<"all" | DataRequest["status"]>("all");
  const [open, setOpen] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    const { data } = await db.from("dataset_requests").select("*").order("created_at", { ascending: false }).limit(2000);
    setRows((data as DataRequest[]) ?? []);
  }, [db]);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  const visible = rows.filter((row) => {
    if (stage !== "all" && row.status !== stage) return false;
    const text = `${row.name} ${row.email} ${row.company ?? ""} ${row.message ?? ""} ${row.dataset_titles.join(" ")}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  // Which datasets people ask for most, across every request.
  const demand = Object.entries(
    rows.flatMap((row) => row.dataset_titles).reduce<Record<string, number>>((tally, title) => ({ ...tally, [title]: (tally[title] ?? 0) + 1 }), {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const setStatus = async (id: string, status: DataRequest["status"]) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, status } : row)));
    await db.from("dataset_requests").update({ status }).eq("id", id);
  };

  const saveNotes = async (id: string) => {
    const value = notes[id] ?? "";
    setRows((current) => current.map((row) => (row.id === id ? { ...row, notes: value } : row)));
    const { error } = await db.from("dataset_requests").update({ notes: value }).eq("id", id);
    setNote(error ? error.message : "Notes saved.");
  };

  return (
    <section>
      <div className={styles.head}>
        <div>
          <h1>Data requests</h1>
          <p>
            {rows.length} total · {rows.filter((row) => row.status === "new").length} new
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
                "data-requests",
                ["Date", "Name", "Email", "Company", "Datasets", "Message", "Status", "Team notes"],
                visible.map((row) => [when(row.created_at), row.name, row.email, row.company, row.dataset_titles.join("; "), row.message, row.status, row.notes]),
              )
            }
          >
            Export CSV
          </button>
        </div>
      </div>
      {demand.length ? (
        <ul className={styles.demand} aria-label="Most requested datasets">
          {demand.map(([title, count]) => (
            <li key={title}>
              <strong>{count}</strong>
              {title}
            </li>
          ))}
        </ul>
      ) : null}
      <div className={styles.filters}>
        <input className={styles.input} placeholder="Search name, email, company, dataset or message" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className={styles.input} value={stage} onChange={(event) => setStage(event.target.value as typeof stage)}>
          <option value="all">All stages</option>
          {requestStages.map((item) => (
            <option key={item} value={item}>
              {item[0].toUpperCase() + item.slice(1)}
            </option>
          ))}
        </select>
      </div>
      {note ? <p className={styles.note}>{note}</p> : null}
      {visible.length === 0 ? (
        <p className={styles.empty}>No requests yet. Requests sent from the data catalogue appear here.</p>
      ) : (
        <div className={styles.table}>
          <div className={`${styles.row} ${styles.rowHead}`}>
            <span>Who</span>
            <span>Datasets</span>
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
                    {row.company ? ` · ${row.company}` : ""}
                  </em>
                </span>
                <span>
                  <b className={styles.pill}>{row.dataset_titles.length}</b> {row.dataset_titles.join(", ")}
                  <em className={styles.snippet}>{row.message ?? ""}</em>
                </span>
                <span className={styles.date}>{when(row.created_at)}</span>
                <span className={`${styles.status} ${styles[row.status]}`}>{row.status}</span>
              </button>
              {open === row.id ? (
                <div className={styles.detail}>
                  <p className={styles.messageFull}>{row.message || "No message."}</p>
                  <dl>
                    <dt>Datasets</dt>
                    <dd>{row.dataset_titles.join(", ")}</dd>
                    <dt>Sent from</dt>
                    <dd>{row.page ?? "—"}</dd>
                  </dl>
                  <label className={styles.notesField}>
                    Team notes
                    <textarea
                      className={styles.input}
                      rows={3}
                      value={notes[row.id] ?? row.notes}
                      onChange={(event) => setNotes((current) => ({ ...current, [row.id]: event.target.value }))}
                      placeholder="Volume, price, who owns it…"
                    />
                  </label>
                  <div className={styles.actions}>
                    <a className={styles.primary} href={`mailto:${row.email}?subject=${encodeURIComponent("Your data request to CNTXT AI")}`}>
                      Reply by email
                    </a>
                    <button className={styles.secondary} onClick={() => saveNotes(row.id)}>
                      Save notes
                    </button>
                  </div>
                  <div className={styles.stages} role="group" aria-label="Move to stage">
                    {requestStages.map((item) => (
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

/* ------------------------------------------------------------ Catalogue */
export function Catalogue({ role }: { role: PortalRole }) {
  const publisher = role === "admin" || role === "data_head";
  const db = useMemo(() => supabaseBrowser(), []);
  const [items, setItems] = useState<Dataset[]>([]);
  const [editing, setEditing] = useState<Dataset | null>(null);

  const load = useCallback(async () => {
    const { data } = await db.from("datasets").select("*").order("sort").order("title");
    setItems((data as Dataset[]) ?? []);
  }, [db]);

  useEffect(() => {
    queueMicrotask(load);
  }, [load]);

  if (editing) {
    return (
      <DatasetEditor
        publisher={publisher}
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
          <h1>Catalogue</h1>
          <p>Published datasets show on /data-hub straight away, with their sample if one is uploaded.</p>
        </div>
        <button className={styles.primary} onClick={() => setEditing({ ...blankDataset, labels: ["", ""] })}>
          New dataset
        </button>
      </div>
      {items.length === 0 ? (
        <p className={styles.empty}>No datasets yet. Add the first one.</p>
      ) : (
        <ul className={styles.postList}>
          {items.map((item) => (
            <li key={item.id}>
              <button onClick={() => setEditing({ ...item, labels: [item.labels[0] ?? "", item.labels[1] ?? ""] })}>
                <span className={styles.countBadge}>{item.category}</span>
                <span>
                  <strong>{item.title}</strong>
                  <em>
                    {item.kind === "captured" ? "Captured data" : "Labelled data"} · {item.sample_url ? `sample: ${item.sample_name ?? "file"}` : "no sample"}
                  </em>
                </span>
                <span className={`${styles.status} ${styles[item.status]}`}>{item.status}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function DatasetEditor({ initial, onDone, publisher }: { initial: Dataset; onDone: () => void; publisher: boolean }) {
  const db = useMemo(() => supabaseBrowser(), []);
  const [item, setItem] = useState<Dataset>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const set = <K extends keyof Dataset>(key: K, value: Dataset[K]) => setItem((current) => ({ ...current, [key]: value }));

  const save = async (status: Dataset["status"]) => {
    if (!item.title.trim() || !item.slug) return setNote("Add a title first.");
    setBusy(true);
    setNote("");
    const row = {
      slug: item.slug,
      title: item.title.trim(),
      kind: item.kind,
      category: item.category,
      blurb: item.blurb.trim(),
      capture: item.kind === "captured" ? item.capture.trim() : "",
      labels: item.kind === "labelled" ? item.labels.map((label) => label.trim()).filter(Boolean) : [],
      sample_url: item.sample_url,
      sample_name: item.sample_name,
      status,
      sort: Number.isFinite(item.sort) ? item.sort : 100,
    };
    const result = item.id ? await db.from("datasets").update(row).eq("id", item.id).select().single() : await db.from("datasets").insert(row).select().single();
    setBusy(false);
    if (result.error) return setNote(/duplicate|unique/i.test(result.error.message) ? "Another dataset already uses that URL name. Change the slug." : result.error.message);
    const saved = result.data as Dataset;
    setItem({ ...saved, labels: [saved.labels[0] ?? "", saved.labels[1] ?? ""] });
    setSlugTouched(true);
    setNote(status === "published" ? "Published. It shows on /data-hub now." : "Draft saved.");
  };

  const remove = async () => {
    if (!item.id || !window.confirm("Delete this dataset from the catalogue? Past requests keep its name.")) return;
    await db.from("datasets").delete().eq("id", item.id);
    onDone();
  };

  const upload = async (file: File) => {
    setBusy(true);
    setNote("");
    const path = `${item.slug || "dataset"}/${Date.now()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`;
    const { error } = await db.storage.from("samples").upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type || undefined });
    setBusy(false);
    if (error) return setNote(error.message);
    setItem((current) => ({ ...current, sample_url: db.storage.from("samples").getPublicUrl(path).data.publicUrl, sample_name: file.name }));
    setNote("Sample uploaded. Save to put it on the catalogue.");
  };

  return (
    <section>
      <div className={styles.head}>
        <button className={styles.link} onClick={onDone}>
          ← Catalogue
        </button>
        <div className={styles.actions}>
          {item.id && publisher ? (
            <button className={styles.danger} onClick={remove}>
              Delete
            </button>
          ) : null}
          {publisher ? (
            <>
              <button className={styles.secondary} disabled={busy} onClick={() => save("draft")}>
                {item.status === "published" ? "Unpublish" : "Save draft"}
              </button>
              <button className={styles.primary} disabled={busy} onClick={() => save("published")}>
                {item.status === "published" ? "Update" : "Publish"}
              </button>
            </>
          ) : (
            <button className={styles.primary} disabled={busy} onClick={() => save(item.status)}>
              {item.status === "published" ? "Save changes" : "Save draft"}
            </button>
          )}
        </div>
      </div>
      {note ? <p className={styles.note}>{note}</p> : null}
      {!publisher ? <p className={styles.hint}>You can add and edit datasets and upload samples. The head of data publishes them to the catalogue.</p> : null}
      <div className={styles.fields}>
        <label>
          Title
          <input
            className={`${styles.input} ${styles.titleInput}`}
            value={item.title}
            onChange={(event) => {
              set("title", event.target.value);
              if (!slugTouched) set("slug", slugify(event.target.value));
            }}
            placeholder="Arabic conversational speech"
          />
        </label>
        <div className={styles.twoCol}>
          <label>
            Type
            <select className={styles.input} value={item.kind} onChange={(event) => set("kind", event.target.value as Dataset["kind"])}>
              <option value="captured">Captured data</option>
              <option value="labelled">Labelled data</option>
            </select>
          </label>
          <label>
            Modality
            <select className={styles.input} value={item.category} onChange={(event) => set("category", event.target.value)}>
              {modalities.map((modality) => (
                <option key={modality}>{modality}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Description
          <textarea className={styles.input} rows={3} value={item.blurb} onChange={(event) => set("blurb", event.target.value)} placeholder="What the data is, how it was captured or labelled, and how it was checked." />
        </label>
        {item.kind === "captured" ? (
          <label>
            Captured with
            <input className={styles.input} value={item.capture} onChange={(event) => set("capture", event.target.value)} placeholder="Head and wrist cameras" />
          </label>
        ) : (
          <div className={styles.twoCol}>
            <label>
              Label type 1
              <input className={styles.input} value={item.labels[0] ?? ""} onChange={(event) => set("labels", [event.target.value, item.labels[1] ?? ""])} placeholder="Transcription" />
            </label>
            <label>
              Label type 2
              <input className={styles.input} value={item.labels[1] ?? ""} onChange={(event) => set("labels", [item.labels[0] ?? "", event.target.value])} placeholder="Diarisation" />
            </label>
          </div>
        )}
        <div className={styles.twoCol}>
          <label>
            URL name
            <input
              className={styles.input}
              value={item.slug}
              onChange={(event) => {
                setSlugTouched(true);
                set("slug", slugify(event.target.value));
              }}
            />
          </label>
          <label>
            Order
            <input className={styles.input} type="number" value={item.sort} onChange={(event) => set("sort", Number(event.target.value))} />
          </label>
        </div>
        <label>
          Sample file
          <span className={styles.cover}>
            {item.sample_url ? (
              <a href={item.sample_url} target="_blank" rel="noopener noreferrer">
                {item.sample_name ?? "Current sample"}
              </a>
            ) : (
              <em>No sample yet. Image, audio, video, JSON, CSV, PDF or ZIP, up to 25 MB.</em>
            )}
            <input type="file" onChange={(event) => event.target.files?.[0] && upload(event.target.files[0])} />
            {item.sample_url ? (
              <button
                className={styles.link}
                onClick={() => {
                  set("sample_url", null);
                  set("sample_name", null);
                }}
              >
                Remove
              </button>
            ) : null}
          </span>
        </label>
      </div>
    </section>
  );
}
