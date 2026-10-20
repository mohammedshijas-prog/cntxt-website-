"use client";

import { useEffect, useRef, useState } from "react";
import { ChallengeArt } from "./ChallengeArt";
import { SiteClose } from "../site/SiteClose";
import { CtaBand } from "../shared/CtaBand";
import { PageHero } from "../shared/PageHero";
import { SiteNav } from "../site/SiteNav";
import styles from "./solutions.module.css";
import { faqs } from "../shared/faqs";
import { Faq } from "../shared/Faq";
import { ProofBar } from "../shared/ProofBar";

const challenges = [
  {
    number: "01",
    title: "Pilots that stall on messy data",
    body: "We label and verify the data first, at 98% accuracy.",
  },
  {
    number: "02",
    title: "Global models that miss Arabic",
    body: "Native annotators across 25+ dialects, and the #1 Arabic speech model.",
  },
  {
    number: "03",
    title: "Data that cannot leave the region",
    body: "Hosted in region, on-premises or hybrid. SOC 2 Type II and ISO 27001.",
  },
  {
    number: "04",
    title: "No way to measure model quality",
    body: "Domain experts test for bias, reliability and compliance before launch.",
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
    body: "Custom AI trained on your data, built into your systems, delivered in two phases.",
    wash: "/solutions/wash-build.svg",
    washWidth: 1567,
    washHeight: 562,
    labelClass: styles.labelBuild,
    shots: [{ src: "/art/deploy.svg" }],
  },
  {
    label: "Data services",
    title: ["Sourced, labelled", "and verified."],
    body: "Data collected, labelled and verified at 98% accuracy.",
    wash: "/solutions/wash-app.svg",
    washWidth: 1567,
    washHeight: 562.5,
    labelClass: styles.labelApp,
    shots: [{ src: "/brand/product/label-text.webp" }],
  },
  {
    label: "Munsit",
    title: ["Arabic voice AI", "across 25+ dialects."],
    body: "Arabic speech-to-text and text-to-speech, ranked #1. Runs on-premises or on-device.",
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
    body: "85% faster reviews.",
  },
  {
    image: "/solutions/panel-app.webp",
    title: "Insurance claims",
    body: "Rejections cut by an estimated 72%.",
  },
  {
    image: "/solutions/study-3.webp",
    title: "Real estate operations",
    body: "22% faster reviews, 28% less legal work.",
  },
  {
    image: "/solutions/study-4.webp",
    title: "Hiring and supply chain",
    body: "32% faster hiring across 3,000+ CVs.",
  },
];

/** Sector cards, mirroring the Solutions menu. One-liners restate each page's sourced lead. */
const sectors = [
  { group: "Enterprise", name: "Financial services", line: "KYC, VAT and contract reviews, with data kept inside the UAE.", href: "/industries/financial-services", image: "/healthcare/tile-chart.webp" },
  { group: "Government", name: "Public sector", line: "Sovereign AI trained on policies, regulations and official records.", href: "/industries/public-sector", image: "/industries/government.jpg" },
  { group: "Enterprise", name: "Healthcare", line: "Medical evaluation, healthcare annotation and Arabic clinical speech.", href: "/healthcare", image: "/healthcare/tile-lab.webp" },
  { group: "Enterprise", name: "Real estate", line: "One data foundation for sales, finance, HR and marketing.", href: "/industries/real-estate", image: "/solutions/study-4.webp" },
  { group: "Enterprise", name: "Insurance", line: "Claims validated in real time, before they are submitted.", href: "/industries/insurance", image: "/security/practice-a.webp" },
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
  const [auto, setAuto] = useState(true);
  const challengeBox = useRef<HTMLDivElement>(null);

  // The challenges play through on their own while in view, until someone picks one.
  useEffect(() => {
    const node = challengeBox.current;
    if (!node || !auto) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const seen = new IntersectionObserver(([entry]) => {
      clearInterval(timer);
      if (entry.isIntersecting && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        timer = setInterval(() => setOpen((value) => (value + 1) % challenges.length), 6000);
      }
    }, { threshold: 0.35 });
    seen.observe(node);
    return () => {
      seen.disconnect();
      clearInterval(timer);
    };
  }, [auto]);

  return (
    <main className={styles.page}>
      <SiteNav current="solutions" />

      <PageHero
        id="solutions-heading"
        kicker="Solutions"
        title={["Real-world AI", "for enterprises."]}
        lead="Data verified from real work, models trained on it, and AI deployed where your data has to stay, for enterprises and governments."
        actions={[
          { label: "Book a demo", href: "/contact?topic=Custom%20AI%20solutions", primary: true },
          { label: "Explore the AI Lab", href: "/products" },
        ]}
        art={
          <div className={styles.heroCollage} aria-hidden="true">
            <img loading="lazy" decoding="async" src="/healthcare/tile-chart.webp" alt="" />
            <img loading="lazy" decoding="async" src="/industries/government.jpg" alt="" />
            <img loading="lazy" decoding="async" src="/healthcare/tile-lab.webp" alt="" />
            <img loading="lazy" decoding="async" src="/healthcare/tile-robot.webp" alt="" />
          </div>
        }
      />

      <ProofBar />

      <section className={styles.browse} aria-labelledby="browse-heading">
        <p className={styles.browseKicker}>Browse by</p>
        <h2 id="browse-heading">Find the solution for your industry.</h2>
        <ul className={styles.browseCards} data-rail>
          {sectors.map((sector) => (
            <li key={sector.name}>
              <a href={sector.href} data-tilt>
                <img loading="lazy" decoding="async" src={sector.image} alt="" />
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
        <div ref={challengeBox} className={styles.challengeGrid}>
          <div className={styles.accordion}>
            {challenges.map((item, index) => {
              const expanded = open === index;
              return (
                <div key={item.number} className={expanded ? styles.itemOpen : styles.item}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => {
                      setOpen(index);
                      setAuto(false);
                    }}
                  >
                    <span>{item.number}</span>
                    {item.title}
                  </button>
                  {expanded && item.body ? <p>{item.body}</p> : null}
                  {expanded && auto ? <i key={`t-${index}`} className={styles.challengeTimer} aria-hidden="true" /> : null}
                </div>
              );
            })}
          </div>
          <ChallengeArt index={Math.max(open, 0)} />
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
        <ul data-rail>
          {studies.map((study) => (
            <li key={study.title} data-tilt>
              <img loading="lazy" decoding="async" src={study.image} alt="" />
              <p>
                <strong>{study.title}</strong> {study.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <Faq items={faqs.solutions} topic="Custom AI solutions" />

      <CtaBand
        id="enterprise-heading"
        title="Bring real-world AI to your enterprise."
        body="“The speed at which CNTXT AI operates is unmatched for a company of its scale.” Youssef Salem, CFO, ADNOC Drilling"
        primary={{ label: "Book a demo", href: "/contact?topic=Custom%20AI%20solutions" }}
      />

      <SiteClose current="Enterprises" hideBand />
    </main>
  );
}
