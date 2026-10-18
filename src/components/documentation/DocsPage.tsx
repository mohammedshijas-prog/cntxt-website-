"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { DocIcon } from "./DocIcon";
import styles from "./docs.module.css";

const docs = "https://docs.munsit.com";

type DocItem = {
  id: string;
  title: string;
  icon: string;
  lead: string;
  body: string[];
  href: string;
};

// The developer documentation lives at docs.munsit.com. Each page here is a
// short summary that links to the full guide.
const groups: { title: string; items: DocItem[] }[] = [
  {
    title: "Get started",
    items: [
      {
        id: "overview",
        title: "Overview",
        icon: "info",
        lead: "What you can build with Munsit, CNTXT AI's Arabic voice platform.",
        body: [
          "Munsit gives you Arabic speech-to-text and text-to-speech through one API. Speech-to-text covers more than 25 Arabic dialects and handles Arabic–English code-switching. Text-to-speech is provided by the Faseeh models.",
          "You can call it over REST for files, over WebSocket for live audio, through plugins for voice-agent frameworks, or run it on your own infrastructure. The full developer documentation is at docs.munsit.com.",
        ],
        href: docs,
      },
      {
        id: "quick-start",
        title: "Quick start",
        icon: "rocket",
        lead: "Create an API key, send one audio file and get Arabic text back.",
        body: [],
        href: `${docs}/quickstart`,
      },
      {
        id: "authentication",
        title: "Authentication",
        icon: "key",
        lead: "One API key, sent in a header on every request.",
        body: [
          "Create a key in the Munsit dashboard and send it in the x-api-key header. There is no OAuth flow or token exchange.",
          "Keys are region-specific: a key from the global dashboard works with the global endpoint, and a key from the UAE dashboard works with the UAE endpoint. Keep keys out of version control and out of browser or mobile code. Call the API from your own backend instead.",
        ],
        href: `${docs}/authentication`,
      },
      {
        id: "limits-and-errors",
        title: "Rate limits and errors",
        icon: "shield",
        lead: "How the API tells you to slow down, and what its error responses mean.",
        body: [
          "The Munsit documentation lists the rate limits that apply to your key and the error responses the API returns. Read both before you put an integration into production.",
        ],
        href: `${docs}/rate-limits`,
      },
    ],
  },
  {
    title: "Speech to text",
    items: [
      {
        id: "transcribe",
        title: "Transcribe audio",
        icon: "list",
        lead: "Send an audio file and receive the transcript as JSON.",
        body: [
          "Post a file to the transcribe endpoint. The response includes a transcription ID, the transcript text and the duration of the audio.",
          "Separate endpoints add speaker diarisation, sentiment analysis on a diarised transcript and minutes of the meeting.",
        ],
        href: `${docs}/speech-to-text/transcribe`,
      },
      {
        id: "streaming",
        title: "Live streaming",
        icon: "upgrade",
        lead: "Transcribe live audio over a WebSocket, with turn detection.",
        body: [
          "Open a WebSocket connection, send raw audio frames and receive interim and final results as the person speaks. The server reports when speech starts and when an utterance ends.",
          "The streaming guide sets out the supported encodings and sample rates, the control messages and the events the server sends.",
        ],
        href: `${docs}/speech-to-text/streaming`,
      },
      {
        id: "understanding",
        title: "Understanding",
        icon: "book",
        lead: "Work with a transcript once you have it.",
        body: [
          "Run sentiment analysis, extract keywords or translate. Each feature has its own guide and endpoint in the Munsit documentation.",
        ],
        href: `${docs}/understanding/sentiment-analysis`,
      },
    ],
  },
  {
    title: "Text to speech",
    items: [
      {
        id: "synthesise",
        title: "Synthesise speech",
        icon: "type",
        lead: "Turn Arabic text into speech with the Faseeh models.",
        body: [
          "Send text and a voice ID to the text-to-speech endpoint and receive audio. Audio can be streamed as it is generated, and a separate endpoint returns timings alongside the audio.",
          "A diacritisation endpoint adds tashkīl to Arabic text before it is spoken.",
        ],
        href: `${docs}/text-to-speech/get-started`,
      },
      {
        id: "voices",
        title: "Voices and cloning",
        icon: "users",
        lead: "List the available voices, preview them, or clone a voice from a sample.",
        body: [
          "The voices guide covers listing and previewing voices. Voice cloning creates a new voice from an audio sample you upload.",
        ],
        href: `${docs}/text-to-speech/voices`,
      },
    ],
  },
  {
    title: "Integrate and deploy",
    items: [
      {
        id: "voice-agents",
        title: "Voice-agent frameworks",
        icon: "plug",
        lead: "Use Munsit inside LiveKit, Pipecat, VAPI or Ultravox.",
        body: [
          "The LiveKit plugin, livekit-plugins-munsit, provides Munsit speech recognition and speech synthesis to LiveKit Agents. The documentation has matching guides for Pipecat, VAPI and Ultravox.",
          "The documentation also covers Munsit's MCP server.",
        ],
        href: `${docs}/integrations/livekit`,
      },
      {
        id: "reference",
        title: "API reference",
        icon: "code",
        lead: "Every endpoint, and the WebSocket protocol, in one place.",
        body: [
          "The reference lists each REST endpoint with its parameters and responses, and documents the WebSocket protocol used for live transcription and streamed speech.",
        ],
        href: `${docs}/reference/endpoints`,
      },
      {
        id: "self-hosting",
        title: "On-premises deployment",
        icon: "settings",
        lead: "Run Munsit inside your own network.",
        body: [
          "Organisations that need data residency or predictable low latency can run Munsit on their own infrastructure, so audio and transcripts stay inside their network. Munsit can also run in a sovereign cloud or on-device.",
          "Deployment is arranged with the team. The self-hosting guide explains what is involved and who to contact for architecture and sizing guidance.",
        ],
        href: `${docs}/deployment/self-hosting`,
      },
      {
        id: "compliance",
        title: "Compliance",
        icon: "square",
        lead: "How Munsit handles security and regulatory requirements.",
        body: [
          "The compliance guide describes the standards Munsit works to. CNTXT AI's security controls and certifications are published in the trust centre at cntxt.trust.site.",
        ],
        href: `${docs}/deployment/compliance`,
      },
    ],
  },
];

