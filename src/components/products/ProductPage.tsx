"use client";

import { useState } from "react";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { CaseCards, type CaseCard } from "../shared/CaseCards";
import styles from "./product.module.css";

const steps = [
  {
    title: "Connect your sources",
    body: "Search exists because your knowledge is not readable. It indexes an estate on a schedule, answers from that snapshot, writes nothing back, and cannot tell you the scope of what it looked at. Once the knowledge itself is readable, current and attributable, much of what search was bought to solve stops being a problem.",
  },
  {
    title: "Build the context layer",
    body: "Documents, calls, tickets and records are read into one shared layer that stays current as work happens, so every answer starts from what the organisation actually knows today.",
  },
  {
    title: "Set guardrails and permissions",
    body: "Decide who and what can read, write and act. Policies apply everywhere at once, and every tool call is checked against them before it runs.",
  },
  {
    title: "Ship and measure",
    body: "Put agents and apps in front of real users, then track accuracy, adoption and cost from one place, with a full audit trail of what happened and why.",
  },
];

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

function Eyebrow({ children }: { children: string }) {
  return (
    <p className={styles.eyebrow}>
      <span className={styles.tag} aria-hidden="true" />
      {children}
    </p>
  );
}

export function ProductPage() {
  const [open, setOpen] = useState(0);
  const [logo, setLogo] = useState(0);

  return (
    <main className={styles.page}>
      <SiteNav current="products" />

      <section className={styles.hero} aria-labelledby="product-heading">
        <div className={styles.heroCopy}>
          <h1 id="product-heading">Build AI that survives contact with the real world.</h1>
          <p>
            Klkt is a visual builder for internal tools — assemble forms, prompts, and logic into a working app in an afternoon. Built for ops and product teams who need something running{" "}
          </p>
          <a className={styles.cta} href="/contact">
            Get started
            <span>
              <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <div className={styles.heroArt}>
          <img src="/products/hero.png" alt="" />
        </div>
      </section>

      <section className={styles.tour} aria-labelledby="tour-heading">
        <div className={styles.tourIntro}>
          <Eyebrow>product tour</Eyebrow>
          <h2 id="tour-heading">What’s inside Build AI</h2>
          <p>
            Independent evaluation for teams shipping language models — benchmarks, human review, and adversarial testing that catches
          </p>
        </div>
        <article className={styles.feature}>
          <div>
            <h3>Physical AI</h3>
            <p>
              Ramp supports 30+ ERPs and complex setups —multi-entity, multi-currency, custom fields, and custom dimensions—so you can scale without manual work or messy reconciliations.
            </p>
          </div>
          <div className={styles.featureShot}>
            <img src="/solutions/panel-guard.png" alt="" />
          </div>
        </article>
        <div className={styles.split}>
          <article>
            <h3>Data Engine</h3>
            <p>The right first move. It gave every person an assistant and the company no shared memory.</p>
            <img src="/products/policy.png" alt="" />
          </article>
          <article>
            <h3>For Governments</h3>
            <p>The right first move. It gave every person an assistant and the company no shared memory.</p>
            <img src="/products/policy.png" alt="" />
          </article>
        </div>
      </section>

      <section className={styles.steps} aria-labelledby="steps-heading">
        <Eyebrow>How it works</Eyebrow>
        <h2 id="steps-heading">How it works</h2>
        <div className={styles.stepGrid}>
          <div>
            {steps.map((step, index) => {
              const expanded = open === index;
              return (
                <div key={index} className={expanded ? styles.stepOpen : styles.step}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setOpen(expanded ? -1 : index)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {step.title}
                  </button>
                  {expanded && step.body ? <p>{step.body}</p> : null}
                </div>
              );
            })}
          </div>
          <img src="/products/steps.png" alt="" />
        </div>
      </section>

      <section className={styles.cases} aria-labelledby="capabilities-heading">
        <Eyebrow>Use cases</Eyebrow>
        <h2 id="capabilities-heading">Capabilities</h2>
        <CaseCards cases={cases} />
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
              AgentLab brings much-needed structure to AI automation workflows. The orchestration layer makes complex systems easier to understand, manage efficiently, and scale without breaking.”
            </blockquote>
            <figcaption>
              <strong>Colton Pond</strong>
              <span>Head of Partnership</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.band} aria-labelledby="ready-heading">
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-left.svg" alt="" />
        </div>
        <div>
          <h2 id="ready-heading">Ready to build?</h2>
          <p>One line of supporting copy.</p>
          <a href="/contact">
            Get started
            <span>
              <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-right.svg" alt="" />
        </div>
      </section>
      <SiteClose current="Build AI" hideBand />
    </main>
  );
}
