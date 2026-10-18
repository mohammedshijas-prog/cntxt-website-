"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./industryDemo.module.css";

/*
 * A short, looping product moment for each industry: what the work looks like
 * with CNTXT in it. The screens are illustrations of the capabilities on the
 * page (docs/content-brief.md, section 7), not customer data.
 */

type Props = { slug: string };

const copy: Record<string, { kicker: string; title: string; steps: string[] }> = {
  "public-sector": {
    kicker: "See it work",
    title: "Ask the regulations. Get an answer with its source.",
    steps: ["A question in Arabic or English", "Searched across policies and circulars", "An answer that cites the clause", "Run on government infrastructure"],
  },
  "financial-services": {
    kicker: "See it work",
    title: "A KYC file, reviewed in the time it takes to open it.",
    steps: ["Documents read from your own files", "Each check run automatically", "Exceptions routed to a person", "Kept inside UAE jurisdiction"],
  },
  "real-estate": {
    kicker: "See it work",
    title: "Scattered data in. Ranked leads out.",
    steps: ["CRM, spreadsheets and folders", "Brought into one system", "Leads scored and ranked", "Teams answer the right ones first"],
  },
  insurance: {
    kicker: "See it work",
    title: "The claim is checked while it is being written.",
    steps: ["The claimant fills the form", "AI validates each field live", "Missing details flagged on the spot", "Only complete claims are submitted"],
  },
};

function useLoop(length: number, ms: number) {
  const [step, setStep] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = box.current;
    if (!node) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const seen = new IntersectionObserver(([entry]) => {
      clearInterval(timer);
      if (entry.isIntersecting && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        timer = setInterval(() => setStep((value) => (value + 1) % length), ms);
      }
    }, { threshold: 0.3 });
    seen.observe(node);
    return () => {
      seen.disconnect();
      clearInterval(timer);
    };
  }, [length, ms]);
  return { step, setStep, box };
}

export function IndustryDemo({ slug }: Props) {
  const content = copy[slug];
  const { step, setStep, box } = useLoop(4, 2600);
  if (!content) return null;

  return (
    <section className={styles.section} aria-labelledby="demo-heading">
      <div className={styles.layout}>
        <div className={styles.copy}>
          <p className={styles.kicker}>{content.kicker}</p>
          <h2 id="demo-heading">{content.title}</h2>
          <ol className={styles.steps}>
            {content.steps.map((text, index) => (
              <li key={text} className={index === step ? styles.stepOn : index < step ? styles.stepDone : ""}>
                <button type="button" onClick={() => setStep(index)}>
                  <span>{index + 1}</span>
                  {text}
                </button>
              </li>
            ))}
          </ol>
          <p className={styles.note}>Illustration of the workflow, not customer data.</p>
        </div>
        <div ref={box} className={styles.screen} aria-hidden="true">
          {slug === "public-sector" ? <Regulations step={step} /> : null}
          {slug === "financial-services" ? <Kyc step={step} /> : null}
          {slug === "real-estate" ? <Leads step={step} /> : null}
          {slug === "insurance" ? <Claim step={step} /> : null}
        </div>
      </div>
    </section>
  );
}

