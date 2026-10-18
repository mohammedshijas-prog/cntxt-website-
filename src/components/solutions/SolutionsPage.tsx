"use client";

import { useState } from "react";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import styles from "./solutions.module.css";
import { faqs } from "../shared/faqs";
import { Faq } from "../shared/Faq";
import { ProofBar } from "../shared/ProofBar";

const challenges = [
  {
    number: "01",
    title: "Pilots that stall on messy data",
    body: "AI projects fail on messy data, not on models. Demos run on clean samples; production runs on scattered documents, recordings and records. We source, label and verify the data first: text, image, video and audio at 98% accuracy, with human-in-the-loop quality assurance.",
  },
  {
    number: "02",
    title: "Global models that miss Arabic",
    body: "Global models underperform in Arabic, and more so in dialect, because the training data is scarce. Our native Arabic annotators cover 25+ dialects, and Munsit, our Arabic voice AI, ranks first on the Hugging Face Open Universal Arabic ASR Leaderboard.",
  },
  {
    number: "03",
    title: "Data that cannot leave the region",
    body: "Some data cannot be sent abroad. We host and process data in region, and deploy on-premises, hybrid or in the cloud. CNTXT AI holds SOC 2 Type II and ISO 27001, and complies with GDPR and HIPAA.",
  },
  {
    number: "04",
    title: "No way to measure model quality",
    body: "Without evaluation, every model choice is a guess. Domain experts test, evaluate and audit AI systems for bias, reliability and compliance before deployment. RAGMeter, our open-source toolkit, evaluates RAG pipelines.",
  },
];

type Product = {
  label: string;
  title: [string, string];
  body: string;
  link?: { href: string; text: string };
  wash: string;
  washWidth: number;
  washHeight: number;
  labelClass: string;
  shots: { src: string; photo?: boolean }[];
};

const products: Product[] = [
  {
    label: "Custom AI",
    title: ["Built on your data.", "Run where you choose."],
    body: "Custom AI integrated with enterprise and government systems and trained on proprietary and regional data. Delivery runs from discovery and roadmap through two build phases, with review and iteration between them, to sign-off.",
    wash: "/solutions/wash-build.svg",
    washWidth: 1567,
    washHeight: 562,
    labelClass: styles.labelBuild,
    shots: [{ src: "/art/deploy.svg" }],
  },
  {
    label: "Data services",
    title: ["Sourced, labelled", "and verified."],
    body: "Domain-specific datasets, field collection, enterprise integration and synthetic data. Text, image, video and audio labelling at 98% accuracy, by native Arabic annotators and domain experts in finance, healthcare, logistics and government.",
    wash: "/solutions/wash-app.svg",
    washWidth: 1567,
    washHeight: 562.5,
    labelClass: styles.labelApp,
    shots: [{ src: "/brand/product/label-text.webp" }],
  },
  {
    label: "Munsit",
    title: ["Arabic voice AI", "across 25+ dialects."],
    body: "Speech-to-text and text-to-speech in one platform, ranked first on the Hugging Face Open Universal Arabic ASR Leaderboard. Deploys via API, on-premises, sovereign cloud or on-device.",
    link: { href: "https://munsit.com", text: "munsit.com" },
    wash: "/solutions/wash-hub.svg",
    washWidth: 1567,
    washHeight: 558.5,
    labelClass: styles.labelHub,
    shots: [{ src: "/brand/product/munsit-app.webp" }],
  },
];

const studies = [
  {
    image: "/solutions/study-1.webp",
    title: "Contract compliance",
    body: "AI-assisted contract compliance review made reviews 85% faster and application processing 60% faster.",
  },
  {
    image: "/solutions/panel-app.webp",
    title: "Insurance claims",
    body: "A rejection rate above 70% was cut by an estimated 72%, with 60% less processing time.",
  },
  {
    image: "/solutions/study-3.webp",
    title: "Real estate operations",
    body: "Reviews ran 22% faster and legal workload fell by 28%.",
  },
  {
    image: "/solutions/study-4.webp",
    title: "Hiring and supply chain",
    body: "Across 3,000+ CVs, admin cost fell 21% and hiring and onboarding ran 32% faster. In supply chain, projected gains are 23% faster processing and 17% fewer data-entry errors.",
  },
];

