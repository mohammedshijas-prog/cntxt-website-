import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { HubspotForm } from "../shared/HubspotForm";
import styles from "./contact.module.css";
import { ProofBar } from "../shared/ProofBar";
import { Faq } from "../shared/Faq";
import { faqs } from "../shared/faqs";
import glance from "../shared/glance.module.css";

/* Which team handles what, so each enquiry lands in the right place. */
const routes = [
  { team: "Sales and demos", body: "Projects, pricing conversations and product demos.", link: { label: "sales@cntxt.tech", href: "mailto:sales@cntxt.tech" } },
  { team: "Data services", body: "Data collection, labelling, evaluation and physical-AI data.", link: { label: "Scope a data project", href: "/data-services" } },
  { team: "Data catalogue", body: "Ready-made datasets you can request as they are.", link: { label: "Browse the catalogue", href: "/data-hub" } },
  { team: "Partnerships", body: "Technology, delivery, data and research partners.", link: { label: "Become a partner", href: "/partners" } },
  { team: "Careers", body: "Open roles at CNTXT, each with its own application.", link: { label: "See open roles", href: "/careers" } },
  { team: "KLKT contributors", body: "Help with tasks, submissions and payments on KLKT.", link: { label: "support@klkt.ai", href: "mailto:support@klkt.ai" } },
];

export function ContactPage() {
  return (
    <main className={styles.page}>
      <SiteNav />
      <section className={styles.stage} aria-labelledby="contact-heading">
        <div className={styles.row}>
          <article className={styles.intro}>
            <div className={styles.introCopy}>
              <h1 id="contact-heading">Let’s talk.</h1>
              <p>Tell us about your project, your data needs or the AI you want to deploy. We will reply by email.</p>
            </div>
            <div className={styles.emails}>
              <div>
                <h2>Sales</h2>
                <a href="mailto:sales@cntxt.tech">sales@cntxt.tech</a>
              </div>
              <div>
                <h2>Support</h2>
                <a href="mailto:support@cntxt.tech">support@cntxt.tech</a>
              </div>
            </div>
            <div className={styles.people}>
              <img loading="lazy" decoding="async" src="/contact/people.webp" alt="" />
            </div>
          </article>
          {/* HubSpot "Contact us" form. GTM listens for its submission (Google Ads conversion). */}
          <div className={styles.formCard}>
            <div className={styles.hubspot}>
              <HubspotForm embed="v2" formId="3b23fdbe-4f21-46d6-b9de-ba525c033f35" />
            </div>
          </div>
        </div>
      </section>
      <ProofBar />

      <section className={glance.glance} aria-labelledby="routes-heading">
        <header className={glance.head}>
          <p>Which team to contact</p>
          <h2 id="routes-heading">Every enquiry goes to the people who handle it.</h2>
        </header>
        <ul className={glance.list}>
          {routes.map((route) => (
            <li key={route.team}>
              <strong>{route.team}</strong>
              <span>{route.body}</span>
              <a href={route.link.href}>
                {route.link.label} <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Faq items={faqs.contact} title="Questions people ask before they write" />

      <SiteClose current="Contact" hideBand />
    </main>
  );
}
