import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { PartnerForm } from "./PartnerForm";
import { WaysToPartner } from "./WaysToPartner";
import styles from "./partner.module.css";
import { LogoWall } from "../shared/LogoWall";
import { faqs } from "../shared/faqs";
import { Faq } from "../shared/Faq";

const ecosystem = [
  {
    label: "Technology",
    text: "Oracle, NVIDIA and AWS. CNTXT is a member of the NVIDIA Inception programme.",
  },
  {
    label: "Research and ecosystem",
    text: "Technology Innovation Institute (TII), AI71, Beam and Middlesex University Dubai.",
  },
  {
    label: "Investors",
    text: "AI71 and BlueFive Capital co-led our $60M Series A in June 2026.",
  },
];

const lookFor = [
  {
    label: "Technology and delivery",
    text: "Infrastructure or delivery teams that let customers run AI on-premise, hybrid or in region.",
  },
  {
    label: "Data",
    text: "Access to real work that can be recorded and labelled, with the consent of the people doing it.",
  },
  {
    label: "Research",
    text: "Groups working on Arabic speech, AI evaluation or physical AI.",
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

export function PartnerPage() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero} aria-labelledby="partner-heading">
        <div className={styles.heroCopy}>
          <div>
            <Eyebrow>Partnerships</Eyebrow>
            <h1 id="partner-heading">Partner with CNTXT.</h1>
            <p>
              We work with technology, delivery, data and research partners
              to capture real-world data and deploy AI where it is needed.
            </p>
          </div>
          <a className={styles.cta} href="#apply">
            Become a partner
            <span>
              <img src="/partners/caret-right.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <img className={styles.heroArt} src="/partners/hero.webp" alt="" />
      </section>

      <WaysToPartner />

      <LogoWall headingId="logos-heading" title="Partners & investors" />

      <section className={styles.compare}>
        <article>
          <Eyebrow>Who we work with</Eyebrow>
          <h2>
            Technology, research
            <br />
            and investment partners.
          </h2>
          <div className={styles.mutedPanel}>
            <ul>
              {ecosystem.map((item) => (
                <li key={item.label}>
                  <img src="/partners/mark-check.svg" alt="" width={11} height={9} />
                  <span>
                    <small>{item.label}</small>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </article>
        <article>
          <Eyebrow>What we look for</Eyebrow>
          <h2>
            Partners who work
            <br />
            close to real data.
          </h2>
          <div className={styles.colorPanel}>
            <ul>
              {lookFor.map((item) => (
                <li key={item.label}>
                  <img src="/partners/mark-check.svg" alt="" width={11} height={9} />
                  <span>
                    <small>{item.label}</small>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <Faq items={faqs.partners} topic="Partnerships" />

      <section className={styles.apply} id="apply" aria-labelledby="apply-heading">
        <article className={styles.applyIntro}>
          <div>
            <h2 id="apply-heading">Partner with us</h2>
            <p>Tell us what you do, where you operate and how you would like to work together.</p>
          </div>
          <div className={styles.email}>
            <h3>Partnerships</h3>
            <a href="mailto:sales@cntxt.tech">sales@cntxt.tech</a>
          </div>
          <div className={styles.people}>
            <img src="/partners/people.webp" alt="" />
          </div>
        </article>
        <PartnerForm />
      </section>

      <section className={styles.band} aria-labelledby="band-heading">
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-left.webp" alt="" />
        </div>
        <div className={styles.bandCopy}>
          <h2 id="band-heading">Partner with us</h2>
          <p>
            Tell us what you build and where you operate. We will reply to
            the address you give us.
          </p>
          <a className={styles.bandButton} href="#apply">
            Become a partner
            <span>
              <img src="/partners/caret-right.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-right.webp" alt="" />
        </div>
      </section>

      <SiteClose current="Partnerships" hideBand />
    </main>
  );
}
