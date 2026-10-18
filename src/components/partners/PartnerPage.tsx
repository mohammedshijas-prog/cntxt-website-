import { SiteClose } from "../site/SiteClose";
import { PageHero } from "../shared/PageHero";
import { SiteNav } from "../site/SiteNav";
import { HubspotForm } from "../shared/HubspotForm";
import { WaysToPartner } from "./WaysToPartner";
import styles from "./partner.module.css";
import { partners } from "../shared/LogoWall";
import { faqs } from "../shared/faqs";
import { Faq } from "../shared/Faq";

const ecosystem = [
  {
    label: "Technology",
    text: "Oracle, NVIDIA and AWS.",
  },
  {
    label: "Research and ecosystem",
    text: "Technology Innovation Institute (TII), AI71, Beam and Middlesex University Dubai.",
  },
  {
    label: "Investors",
    text: "AI71 and BlueFive Capital, $60M Series A.",
  },
];

const lookFor = [
  {
    label: "Technology and delivery",
    text: "Teams that run AI on-premise or in region.",
  },
  {
    label: "Data",
    text: "Real work that can be recorded with consent.",
  },
  {
    label: "Research",
    text: "Arabic speech, evaluation or physical AI.",
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

      <PageHero
        id="partner-heading"
        kicker="Partnerships"
        title={["Partner", "with CNTXT."]}
        lead="We work with technology, delivery, data and research partners to capture real-world data and deploy AI where it is needed."
        actions={[
          { label: "Become a partner", href: "#apply", primary: true },
          { label: "Ways to partner", href: "#ways-heading" },
        ]}
        art={
          <ul className={styles.heroLogos} aria-label="Partners and investors">
            {partners.map((partner) => (
              <li key={partner.name}>
                <img loading="lazy" decoding="async" src={`/brand/partners/${partner.logo}`} alt={partner.name} style={{ width: partner.width * 0.75 }} />
                <span>{partner.role}</span>
              </li>
            ))}
          </ul>
        }
      />

      <WaysToPartner />

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
                  <img loading="lazy" decoding="async" src="/partners/mark-check.svg" alt="" width={11} height={9} />
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
                  <img loading="lazy" decoding="async" src="/partners/mark-check.svg" alt="" width={11} height={9} />
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

      <Faq items={faqs.partners} topic="Partnerships" title="Questions partners ask" />

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
            <img loading="lazy" decoding="async" src="/partners/people.webp" alt="" />
          </div>
        </article>
        {/* HubSpot "Partnership" form. */}
        <div className={styles.formCard}>
          <div className={styles.hubspot}>
            <HubspotForm embed="frame" formId="408bde05-db95-4bfd-96ce-7c93e19fd9b7" />
          </div>
        </div>
      </section>

      <SiteClose current="Partnerships" hideBand />
    </main>
  );
}
