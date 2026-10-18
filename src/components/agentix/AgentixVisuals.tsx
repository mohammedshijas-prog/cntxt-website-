"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { sphere } from "../three/shapes";
import styles from "./visuals.module.css";

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// WebGL loads after the page is interactive; the halo holds the space.
const ParticleField = dynamic(() => import("../three/ParticleField"), { ssr: false });
const orbShape = [sphere(4200)];

/* ------------------------------------------------------------------ */
/* Hero: the orb with a live call playing out over it.                 */
/* ------------------------------------------------------------------ */

type Line = { who: "Caller" | "Agent"; ar: string; en: string };
type Scenario = { name: string; channel: string; intent: string; label: string; lines: Line[]; actions: string[] };

/* Sample conversations (illustrative), in Gulf Arabic with English beneath. */
const scenarios: Scenario[] = [
  {
    name: "Reschedule",
    channel: "Inbound call",
    intent: "Reschedule",
    label: "A caller moves a Thursday appointment; the agent rebooks it and confirms on WhatsApp.",
    lines: [
      { who: "Caller", ar: "مرحبا، أبي أغيّر موعدي يوم الخميس.", en: "Hi, I'd like to move my Thursday appointment." },
      { who: "Agent", ar: "أكيد. عندي الساعة ٤ أو ٥ العصر، أيهم يناسبك؟", en: "Of course. I have 4 or 5 pm. Which suits you?" },
      { who: "Caller", ar: "الساعة ٥ أحسن.", en: "5 pm is better." },
      { who: "Agent", ar: "تم، حجزت لك الخميس الساعة ٥ وبرسل لك التأكيد على واتساب.", en: "Done: Thursday at 5 pm. I'll send the confirmation on WhatsApp." },
    ],
    actions: ["Booking moved to Thursday, 5 pm", "WhatsApp confirmation sent"],
  },
  {
    name: "Order status",
    channel: "WhatsApp voice",
    intent: "Order status",
    label: "A customer asks where an order is; the agent finds it and sends a tracking link.",
    lines: [
      { who: "Caller", ar: "وين طلبي؟ رقم الطلب ٤٥٢١.", en: "Where's my order? Order number 4521." },
      { who: "Agent", ar: "طلبك طلع للتوصيل، ويوصلك اليوم قبل الساعة ٦.", en: "It's out for delivery and will reach you today before 6." },
      { who: "Caller", ar: "زين، مشكور.", en: "Great, thanks." },
      { who: "Agent", ar: "العفو. أرسلت لك رابط التتبع على واتساب.", en: "You're welcome. I've sent the tracking link on WhatsApp." },
    ],
    actions: ["Order 4521 found: out for delivery", "Tracking link sent on WhatsApp"],
  },
  {
    name: "Payment follow-up",
    channel: "Outbound call",
    intent: "Payment follow-up",
    label: "The agent calls about a payment that is due and sends a secure link; the customer pays.",
    lines: [
      { who: "Agent", ar: "مرحبا، عندك دفعة مستحقة يوم الأحد.", en: "Hello, you have a payment due on Sunday." },
      { who: "Caller", ar: "أقدر أدفعها الحين؟", en: "Can I pay it now?" },
      { who: "Agent", ar: "أكيد، أرسلت لك رابط دفع آمن برسالة نصية.", en: "Of course. I've sent a secure payment link by SMS." },
      { who: "Caller", ar: "تم، دفعت.", en: "Done, I've paid." },
    ],
    actions: ["Payment link sent by SMS", "Payment confirmed and logged"],
  },
];

