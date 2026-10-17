import { Hero } from "../Hero";
import { BlogRail } from "./BlogRail";
import { CustomerSpotlights } from "./CustomerSpotlights";
import { LogoZoom } from "./LogoZoom";
import { ScrollStory } from "./ScrollStory";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { IndustriesSection } from "../shared/IndustriesSection";
import { ResultsBand } from "../shared/ResultsBand";
import styles from "./home.module.css";

const proof = [
  {
    label: "Munsit ranks #1 for Arabic speech",
    image: "/proven/munsit.webp",
    body: "Top of the Hugging Face Open Universal Arabic ASR Leaderboard. Trained from 30,000+ hours across 25+ dialects, on a patented architecture.",
    href: "https://munsit.com",
  },
  {
    label: "One standard for every hour",
    image: "/art/standard.svg",
    body: "A person reviews every recorded hour before it is accepted. CNTXT holds SOC 2 Type II and ISO 27001.",
    href: "/security",
  },
  {
    label: "Captures the data. Deploys the AI. Closes the loop.",
    image: "/proven/loop.webp",
    body: "One company captures real work with consent, verifies it with human review, trains models on it and deploys the AI.",
    href: "/about",
  },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className={styles.eyebrow}>
      <span className={styles.tag} aria-hidden="true" />
      {children}
    </p>
  );
}

function Explore({ href, children }: { href: string; children: string }) {
  return (
    <a className={styles.pill} href={href}>
      {children}
      <img src="/home/caret.svg" alt="" width={24} height={24} />
    </a>
  );
}

export function HomePage() {
  return (
    <main className={styles.page}>
      <SiteNav pinAfterHero />
      <Hero />

      <ScrollStory
        steps={[
          {
            eyebrow: "Data",
            title: "Data captured from real work, verified by humans.",
            body: "Text, speech, vision, computer-use and robotics data, captured from real work and checked by human reviewers.",
            stat: (
              <>
                <strong>98%</strong> labelling accuracy, checked by people.
              </>
            ),
            cta: <Explore href="/data-hub">Explore the Data Hub</Explore>,
          },
          {
            eyebrow: "Models",
            title: "Models trained on real work.",
            body: "Munsit, the leading Arabic speech model, plus foundation models for physical AI, trained and tested on our own captured data.",
            stat: (
              <>
                <strong>#1</strong> on the Hugging Face Arabic ASR leaderboard.
                <img className={styles.statLogo} src="/customers/hugging-face.png" alt="Hugging Face" />
              </>
            ),
            cta: <Explore href="https://munsit.com">Explore Munsit</Explore>,
          },
          {
            eyebrow: "Agents",
            title: "Agents that work where you work.",
            body: "Agentix runs Arabic voice and chat agents on one platform, with workflow automation and GCC telephony, in the cloud or on-premises.",
            stat: (
              <>
                <strong>20+</strong> enterprise deployments.
              </>
            ),
            cta: <Explore href="/agentix">Explore Agentix</Explore>,
          },
        ]}
      />

      <LogoZoom />

      <IndustriesSection />

      <CustomerSpotlights eyebrow={<Eyebrow>Customer spotlights</Eyebrow>} />

      <ResultsBand />

      <section className={styles.proven} aria-labelledby="proven-heading">
        <h2 id="proven-heading">Proven on the floor, in every industry.</h2>
        <ul>
          {proof.map((item) => (
            <li key={item.label}>
              <a href={item.href}>
                <span className={styles.provenMedia}>
                  <img src={item.image} alt="" />
                </span>
                <span className={styles.provenText}>
                  <h3>{item.label}</h3>
                  <p>{item.body}</p>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <BlogRail
        eyebrow={<Eyebrow>Latest</Eyebrow>}
        title={
          <>
            From the floor to the real world.{" "}
            <br />
            The latest from CNTXT.
          </>
        }
      />

      <section className={styles.band} aria-labelledby="ready-heading">
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-left.webp" alt="" />
        </div>
        <div>
          <h2 id="ready-heading">Your site. Your data. Your AI.</h2>
          <p>Book a demo and see how CNTXT builds real-world AI for your organisation.</p>
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
      <SiteClose hideBand />
    </main>
  );
}
