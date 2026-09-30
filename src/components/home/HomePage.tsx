import { Hero } from "../Hero";
import { BlogRail } from "./BlogRail";
import { CustomerSpotlights } from "./CustomerSpotlights";
import { LogoZoom } from "./LogoZoom";
import { ScrollStory } from "./ScrollStory";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { IndustriesSection } from "../shared/IndustriesSection";
import styles from "./home.module.css";

/** Logo row under the Agents step; names without a logo file show as text. */
const customerLogos: { name: string; logo?: string }[] = [
  { name: "Emirates NBD", logo: "/customers/emirates-nbd.png" },
  { name: "Mashreq", logo: "/customers/mashreq.png" },
  { name: "DP World", logo: "/customers/dp-world.png" },
  { name: "Burjeel" },
  { name: "dnata", logo: "/customers/dnata.png" },
  { name: "noon", logo: "/customers/noon.png" },
];

const proof = [
  {
    label: "Munsit ranks #1 for Arabic speech",
    image: "/proven/munsit.png",
    body: "Top of the Hugging Face Arabic ASR leaderboard. 76K+ hours, 25+ dialects, patent pending.",
    href: "/products",
  },
  {
    label: "One standard in every country",
    image: "/proven/standard.png",
    body: "Review floors in Abu Dhabi and Amman, with California opening in 2026, confirm every accepted hour through three layers. Aligned with ADGM and DIFC.",
    href: "/security",
  },
  {
    label: "Captures the data. Deploys the AI. Closes the loop.",
    image: "/proven/loop.png",
    body: "One company captures real work on signed sites, verifies it in-house, and deploys the AI back on the same floors.",
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
            body: "Text, speech, vision, computer-use and robotics data, captured from real work and confirmed by certified reviewers.",
            stat: (
              <>
                <strong>1000+</strong> data types, one verified pool.
              </>
            ),
            cta: <Explore href="/products">Explore AI Lab</Explore>,
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
            cta: <Explore href="/products">Explore Munsit</Explore>,
          },
          {
            eyebrow: "Agents",
            title: "Agents that work where you work.",
            body: "Agentix puts agents to work across the business. Built without code, deployed on-premise, live in minutes.",
            stat: (
              <>
                <strong>250+</strong> government and enterprise organisations.
              </>
            ),
            cta: <Explore href="/products">Explore Agentix</Explore>,
            extra: (
              <ul className={styles.logoRow} aria-label="Customers">
                {customerLogos.map(({ name, logo }) => (
                  <li key={name}>
                    {logo ? <img src={logo} alt={name} /> : <span>{name}</span>}
                  </li>
                ))}
              </ul>
            ),
          },
        ]}
      />

      <LogoZoom />

      <IndustriesSection />

      <CustomerSpotlights eyebrow={<Eyebrow>Customer spotlights</Eyebrow>} />

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
          <img src="/security/map-left.svg" alt="" />
        </div>
        <div>
          <h2 id="ready-heading">Your site. Your data. Your AI.</h2>
          <p>Book a demo and see how CNTXT builds real-world AI for your organisation.</p>
          <a href="/contact">
            Get started
            <span>
              <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-right.svg" alt="" />
        </div>
      </section>
      <SiteClose hideBand />
    </main>
  );
}
