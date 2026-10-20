"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./agentixSections.module.css";

/* Facts from actualize.pro, the product's own site (docs/content-brief.md, section 8). */

/* ------------------------------------------------------------ 2. Use cases, as switching cards */

const uses = [
  { title: "Customer support", agent: "Receptionist agent", image: "/solutions/study-1.webp", them: "I was charged twice this month.", us: "I can see both charges. I've raised a refund for the second one." },
  { title: "Appointment booking", agent: "Booking confirmation agent", image: "/healthcare/case-2.webp", them: "Can I move my appointment?", us: "Tomorrow at 10 or Thursday at 4. Which suits you?" },
  { title: "Concierge", agent: "Receptionist agent", image: "/industries/hospitality.jpg", them: "Is the pool open tonight?", us: "Until 10 pm. Shall I book you a cabana?" },
  { title: "Lead qualification", agent: "Sales agent", image: "/security/practice-a.webp", them: "We need agents for three branches.", us: "Got it. I've booked a call with our team for Sunday." },
  { title: "Billing support", agent: "Order and payment follow-up", image: "/healthcare/tile-chart.webp", them: "When will my refund arrive?", us: "It was sent today. I'll message you on WhatsApp when it lands." },
  { title: "Logistics", agent: "Order and payment follow-up", image: "/healthcare/tile-ship.webp", them: "Where is my order?", us: "It's out for delivery and arrives before 6 pm." },
  { title: "Surveys and feedback", agent: "Workflow builder", image: "/solutions/panel-app.webp", them: "Happy to answer a few questions.", us: "Thank you. On a scale of 1 to 5, how was your visit?" },
];

const dialects = ["Khaleeji", "Emirati", "Najdi", "Hijazi", "English", "Hindi", "French"];

