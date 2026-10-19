import { FactoryCrew } from "../products/DataFactory";
import { CtaBand } from "../shared/CtaBand";
import { Faq } from "../shared/Faq";
import { faqs } from "../shared/faqs";
import { PageHero } from "../shared/PageHero";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { ServiceTabs } from "./ServiceTabs";
import styles from "./dataServices.module.css";

/* Figures from docs/content-brief.md. */
const stats = [
  { value: "98%", label: "Labelling accuracy" },
  { value: "30M+", label: "Data points annotated" },
  { value: "25+", label: "Arabic dialects" },
];

const modalities = ["Audio", "Text", "Image", "Video", "LiDAR", "Documents"];

/* The AI Lab delivery process, told for a data project. */
const steps = [
  { name: "Scope", body: "The model, the data behind it and the rules for labelling it." },
  { name: "First batch", body: "Sourced, labelled and checked by a person before it reaches you." },
  { name: "Review with you", body: "Your team reviews it. What the review finds goes into the guidelines." },
  { name: "Scale and deliver", body: "The full set, delivered into your training run, kept in region." },
];

const trust = [
  { value: "98%", title: "Labelling accuracy", body: "Human-in-the-loop quality checks on every project." },
  { value: "In region", title: "Hosting and processing", body: "Delivered on-premises, hybrid or in the cloud." },
  {
    value: "SOC 2 · ISO",
    title: "SOC 2 Type II and ISO 27001",
    body: "With GDPR and HIPAA listed in our trust centre.",
    href: "https://cntxt.trust.site",
  },
];

/** Data-as-a-service: a managed data project, separate from the ready-made catalogue at /data-hub. */
export function DataServicesPage() {
  const contact = `/contact?${new URLSearchParams({ topic: "Data services" })}`;

  return (
    <main className={styles.page}>
      <SiteNav current="data-hub" />

      <PageHero
        id="data-services-heading"
        kicker="Data-as-a-service"
        title={["Training data,", "built to your spec."]}
        lead="We source, label, review and evaluate the data your models learn from, with native Arabic annotators across 25+ dialects and domain experts in finance, healthcare, logistics and government."
        actions={[
          { label: "Scope a project", href: contact, primary: true },
          { label: "Browse the data catalogue", href: "/data-hub" },
        ]}
        art={
          <div className={styles.heroArt}>
            <p className={styles.order}>Data project · in progress</p>
            <ul className={styles.chips}>
              {modalities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <ol className={styles.track}>
              {["Sourced", "Labelled", "Reviewed", "Delivered"].map((stage, i) => (
                <li key={stage} style={{ animationDelay: `${300 + i * 250}ms` }}>
                  <span aria-hidden="true">✓</span>
                  {stage}
                </li>
              ))}
            </ol>
            <dl className={styles.stats}>
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.value}</dt>
                  <dd>{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
      />

      <ServiceTabs />

      <section className={styles.section} aria-labelledby="loop-heading">
        <header className={styles.head}>
          <p className={styles.kicker}>How a project runs</p>
          <h2 id="loop-heading">Every batch makes the next one better.</h2>
        </header>
        <ol className={styles.loop}>
          {steps.map((step, i) => (
            <li key={step.name} data-tilt>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{step.name}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
        <p className={styles.loopNote}>
          <span aria-hidden="true">↻</span> Review findings feed the guidelines for the next batch.
        </p>
      </section>

      <FactoryCrew />

      <section className={styles.section} aria-labelledby="trust-heading">
        <header className={styles.head}>
          <p className={styles.kicker}>Quality and security</p>
          <h2 id="trust-heading">Checked by people. Kept where it has to stay.</h2>
        </header>
        <ul className={styles.trust}>
          {trust.map((item) => (
            <li key={item.title}>
              <strong>{item.value}</strong>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              {item.href ? (
                <a href={item.href}>
                  Visit the trust centre <span aria-hidden="true">→</span>
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.catalogue} aria-labelledby="catalogue-heading">
        <div>
          <p className={styles.kicker}>Data catalogue</p>
          <h2 id="catalogue-heading">Need data that already exists?</h2>
          <p>Browse ready-made categories by modality and add them to one request.</p>
        </div>
        <a href="/data-hub">
          Browse the data catalogue <span aria-hidden="true">→</span>
        </a>
      </section>

      <Faq items={faqs.dataServices} topic="Data services" />

      <CtaBand
        id="data-services-cta"
        title="Tell us what your model needs to learn."
        body="Share the task, the languages and the volume. We come back with a scope, guidelines and a first batch."
        primary={{ label: "Scope a project", href: contact }}
        secondary={{ label: "Browse the data catalogue", href: "/data-hub" }}
      />

      <SiteClose current="Data services" hideBand />
    </main>
  );
}
