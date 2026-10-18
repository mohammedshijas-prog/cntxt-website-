import type { CSSProperties } from "react";
import styles from "./labSections.module.css";

/* Facts here are from docs/content-brief.md (AI Lab, Munsit, Agentix, research). */

/** Data → models → agents, as one connected line with a live moment in each layer. */
export function PowerStack() {
  return (
    <section className={styles.power} aria-labelledby="tour-heading">
      <header className={styles.head}>
        <p className={styles.kicker}>What the data powers</p>
        <h2 id="tour-heading">Data, then models, then agents.</h2>
      </header>

      <ol className={styles.stack}>
        <li data-tilt>
          <span className={styles.step}>01 · Data</span>
          <div className={styles.visual} aria-hidden="true">
            <div className={styles.rows}>
              {["Audio · transcribed", "Image · boxes", "Video · actions", "Text · entities"].map((row, i) => (
                <span key={row} style={{ "--i": i } as CSSProperties}>
                  {row}
                  <b>✓</b>
                </span>
              ))}
            </div>
          </div>
          <h3>AI Lab data</h3>
          <p>Labelled at 98% accuracy.</p>
          <a href="/data-hub">
            Browse the Data Hub <span aria-hidden="true">→</span>
          </a>
        </li>

        <li data-tilt>
          <span className={styles.step}>02 · Models</span>
          <div className={`${styles.visual} ${styles.ink}`} aria-hidden="true">
            <div className={styles.wave}>
              {Array.from({ length: 28 }, (_, i) => (
                <i key={i} style={{ "--i": i } as CSSProperties} />
              ))}
            </div>
            <p dir="rtl" lang="ar" className={styles.transcript}>
              مرحبا، أبي أغيّر موعدي
            </p>
            <span className={styles.rank}>#1 · Open Universal Arabic ASR Leaderboard</span>
          </div>
          <h3>Munsit</h3>
          <p>#1 Arabic speech recognition.</p>
          <a href="https://munsit.com">
            Explore Munsit <span aria-hidden="true">→</span>
          </a>
        </li>

        <li data-tilt>
          <span className={styles.step}>03 · Agents</span>
          <div className={styles.visual} aria-hidden="true">
            <div className={styles.chat}>
              <span className={styles.them}>I&apos;d like to move my Thursday appointment.</span>
              <span className={styles.us}>Done: Thursday at 5 pm. Confirmation sent on WhatsApp.</span>
              <span className={styles.done}>✓ Booking moved</span>
            </div>
          </div>
          <h3>Agentix</h3>
          <p>Arabic agents on your phone lines.</p>
          <a href="/agentix">
            Explore Agentix <span aria-hidden="true">→</span>
          </a>
        </li>
      </ol>
    </section>
  );
}

const papers = [
  {
    type: "Paper · Speech",
    title: "Advancing Arabic speech recognition through large-scale weakly supervised learning",
    body: "How Munsit was trained: a Conformer model learning from 30,000+ hours of real Arabic audio, filtered to a 15,000-hour high-quality set.",
    href: "https://www.cntxt.tech/insight-hub/advancing-arabic-speech-recognition-through-large-scale-weakly-supervised-learning",
    cta: "Read the paper",
    figure: { big: "30,000+", small: "hours of Arabic audio" },
  },
  {
    type: "Shared task · Dialects",
    title: "Munsit at NADI 2025: multidialectal Arabic ASR",
    body: "Our entry to the NADI 2025 shared task on speech recognition across Arabic dialects.",
    href: "https://www.cntxt.tech/insight-hub/munsit-at-nadi-2025-shared-task-2-pushing-the-boundaries-of-multidialectal-arabic-asr",
    cta: "Read the entry",
    figure: { big: "NADI", small: "2025 shared task" },
  },
  {
    type: "Open source · Evaluation",
    title: "RAGMeter",
    body: "A toolkit for evaluating retrieval-augmented generation systems, published on PyPI as rag-meter.",
    href: "https://pypi.org/project/rag-meter/",
    cta: "Get it on PyPI",
    figure: { big: "pip", small: "install rag-meter" },
  },
];

/** Research, as three cards with a figure each. */
export function ResearchCards() {
  return (
    <section className={styles.research} id="research" aria-labelledby="research-heading">
      <header className={styles.head}>
        <p className={styles.kicker}>Research</p>
        <h2 id="research-heading">What we publish.</h2>
      </header>
      <ul className={styles.papers} data-rail>
        {papers.map((paper, index) => (
          <li key={paper.title} data-tilt>
            <a href={paper.href}>
              <span className={`${styles.cover} ${styles[`cover${index}`]}`} aria-hidden="true">
                <b>{paper.figure.big}</b>
                <small>{paper.figure.small}</small>
              </span>
              <span className={styles.type}>{paper.type}</span>
              <strong>{paper.title}</strong>
              <em>
                {paper.cta} <span aria-hidden="true">→</span>
              </em>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