export function UseCases() {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const rail = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (held || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((value) => (value + 1) % uses.length), 4800);
    return () => window.clearInterval(id);
  }, [held]);

  return (
    <section className={styles.uses} aria-labelledby="uses-heading">
      <header className={styles.headSplit}>
        <h2 id="uses-heading">Agents for the calls and chats that keep coming.</h2>
        <p>Start from a ready-made agent, adjust its flow and put it on your line. Standard onboarding takes under two days.</p>
      </header>

      <ul ref={rail} className={styles.deck} onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)}>
        {uses.map((use, index) => {
          const on = index === active;
          const distance = (index - active + uses.length) % uses.length;
          return (
            <li key={use.title} className={on ? styles.cardOn : styles.card} data-distance={distance}>
              <button type="button" onClick={() => setActive(index)} onFocus={() => setActive(index)} aria-pressed={on} aria-label={`${use.title}: ${use.agent}`}>
                <img loading="lazy" decoding="async" src={use.image} alt="" />
                <span className={styles.cardTitle}>
                  <strong>{use.title}</strong>
                  <em>{use.agent}</em>
                </span>
                <span className={styles.transcript} aria-hidden={!on}>
                  <span className={styles.them}>{use.them}</span>
                  <span className={styles.us}>
                    <b>Agentix</b>
                    {use.us}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.strip} aria-label="Languages and Arabic voices">
        <span className={styles.stripLabel}>Speaks your customers&apos; language</span>
        <ul>
          {dialects.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ 3. Outcomes */

function Curve() {
  return (
    <svg viewBox="0 0 240 150" aria-hidden="true">
      <path d="M10 140 C 80 140, 90 70, 150 52 S 220 30, 232 28" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 142 C 90 142, 120 100, 170 86 S 220 76, 232 74" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" opacity="0.5" />
      <circle cx="104" cy="92" r="4" fill="#fff" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="170" cy="46" r="5" fill="var(--accent)" />
      <text x="84" y="76" className={styles.svgMuted}>Before</text>
      <text x="152" y="30" className={styles.svgText}>+30%</text>
    </svg>
  );
}

function Rings() {
  return (
    <svg viewBox="0 0 240 150" aria-hidden="true">
      <line x1="40" y1="75" x2="200" y2="75" stroke="currentColor" strokeDasharray="2 4" opacity="0.6" />
      {[64, 52, 40, 28].map((r, i) => (
        <circle key={r} cx={56 + r} cy="75" r={r} fill="none" stroke={i === 0 ? "currentColor" : "currentColor"} strokeWidth={i === 0 ? 1.6 : 1} opacity={i === 0 ? 1 : 0.45} />
      ))}
      <circle cx="56" cy="75" r="4" fill="currentColor" />
      <circle cx="184" cy="75" r="5" fill="var(--accent)" />
    </svg>
  );
}

function Converge() {
  return (
    <svg viewBox="0 0 240 150" aria-hidden="true">
      <line x1="40" y1="20" x2="120" y2="75" stroke="currentColor" strokeDasharray="2 4" opacity="0.6" />
      <line x1="40" y1="130" x2="120" y2="75" stroke="currentColor" strokeDasharray="2 4" opacity="0.6" />
      <line x1="40" y1="75" x2="200" y2="75" stroke="currentColor" strokeWidth="1.6" />
      {[
        [40, 20],
        [40, 130],
        [40, 75],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="4" fill="#fff" stroke="currentColor" strokeWidth="1.4" />
      ))}
      <circle cx="120" cy="75" r="4" fill="currentColor" />
      <circle cx="200" cy="75" r="5" fill="var(--accent)" />
    </svg>
  );
}

export function Outcomes() {
  const items = [
    { art: <Curve />, value: "30%", title: "More calls resolved first time", body: "Agentix answers in the caller's dialect, works out what they need and finishes the task, so fewer people call back." },
    { art: <Rings />, value: "37%", title: "Lower operational cost", body: "Routine calls and chats are handled end to end. Your team picks up only the conversations that need a person." },
    { art: <Converge />, value: "43%", title: "Higher customer satisfaction", body: "Every channel feeds one conversation: voice, WhatsApp, web chat, app, email and SMS. Customers never start again." },
  ];
  return (
    <section className={styles.grid} aria-labelledby="outcomes-heading">
      <div className={styles.gridHead}>
        <h2 id="outcomes-heading">Voice and chat agents built to move support, sales and operations.</h2>
      </div>
      <ul className={styles.gridRow}>
        {items.map((item) => (
          <li key={item.title}>
            <div className={styles.diagram}>{item.art}</div>
            <p className={styles.metric}>{item.value}</p>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </li>
        ))}
      </ul>
      <p className={styles.source}>Published results from Agentix deployments, on actualize.pro.</p>
    </section>
  );
}

/* ------------------------------------------------------------ 4. The offering, in depth */

const flow = [
  { name: "Start", note: "" },
  { name: "Understand the caller", note: "Detect dialect, intent and sentiment" },
];
const branches = [
  { tag: "Booking", name: "Confirm the booking", note: "Read the slot back, then confirm" },
  { tag: "Order", name: "Share the order status", note: "Look it up and send it on WhatsApp" },
  { tag: "Payment", name: "Take the follow-up", note: "Remind, then hand off if needed" },
];

export function Offering() {
  const [mode, setMode] = useState<"voice" | "chat">("voice");
  return (
    <section className={styles.offering} aria-labelledby="offering-heading">
      <header className={styles.headSplit}>
        <h2 id="offering-heading">Design, launch and watch every agent, from one platform.</h2>
      </header>
      <div className={styles.bento}>
        <article className={`${styles.tile} ${styles.wide}`}>
          <h3>Design the conversation</h3>
          <p>A drag-and-drop workflow builder: set what the agent asks, what it checks and when it hands over to a person.</p>
          <div className={styles.builder} aria-hidden="true">
            <aside>
              <b>Agentix</b>
              {["Agents", "Workflows", "Knowledge", "Channels", "Analytics"].map((item) => (
                <span key={item} className={item === "Workflows" ? styles.navOn : ""}>
                  {item}
                </span>
              ))}
            </aside>
            <div className={styles.canvas}>
              {flow.map((node) => (
                <div key={node.name} className={node.note ? styles.node : styles.nodeStart}>
                  <strong>{node.name}</strong>
                  {node.note ? <span>{node.note}</span> : null}
                </div>
              ))}
              <div className={styles.branches}>
                {branches.map((branch) => (
                  <div key={branch.name} className={styles.branch}>
                    <em>{branch.tag}</em>
                    <div className={styles.node}>
                      <strong>{branch.name}</strong>
                      <span>{branch.note}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`${styles.node} ${styles.handoff}`}>
                <strong>Hand off to a person</strong>
                <span>With the full history</span>
              </div>
            </div>
          </div>
        </article>

        <article className={styles.tile}>
          <h3>Meet customers where they are</h3>
          <p>One conversation across voice, WhatsApp, web chat, app, email and SMS, on UAE, KSA, Qatar and international numbers.</p>
          <div className={styles.channel} aria-hidden="true">
            <div className={styles.orb} data-mode={mode}>
              <span>{mode === "voice" ? "☏" : "✉"}</span>
            </div>
            {mode === "voice" ? (
              <div className={styles.wave}>
                {Array.from({ length: 24 }, (_, i) => (
                  <i key={i} style={{ animationDelay: `${i * 60}ms` }} />
                ))}
              </div>
            ) : (
              <div className={styles.miniChat}>
                <span>Is my order on its way?</span>
                <span>Yes, it arrives today before 6 pm.</span>
              </div>
            )}
          </div>
          <div className={styles.toggle} role="group" aria-label="Channel">
            {(["voice", "chat"] as const).map((item) => (
              <button key={item} type="button" aria-pressed={mode === item} onClick={() => setMode(item)}>
                {item === "voice" ? "Voice" : "Chat"}
              </button>
            ))}
          </div>
        </article>

        <article className={styles.tile}>
          <h3>Start from a ready-made agent</h3>
          <p>Pre-trained agents you adjust instead of building from nothing.</p>
          <ul className={styles.agents}>
            {["Receptionist", "Booking confirmation", "Sales agent", "Order and payment follow-up"].map((item) => (
              <li key={item}>
                <span aria-hidden="true">●</span>
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className={`${styles.tile} ${styles.wide}`}>
          <h3>Watch every conversation live</h3>
          <p>A live operations dashboard with sentiment detection and intent classification. Step in and take over any call, with the full history.</p>
          <img className={styles.ops} loading="lazy" decoding="async" src="/art/agentix-ops.svg" alt="The Agentix live operations dashboard" />
        </article>

        <article className={styles.tile}>
          <h3>Arabic voices that sound local</h3>
          <p>Built on Faseeh Arabic speech models: replies in under 150 ms, with Khaleeji, Emirati, Najdi and Hijazi voices, and voice cloning.</p>
          <p className={styles.big}>
            &lt;150<small>ms</small>
          </p>
        </article>

        <article className={styles.tile}>
          <h3>Deploy where your data lives</h3>
          <p>GCC cloud, a private VPC or on-premises. Standard onboarding takes under two days.</p>
          <ul className={styles.deploy}>
            {["GCC cloud", "Private VPC", "On-premises"].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ 5. Integrations */

const integrations = [
  { name: "Maqsam", mark: "M" },
  { name: "3CX", mark: "3" },
  { name: "Telnyx", mark: "T" },
  { name: "Twilio", mark: "T" },
  { name: "Yeastar", mark: "Y" },
  { name: "Cisco", mark: "C" },
  { name: "Avaya", mark: "A" },
  { name: "SIP and WebRTC", mark: "S" },
  { name: "PABX", mark: "P" },
  { name: "WhatsApp", mark: "W" },
];

export function Integrations({ contact }: { contact: string }) {
  return (
    <section className={styles.grid} aria-labelledby="integrations-heading">
      <div className={styles.integrations}>
        <div>
          <h2 id="integrations-heading">Works with the phone systems you already run.</h2>
          <p>SIP, PABX, Cisco and Avaya compatible, so Agentix answers on your existing numbers.</p>
          <a className={styles.pill} href={contact}>
            Talk to us about your setup
          </a>
        </div>
        <ul>
          {integrations.map((item) => (
            <li key={item.name}>
              <span aria-hidden="true">{item.mark}</span>
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ 6. Ways to start */

export function GetStarted({ contact }: { contact: string }) {
  const columns = [
    {
      title: "Start with a ready-made agent",
      body: "Pick an agent, adjust its flow and put it on your line.",
      cta: { label: "Book a demo", href: contact, primary: true },
      points: ["Receptionist, booking, sales and follow-up agents", "Voice, WhatsApp, web chat, app, email and SMS", "Standard onboarding in under two days", "Human handoff with the full history"],
      visual: "chat" as const,
    },
    {
      title: "Agentix for enterprise",
      body: "Run agents at scale, inside the environment you choose.",
      cta: { label: "Contact us", href: contact },
      points: ["GCC cloud, private VPC or on-premises", "Live operations dashboard", "Sentiment and intent on every conversation", "Arabic dialects, English, Hindi and French"],
      visual: "orb" as const,
    },
    {
      title: "Connect your phone system",
      body: "Answer on the numbers your customers already call.",
      cta: { label: "Visit actualize.pro", href: "https://www.actualize.pro/" },
      points: ["UAE, KSA, Qatar and international numbers", "SIP and WebRTC", "PABX, Cisco and Avaya compatible", "Maqsam, 3CX, Telnyx, Twilio and Yeastar"],
      visual: "config" as const,
    },
  ];
  return (
    <section className={styles.grid} aria-labelledby="start-heading">
      <div className={styles.gridHead}>
        <h2 id="start-heading">Get started with Agentix.</h2>
      </div>
      <ul className={`${styles.gridRow} ${styles.start}`}>
        {columns.map((column) => (
          <li key={column.title}>
            <h3>{column.title}</h3>
            <p>{column.body}</p>
            <a className={column.cta.primary ? styles.ctaDark : styles.ctaLight} href={column.cta.href}>
              {column.cta.label}
            </a>
            <ul className={styles.ticks}>
              {column.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className={styles.startVisual} aria-hidden="true">
              {column.visual === "chat" ? (
                <div className={styles.chatMock}>
                  <b>
                    <i /> Receptionist agent
                  </b>
                  <span className={styles.bubbleIn}>مرحبا! كيف أقدر أساعدك؟</span>
                  <span className={styles.bubbleIn}>Hello! How can I help today?</span>
                  <span className={styles.bubbleOut}>I&apos;d like to book a table for four.</span>
                </div>
              ) : column.visual === "orb" ? (
                <div className={styles.orbMock}>
                  <div className={styles.orbBar}>
                    <span>Variables</span>
                    <span>Preview</span>
                    <b>Deploy</b>
                  </div>
                  <div className={styles.orb} data-mode="voice">
                    <span>☏</span>
                  </div>
                </div>
              ) : (
                <pre className={styles.code}>
                  <span className={styles.k}>agent</span>: receptionist{"\n"}
                  <span className={styles.k}>voice</span>: <span className={styles.s}>Emirati</span>
                  {"\n"}
                  <span className={styles.k}>number</span>: <span className={styles.s}>+971 4 …</span>
                  {"\n"}
                  <span className={styles.k}>trunk</span>: sip{"\n"}
                  <span className={styles.k}>channels</span>: [voice, whatsapp]{"\n"}
                  <span className={styles.k}>handoff</span>: <span className={styles.s}>team-support</span>
                </pre>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
