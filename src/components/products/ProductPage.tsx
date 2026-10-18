"use client";

import { useState } from "react";
import { SiteClose } from "../site/SiteClose";
import { CaseStudies, DataTypes } from "./DataTypes";
import { SiteNav } from "../site/SiteNav";
import { CaseCards, type CaseCard } from "../shared/CaseCards";
import styles from "./product.module.css";
import { IsoFloor, PanelArt } from "../shared/graphics";
import { faqs } from "../shared/faqs";
import { Faq } from "../shared/Faq";
import { ProofBar } from "../shared/ProofBar";

const steps = [
  {
    title: "Discovery and roadmap",
    body: "We start with the problem, the systems it touches and the data behind it. AI projects fail on messy data, not on models, so the data foundation is examined first. Discovery ends in a roadmap that sets out what will be built and in what order.",
  },
  {
    title: "Kick-off and phase 1 build",
    body: "The first phase is built: data sourced and prepared, models built and trained on proprietary and regional data, and the work integrated with your enterprise or government systems.",
  },
  {
    title: "Review and iterate",
    body: "Phase 1 goes to review with your team. We iterate on what the review finds before anything more is built.",
  },
  {
    title: "Phase 2 build and sign-off",
    body: "The second phase completes the build, deployed on-premises, hybrid or in the cloud. The work closes with your sign-off.",
  },
];

const cases: CaseCard[] = [
  {
    image: "/brand/product/label-image.webp",
    index: "01",
    label: "Data.",
    title: "Four kinds of data.\nOne human check.",
    body: "Audio transcription and speaker diarisation, image boxes and masks, text entities and moderation, video action labels and LiDAR.",
  },
  {
    image: "/brand/product/label-audio.webp",
    index: "02",
    label: "Models.",
    title: "Speech in, speech out.\nIn real time.",
    body: "Munsit streams transcripts live with speaker labels and word-level timestamps, follows Arabic–English code-switching, and speaks back through Faseeh text-to-speech.",
  },
  {
    image: "/healthcare/case-3.webp",
    index: "03",
    label: "Agents.",
    title: "Built into your systems.\nRun on your terms.",
    body: "Agents are integrated with the systems you already run and delivered in two build phases, with review and iteration between them.",
  },
];