const toc = [
  {
    id: "api-key",
    title: "Create an API key",
    items: ["Regional endpoints", "Keeping keys safe"],
  },
  {
    id: "first-request",
    title: "Send your first request",
    items: ["Speech to text", "Text to speech"],
  },
  {
    id: "go-further",
    title: "Go further",
    items: ["Full documentation"],
  },
];

const flat = groups.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.title })),
);

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function EndpointLine({ method, path }: { method: string; path: string }) {
  return (
    <p>
      <span className={styles.tag}>{method}</span>
      <span className={styles.plain}> </span>
      <span className={styles.cls}>{path}</span>
    </p>
  );
}

function DocsLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "#7d52f4", textDecoration: "underline" }}
    >
      {children}
    </a>
  );
}

export function DocsPage() {
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState("quick-start");
  const [tocId, setTocId] = useState("speech-to-text");
  // Phones and tablets: the page list is collapsed behind a toggle.
  const [navOpen, setNavOpen] = useState(false);

  const needle = query.trim().toLowerCase();
  const visibleGroups = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            `${item.title} ${item.lead}`.toLowerCase().includes(needle),
          ),
        }))
        .filter((group) => group.items.length > 0),
    [needle],
  );

  const active = flat.find((item) => item.id === activeId) ?? flat[0];
  const activeIndex = flat.findIndex((item) => item.id === active.id);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const previous = flat[activeIndex - 1];
  const following = flat[activeIndex + 1];

  function openToc(id: string) {
    setTocId(id);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    });
  }

  function step(direction: -1 | 1) {
    const next = flat[activeIndex + direction];
    if (!next) return;
    setActiveId(next.id);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0 });
    });
  }

  return (
    <main className={styles.page}>
      <SiteNav />

      <div className={styles.docs}>
        <aside className={styles.sidebar} aria-label="Documentation" data-open={navOpen}>
          <label className={styles.search}>
            <span className={styles.searchField}>
              <img loading="lazy" decoding="async" src="/documentation/search.svg" alt="" width={18} height={18} />
              <input
                ref={searchRef}
                type="search"
                placeholder="Search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search documentation"
              />
            </span>
            <kbd>⌘ K</kbd>
          </label>

          <button
            type="button"
            className={styles.navToggle}
            aria-expanded={navOpen}
            onClick={() => setNavOpen((value) => !value)}
          >
            <span>
              <small>Browsing</small>
              {active.title}
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {visibleGroups.length === 0 ? (
            <p className={styles.empty}>No matching pages.</p>
          ) : (
            visibleGroups.map((group) => (
              <section key={group.title} className={styles.group}>
                <h2>{group.title}</h2>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        aria-current={item.id === active.id ? "page" : undefined}
                        onClick={() => {
                          setActiveId(item.id);
                          setNavOpen(false);
                        }}
                      >
                        <span aria-hidden="true"><DocIcon name={item.icon} /></span>
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </aside>

        <article className={styles.article}>
          <p className={styles.crumbs}>
            <span>Overview</span>
            <span aria-hidden="true">›</span>
            <span>{active.group}</span>
            <span aria-hidden="true">›</span>
            <span className={styles.crumbCurrent}>{active.title}</span>
          </p>

          {active.id === "quick-start" ? (
            <>
              <h1>{active.title}</h1>
              <p className={styles.lead}>{active.lead}</p>

              <div className={styles.preview}>
                <img
                  className={styles.previewPhoto}
                  src="/documentation/preview-photo.webp"
                  alt=""
                />
                <img
                  className={styles.previewWash}
                  src="/partners/panel-color.jpg"
                  alt=""
                />
                <div className={styles.snippet}>
                  <p className={styles.fileTab}>
                    transcribe
                    <br />
                    a file
                  </p>
                  <div className={styles.code}>
                    <p>
                      <span className={styles.tag}>curl</span>
                      <span className={styles.plain}>{" -X POST "}</span>
                      <span className={styles.cls}>
                        &quot;https://api.munsit.com/api/v1/audio/transcribe&quot;
                      </span>
                      <span className={styles.plain}>{" \\"}</span>
                    </p>
                    <p>
                      <span className={styles.indent}>{"  "}</span>
                      <span className={styles.plain}>{"-H "}</span>
                      <span className={styles.val}>&quot;x-api-key: $MUNSIT_API_KEY&quot;</span>
                      <span className={styles.plain}>{" \\"}</span>
                    </p>
                    <p>
                      <span className={styles.indent}>{"  "}</span>
                      <span className={styles.plain}>{"-F "}</span>
                      <span className={styles.val}>&quot;file=@meeting.mp3&quot;</span>
                    </p>
                  </div>
                </div>
              </div>

              <h2 id="api-key">Create an API key</h2>
              <p id="regional-endpoints">
                Create a key in the Munsit dashboard at{" "}
                <DocsLink href="https://app.munsit.com">app.munsit.com</DocsLink>. Keys are
                region-specific: the global dashboard issues keys for the global endpoint, and
                the UAE dashboard issues keys for the UAE endpoint. Use the key with the endpoint
                it was created for.
              </p>
              <p id="keeping-keys-safe">
                Send the key in the <code>x-api-key</code> header on every request. Keep it in an
                environment variable such as <code className={styles.px}>MUNSIT_API_KEY</code>,
                never in version control or client-side code.
              </p>

              <div className={styles.pair} id="first-request">
                <section className={styles.card} id="speech-to-text">
                  <div className={styles.cardCode}>
                    <div className={styles.cardFrame}>
                      <p className={styles.cardTab}>speech-to-text</p>
                      <div className={styles.cardLines}>
                        <EndpointLine method="POST" path="/audio/transcribe" />
                        <EndpointLine method="POST" path="/audio/diarization/transcribe" />
                        <EndpointLine method="WSS" path="/listen" />
                      </div>
                    </div>
                  </div>
                  <h3>Speech to text</h3>
                  <p>
                    Post an audio file to get a transcript, add speaker diarisation, or stream
                    live audio over a WebSocket.
                  </p>
                </section>
                <section className={styles.card} id="text-to-speech">
                  <div className={styles.cardCode}>
                    <div className={styles.cardFrame}>
                      <p className={styles.cardTab}>text-to-speech</p>
                      <div className={styles.cardLines}>
                        <EndpointLine method="POST" path="/text-to-speech/{model_id}" />
                        <EndpointLine method="GET" path="/voices" />
                        <EndpointLine method="POST" path="/voices/clone" />
                      </div>
                    </div>
                  </div>
                  <h3>Text to speech</h3>
                  <p>
                    Send text and a voice ID to generate Arabic speech, list the available
                    voices, or clone a voice from a sample.
                  </p>
                </section>
              </div>

              <h2 id="go-further">Go further</h2>
              <p className={styles.wide} id="full-documentation">
                The{" "}
                <DocsLink href={active.href}>quick start on docs.munsit.com</DocsLink> has the
                same request in Python, Node.js and Go, and describes the response. From there,
                read the guides on{" "}
                <DocsLink href={`${docs}/speech-to-text/streaming`}>live streaming</DocsLink>,{" "}
                <DocsLink href={`${docs}/integrations/livekit`}>LiveKit</DocsLink> and{" "}
                <DocsLink href={`${docs}/deployment/self-hosting`}>
                  on-premises deployment
                </DocsLink>
                , or open the{" "}
                <DocsLink href={`${docs}/reference/endpoints`}>endpoint reference</DocsLink>.
              </p>
            </>
          ) : (
            <>
              <h1>{active.title}</h1>
              <p className={styles.lead}>{active.lead}</p>
              {active.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
              <p>
                <DocsLink href={active.href}>
                  Read the {active.title.toLowerCase()} guide on docs.munsit.com
                </DocsLink>
              </p>
            </>
          )}

          <div className={styles.pager}>
            <button type="button" onClick={() => step(-1)} disabled={activeIndex === 0}>
              {previous ? previous.title : "Previous"}
            </button>
            <button
              type="button"
              className={styles.next}
              onClick={() => step(1)}
              disabled={activeIndex === flat.length - 1}
            >
              {following ? following.title : "Next"}
              <img loading="lazy" decoding="async" src="/documentation/caret.svg" alt="" width={25} height={25} />
            </button>
          </div>
        </article>

        <aside className={styles.toc} aria-label="On this page">
          <h2>On this page</h2>
          {active.id === "quick-start"
            ? toc.map((section) => (
                <section key={section.id}>
                  <h3>
                    <button type="button" onClick={() => openToc(section.id)}>
                      {section.title}
                    </button>
                  </h3>
                  <ul>
                    {section.items.map((item) => {
                      const id = slug(item);
                      const current = tocId === id;
                      return (
                        <li key={item} data-current={current || undefined}>
                          <button type="button" onClick={() => openToc(id)}>
                            {item}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))
            : null}
        </aside>
      </div>

      <SiteClose current="Documentation" hideBand />
    </main>
  );
}
