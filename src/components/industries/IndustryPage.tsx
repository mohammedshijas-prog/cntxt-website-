import { IconChip } from "../shared/graphics";
import { SiteClose } from "../site/SiteClose";
import { CtaBand } from "../shared/CtaBand";
import { PageHero } from "../shared/PageHero";
import { SiteNav } from "../site/SiteNav";
import type { Industry } from "./industries";
import { industries } from "./industries";
import styles from "./industryPage.module.css";
import { industryFaqs } from "../shared/faqs";
import { IndustryDemo } from "./IndustryDemo";
import { Faq } from "../shared/Faq";
import { PhysicalAccordion } from "../home/PhysicalAccordion";

const marks = [
  { name: "SOC 2 Type II", src: "/brand/certs/soc2.svg" },
  { name: "ISO 27001", src: "/brand/certs/iso-27001.svg" },
  { name: "GDPR", src: "/brand/certs/gdpr.svg" },
];

const deploy = ["On-premises", "Private cloud (VPC)", "GCC cloud"];


/**
 * One industry, told as a sale: the outcome up front, the pain the team
 * lives with today against what we build, the numbers, the proof, how a
 * project runs, and where the data stays.
 */
export function IndustryPage({ industry }: { industry: Industry }) {
  const contact = `/contact?${new URLSearchParams({ topic: industry.topic, about: industry.name })}`;
  const others = industries.filter((item) => item.slug !== industry.slug);
  const lead = industry.results[0];
  const caseValues = new Set(industry.study.stats.map((stat) => stat.value));
  const showResults = industry.results.some((result) => !caseValues.has(result.value));
  // One row per fix, with every problem it solves beside it.
  const groups: { fix: Industry["solutions"][number]; problems: string[] }[] = [];
  industry.problems.forEach((problem, index) => {
    const fix = industry.solutions[industry.fixes[index] ?? 0];
    const group = groups.find((item) => item.fix === fix);
    if (group) group.problems.push(problem);
    else groups.push({ fix, problems: [problem] });
  });

  return (
    <main className={styles.page}>
      <SiteNav current="solutions" />

      <PageHero
        id="industry-heading"
        kicker={industry.eyebrow}
        title={industry.title}
        lead={industry.lead}
        actions={[
          { label: "Book a demo", href: contact, primary: true },
          { label: "See the results", href: "#results-heading" },
        ]}
        art={
          <div className={styles.heroPhoto}>
            <img fetchPriority="high" decoding="async" src={industry.image} alt="" />
            <div className={styles.heroChip}>
              <strong>{lead.value}</strong>
              <span>{lead.label}</span>
            </div>
            <ul className={styles.heroTags} aria-label="What we build">
              {industry.solutions.slice(0, 3).map((item) => (
                <li key={item.title}>
                  <i aria-hidden="true" />
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        }
      />

      {/* What goes wrong today, and what we do about it, one row per problem. */}
      <section className={styles.fixSection} aria-labelledby="can-heading">
        <header className={styles.fixHead}>
          <div>
            <p className={styles.kicker}>What we do</p>
            <h2 id="can-heading">What CNTXT can do for {industry.name.toLowerCase()}.</h2>
          </div>
        </header>
        <div className={styles.table} role="table" aria-label={`Problems and how CNTXT fixes them in ${industry.name.toLowerCase()}`}>
          <div className={styles.tableHead} role="row">
            <span role="columnheader">What goes wrong today</span>
            <span role="columnheader">What we do about it</span>
          </div>
          {groups.map(({ fix, problems }) => (
            <div key={fix.title} className={styles.row} role="row">
              <ul role="cell" className={styles.problem}>
                {problems.map((problem) => (
                  <li key={problem}>{problem}</li>
                ))}
              </ul>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
              <div role="cell" className={styles.fix}>
                <IconChip name={fix.icon} />
                <span>
                  <strong>{fix.title}</strong>
                  {fix.body}
                </span>
              </div>
            </div>
          ))}
        </div>

      </section>

      <IndustryDemo slug={industry.slug} />

      {/* The numbers, big, unless the case below already shows the same ones. */}
      {showResults ? (
      <section className={styles.results} aria-labelledby="results-heading">
        <header className={styles.head}>
          <p className={styles.kicker}>Results</p>
          <h2 id="results-heading">What {industry.name.toLowerCase()} teams get.</h2>
        </header>
        <dl>
          {industry.results.map((result) => (
            <div key={result.label} data-tilt>
              <dt>{result.value}</dt>
              <dd>{result.label}</dd>
            </div>
          ))}
        </dl>
      </section>
      ) : null}

      {/* Proof: the published case, told as one line from challenge to result. */}
      <section className={styles.story} aria-labelledby="study-heading">
        <div className={styles.storyCard}>
        <header className={styles.storyHead}>
          <p className={styles.kicker}>Published case · {industry.study.sector}</p>
          <h2 id="study-heading">{industry.study.title}</h2>
        </header>
        <ol className={styles.storyLine}>
          <li>
            <span className={styles.storyStep}>01 · The challenge</span>
            <p>{industry.study.challenge}</p>
          </li>
          <li>
            <span className={styles.storyStep}>02 · What we did</span>
            <p>{industry.study.solution}</p>
          </li>
          <li className={styles.storyResult}>
            <span className={styles.storyStep}>03 · The result</span>
            <dl>
              {industry.study.stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.value}</dt>
                  <dd>{stat.label}</dd>
                </div>
              ))}
            </dl>
          </li>
        </ol>
        {industry.quote ? (
          <figure className={styles.storyQuote}>
            <blockquote>“{industry.quote.text}”</blockquote>
            <figcaption>
              <img loading="lazy" decoding="async" src={industry.quote.photo} alt="" width={40} height={40} />
              <span>
                <strong>{industry.quote.name}</strong> · {industry.quote.role}
              </span>
            </figcaption>
          </figure>
        ) : null}
        </div>
      </section>

      {/* Where the data stays. */}
      <section className={styles.trust} aria-labelledby="trust-heading">
        <div>
          <p className={styles.kicker}>Security and sovereignty</p>
          <h2 id="trust-heading">Your data stays where it has to.</h2>
        </div>
        <div className={styles.trustSide}>
          <ul className={styles.deploy}>
            {deploy.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <ul className={styles.marks}>
            {marks.map((mark) => (
              <li key={mark.name}>
                <img loading="lazy" decoding="async" src={mark.src} alt={mark.name} width={64} height={64} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Faq items={[...(industry.faq ?? []), ...industryFaqs]} topic={industry.topic} />

      <PhysicalAccordion
        title="Other industries we work in"
        body="Open one to see what we build there and the results it has published."
        button={false}
        headingId="more-heading"
        items={[
          ...others.map((item, index) => ({
            name: item.name,
            body: `${item.lead} ${item.results[0].value} ${item.results[0].label.toLowerCase()}.`,
            art: item.image,
            href: `/industries/${item.slug}`,
            tone: (["lilac", "mist", "violet", "pearl"] as const)[index % 4],
            photo: true,
          })),
          {
            name: "Healthcare",
            body: "Data, evaluation and Arabic voice AI for healthcare organisations, hosted in region or deployed on-premises.",
            art: "/healthcare/tile-lab.webp",
            href: "/healthcare",
            tone: "pearl" as const,
            photo: true,
          },
          {
            name: "Robotics",
            body: "First-person data from real work, recorded with consent and labelled for robotics teams.",
            art: "/healthcare/tile-robot.webp",
            href: "/physical-ai/robotics-humanoids",
            tone: "lilac" as const,
            photo: true,
          },
        ]}
      />

      <CtaBand
        id="industry-cta"
        title={`Bring AI to your ${industry.name.toLowerCase()} operations.`}
        body="Tell us what you run today and where the data has to stay. We will show what we would build first."
        primary={{ label: "Book a demo", href: contact }}
        secondary={{ label: "Explore the AI Lab", href: "/products" }}
      />

      <SiteClose current="Enterprises" hideBand />
    </main>
  );
}