/** Sector cards, mirroring the Solutions menu. One-liners restate each page's sourced lead. */
const sectors = [
  { group: "Enterprise", name: "Financial services", line: "KYC, VAT and contract reviews, with data kept inside the UAE.", href: "/industries/financial-services", image: "/healthcare/tile-chart.webp" },
  { group: "Government", name: "Public sector", line: "Sovereign AI trained on policies, regulations and official records.", href: "/industries/public-sector", image: "/industries/government.jpg" },
  { group: "Enterprise", name: "Healthcare", line: "Medical evaluation, healthcare annotation and Arabic clinical speech.", href: "/healthcare", image: "/healthcare/tile-lab.webp" },
  { group: "Enterprise", name: "Real estate", line: "One data foundation for sales, finance, HR and marketing.", href: "/industries/real-estate", image: "/solutions/study-4.webp" },
  { group: "Enterprise", name: "Insurance", line: "Claims validated in real time, before they are submitted.", href: "/industries/insurance", image: "/security/practice-a.png" },
  { group: "Physical AI", name: "Robotics", line: "First-person video of real work, recorded with consent and labelled.", href: "/physical-ai", image: "/healthcare/tile-robot.webp" },
];

const modalities = [
  { label: "Audio and speech", category: "Audio" },
  { label: "Text", category: "Text" },
  { label: "Documents", category: "Document" },
  { label: "Image", category: "Image" },
  { label: "Video", category: "Video" },
  { label: "3D and LiDAR", category: "3D" },
  { label: "Model evaluation", category: "Evaluation" },
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
          <p>
            CNTXT AI captures and verifies data from real work, trains models on it and
            deploys them on-premises, hybrid or in the cloud, for enterprises and
            governments in finance, the public sector, logistics, healthcare, real
            estate and insurance.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.cta} href="/contact?topic=Custom%20AI%20solutions">
              Book a demo
              <span>
                <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
              </span>
            </a>
            <a className={styles.ghostCta} href="/products">
              Explore the AI Lab
            </a>
          </div>
        </div>
        <img className={styles.heroArt} src="/healthcare/hero.webp" alt="" />
      </section>

      <ProofBar />

      <section className={styles.browse} aria-labelledby="browse-heading">
        <p className={styles.browseKicker}>Browse by</p>
        <h2 id="browse-heading">Find the solution for your industry.</h2>
        <ul className={styles.browseCards}>
          {sectors.map((sector) => (
            <li key={sector.name}>
              <a href={sector.href}>
                <img src={sector.image} alt="" />
                <span className={styles.browseGroup}>{sector.group}</span>
                <strong>{sector.name}</strong>
                <span>{sector.line}</span>
                <span className={styles.browseLink}>
                  Explore {sector.name.toLowerCase()} <span aria-hidden="true">→</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.modalities}>
          <p>By data type</p>
          <ul>
            {modalities.map((item) => (
              <li key={item.label}>
                <a href={`/data-hub?category=${item.category}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
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
            <img src="/security/practice-a.png" alt="" />
            <span>01</span>
          </div>
        </div>
      </section>

      <section className={styles.products} aria-labelledby="products-heading">
        <Eyebrow>What we provide</Eyebrow>
        <h2 id="products-heading">What CNTXT AI provides</h2>
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
                  {product.title[0]}
                  <br />
                  {product.title[1]}
                </h3>
                <p>
                  {product.body}
                  {product.link ? (
                    <>
                      {" "}
                      <a href={product.link.href} style={{ textDecoration: "underline" }}>
                        {product.link.text}
                      </a>
                    </>
                  ) : null}
                </p>
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
          {studies.map((study) => (
            <li key={study.title}>
              <img src={study.image} alt="" />
              <p>
                <strong>{study.title}</strong> {study.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <Faq items={faqs.solutions} topic="Custom AI solutions" />

      <section className={styles.band} aria-labelledby="enterprise-heading">
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-left.webp" alt="" />
        </div>
        <div>
          <h2 id="enterprise-heading">
            Bring real-world AI to
            <br />
            your enterprise
          </h2>
          <p>
            “The speed at which CNTXT AI operates is unmatched for a company of its
            scale.” Youssef Salem, CFO, ADNOC Drilling
          </p>
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

      <SiteClose current="Enterprises" hideBand />
    </main>
  );
}
