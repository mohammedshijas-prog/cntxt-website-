import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { HubspotForm } from "../shared/HubspotForm";
import styles from "./contact.module.css";
import { ProofBar } from "../shared/ProofBar";

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

      <SiteClose current="Contact" hideBand />
    </main>
  );
}
