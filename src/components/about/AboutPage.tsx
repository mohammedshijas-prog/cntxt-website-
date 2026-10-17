import { CountUp } from "../shared/CountUp";
import { LogoWall } from "../shared/LogoWall";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import styles from "./about.module.css";
import { CtaBand } from "../shared/CtaBand";

// Portraits are the ones published on cntxt.tech. `avatar` is a small round
// photo for people we only have a thumbnail of.
const leaders: { src?: string; avatar?: string; position?: string; name: string; role: string }[] = [
  { src: "/brand/people/mohammad-abu-sheikh.webp", position: "62% top", name: "Mohammad Abu Sheikh", role: "Co-Founder & CEO" },
  { src: "/brand/people/hassan-abu-sheikh.webp", name: "Hassan Abu Sheikh", role: "Co-Founder" },
  { avatar: "/brand/people/muhammed-shabreen.webp", name: "Muhammed Shabreen", role: "CTO" },
  { name: "Khalid Ghiboub", role: "VP of AI Models" },
  { src: "/brand/people/shameed-sait.webp", name: "Shameed Sait", role: "Director of AI & Engineering" },
  { src: "/brand/people/rym-bachouche.webp", name: "Rym Bachouche", role: "VP of Marketing" },
  { src: "/brand/people/lathan-jacobs.webp", name: "Lathan Jacobs", role: "VP Operations & Commercial" },
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

      <section className={styles.hero} aria-labelledby="about-heading">
        <div className={styles.heroCopy}>
          <Eyebrow>Why CNTXT</Eyebrow>
          <h1 id="about-heading">
            AI projects fail on data, not on models.{" "}
            <span>That is why we built CNTXT.</span>
          </h1>
          <p>
            CNTXT AI is a data and AI company headquartered in Abu Dhabi. We
            help organisations build and run AI while keeping full control of
            their data.
          </p>
        </div>
        <div className={styles.photo}>
          <img className={styles.texture} src="/about/texture.webp" alt="" />
          <div className={styles.mark}>
            <img src="/about/mark.svg" alt="" width={677} height={610} />
          </div>
          <img className={styles.team} src="/about/team.webp" alt="The CNTXT team" />
        </div>
      </section>

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
            Brothers Mohammad and Hassan Abu Sheikh founded CNTXT on one
            observation: AI projects fail on messy data, not on models. Today
            we capture and verify data from real work, train models on it,
            such as Munsit for Arabic speech, and deploy AI on-premise so
            organisations keep sovereign control of their data.
          </p>
          <p>
            Munsit ranks #1 on the Hugging Face Open Universal Arabic ASR
            Leaderboard. In June 2026 we acquired Actualize, which builds
            Arabic voice agents, and raised a $60M Series A co-led by AI71 and
            BlueFive Capital. More than 250 enterprise and government
            organisations have worked with us.
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
            <li key={`${leader.role}-${index}`}>
              {leader.src ? (
                <img src={leader.src} alt={leader.name} style={{ objectPosition: leader.position }} />
              ) : (
                <span className={styles.monogram} aria-hidden="true">
                  {leader.avatar ? (
                    <img src={leader.avatar} alt="" />
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

      <LogoWall headingId="investors-heading" title="Partners & investors" />

      <CtaBand
        id="about-cta"
        title="Build with the team behind Munsit and Agentix."
        body="Tell us what you are working on. We will show you how data, models and agents would fit."
        secondary={{ label: "Meet the stack", href: "/products" }}
      />

      <SiteClose current="About" hideBand />
    </main>
  );
}
