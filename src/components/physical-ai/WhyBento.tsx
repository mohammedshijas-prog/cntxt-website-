import styles from "./whyBento.module.css";

/* Every claim here is from docs/content-brief.md (Physical AI, KLKT, trust centre). */
const flow = ["Capture", "Verify", "Label", "Train", "Deploy"];
const languages = [
  { name: "العربية", lang: "ar" },
  { name: "English", lang: "en" },
  { name: "Filipino", lang: "fil" },
  { name: "اردو", lang: "ur" },
];
const marks = [
  { name: "SOC 2 Type II", src: "/brand/certs/soc2.svg" },
  { name: "ISO 27001", src: "/brand/certs/iso-27001.svg" },
  { name: "GDPR", src: "/brand/certs/gdpr.svg" },
  { name: "HIPAA", src: "/brand/certs/hipaa.svg" },
];

/** Why teams work with CNTXT, as a bento: every reason carries its own small visual. */
export function WhyBento() {
  return (
    <section className={styles.section} aria-labelledby="reasons-heading">
      <header className={styles.head}>
        <p className={styles.kicker}>Why CNTXT</p>
        <h2 id="reasons-heading">Why robotics teams work with us.</h2>
      </header>

      <ul className={styles.grid}>
        <li className={`${styles.tile} ${styles.wide}`} data-tilt>
          <div className={styles.copy}>
            <h3>One company, end to end</h3>
            <p>Capture, verify, train and deploy, under one roof.</p>
          </div>
          <ol className={styles.flow} aria-label="Our pipeline">
            {flow.map((step, index) => (
              <li key={step} style={{ animationDelay: `${index * 0.6}s` }}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
        </li>

        <li className={`${styles.tile} ${styles.ink}`} data-tilt>
          <div className={styles.meter} aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" className={styles.meterTrack} />
              <circle cx="60" cy="60" r="50" className={styles.meterFill} />
            </svg>
            <strong>100%</strong>
          </div>
          <div className={styles.copy}>
            <h3>Human review on every hour</h3>
            <p>A person accepts every hour.</p>
          </div>
        </li>

        <li className={styles.tile} data-tilt>
          <ul className={styles.langs} aria-label="Consent languages">
            {languages.map((item) => (
              <li key={item.name} lang={item.lang}>
                {item.name}
              </li>
            ))}
          </ul>
          <div className={styles.copy}>
            <h3>Consent in four languages</h3>
            <p>Agreed before anything is recorded.</p>
          </div>
        </li>

        <li className={styles.tile} data-tilt>
          <div className={styles.ticket} aria-hidden="true">
            <span>Accepted hour</span>
            <strong>Paid in USD</strong>
            <em>No fees</em>
          </div>
          <div className={styles.copy}>
            <h3>Fair pay for contributors</h3>
            <p>Paid in USD per accepted hour.</p>
          </div>
        </li>

        <li className={styles.tile} data-tilt>
          <div className={styles.region} aria-hidden="true">
            <span className={styles.ring} />
            <span className={`${styles.ring} ${styles.ring2}`} />
            <span className={styles.pin}>In region</span>
          </div>
          <div className={styles.copy}>
            <h3>In-region when you need it</h3>
            <p>Hosted and processed in region.</p>
          </div>
        </li>

        <li className={`${styles.tile} ${styles.full}`} data-tilt>
          <div className={styles.copy}>
            <h3>Security and compliance</h3>
            <p>
              SOC 2 Type II and ISO 27001. <a href="https://cntxt.trust.site">Trust centre</a>.
            </p>
          </div>
          <ul className={styles.marks}>
            {marks.map((mark) => (
              <li key={mark.name}>
                <img loading="lazy" decoding="async" src={mark.src} alt={mark.name} width={72} height={72} />
                <span>{mark.name}</span>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </section>
  );
}
