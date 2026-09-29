"use client";

import { useState } from "react";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { CaseCards, type CaseCard } from "../shared/CaseCards";
import { IndustriesSection } from "../shared/IndustriesSection";
import styles from "./healthcare.module.css";

const cases: CaseCard[] = [
  {
    image: "/healthcare/case-1.png",
    index: "01",
    label: "The data warehouse.",
    title: "Solved the numbers.\nNot the knowledge.",
    body: "It made structured data queryable. Most of what your company knows was never in a table.",
  },
  {
    image: "/healthcare/case-2.png",
    index: "02",
    label: "A license for everyone.",
    title: "An assistant for everyone.\nA memory for no one.",
    body: "The right first move. It gave every person an assistant and the company no shared memory.",
  },
  {
    image: "/healthcare/case-3.png",
    index: "03",
    label: "A knowledge graph.",
    title: "Built once.\nTrue on the day it shipped.",
    body: "It reads from a snapshot and never writes back, so it is out of date until someone rebuilds it.",
  },
];

const logos = [
  { src: "/healthcare/logo-zenzap.png", name: "ZenZap", width: 64, height: 20 },
  { src: "/healthcare/logo-sparkle.png", name: "sparkle", width: 72, height: 20 },
  { src: "/healthcare/logo-craftgram.png", name: "Craftgram", width: 98, height: 20 },
  { src: "/healthcare/logo-pulse.png", name: "Pulse", width: 77, height: 20 },
  { src: "/healthcare/logo-pulse.png", name: "Pulse", width: 77, height: 20 },
  { src: "/healthcare/logo-pulse.png", name: "Pulse", width: 77, height: 20 },
];

const offers = [
  { image: "/data-hub/orb-pink.jpg" },
  { image: "/data-hub/orb-blue.png" },
  { image: "/data-hub/orb-red.jpg" },
  { image: "/data-hub/orb-pink.jpg" },
];


function Eyebrow({ children }: { children: string }) {
  return (
    <p className={styles.eyebrow}>
      <span className={styles.tag} aria-hidden="true" />
      {children}
    </p>
  );
}

export function HealthcarePage() {
  const [logo, setLogo] = useState(0);
  const [requested, setRequested] = useState<number[]>([]);

  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero} aria-labelledby="healthcare-heading">
        <div className={styles.heroCopy}>
          <Eyebrow>Healthcare</Eyebrow>
          <h1 id="healthcare-heading">Real-world AI for healthcare.</h1>
          <p>
            Who we partner with and why — integrators, data partners, cloud
            & hardware, research.
          </p>
          <a className={styles.partner} href="/partners">
            Become a partner
            <span>
              <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <img className={styles.heroArt} src="/healthcare/hero.png" alt="" />
      </section>

      <section className={styles.cases} aria-labelledby="cases-heading">
        <Eyebrow>Use cases</Eyebrow>
        <h2 id="cases-heading">Use cases in this industry</h2>
        <CaseCards cases={cases} />
      </section>

      <section className={styles.offers} aria-labelledby="offers-heading">
        <Eyebrow>What you get</Eyebrow>
        <h2 id="offers-heading">
          Stale context. Lost work.
          <br />
          Governance rebuilt every time.
        </h2>
        <ul>
          {offers.map((offer, index) => {
            const isRequested = requested.includes(index);
            return (
              <li key={index}>
                <p className={styles.offerTag}>
                  <img src="/data-hub/dot.svg" alt="" width={8} height={8} />
                  Generative Agent AI
                </p>
                <span className={styles.orb}>
                  <img src={offer.image} alt="" />
                </span>
                <div>
                  <h3>Data set 1</h3>
                  <p>Access a global network of hand-picked experts across diverse fields.</p>
                  <ul>
                    <li>Invoice Auditing</li>
                    <li>Guideline Enforcement</li>
                  </ul>
                  <button
                    type="button"
                    aria-pressed={isRequested}
                    onClick={() =>
                      setRequested((current) =>
                        current.includes(index)
                          ? current.filter((item) => item !== index)
                          : [...current, index],
                      )
                    }
                  >
                    {isRequested ? "Requested" : "Request to buy →"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.customers} aria-labelledby="customers-heading">
        <Eyebrow>Customers & results</Eyebrow>
        <h2 id="customers-heading">
          Stale context. Lost work.
          <br />
          Governance rebuilt every time.
        </h2>
        <div className={styles.logoBar} role="tablist" aria-label="Customers">
          {logos.map((item, index) => (
            <button
              key={`${item.name}-${index}`}
              type="button"
              role="tab"
              aria-selected={logo === index}
              aria-label={item.name}
              onClick={() => setLogo(index)}
            >
              <img src={item.src} alt="" width={item.width} height={item.height} />
            </button>
          ))}
        </div>
        <div className={styles.result}>
          <div className={styles.brand}>
            <img className={styles.brandBg} src="/healthcare/brand-bg.png" alt="" />
            <img className={styles.brandMark} src="/healthcare/brand-mark.svg" alt="" width={138} height={138} />
            <img className={styles.brandWord} src="/healthcare/brand-word.svg" alt="Craftgram" width={312} height={66} />
          </div>
          <div className={styles.metric}>
            <p>The orchestration layer simplifies complex workflows and makes easier to manage.</p>
            <div>
              <strong>85%</strong>
              <span>Reduction in manual work</span>
            </div>
          </div>
          <figure>
            <img src="/healthcare/portrait.png" alt="" width={144} height={144} />
            <blockquote>
              AgentLab brings much-needed structure to AI automation workflows.
              The orchestration layer makes complex systems easier to understand,
              manage efficiently, and scale without breaking.”
            </blockquote>
            <figcaption>
              <strong>Colton Pond</strong>
              <span>Head of Partnership</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <IndustriesSection />

      <section className={styles.band} aria-labelledby="healthcare-cta">
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-left.svg" alt="" />
        </div>
        <div>
          <h2 id="healthcare-cta">Talk to our healthcare team</h2>
          <p>
            Get our SOC 2 report, pen test summary, and architecture overview
            in one package — usually within one business day.
          </p>
          <a href="/contact">
            Contact us
            <span>
              <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-right.svg" alt="" />
        </div>
      </section>

      <SiteClose current="Healthcare" hideBand />
    </main>
  );
}