export function HeroCall() {
  const [scenario, setScenario] = useState(0);
  const { lines: script, actions } = scenarios[scenario];
  const level = useRef(0.25);
  const reduced = useRef(false);
  // shown: lines revealed; speaking: who is talking before the next line lands.
  const [shown, setShown] = useState(0);
  const [speaking, setSpeaking] = useState<"Caller" | "Agent" | null>(null);
  const [done, setDone] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    reduced.current = prefersReduced();
    if (reduced.current) {
      // Show the finished call, still.
      const id = setTimeout(() => {
        setShown(script.length);
        setDone(actions.length);
        setSeconds(38);
      }, 0);
      return () => clearTimeout(id);
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    const run = () => {
      setShown(0);
      setDone(0);
      setSpeaking(null);
      setSeconds(0);
      level.current = 0.25;
      let t = 700;
      script.forEach((line, i) => {
        at(t, () => {
          setSpeaking(line.who);
          level.current = line.who === "Agent" ? 1 : 0.55;
        });
        t += line.who === "Agent" ? 2100 : 1500;
        at(t, () => {
          setSpeaking(null);
          setShown(i + 1);
          level.current = 0.25;
        });
        t += 700;
      });
      actions.forEach((_, i) => {
        t += 650;
        at(t, () => setDone(i + 1));
      });
      at(t + 4200, run);
    };

    const clock = setInterval(() => setSeconds((s) => s + 1), 1000);
    run();
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(clock);
    };
  }, [script, actions]);

  const time = `00:${String(Math.min(seconds, 59)).padStart(2, "0")}`;

  return (
    <div className={styles.heroVisual}>
      <div className={styles.halo} aria-hidden="true" />
      <ParticleField className={styles.orb} shapes={orbShape} level={level} spin={0.16} scale={1.32} />
      <div className={styles.call} role="img" aria-label={`Sample conversation: ${scenarios[scenario].label}`}>
        <div className={styles.callHead}>
          <span className={styles.live}>
            <i aria-hidden="true" />
            Live call
          </span>
          <span className={styles.callMeta}>{scenarios[scenario].channel} · Gulf Arabic</span>
          <span className={styles.timer}>{time}</span>
        </div>
        <ol className={styles.lines} aria-hidden="true">
          {script.slice(0, shown).map((line) => (
            <li key={line.en} className={line.who === "Agent" ? styles.agentLine : styles.callerLine}>
              <span className={styles.who}>{line.who}</span>
              <span className={styles.ar} dir="rtl" lang="ar">
                {line.ar}
              </span>
              <span className={styles.en}>{line.en}</span>
            </li>
          ))}
          {speaking ? (
            <li className={speaking === "Agent" ? styles.agentLine : styles.callerLine}>
              <span className={styles.who}>{speaking}</span>
              <span className={styles.wave}>
                {Array.from({ length: 14 }, (_, i) => (
                  <i key={i} style={{ "--i": i } as CSSProperties} />
                ))}
              </span>
            </li>
          ) : null}
        </ol>
        <ul className={styles.done} aria-hidden="true">
          {actions.slice(0, done).map((action) => (
            <li key={action}>
              <svg viewBox="0 0 16 16" width="14" height="14">
                <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {action}
            </li>
          ))}
        </ul>
        <div className={styles.callFoot} aria-hidden="true">
          <span>Intent · {scenarios[scenario].intent}</span>
          <span>Sentiment · Positive</span>
          <span>Streams in &lt;150 ms</span>
        </div>
      </div>
      <div className={styles.scenarios}>
        <span className={styles.sampleNote}>Try a sample conversation</span>
        <div role="tablist" aria-label="Sample conversations">
          {scenarios.map((item, index) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={index === scenario}
              className={index === scenario ? styles.scenarioActive : ""}
              onClick={() => setScenario(index)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Results that count up when they come into view.                     */
/* ------------------------------------------------------------------ */

export function CountUp({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReduced()) return;
    let frame = 0;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        seen.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1400);
          const eased = 1 - Math.pow(1 - t, 3);
          setShown(Math.round(value * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    // Start from zero only once we know it will animate.
    frame = requestAnimationFrame(() => setShown(0));
    seen.observe(node);
    return () => {
      cancelAnimationFrame(frame);
      seen.disconnect();
    };
  }, [value]);

  return (
    <span ref={ref}>
      {shown}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Platform: four layers stacked in 3D, lit one at a time on scroll.   */
/* ------------------------------------------------------------------ */

type Layer = { key: string; title: string; body: string; art: ReactNode };

function Wave() {
  return (
    <svg viewBox="0 0 200 60" className={styles.plateArt}>
      {Array.from({ length: 28 }, (_, i) => {
        const h = 8 + Math.abs(Math.sin(i * 0.7) * 40) * (0.4 + (i % 5) / 6);
        return <rect key={i} x={i * 7 + 2} y={30 - h / 2} width="3.4" height={h} rx="1.7" />;
      })}
    </svg>
  );
}

function Channels() {
  return (
    <div className={styles.channelGrid}>
      {["Voice", "WhatsApp", "Web chat", "App", "Email", "SMS"].map((c) => (
        <span key={c}>{c}</span>
      ))}
    </div>
  );
}

function Numbers() {
  return (
    <div className={styles.numberGrid}>
      {["+971", "+966", "+974"].map((c) => (
        <span key={c}>{c}</span>
      ))}
      <em>SIP · WebRTC · PABX</em>
    </div>
  );
}

function Flow() {
  return (
    <svg viewBox="0 0 200 90" className={styles.plateArt}>
      <path d="M30 45 H80 M120 45 H170 M100 25 V10 M100 65 V80" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4" />
      <rect x="6" y="33" width="44" height="24" rx="8" />
      <rect x="78" y="31" width="44" height="28" rx="8" className={styles.flowHot} />
      <rect x="150" y="33" width="44" height="24" rx="8" />
      <circle cx="100" cy="10" r="6" />
      <circle cx="100" cy="80" r="6" />
    </svg>
  );
}

export function PlatformStack({ layers }: { layers: Omit<Layer, "art">[] }) {
  const arts: Record<string, ReactNode> = { voice: <Wave />, channels: <Channels />, telephony: <Numbers />, workflows: <Flow /> };
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.current.forEach((step) => step && seen.observe(step));
    return () => seen.disconnect();
  }, []);

  // Bottom of the stack first: telephony is the foundation, workflows on top.
  const order = ["telephony", "voice", "channels", "workflows"];

  return (
    <div className={styles.platform} data-motion="off">
      <div className={styles.stage}>
        <div className={styles.scene} aria-hidden="true">
          <div className={styles.stack}>
            {order.map((key, depth) => {
              const index = layers.findIndex((l) => l.key === key);
              const isActive = index === active;
              return (
                <div
                  key={key}
                  className={`${styles.plate} ${isActive ? styles.plateActive : ""}`}
                  style={{ "--depth": depth, "--lift": isActive ? 1 : 0 } as CSSProperties}
                >
                  <span className={styles.plateLabel}>{layers[index].title}</span>
                  {arts[key]}
                </div>
              );
            })}
            <div className={styles.plateShadow} />
          </div>
        </div>
      </div>
      <ol className={styles.steps}>
        {layers.map((layer, index) => (
          <li
            key={layer.key}
            ref={(node) => {
              steps.current[index] = node;
            }}
            data-index={index}
            className={index === active ? styles.stepActive : ""}
          >
            <span className={styles.stepNo}>{String(index + 1).padStart(2, "0")}</span>
            <h3>{layer.title}</h3>
            <p>{layer.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ready-made agents: pick one, its flow appears on a tilted card.     */
/* ------------------------------------------------------------------ */

type Agent = { name: string; body: string; channel: string; steps: string[] };

export function AgentFlows({ agents }: { agents: Agent[] }) {
  const [active, setActive] = useState(0);
  const card = useRef<HTMLDivElement>(null);
  const agent = agents[active];

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = card.current;
    if (!node || prefersReduced() || event.pointerType !== "mouse") return;
    const box = node.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    node.style.setProperty("--rx", `${8 - y * 10}deg`);
    node.style.setProperty("--ry", `${-14 + x * 14}deg`);
  };
  const onLeave = () => {
    card.current?.style.removeProperty("--rx");
    card.current?.style.removeProperty("--ry");
  };

  return (
    <div className={styles.agents}>
      <div className={styles.agentTabs} role="tablist" aria-label="Ready-made agents">
        {agents.map((item, index) => (
          <button
            key={item.name}
            type="button"
            role="tab"
            id={`agent-tab-${index}`}
            aria-selected={index === active}
            aria-controls="agent-panel"
            className={index === active ? styles.agentTabActive : ""}
            onClick={() => setActive(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.name}</strong>
            <em>{item.body}</em>
          </button>
        ))}
      </div>
      <div className={styles.cardScene} onPointerMove={onMove} onPointerLeave={onLeave} data-motion="off">
        <div
          ref={card}
          className={styles.flowCard}
          id="agent-panel"
          role="tabpanel"
          aria-labelledby={`agent-tab-${active}`}
        >
          <div className={styles.flowHead}>
            <img src="/brand/agentix/logo.svg" alt="" width={86} height={21} />
            <span>{agent.channel}</span>
          </div>
          <p className={styles.flowTitle}>{agent.name}</p>
          <ol key={agent.name} className={styles.flowSteps}>
            {agent.steps.map((step, index) => (
              <li key={step} style={{ "--i": index } as CSSProperties}>
                <span>{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <p className={styles.flowNote}>Example flow</p>
        </div>
        <div className={styles.cardGhost} aria-hidden="true" />
        <div className={`${styles.cardGhost} ${styles.cardGhostBack}`} aria-hidden="true" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Telephony: provider logos orbiting the Agentix hub in 3D.           */
/* ------------------------------------------------------------------ */

const inner = [
  { name: "Twilio", logo: "twilio.png" },
  { name: "Telnyx", logo: "telnyx.png" },
  { name: "3CX", logo: "3cx.png" },
];
const outer = [
  { name: "Maqsam", logo: "maqsam.png" },
  { name: "Yeastar", logo: "yeastar.png" },
  { name: "PABX, Cisco, Avaya", logo: "" },
];

function Ring({ items, radius, speed }: { items: { name: string; logo: string }[]; radius: number; speed: number }) {
  return (
    <div className={styles.ring} style={{ "--r": `${radius}px`, "--speed": `${speed}s` } as CSSProperties}>
      <div className={styles.ringSpin}>
        {items.map((item, index) => (
          <div key={item.name} className={styles.sat} style={{ "--a": `${(360 / items.length) * index}deg` } as CSSProperties}>
            <div className={styles.satFace}>
              {item.logo ? <img src={`/brand/agentix/providers/${item.logo}`} alt={item.name} /> : <b>{item.name}</b>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProviderOrbit() {
  return (
    <div className={styles.orbit} role="img" aria-label="Agentix connects to Twilio, Telnyx, 3CX, Maqsam, Yeastar and PABX, Cisco and Avaya systems">
      <Ring items={outer} radius={270} speed={48} />
      <Ring items={inner} radius={172} speed={32} />
      <div className={styles.orbitHub}>
        <img src="/brand/agentix/logo.svg" alt="" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* How a call becomes finished work: five steps, lit in sequence.      */
/* ------------------------------------------------------------------ */

const flow = [
  { title: "Answer", body: "In the caller's dialect, with Arabic speech streaming back in under 150 ms.", tag: "Voice · chat" },
  { title: "Understand", body: "Speech-to-text and intent in one pipeline, built on Faseeh.", tag: "Intent" },
  { title: "Act", body: "A drag-and-drop workflow books, updates or follows up in your systems.", tag: "Workflow" },
  { title: "Confirm", body: "The customer gets the result on WhatsApp, SMS or email.", tag: "Channels" },
  { title: "Hand off", body: "When the agent cannot help, a person takes over with the full history.", tag: "People" },
];

export function CallFlow() {
  const root = useRef<HTMLOListElement>(null);
  const [step, setStep] = useState(-1);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    if (prefersReduced()) {
      const id = setTimeout(() => setStep(flow.length - 1), 0);
      return () => clearTimeout(id);
    }
    let timer: ReturnType<typeof setInterval> | undefined;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !timer) {
          setStep(0);
          timer = setInterval(() => setStep((s) => (s + 1) % (flow.length + 1)), 1400);
        } else if (!entry.isIntersecting && timer) {
          clearInterval(timer);
          timer = undefined;
        }
      },
      { threshold: 0.4 },
    );
    seen.observe(node);
    return () => {
      seen.disconnect();
      if (timer) clearInterval(timer);
    };
  }, []);
  return (
    <ol ref={root} className={styles.flow} data-motion="off" style={{ "--step": Math.min(step, flow.length - 1) } as CSSProperties}>
      <span className={styles.flowTrack} aria-hidden="true">
        <span />
      </span>
      {flow.map((item, index) => (
        <li key={item.title} className={index <= step ? styles.flowOn : ""}>
          <span className={styles.flowDot} aria-hidden="true">
            {index + 1}
          </span>
          <em>{item.tag}</em>
          <strong>{item.title}</strong>
          <span>{item.body}</span>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Live operations: conversations stream in with intent and sentiment. */
/* ------------------------------------------------------------------ */

const feed = [
  { channel: "Voice", intent: "Booking confirmation", sentiment: "Positive", status: "Completed", lang: "Emirati Arabic" },
  { channel: "WhatsApp", intent: "Order status", sentiment: "Neutral", status: "Completed", lang: "Saudi Arabic" },
  { channel: "Web chat", intent: "Refund question", sentiment: "Negative", status: "Handed to a person", lang: "English" },
  { channel: "Voice", intent: "Appointment reminder", sentiment: "Positive", status: "Completed", lang: "Kuwaiti Arabic" },
  { channel: "SMS", intent: "Payment follow-up", sentiment: "Neutral", status: "In progress", lang: "Arabic and English" },
  { channel: "Voice", intent: "Receptionist enquiry", sentiment: "Positive", status: "Completed", lang: "Qatari Arabic" },
  { channel: "WhatsApp", intent: "Lead qualification", sentiment: "Positive", status: "Follow-up booked", lang: "Bahraini Arabic" },
];

export function LiveOps() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (prefersReduced()) return;
    const id = setInterval(() => setOffset((o) => (o + 1) % feed.length), 2200);
    return () => clearInterval(id);
  }, []);
  const rows = Array.from({ length: 5 }, (_, i) => feed[(offset + i) % feed.length]);
  return (
    <div className={styles.ops} data-motion="off" role="img" aria-label="Agentix live operations: each conversation with its channel, language, intent, sentiment and status">
      <div className={styles.opsHead}>
        <img src="/brand/agentix/logo.svg" alt="" width={86} height={21} />
        <span>Live operations</span>
        <span className={styles.opsLive}>
          <i aria-hidden="true" /> Agents live
        </span>
      </div>
      <div className={styles.opsCols} aria-hidden="true">
        <span>Channel</span>
        <span>Intent</span>
        <span>Language</span>
        <span>Sentiment</span>
        <span>Status</span>
      </div>
      <ul className={styles.opsRows} aria-hidden="true">
        {rows.map((row, i) => (
          <li key={`${offset}-${i}`} style={{ "--i": i } as CSSProperties}>
            <span className={styles.opsChannel}>{row.channel}</span>
            <span>{row.intent}</span>
            <span>{row.lang}</span>
            <span className={styles[`sent${row.sentiment}`]}>{row.sentiment}</span>
            <span className={row.status === "Handed to a person" ? styles.opsHandoff : styles.opsStatus}>{row.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
