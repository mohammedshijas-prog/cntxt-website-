import { CountUp } from "../shared/CountUp";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import styles from "./about.module.css";

const leaders = [
  {
    src: "/about/leader-1.png",
    name: "Mohammed Abu sheikh",
    role: "Co founder and ceo",
  },
  {
    src: "/about/leader-2.png",
    name: "Mohammed Abu sheikh",
    role: "Co founder",
  },
  {
    src: "/about/leader-3.png",
    name: "Mohammed Abu sheikh",
    role: "Co founder and ceo",
  },
  {
    src: "/about/leader-3.png",
    name: "Mohammed Abu sheikh",
    role: "Co founder and ceo",
  },
];

const logos = [
  { src: "/about/logo-lovable.png", name: "Lovable" },
  { src: "/about/logo-polyai.png", name: "PolyAI" },
  { src: "/about/logo-lovable.png", name: "Lovable" },
  { src: "/about/logo-polyai.png", name: "PolyAI" },
  { src: "/about/logo-lovable.png", name: "Lovable" },
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
            Real-world AI is lacking context.{" "}
            <span>That’s why we created cntxt.</span>
          </h1>
          <p>
            Protecting customer data is our highest priority. Encord was built
            from the ground up with enterprise-grade security,
          </p>
        </div>
        <div className={styles.photo}>
          <img className={styles.texture} src="/about/texture.png" alt="" />
          <div className={styles.mark}>
            <img src="/about/mark.svg" alt="" width={677} height={610} />
          </div>
          <img className={styles.team} src="/about/team.png" alt="The CNTXT team" />
        </div>
      </section>

      <section className={styles.story} aria-labelledby="story-heading">
        <div className={styles.storyCopy}>
          <Eyebrow>Our story</Eyebrow>
          <h2 id="story-heading">
            Retrieval was sufficient while software only read. It stopped being
            sufficient <span>when software began to act.</span>
          </h2>
        </div>
        <div className={styles.storyBody}>
          <p>
            For two decades enterprise systems assumed a person sat at the end
            of the process. Search returned ten results and a human chose
            between them. Tolerance for staleness and unexplained gaps was
            high, because human judgement was doing the work the system did
            not.
          </p>
          <p>
            Software now drafts the email, reallocates the spend and files the
            report. The human reviews an outcome rather than choosing between
            candidates, and usually cannot establish whether it was complete. A
            stale index a person would have caught becomes a decision nobody
            questioned.
          </p>
        </div>
      </section>

      <section className={styles.stats} aria-label="Company figures">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index}>
            <CountUp className={styles.figure} value={250} suffix="+" />
            <p>Data Points Annotated</p>
          </div>
        ))}
      </section>

      <section className={styles.teamSection} aria-labelledby="team-heading">
        <div className={styles.teamCopy}>
          <Eyebrow>Our team</Eyebrow>
          <h2 id="team-heading">Meet our Leadership</h2>
        </div>
        <ul className={styles.leaders}>
          {leaders.map((leader, index) => (
            <li key={`${leader.role}-${index}`}>
              <img src={leader.src} alt="" />
              <div>
                <p>{leader.name}</p>
                <p>{leader.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.investors} aria-labelledby="investors-heading">
        <h2 id="investors-heading">Partners & investors</h2>
        <ul>
          {logos.map((logo, index) => (
            <li key={`${logo.name}-${index}`}>
              <img src={logo.src} alt={logo.name} width={284} height={80} />
            </li>
          ))}
        </ul>
      </section>

      <SiteClose current="About" packHref="/security#procurement" />
    </main>
  );
}
