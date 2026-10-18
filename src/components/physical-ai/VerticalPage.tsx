import { IconChip } from "../shared/graphics";
import { CtaBand } from "../shared/CtaBand";
import { Faq } from "../shared/Faq";
import { faqs } from "../shared/faqs";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import styles from "./vertical.module.css";
import { verticals, type Vertical } from "./verticals";

const proof = [
  { value: "1.8M", label: "Frames annotated in six months for one robotics lab" },
  { value: "100%", label: "Of recorded hours reviewed by a person" },
  { value: "98%", label: "Labelling accuracy with human-in-the-loop checks" },
  { value: "4", label: "Consent languages: Arabic, English, Filipino and Urdu" },
];

/** A physical-AI vertical, structured like a dedicated industry page. */
export function VerticalPage({ vertical }: { vertical: Vertical }) {
  const topic = `Physical AI data: ${vertical.name}`;
  const contact = `/contact?${new URLSearchParams({ topic: "Physical AI data", about: vertical.name })}`;
  const others = verticals.filter((item) => item.slug !== vertical.slug);

  return (
    <main className={styles.page}>
      <SiteNav current="solutions" />

      <section className={styles.hero} aria-labelledby="vertical-heading">
        <p className={styles.kicker}>Physical AI · {vertical.name}</p>
        <h1 id="vertical-heading">{vertical.title}</h1>
        <p className={styles.lead}>{vertical.lead}</p>
        <div className={styles.actions}>
          <a className={styles.primary} href={contact}>
            Book a demo
          </a>
          <a className={styles.secondary} href="#samples">
            Check our data samples
          </a>
        </div>
        <div className={styles.heroArt}>
          <img src={vertical.art} alt="" />
        </div>
      </section>

      <section className={styles.problem} aria-labelledby="problem-heading">
        <h2 id="problem-heading">{vertical.problemTitle}</h2>
        <p>{vertical.problem}</p>
      </section>

      <section className={styles.section} aria-labelledby="built-heading">
        <p className={styles.kicker}>What you get</p>
        <h2 id="built-heading">Built for {vertical.name.toLowerCase()}.</h2>
        <ul className={styles.capabilities}>
          {vertical.capabilities.map((item) => (
            <li key={item.title}>
              <IconChip name={item.icon} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.network} aria-labelledby="network-heading">
        <div className={styles.networkCopy}>
          <p className={styles.kickerDark}>Captured with KLKT</p>
          <h2 id="network-heading">Our capture network, your protocol.</h2>
          <p>
            You define the tasks, environments and labels. People record the work hands-free on the
            KLKT app and are paid in US dollars for every accepted hour.
          </p>
          <a href="https://klkt.app">
            Explore KLKT <span aria-hidden="true">→</span>
          </a>
        </div>
        <img src="/art/klkt-phone.webp" alt="The KLKT app on a phone, recording from the worker's point of view" />
      </section>

      <section className={styles.section} id="samples" aria-labelledby="samples-heading">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.kicker}>Data samples</p>
            <h2 id="samples-heading">Check our data samples.</h2>
          </div>
          <a className={styles.link} href={`/data-hub?category=${encodeURIComponent(vertical.hubCategory)}`}>
            Browse the Data Hub <span aria-hidden="true">→</span>
          </a>
        </div>
        <ul className={styles.samples}>
          {vertical.samples.map((sample) => (
            <li key={sample.src}>
              <a href={`/data-hub?category=${encodeURIComponent(vertical.hubCategory)}`}>
                <span className={styles.sampleMedia}>
                  <img src={sample.src} alt="" />
                  <em>{sample.tag}</em>
                </span>
                <strong>{sample.label}</strong>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="types-heading">
        <p className={styles.kicker}>Supported data types</p>
        <h2 id="types-heading">What we capture and label.</h2>
        <ul className={styles.types}>
          {vertical.dataTypes.map((type) => (
            <li key={type}>{type}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="proof-heading">
        <p className={styles.kicker}>Proven in production</p>
        <h2 id="proof-heading">The standard every hour is held to.</h2>
        <dl className={styles.proof}>
          {proof.map((item) => (
            <div key={item.value}>
              <dt>{item.value}</dt>
              <dd>{item.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="more-heading">
        <h2 id="more-heading" className={styles.small}>
          Other physical AI verticals
        </h2>
        <ul className={styles.others}>
          {others.map((item) => (
            <li key={item.slug}>
              <a href={`/physical-ai/${item.slug}`}>
                {item.name} <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Faq items={faqs.physicalAi} topic={topic} />

      <CtaBand
        id="vertical-cta"
        title={`Bring real-world data to your ${vertical.name.toLowerCase()} work.`}
        body="Tell us what your robot needs to learn. We will scope the environments, tasks and labels with you."
        primary={{ label: "Book a demo", href: contact }}
        secondary={{ label: "Speak to an expert", href: `${contact}&about=Expert%20session` }}
      />

      <SiteClose hideBand />
    </main>
  );
}
