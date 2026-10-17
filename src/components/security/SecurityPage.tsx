import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { Practices } from "./Practices";
import styles from "./security.module.css";
import { faqs } from "../shared/faqs";
import { Faq } from "../shared/Faq";

const gridLayers = Array.from({ length: 15 }, (_, index) => `/security/hero-grid/${index}.svg`);

const certifications = [
  {
    name: "SOC 2 Type II",
    mark: "/brand/certs/soc2.svg",
    copy: "CNTXT AI holds SOC 2 Type II. The controls behind it are published in our trust centre at cntxt.trust.site.",
  },
  {
    name: "ISO 27001",
    mark: "/brand/certs/iso-27001.svg",
    copy: "CNTXT AI holds ISO 27001, the international standard for managing information security across the organisation.",
  },
  {
    name: "GDPR",
    mark: "/brand/certs/gdpr.svg",
    copy: "GDPR is listed in our trust centre. Hosting and processing stay in-region, with on-premises deployment available.",
  },
  {
    name: "HIPAA",
    mark: "/brand/certs/hipaa.svg",
    copy: "HIPAA is listed in our trust centre alongside the controls that cover product, data, network and endpoint security.",
  },
];


export function SecurityPage() {
  return (
    <main className={styles.page}>
      <SiteNav />
      <section className={styles.hero} aria-labelledby="security-heading">
        <div className={styles.heroCopy}>
          <h1 id="security-heading">Security and data sovereignty, by design.</h1>
          <p>
            CNTXT AI holds SOC 2 Type II and ISO 27001, with GDPR
            and HIPAA listed in our trust centre. Your data is hosted and processed in-region, and we
            deploy on-premises, hybrid or in the cloud.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primary} href="https://cntxt.trust.site">
              Visit the trust centre
            </a>
            <a className={styles.secondary} href="/contact?topic=Security">
              Contact security
            </a>
          </div>
        </div>
        <div className={styles.visual} aria-hidden="true">
          {gridLayers.map((src) => (
            <img key={src} className={styles.gridLine} src={src} alt="" />
          ))}
          <div className={styles.lockFrame}>
            <img className={styles.lock} src="/security/lock.webp" alt="" />
          </div>
          <div className={styles.requestCard}>
            <span className={styles.requestIcon}>
              <img src="/security/shield.svg" alt="" />
            </span>
            <span>
              <strong>Work request</strong>
              <em>read, write or tool call</em>
            </span>
          </div>
          <div className={styles.permissionCard}>
            <span>
              <i />
              CHECK PERMISSION
            </span>
            <span>
              <i />
              RECORD OUTCOME
            </span>
          </div>
        </div>
      </section>

      <section className={styles.compliance} aria-labelledby="compliance-heading">
        <div className={styles.complianceCard}>
          <h2 id="compliance-heading">Compliance and certifications</h2>
          <ul>
            {certifications.map(({ name, copy, mark }) => (
              <li key={name}>
                <img src={mark} alt={`${name} mark`} width={150} height={150} />
                <h3>{name}</h3>
                <p>{copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Practices />

      <section className={styles.infrastructure} aria-labelledby="infrastructure-heading">
        <div className={styles.infraIntro}>
          <p className={styles.eyebrow}>
            <span className={styles.tag} aria-hidden="true">
              <span className={styles.tagBar} />
              <span className={styles.tagBarFlipped} />
            </span>
            Infrastructure
          </p>
          <h2 id="infrastructure-heading">How our systems are built</h2>
          <p>
            We deploy on-premises, hybrid or in the cloud, with hosting and
            processing kept in-region. Network connections are limited, and
            access is checked against a role and recorded.
          </p>
        </div>
        <div className={styles.infraPanel}>
          <img
            src="/art/deploy.svg"
            alt="Three deployment options: on-premises, hybrid and cloud, all with in-region hosting and processing"
            style={{ position: "relative", zIndex: 1, display: "block", width: "100%", height: "100%", objectFit: "contain", background: "#f5f1ff" }}
          />
        </div>
      </section>

      <section className={styles.disclosure} id="report" aria-labelledby="disclosure-heading">
        <div className={styles.folder}>
          <p className={styles.folderTab}>Security and governance</p>
          <div className={styles.folderBody}>
            <div className={styles.folderCopy}>
              <h2 id="disclosure-heading">
                Found a security issue?
                <br />
                Tell us before anyone else finds out.
              </h2>
              <p>
                We take reports from independent researchers seriously. Send
                us the details through our contact page and the team will follow up.
              </p>
              <a className={styles.lightButton} href="/contact?topic=Security">
                Report a vulnerability
              </a>
            </div>
            <img className={styles.folderLock} src="/security/disclosure-lock.webp" alt="" />
          </div>
        </div>
      </section>

      <Faq items={faqs.security} topic="Security" />

      <SiteClose
        current="Security"
        packHref="https://cntxt.trust.site"
        procurementId="procurement"
      />
    </main>
  );
}
