"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { sphere } from "../three/shapes";
import styles from "./agentixHero.module.css";

const ParticleField = dynamic(() => import("../three/ParticleField"), { ssr: false });

const channels = ["Voice", "Chat", "WhatsApp", "SMS"];

/* Live conversations floating over the planet: what Agentix is handling right now. */
const calls = [
  { channel: "Voice", task: "Booking confirmed", dialect: "Emirati", place: "a" },
  { channel: "WhatsApp", task: "Order status sent", dialect: "Saudi", place: "b" },
  { channel: "Web chat", task: "Refund question answered", dialect: "Egyptian", place: "c" },
  { channel: "SMS", task: "Payment reminder", dialect: "Gulf", place: "d" },
] as const;

/**
 * Agentix hero: a dark sky, a planet of purple dots rising from the bottom, and
 * a headline whose bracketed word cycles through the channels the agents answer.
 */
export function AgentixHero({
  contact,
  results,
}: {
  contact: string;
  results: { value: string; label: string }[];
}) {
  const [word, setWord] = useState(0);
  const [shapes] = useState(() => [sphere(typeof window !== "undefined" && window.innerWidth <= 734 ? 2600 : 5200, 1)]);
  const level = useRef(0.25);
  const section = useRef<HTMLElement>(null);
  const [coords, setCoords] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setWord((value) => (value + 1) % channels.length), 2200);
    return () => window.clearInterval(id);
  }, []);

  // The corner readouts follow the cursor, like a navigation display.
  const track = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || !section.current) return;
    const box = section.current.getBoundingClientRect();
    setCoords({ x: ((event.clientX - box.left) / box.width) * 100, y: ((event.clientY - box.top) / box.height) * 100 });
  };

  return (
    <section ref={section} className={styles.hero} aria-labelledby="agentix-heading" onPointerMove={track} data-motion="off">
      <div className={styles.sky} aria-hidden="true" />
      <div className={styles.planet} aria-hidden="true">
        <ParticleField shapes={shapes} level={level} spin={0.05} pointSize={20} />
      </div>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.copy}>
        <p className={styles.kicker}>Agentix · Arabic voice and chat agents</p>
        <h1 id="agentix-heading">
          <span className={styles.bracket}>
            <span aria-hidden="true">[</span>
            <span className={styles.words}>
              {channels.map((channel, index) => (
                <span key={channel} className={index === word ? styles.wordOn : styles.word} aria-hidden={index !== word}>
                  {channel}
                </span>
              ))}
              {/* The widest word holds the space so the line never jumps. */}
              <span className={styles.wordSizer} aria-hidden="true">
                WhatsApp
              </span>
            </span>
            <span aria-hidden="true">]</span>
          </span>{" "}
          agents that finish the job.
        </h1>
        <p className={styles.lead}>
          Customers call, message and wait. Agentix answers in their dialect, decides what they need and completes the task, on GCC
          phone lines.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href={contact}>
            Book a demo
            <span aria-hidden="true">→</span>
          </a>
          <a className={styles.secondary} href="https://www.actualize.pro/" target="_blank" rel="noopener noreferrer">
            Visit actualize.pro <span aria-hidden="true">›</span>
          </a>
        </div>
      </div>

      <ul className={styles.calls} aria-label="Conversations Agentix is handling">
        {calls.map((call) => (
          <li key={call.task} className={styles[call.place]}>
            <b>{call.channel}</b>
            <span>{call.task}</span>
            <em>{call.dialect} Arabic · done</em>
          </li>
        ))}
      </ul>

      <dl className={styles.results}>
        {results.map((result) => (
          <div key={result.label}>
            <dt>{result.value}</dt>
            <dd>{result.label}</dd>
          </div>
        ))}
      </dl>

      <span className={`${styles.readout} ${styles.readoutX}`} aria-hidden="true">
        X: {coords.x.toFixed(2)}
      </span>
      <span className={`${styles.readout} ${styles.readoutY}`} aria-hidden="true">
        Y: {coords.y.toFixed(2)}
      </span>
    </section>
  );
}
