import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { ContactForm } from "./ContactForm";
import styles from "./contact.module.css";

export function ContactPage() {
  return (
    <main className={styles.page}>
      <SiteNav />
      <section className={styles.stage} aria-labelledby="contact-heading">
        <div className={styles.row}>
          <article className={styles.intro}>
            <div className={styles.introCopy}>
              <h1 id="contact-heading">Let’s talk.</h1>
              <p>Tell us about your project, data needs or partnership idea.</p>
            </div>
            <div className={styles.emails}>
              <div>
                <h2>Sales</h2>
                <a href="mailto:support@cntxt.tech">support@cntxt.tech</a>
              </div>
              <div>
                <h2>Partnerships</h2>
                <a href="mailto:partnerships@cntxt.tech">partnerships@cntxt.tech</a>
              </div>
            </div>
            <div className={styles.people}>
              <img src="/contact/people.png" alt="" />
            </div>
          </article>
          <ContactForm />
        </div>
      </section>
      <SiteClose current="Contact" packHref="/security#procurement" />
    </main>
  );
}
