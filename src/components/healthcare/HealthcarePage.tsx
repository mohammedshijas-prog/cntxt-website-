"use client";

import { useRouter } from "next/navigation";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { CaseCards, type CaseCard } from "../shared/CaseCards";
import { IndustriesSection } from "../shared/IndustriesSection";
import { IconChip } from "../shared/graphics";
import styles from "./healthcare.module.css";
import { KitArt, PanelArt } from "../shared/graphics";
import { faqs } from "../shared/faqs";
import { Faq } from "../shared/Faq";

const glyphs: Record<string, "wave" | "text" | "image" | "camera" | "lidar" | "check" | "consent" | "floor"> = {
  Audio: "wave",
  "3D": "lidar",
  Document: "text",
  Text: "text",
  Image: "image",
  Video: "camera",
  LiDAR: "lidar",
  Evaluation: "check",
  "Data services": "image",
  "AI evaluation": "check",
  "Arabic voice AI": "wave",
  "Physical AI data": "camera",
};

const cases: CaseCard[] = [
  {
    image: "/healthcare/case-1.webp",
    index: "01",
    label: "Clinical speech.",
    title: "Arabic speech,\nas patients speak it.",
    body: "Munsit transcribes and voices Arabic across 25+ dialects, for clinical and patient-facing speech.",
  },
  {
    image: "/healthcare/case-2.webp",
    index: "02",
    label: "Model evaluation.",
    title: "Tested by people\nwho know medicine.",
    body: "Medical AI evaluators test models for bias, reliability and compliance before deployment.",
  },
  {
    image: "/healthcare/case-3.webp",
    index: "03",
    label: "Physical AI data.",
    title: "Support work,\ncaptured as data.",
    body: "Support staff such as hospital porters record the work they already do. It becomes training data for robotics.",
  },
];

type Offer = {
  tag: string;
  title: string;
  body: string;
  link?: { href: string; text: string };
  points: [string, string];
};

const offers: Offer[] = [
  {
    tag: "Data services",
    title: "Healthcare annotation",
    body: "Healthcare domain annotators label text, audio, image and video, with human-in-the-loop quality assurance.",
    points: ["98% accuracy", "In-region"],
  },
  {
    tag: "AI evaluation",
    title: "Medical AI evaluators",
    body: "Evaluators with medical and biology expertise test and audit models before they are deployed.",
    points: ["Bias", "Reliability"],
  },
  {
    tag: "Arabic voice AI",
    title: "Munsit",
    body: "Speech-to-text and text-to-speech across 25+ Arabic dialects, via API or on-premises.",
    link: { href: "https://munsit.com", text: "munsit.com" },
    points: ["25+ dialects", "On-premises"],
  },
  {
    tag: "Physical AI data",
    title: "Real work capture",
    body: "Teams record everyday support work, such as hospital portering, through KLKT, with worker consent.",
    link: { href: "https://klkt.app", text: "klkt.app" },
    points: ["Consent", "Human review"],
  },
];

const underline = { textDecoration: "underline" } as const;

/** Offer tag → the matching option on the contact form. */
const topics: Record<string, string> = {
  "Data services": "Data services",
  "AI evaluation": "AI evaluation",
  "Arabic voice AI": "Arabic voice AI (Munsit)",
  "Physical AI data": "Physical AI data",
};

function Eyebrow({ children }: { children: string }) {
  return (
    <p className={styles.eyebrow}>
      <span className={styles.tag} aria-hidden="true" />
      {children}
    </p>
  );
}

export function HealthcarePage() {
  const router = useRouter();

  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero} aria-labelledby="healthcare-heading">
        <div className={styles.heroCopy}>
          <Eyebrow>Healthcare</Eyebrow>
          <h1 id="healthcare-heading">Real-world AI for healthcare.</h1>
          <p>
            Data, evaluation and Arabic voice AI for healthcare organisations.
            Hosted in region or deployed on-premises, with HIPAA listed in our trust centre.
          </p>
          <a className={styles.partner} href="/contact">
            Book a demo
            <span>
              <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <img className={styles.heroArt} src="/healthcare/hero.webp" alt="" />
      </section>


      <section className={styles.cases} aria-labelledby="cases-heading">
        <Eyebrow>Use cases</Eyebrow>
        <h2 id="cases-heading">Use cases in this industry</h2>
        <CaseCards cases={cases} />
      </section>

      <section className={styles.offers} aria-labelledby="offers-heading">
        <Eyebrow>What you get</Eyebrow>
        <h2 id="offers-heading">
          Data, evaluation and voice.
          <br />
          Kept under your control.
        </h2>
        <ul>
          {offers.map((offer, index) => {
            return (
              <li key={index}>
                <p className={styles.offerTag}>
                  <img src="/data-hub/dot.svg" alt="" width={8} height={8} />
                  {offer.tag}
                </p>
                <IconChip name={glyphs[offer.tag] ?? "floor"} />
                <div>
                  <h3>{offer.title}</h3>
                  <p>
                    {offer.body}
                    {offer.link ? (
                      <>
                        {" "}
                        <a href={offer.link.href} style={underline}>
                          {offer.link.text}
                        </a>
                      </>
                    ) : null}
                  </p>
                  <ul>
                    <li>{offer.points[0]}</li>
                    <li>{offer.points[1]}</li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      const params = new URLSearchParams({ topic: topics[offer.tag] ?? "Other", about: offer.title });
                      router.push(`/contact?${params}`);
                    }}
                  >
                    Speak to an expert →
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.customers} aria-labelledby="customers-heading">
        <Eyebrow>Security and compliance</Eyebrow>
        <h2 id="customers-heading">
          Hosted in region or on your premises.
          <br />
          Controls published.
        </h2>
        <div className={styles.result}>
          <div className={styles.brand}>
            <img className={styles.brandBg} src="/healthcare/brand-bg.webp" alt="" />
            <PanelArt>
              <KitArt kind="head" />
            </PanelArt>
          </div>
          <div className={styles.metric}>
            <p>
              Security controls are published in our{" "}
              <a href="https://cntxt.trust.site" style={underline}>
                trust centre
              </a>
              . Planning a first project? Read{" "}
              <a
                href="https://www.cntxt.tech/insight-hub/8-things-to-consider-when-introducing-ai-in-healthcare"
                style={underline}
              >
                8 things to consider when introducing AI in healthcare
              </a>
              .
            </p>
            <div>
              <strong>HIPAA</strong>
              <span>Alongside SOC 2 Type II, ISO 27001 and GDPR</span>
            </div>
          </div>
          <figure>
            <blockquote>
              “CNTXT AI capabilities and speed of execution stand out in this
              fast-moving AI world.”
            </blockquote>
            <figcaption>
              <img
                src="/brand/people/reda-nidhakou.webp"
                alt=""
                width={56}
                height={56}
                style={{ display: "block", width: 56, height: 56, marginBottom: 14, borderRadius: "50%", objectFit: "cover" }}
              />
              <strong>Reda Nidhakou</strong>
              <span>AI71, investor in CNTXT AI</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <IndustriesSection />

      <Faq items={faqs.healthcare} topic="Other" />

      <section className={styles.band} aria-labelledby="healthcare-cta">
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-left.webp" alt="" />
        </div>
        <div>
          <h2 id="healthcare-cta">Bring AI to your healthcare operations.</h2>
          <p>
            Tell us what you are building and where the data has to stay. We
            will show how data, evaluation and deployment would work.
          </p>
          <a href="/contact">
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

      <SiteClose current="Healthcare" hideBand />
    </main>
  );
}
