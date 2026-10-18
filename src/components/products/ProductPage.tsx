"use client";

import { useState } from "react";
import { SiteClose } from "../site/SiteClose";
import { CtaBand } from "../shared/CtaBand";
import { CaseStudies, DataTypes } from "./DataTypes";
import { FactoryLine } from "./DataFactory";
import { PowerStack, ResearchCards } from "./LabSections";
import { Delivery } from "./Delivery";
import { VerticalWorld } from "../physical-ai/VerticalWorld";
import { SiteNav } from "../site/SiteNav";
import { PageHero } from "../shared/PageHero";
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

      <PageHero
        id="product-heading"
        kicker="AI Lab"
        title={["The data factory", "for real-world AI."]}
        lead="Raw data goes in: captured with consent, labelled by native annotators and checked by people. Training-ready data comes out, with the models and agents built on it."
        actions={[
          { label: "Book a demo", href: "/contact?topic=Data%20services", primary: true },
          { label: "See the line", href: "#line-heading" },
        ]}
        art={<VerticalWorld slug="ai-lab" />}
      />

      <ProofBar />

      <FactoryLine />

      <DataTypes />

      <PowerStack />

      <CaseStudies />

      <Delivery />

      <ResearchCards />

      <Faq items={faqs.products} topic="Custom AI solutions" />

      <CtaBand
        id="ready-heading"
        title="Ready to build?"
        body="Tell us about your data, your models or the agent you want to deploy."
        primary={{ label: "Book a demo", href: "/contact?topic=Custom%20AI%20solutions" }}
      />
      <SiteClose current="Build AI" hideBand />
    </main>
  );
}