/** Published research from the lab (cntxt.tech/ai-product-lab and its insight hub). */
const research = [
  {
    type: "Paper · Speech",
    title: "Advancing Arabic speech recognition through large-scale weakly supervised learning",
    body: "How Munsit was trained: a Conformer model learning from 30,000+ hours of real Arabic audio, filtered to a 15,000-hour high-quality set.",
    href: "https://www.cntxt.tech/insight-hub/advancing-arabic-speech-recognition-through-large-scale-weakly-supervised-learning",
    cta: "Read the paper",
  },
  {
    type: "Shared task · Dialects",
    title: "Munsit at NADI 2025: multidialectal Arabic ASR",
    body: "Our entry to the NADI 2025 shared task on speech recognition across Arabic dialects.",
    href: "https://www.cntxt.tech/insight-hub/munsit-at-nadi-2025-shared-task-2-pushing-the-boundaries-of-multidialectal-arabic-asr",
    cta: "Read the entry",
  },
  {
    type: "Open source · Evaluation",
    title: "RAGMeter",
    body: "A toolkit for evaluating retrieval-augmented generation systems, published on PyPI as rag-meter.",
    href: "https://pypi.org/project/rag-meter/",
    cta: "Get it on PyPI",
  },
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

  return (
    <main className={styles.page}>
      <SiteNav current="products" />

      <section className={styles.hero} aria-labelledby="product-heading">
        <div className={styles.heroCopy}>
          <p className={styles.labEyebrow}>AI Lab</p>
          <h1 id="product-heading">Build AI that survives contact with the real world.</h1>
          <p>
            CNTXT is a full stack for AI in three layers: data captured and verified from real work, models trained on that data, and agents deployed on-premises, hybrid or in the cloud.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.cta} href="/contact?topic=Custom%20AI%20solutions">
              Book a demo
              <span>
                <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
              </span>
            </a>
            <a className={styles.ghostCta} href="#research">
              Explore our research
            </a>
          </div>
        </div>
        <div className={styles.heroArt}>
          <img src="/art/labels.svg" alt="" />
        </div>
      </section>

      <ProofBar />

      <section className={styles.tour} aria-labelledby="tour-heading">
        <div className={styles.tourIntro}>
          <Eyebrow>Product tour</Eyebrow>
          <h2 id="tour-heading">What’s inside AI Lab</h2>
          <p>
            Three layers that build on each other. Data comes first, models are trained on it, and agents put those models to work inside your systems.
          </p>
        </div>
        <article className={styles.feature}>
          <div>
            <h3>Data</h3>
            <p>
              AI Lab sources, labels and verifies text, image, video and audio data at 98% accuracy, with human-in-the-loop quality assurance and native Arabic annotators across 25+ dialects. Physical-AI data is captured from real work through <a href="https://klkt.app">KLKT</a>, where every accepted hour is confirmed by human review.
            </p>
          </div>
          <div className={styles.featureShot}>
            <img src="/art/annotation.svg" alt="" />
          </div>
        </article>
        <div className={styles.split}>
          <article>
            <h3>Models</h3>
            <p>
              <a href="https://munsit.com">Munsit</a> is Arabic voice AI: speech-to-text and text-to-speech across 25+ dialects, ranked #1 on the Hugging Face Open Universal Arabic ASR Leaderboard. We also train models on the data we capture.
            </p>
            <img src="/brand/product/munsit-platform.webp" alt="Munsit, the Arabic voice AI platform" />
          </article>
          <article>
            <h3>Agents</h3>
            <p>
              <a href="/agentix">Agentix</a> is our conversational AI platform: Arabic voice and chat agents, workflow automation and GCC telephony, alongside custom AI built into enterprise and government systems.
            </p>
            <img src="/art/deploy.svg" alt="" />
          </article>
        </div>
      </section>

      <section className={styles.steps} aria-labelledby="steps-heading">
        <Eyebrow>How it works</Eyebrow>
        <h2 id="steps-heading">How we deliver</h2>
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
          <img src="/art/delivery.svg" alt="" />
        </div>
      </section>

      <section className={styles.cases} aria-labelledby="capabilities-heading">
        <Eyebrow>Capabilities</Eyebrow>
        <h2 id="capabilities-heading">What each layer does</h2>
        <CaseCards cases={cases} />
      </section>

      <DataTypes />

      <CaseStudies />

      <section className={styles.customers} aria-labelledby="customers-heading">
        <Eyebrow>Customers & results</Eyebrow>
        <h2 id="customers-heading">
          250+ organisations served.
          <br />
          30M+ data points annotated.
        </h2>
        <div className={styles.result}>
          <div className={styles.brand}>
            <img className={styles.brandBg} src="/healthcare/brand-bg.webp" alt="" />
            <PanelArt>
              <IsoFloor />
            </PanelArt>
          </div>
          <div className={styles.metric}>
            <p>Munsit, our Arabic voice platform, is used by more than 250 government and enterprise organisations and 150,000 app users.</p>
            <div>
              <strong>1M+</strong>
              <span>Minutes of Arabic speech processed</span>
            </div>
          </div>
          <figure>
            <blockquote>
              “Working with CNTXT AI has been an incredibly rewarding experience.”
            </blockquote>
            <figcaption>
              <img
                src="/brand/people/ameen-al-qudsi.webp"
                alt=""
                width={56}
                height={56}
                style={{ display: "block", width: 56, height: 56, marginBottom: 14, borderRadius: "50%", objectFit: "cover" }}
              />
              <strong>Ameen Al Qudsi</strong>
              <span>CEO, Nationwide Middle East Properties</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.research} id="research" aria-labelledby="research-heading">
        <div className={styles.researchIntro}>
          <Eyebrow>Research</Eyebrow>
          <h2 id="research-heading">Regional-first models, shaped by regional data.</h2>
          <p>
            We design for context, stress-test prototypes on real data, and validate in production.
            What we learn, we publish.
          </p>
        </div>
        <ol className={styles.papers}>
          {research.map((paper) => (
            <li key={paper.title}>
              <a href={paper.href}>
                <span className={styles.paperType}>{paper.type}</span>
                <strong>{paper.title}</strong>
                <span>{paper.body}</span>
                <span className={styles.paperLink}>
                  {paper.cta} <span aria-hidden="true">→</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <Faq items={faqs.products} topic="Custom AI solutions" />

      <section className={styles.band} aria-labelledby="ready-heading">
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-left.webp" alt="" />
        </div>
        <div>
          <h2 id="ready-heading">Ready to build?</h2>
          <p>Tell us about your data, your models or the agent you want to deploy.</p>
          <a href="/contact?topic=Custom%20AI%20solutions">
            Book a demo
            <span>
              <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-right.webp" alt="" />
        </div>
      </section>
      <SiteClose current="Build AI" hideBand />
    </main>
  );
}
