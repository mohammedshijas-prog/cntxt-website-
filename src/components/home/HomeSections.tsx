import { partners } from "../shared/LogoWall";
import styles from "./sections.module.css";

/** Partner and investor marks, drifting under the hero. */
export function LogoMarquee() {
  const row = partners.map((item) => (
    <li key={item.name}>
      <img loading="lazy" decoding="async" src={`/brand/partners/${item.logo}`} alt={item.name} style={{ width: item.width * 0.8 }} />
    </li>
  ));
  return (
    <section className={styles.marquee} aria-label="Investors and partners">
      <p>Backed by and building with</p>
      <div className={styles.marqueeTrack}>
        <ul>{row}</ul>
        <ul aria-hidden="true">{row}</ul>
      </div>
    </section>
  );
}

const certs = [
  { name: "SOC 2 Type II", note: "Independently audited controls", logo: "soc2.svg" },
  { name: "ISO 27001", note: "Information security management", logo: "iso-27001.svg" },
  { name: "GDPR", note: "Listed in our trust centre", logo: "gdpr.svg" },
  { name: "HIPAA", note: "Listed in our trust centre", logo: "hipaa.svg" },
];

const deployments = [
  { name: "GCC cloud", note: "Hosted and processed in region" },
  { name: "Private VPC", note: "Isolated in your own cloud account" },
  { name: "On-premises", note: "On infrastructure you control" },
];

/** Security: a light section; promise and link up top, the evidence below. */
export function SecurityBand() {
  return (
    <section className={styles.security} aria-labelledby="security-heading">
      <header className={styles.securityHead}>
        <div>
          <p className={styles.securityKicker}>Security</p>
          <h2 id="security-heading">Proven at scale. Kept in your control.</h2>
          <p className={styles.securityLead}>
            Your data stays where you decide. CNTXT holds SOC 2 Type II and ISO 27001, with GDPR
            and HIPAA listed in our trust centre.
          </p>
        </div>
        <a className={styles.securityLink} href="/security">
          Visit the trust centre <span aria-hidden="true">→</span>
        </a>
      </header>
      <ul className={styles.certs}>
        {certs.map((cert) => (
          <li key={cert.name}>
            <img loading="lazy" decoding="async" src={`/brand/certs/${cert.logo}`} alt="" />
            <strong>{cert.name}</strong>
            <span>{cert.note}</span>
          </li>
        ))}
      </ul>
      <ul className={styles.deploy} aria-label="Where it can run">
        {deployments.map((item) => (
          <li key={item.name}>
            <strong>{item.name}</strong>
            <span>{item.note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
