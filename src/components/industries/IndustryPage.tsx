import Link from "next/link";
import { IconChip } from "../shared/graphics";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import type { Industry } from "./industries";
import { industries } from "./industries";
import styles from "./industry.module.css";
import { industryFaqs } from "../shared/faqs";
import { Faq } from "../shared/Faq";

const marks = [
  { name: "SOC 2 Type II", src: "/brand/certs/soc2.svg" },
  { name: "ISO 27001", src: "/brand/certs/iso-27001.svg" },
  { name: "GDPR", src: "/brand/certs/gdpr.svg" },
  { name: "HIPAA", src: "/brand/certs/hipaa.svg" },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className={styles.eyebrow}>
      <span className={styles.tag} aria-hidden="true" />
      {children}
    </p>
  );
}

/** One industry: the pitch, the numbers, the problems, what we build, and a published case. */
export function IndustryPage({ industry }: { industry: Industry }) {
  const contact = `/contact?${new URLSearchParams({ topic: industry.topic, about: industry.name })}`;
  const others = industries.filter((item) => item.slug !== industry.slug);

  return (
    <main className={styles.page}>
      <SiteNav current="solutions" />

      <section className={styles.hero} aria-labelledby="industry-heading">
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}>{industry.eyebrow}</p>
          <h1 id="industry-heading">{industry.title}</h1>
          <p>{industry.lead}</p>
          <a className={styles.primary} href={contact}>
            Book a demo
            <img src="/home/caret.svg" alt="" width={24} height={24} />
          </a>
        </div>
        <dl className={styles.results}>
          {industry.results.map((result) => (
            <div key={result.label}>
              <dt>{result.value}</dt>
              <dd>{result.label}</dd>
            </div>
          ))}
        </dl>
      </section>


      <section className={styles.problems} aria-labelledby="problems-heading">
        <div>
          <Eyebrow>The problem</Eyebrow>
          <h2 id="problems-heading">{industry.problemsTitle}</h2>
        </div>
        <ol>
          {industry.problems.map((problem, index) => (
            <li key={problem}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {problem}
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.solutions} aria-labelledby="solutions-heading">
        <Eyebrow>What we build</Eyebrow>
        <h2 id="solutions-heading">{industry.solutionsTitle}</h2>
        <ul>
          {industry.solutions.map((item) => (
            <li key={item.title}>
              <IconChip name={item.icon} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.study} aria-labelledby="study-heading">
        <div className={styles.studyCopy}>
          <p className={styles.studyEyebrow}>Published case · {industry.study.sector}</p>
          <h2 id="study-heading">{industry.study.title}</h2>
          <dl>
            <div>
              <dt>The challenge</dt>
              <dd>{industry.study.challenge}</dd>
            </div>
            <div>
              <dt>What we did</dt>
              <dd>{industry.study.solution}</dd>
            </div>
          </dl>
          <p className={styles.note}>The client is not named in the published case.</p>
        </div>
        <ul className={styles.studyStats}>
          {industry.study.stats.map((stat) => (
            <li key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.trust} aria-labelledby="trust-heading">
        <div>
          <Eyebrow>Security and sovereignty</Eyebrow>
          <h2 id="trust-heading">Deployed where your data has to stay.</h2>
          <p>
            On-premises, hybrid or in the cloud, with hosting and processing kept in region. Our
            controls are published in the{" "}
            <a href="https://cntxt.trust.site">trust centre</a>.
          </p>
          <ul className={styles.marks}>
            {marks
              .filter((mark) => mark.name !== "HIPAA" || industry.slug === "healthcare")
              .map((mark) => (
              <li key={mark.name}>
                <img src={mark.src} alt={mark.name} width={72} height={72} />
              </li>
            ))}
          </ul>
        </div>
        {industry.quote ? (
          <figure>
            <blockquote>“{industry.quote.text}”</blockquote>
            <figcaption>
              <img src={industry.quote.photo} alt="" width={56} height={56} />
              <span>
                <strong>{industry.quote.name}</strong>
                {industry.quote.role}
              </span>
            </figcaption>
          </figure>
        ) : null}
      </section>

      <Faq items={[...(industry.faq ?? []), ...industryFaqs]} topic={industry.topic} />

      <section className={styles.more} aria-labelledby="more-heading">
        <h2 id="more-heading">Other industries</h2>
        <ul>
          {others.map((item) => (
            <li key={item.slug}>
              <a href={`/industries/${item.slug}`}>
                {item.name} <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
          <li>
            <a href="/healthcare">
              Healthcare <span aria-hidden="true">→</span>
            </a>
          </li>
          <li>
            <Link href="/physical-ai/robotics-humanoids">
              Robotics <span aria-hidden="true">→</span>
            </Link>
          </li>
        </ul>
      </section>

      <section className={styles.band} aria-labelledby="industry-cta">
        <h2 id="industry-cta">Bring AI to your {industry.name.toLowerCase()} operations.</h2>
        <p>Tell us what you run today and where the data has to stay.</p>
        <a className={styles.primary} href={contact}>
          Book a demo
          <img src="/home/caret.svg" alt="" width={24} height={24} />
        </a>
      </section>

      <SiteClose current="Enterprises" hideBand />
    </main>
  );
}
