"use client";

import { useState } from "react";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import styles from "./solutions.module.css";

const lorem =
  "Lorem Ipsum\u00a0is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset ";

const challenges = [
  {
    number: "01",
    title: "Knowledge nobody can find",
    body: "Search exists because your knowledge is not readable. It indexes an estate on a schedule, answers from that snapshot, writes nothing back, and cannot tell you the scope of what it looked at. Once the knowledge itself is readable, current and attributable, much of what search was bought to solve stops being a problem.",
  },
  {
    number: "02",
    title: "Pilots that never reach production",
    body: "Demos work on clean samples and then stall on real data, real permissions and real users. We build on your actual systems from day one, so what you test is what you ship.",
  },
  {
    number: "03",
    title: "Governance rebuilt for every project",
    body: "Each new AI tool brings its own access rules and audit gaps. One shared policy layer covers every agent and app, with a full record of who did what and why.",
  },
  {
    number: "04",
    title: "No way to measure what works",
    body: "Without evaluation on your own data, every model choice is a guess. Continuous testing against real tasks shows accuracy, cost and risk before users ever see a result.",
  },
];

const products = [
  {
    label: "Build AI",
    wash: "/solutions/wash-build.svg",
    washWidth: 1567,
    washHeight: 562,
    labelClass: styles.labelBuild,
    shots: [{ src: "/solutions/panel-build.png" }],
  },
  {
    label: "Application AI",
    wash: "/solutions/wash-app.svg",
    washWidth: 1567,
    washHeight: 562.5,
    labelClass: styles.labelApp,
    shots: [
      { src: "/solutions/panel-app.png", photo: true },
      { src: "/solutions/panel-guard.png" },
    ],
  },
  {
    label: "Evaluate AI",
    wash: "/solutions/wash-eval.svg",
    washWidth: 1567,
    washHeight: 558.5,
    labelClass: styles.labelEval,
    shots: [{ src: "/solutions/panel-eval.png" }],
  },
  {
    label: "Data Hub",
    wash: "/solutions/wash-hub.svg",
    washWidth: 1567,
    washHeight: 558.5,
    labelClass: styles.labelHub,
    shots: [{ src: "/solutions/panel-guard.png" }],
  },
];

const studies = [
  "/solutions/study-1.png",
  "/solutions/panel-app.png",
  "/solutions/study-3.png",
  "/solutions/study-4.png",
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className={styles.eyebrow}>
      <span className={styles.tag} aria-hidden="true" />
      {children}
    </p>
  );
}

export function SolutionsPage() {
  const [open, setOpen] = useState(0);

  return (
    <main className={styles.page}>
      <SiteNav current="solutions" />

      <section className={styles.hero} aria-labelledby="solutions-heading">
        <div className={styles.heroCopy}>
          <Eyebrow>Solutions</Eyebrow>
          <h1 id="solutions-heading">Real-world AI for enterprises.</h1>
          <p>{lorem}</p>
          <a className={styles.cta} href="/contact">
            Talk to us
            <span>
              <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <img className={styles.heroArt} src="/healthcare/hero.png" alt="" />
      </section>

      <section className={styles.challenges} aria-labelledby="challenges-heading">
        <Eyebrow>Challenges</Eyebrow>
        <h2 id="challenges-heading">Challenges we solve</h2>
        <div className={styles.challengeGrid}>
          <div className={styles.accordion}>
            {challenges.map((item, index) => {
              const expanded = open === index;
              return (
                <div key={item.number} className={expanded ? styles.itemOpen : styles.item}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setOpen(expanded ? -1 : index)}
                  >
                    <span>{item.number}</span>
                    {item.title}
                  </button>
                  {expanded && item.body ? <p>{item.body}</p> : null}
                </div>
              );
            })}
          </div>
          <div className={styles.challengeArt}>
            <img src="/solutions/challenge.jpg" alt="" />
            <span>01</span>
          </div>
        </div>
      </section>

      <section className={styles.products} aria-labelledby="products-heading">
        <Eyebrow>Use cases</Eyebrow>
        <h2 id="products-heading">Challenges we solve</h2>
        <div className={styles.productList}>
          {products.map((product) => (
            <article key={product.label} className={styles.product}>
              <img
                className={styles.wash}
                src={product.wash}
                alt=""
                width={product.washWidth}
                height={product.washHeight}
              />
              <p className={`${styles.productLabel} ${product.labelClass}`}>{product.label}</p>
              <div className={styles.productCopy}>
                <h3>
                  Stale context. Lost work.
                  <br />
                  Governance rebuilt every time.
                </h3>
                <p>{lorem}</p>
              </div>
              <div className={styles.shot}>
                {product.shots.map((shot) => (
                  <img
                    key={shot.src}
                    className={shot.photo ? styles.shotPhoto : undefined}
                    src={shot.src}
                    alt=""
                  />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.studies} aria-labelledby="studies-heading">
        <Eyebrow>Use cases</Eyebrow>
        <h2 id="studies-heading">Case studies</h2>
        <ul>
          {studies.map((src) => (
            <li key={src}>
              <img src={src} alt="" />
              <p>
                <strong>Complete</strong> It holds what the organisation actually knows,
                not only the part that was once typed into a structured field. Documents,
                correspondence, calls, records, decisions, and the reasoning behind those
                decisions.
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.band} aria-labelledby="enterprise-heading">
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-left.svg" alt="" />
        </div>
        <div>
          <h2 id="enterprise-heading">
            Bring real-world AI to
            <br />
            your enterprise
          </h2>
          <p>
            Get our SOC 2 report, pen test summary, and architecture overview in one
            package — usually within one business day.
          </p>
          <a href="/contact">
            Talk to us
            <span>
              <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-right.svg" alt="" />
        </div>
      </section>

      <SiteClose current="Enterprises" hideBand />
    </main>
  );
}