function Window({ title, badge, children }: { title: string; badge: string; children: React.ReactNode }) {
  return (
    <div className={styles.window}>
      <div className={styles.bar}>
        <i />
        <i />
        <i />
        <span>{title}</span>
        <b>{badge}</b>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}

/* Public sector: a question answered from the documents, with the clause cited. */
function Regulations({ step }: { step: number }) {
  const sources = ["Procurement policy", "Circular", "Internal guidance", "Regulation"];
  return (
    <Window title="Policy assistant" badge="On-premises">
      <div className={styles.ask}>
        <span dir="rtl" lang="ar">ما هي متطلبات الموافقة على عقد توريد جديد؟</span>
        <small>What approvals does a new supply contract need?</small>
      </div>
      <div className={styles.sources}>
        {sources.map((name, index) => (
          <span key={name} className={step >= 1 && index <= step ? styles.sourceHit : ""}>
            <i />
            {name}
          </span>
        ))}
      </div>
      <div className={`${styles.answer} ${step >= 2 ? styles.show : ""}`}>
        <p>The contract is reviewed against the procurement policy, then approved at the level its value requires.</p>
        <span className={styles.cite}>Source · Procurement policy, approvals section</span>
      </div>
      <div className={`${styles.footer} ${step >= 3 ? styles.show : ""}`}>
        <span className={styles.dot} /> Data stays in national infrastructure
      </div>
    </Window>
  );
}

/* Financial services: a KYC file checked line by line, one exception to a person. */
function Kyc({ step }: { step: number }) {
  const checks = [
    { name: "Emirates ID", state: "ok" },
    { name: "Trade licence", state: "ok" },
    { name: "VAT certificate", state: "ok" },
    { name: "Address on contract", state: "flag" },
  ];
  return (
    <Window title="KYC review" badge="UAE region">
      <ul className={styles.checks}>
        {checks.map((item, index) => {
          const done = step >= 1 && index <= step;
          return (
            <li key={item.name} className={done ? (item.state === "flag" ? styles.flag : styles.ok) : ""}>
              <span className={styles.doc} />
              {item.name}
              <em>{done ? (item.state === "flag" ? "Check with reviewer" : "Matched") : "Waiting"}</em>
            </li>
          );
        })}
      </ul>
      <div className={`${styles.handoff} ${step >= 3 ? styles.show : ""}`}>
        <span>1 exception</span> sent to a reviewer · the rest cleared automatically
      </div>
    </Window>
  );
}

/* Real estate: three scattered sources merge, then leads rank. */
function Leads({ step }: { step: number }) {
  const sources = ["CRM", "Excel sheets", "Document folders"];
  const leads = [
    { name: "Villa enquiry", score: 92 },
    { name: "Off-plan apartment", score: 78 },
    { name: "Office lease", score: 64 },
    { name: "Townhouse viewing", score: 41 },
  ];
  return (
    <Window title="Brokerage data" badge="One system">
      <div className={`${styles.merge} ${step >= 1 ? styles.merged : ""}`}>
        {sources.map((name) => (
          <span key={name}>{name}</span>
        ))}
        <b>Unified</b>
      </div>
      <ul className={`${styles.leads} ${step >= 2 ? styles.show : ""}`}>
        {leads.map((lead, index) => (
          <li key={lead.name} className={step >= 3 && index === 0 ? styles.top : ""}>
            {lead.name}
            <span className={styles.bar2}>
              <i style={{ width: step >= 2 ? `${lead.score}%` : "0%" }} />
            </span>
            <b>{step >= 2 ? lead.score : "–"}</b>
          </li>
        ))}
      </ul>
    </Window>
  );
}

/* Insurance: a form validated live; the error is caught before submit. */
function Claim({ step }: { step: number }) {
  return (
    <Window title="Submit a claim" badge="Live validation">
      <div className={styles.form}>
        <label className={step >= 1 ? styles.fieldOk : ""}>
          Policy number
          <span>{step >= 1 ? "POL-48-2210" : ""}</span>
        </label>
        <label className={step === 2 ? styles.fieldBad : step >= 3 ? styles.fieldOk : ""}>
          Date of treatment
          <span>{step >= 3 ? "12 Sep" : ""}</span>
          {step === 2 ? <small>Missing: add the date of treatment</small> : null}
        </label>
        <label className={step >= 3 ? styles.fieldOk : ""}>
          Invoice attached
          <span>{step >= 3 ? "invoice.pdf" : ""}</span>
        </label>
        <button type="button" tabIndex={-1} className={step >= 3 ? styles.ready : ""}>
          {step >= 3 ? "Ready to submit" : "Checking…"}
        </button>
      </div>
    </Window>
  );
}
