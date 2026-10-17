import { Suspense } from "react";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { ContactForm } from "./ContactForm";
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
              <img src="/contact/people.webp" alt="" />
            </div>
          </article>
          <Suspense fallback={null}>
            <ContactForm />
          </Suspense>
        </div>
      </section>
      <ProofBar />

      <div style={{ height: 96 }} />

      <SiteClose current="Contact" packHref="/security#procurement" />
    </main>
  );
}
