import { FactoryCrew } from "../products/DataFactory";
import { CtaBand } from "../shared/CtaBand";
import { Faq } from "../shared/Faq";
import { faqs } from "../shared/faqs";
import { PageHero } from "../shared/PageHero";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { DataTypes } from "../products/DataTypes";
import { DataDots } from "./DataDots";
import { ServiceTabs } from "./ServiceTabs";
import styles from "./dataServices.module.css";

/* Figures from docs/content-brief.md. */
const stats = [
  { value: "98%", label: "Labelling accuracy" },
  { value: "30M+", label: "Data points annotated" },
  { value: "25+", label: "Arabic dialects" },
];


/* The AI Lab delivery process, told for a data project. */
const steps = [
  { name: "Scope", body: "The model, the data behind it and the rules for labelling it." },
  { name: "First batch", body: "Sourced, labelled and checked by a person before it reaches you." },
  { name: "Review with you", body: "Your team reviews it. What the review finds goes into the guidelines." },
  { name: "Scale and deliver", body: "The full set, delivered into your training run, kept in region." },
];

/* Four reasons, after Scale's "best in the business" grid. Facts from docs/content-brief.md. */
const proof = [
  { title: "Quality", body: "Labelled at 98% accuracy, with human-in-the-loop checks on every project.", mark: "#7d52f4" },
  { title: "Scale", body: "30M+ data points annotated for 250+ enterprise and government organisations.", mark: "#b79cff" },
  { title: "Arabic depth", body: "Native annotators across 25+ dialects, with domain experts in finance, healthcare, logistics and government.", mark: "#15111f" },
  { title: "Kept in region", body: "Hosted and processed in region: on-premises, hybrid or in the cloud. SOC 2 Type II and ISO 27001.", mark: "#5b3fd1" },
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
          <div className={styles.heroDots} role="img" aria-label="An abstract ribbon of purple dots: data flowing from source to model">
            <DataDots form="ribbon" className={styles.dotsFill} />
            {stats.map((stat, i) => (
              <span key={stat.label} className={styles.heroTag} data-at={i}>
                <b>{stat.value}</b> {stat.label}
              </span>
            ))}
          </div>
        }
      />

      <section className={styles.proof} aria-labelledby="proof-heading">
        <div className={styles.proofPanel}>
          <div className={styles.proofLead}>
            <h2 id="proof-heading">Training data, done properly.</h2>
            <p>Sourced, labelled and checked by people who know the language and the domain, then delivered where it has to stay.</p>
            <DataDots form="terrain" className={styles.proofDots} />
          </div>
          <ul className={styles.proofCards}>
            {proof.map((item) => (
              <li key={item.title} data-tilt>
                <span className={styles.mark} style={{ color: item.mark }} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <DataTypes />

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
