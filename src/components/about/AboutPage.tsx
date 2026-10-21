import { CountUp } from "../shared/CountUp";
import { LogoWall } from "../shared/LogoWall";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import styles from "./about.module.css";
import { CtaBand } from "../shared/CtaBand";
import { Faq } from "../shared/Faq";
import { faqs } from "../shared/faqs";
import glance from "../shared/glance.module.css";

/* CNTXT at a glance, from docs/content-brief.md: plain facts answer engines can quote. */
const facts = [
  { label: "Headquarters", body: "Abu Dhabi, United Arab Emirates." },
  { label: "What we do", body: "Capture and verify data from real work, train models on it, and deploy Arabic-first AI on-premises, hybrid or in the cloud." },
  { label: "Products", body: "Munsit for Arabic speech, Agentix for voice and chat agents, and KLKT for recording real work with consent." },
  { label: "Reach", body: "250+ enterprise and government organisations served, and 30M+ data points annotated." },
  { label: "Funding", body: "A $60M Series A in June 2026, co-led by AI71 and BlueFive Capital." },
  { label: "Founders", body: "Mohammad Abu Sheikh, Co-Founder and CEO, and Hassan Abu Sheikh, Co-Founder." },
];
import { PageHero } from "../shared/PageHero";

// Portraits are the ones published on cntxt.tech. `avatar` is a small round
// photo for people we only have a thumbnail of.
const leaders: { src?: string; avatar?: string; position?: string; name: string; role: string }[] = [
  { src: "/brand/people/mohammad-abu-sheikh.webp", position: "62% top", name: "Mohammad Abu Sheikh", role: "Co-Founder & CEO" },
  { src: "/brand/people/hassan-abu-sheikh.webp", name: "Hassan Abu Sheikh", role: "Co-Founder" },
  { avatar: "/brand/people/muhammed-shabreen.webp", name: "Muhammed Shabreen", role: "CTO" },
  { name: "Khalid Ghiboub", role: "VP of AI Models" },
  { src: "/brand/people/shameed-sait.webp", name: "Shameed Sait", role: "Director of AI & Engineering" },
  { src: "/brand/people/rym-bachouche.webp", name: "Rym Bachouche", role: "VP of Marketing" },
];

const stats = [
  { value: 250, suffix: "+", label: "Organisations served" },
  { value: 30, suffix: "M+", label: "Data points annotated" },
  { value: 25, suffix: "+", label: "Arabic dialects" },
  { value: 98, suffix: "%", label: "Labelling accuracy" },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className={styles.eyebrow}>
      <span className={styles.tag} aria-hidden="true" />
      {children}
    </p>
  );
}

export function AboutPage() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <PageHero
        id="about-heading"
        kicker="Why CNTXT"
        title={["AI projects fail on data,", "not on models."]}
        lead="That is why we built CNTXT. CNTXT AI is a data and AI company headquartered in Abu Dhabi. We help organisations build and run AI while keeping full control of their data."
        actions={[
          { label: "Book a demo", href: "/contact", primary: true },
          { label: "Join the team", href: "/careers" },
        ]}
        art={<img className={styles.heroTeam} src="/about/team.webp" alt="The CNTXT team" />}
      />

      <section className={styles.story} aria-labelledby="story-heading">
        <div className={styles.storyCopy}>
          <Eyebrow>Our story</Eyebrow>
          <h2 id="story-heading">
            Data ≥ AI. Fix the data foundation first,{" "}
            <span>then build the model.</span>
          </h2>
        </div>
        <div className={styles.storyBody}>
          <p>
            Founded by Mohammad and Hassan Abu Sheikh. Today we capture and verify data from real work,
            train models like Munsit on it, and deploy AI on-premise.
          </p>
          <p>
            In June 2026 we acquired Actualize and raised a $60M Series A, co-led by AI71 and BlueFive
            Capital.
          </p>
        </div>
      </section>

      <section className={styles.stats} aria-label="Company figures">
        {stats.map((stat) => (
          <div key={stat.label}>
            <CountUp className={styles.figure} value={stat.value} suffix={stat.suffix} />
            <p>{stat.label}</p>
          </div>
        ))}
      </section>

      <section className={styles.teamSection} aria-labelledby="team-heading">
        <div className={styles.teamCopy}>
          <Eyebrow>Our team</Eyebrow>
          <h2 id="team-heading">Meet our leadership</h2>
        </div>
        <ul className={styles.leaders}>
          {leaders.map((leader, index) => (
            <li key={`${leader.role}-${index}`} data-tilt>
              {leader.src ? (
                <img loading="lazy" decoding="async" src={leader.src} alt={leader.name} style={{ objectPosition: leader.position }} />
              ) : (
                <span className={styles.monogram} aria-hidden="true">
                  {leader.avatar ? (
                    <img loading="lazy" decoding="async" src={leader.avatar} alt="" />
                  ) : (
                    leader.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                  )}
                </span>
              )}
              <div>
                <p>{leader.name}</p>
                <p>{leader.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={glance.glance} aria-labelledby="glance-heading">
        <header className={glance.head}>
          <p>At a glance</p>
          <h2 id="glance-heading">CNTXT AI in six facts.</h2>
        </header>
        <ul className={glance.list}>
          {facts.map((fact) => (
            <li key={fact.label}>
              <strong>{fact.label}</strong>
              <span>{fact.body}</span>
            </li>
          ))}
        </ul>
      </section>

      <LogoWall headingId="investors-heading" title="Partners & investors" />

      <Faq items={faqs.about} title="Questions people ask about CNTXT" />

      <CtaBand
        id="about-cta"
        title="Build with the team behind Munsit and Agentix."
        body="Tell us what you are working on. We will show you how data, models and agents would fit."
        secondary={{ label: "Explore the AI Lab", href: "/products" }}
      />

      <SiteClose current="About" hideBand />
    </main>
  );
}
