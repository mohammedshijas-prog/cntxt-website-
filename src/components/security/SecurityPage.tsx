import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { Practices } from "./Practices";
import styles from "./security.module.css";

const gridLayers = Array.from({ length: 15 }, (_, index) => `/security/hero-grid/${index}.svg`);

const certifications = [
  "ISO 27001",
  "SOC 2",
  "[Regional data law]",
  "GDPR",
];

const certificationCopy =
  "Encord has successfully completed its Systems and Organizational Control (SOC)-2 Examination. In doing so, Encord maintains its adherence to";

const apps = [
  { src: "/security/icons/gmail.svg", name: "Gmail" },
  { src: "/security/icons/slack.svg", name: "Slack" },
  { src: "/security/icons/sheets.svg", name: "Sheets" },
  { src: "/security/icons/drive.svg", name: "Drive" },
  { src: "/security/icons/notion.svg", name: "Notion" },
  { src: "/security/icons/teams.svg", name: "Teams" },
];

const actions = ["Read", "Write", "Send", "Copy", "Move", "Generate"];


export function SecurityPage() {
  return (
    <main className={styles.page}>
      <SiteNav />
      <section className={styles.hero} aria-labelledby="security-heading">
        <div className={styles.heroCopy}>
          <h1 id="security-heading">Security and data sovereignty, by design.</h1>
          <p>
            Protecting customer data is our highest priority. Encord was built
            from the ground up with enterprise-grade security, governance, and
            compliance at every layer.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primary} href="#procurement">
              Request security pack
            </a>
            <a className={styles.secondary} href="/contact">
              Contact security
            </a>
          </div>
        </div>
        <div className={styles.visual} aria-hidden="true">
          {gridLayers.map((src) => (
            <img key={src} className={styles.gridLine} src={src} alt="" />
          ))}
          <div className={styles.lockFrame}>
            <img className={styles.lock} src="/security/lock.png" alt="" />
          </div>
          <div className={styles.requestCard}>
            <span className={styles.requestIcon}>
              <img src="/security/shield.svg" alt="" />
            </span>
            <span>
              <strong>Work Request</strong>
              <em>read,write,or tool call</em>
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
          <h2 id="compliance-heading">Compliance & certifications</h2>
          <ul>
            {certifications.map((name) => (
              <li key={name}>
                <img src="/security/soc2.png" alt="" width={150} height={150} />
                <h3>{name}</h3>
                <p>{certificationCopy}</p>
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
          <h2 id="infrastructure-heading">How Our Systems Are Built</h2>
          <p>
            Built on secure, redundant infrastructure — isolated environments,
            restricted access, and regular disaster recovery testing to keep the
            platform resilient.
          </p>
        </div>
        <div className={styles.infraPanel}>
          <div className={styles.flow}>
            <article className={styles.requestRow}>
              <span className={styles.flowLead}>
                <span className={styles.iconWell}>
                  <img src="/security/icons/bot.svg" alt="" />
                </span>
                Request
              </span>
              <span className={styles.appRow}>
                {apps.map((app) => (
                  <span className={styles.appIcon} key={app.name}>
                    <img src={app.src} alt="" />
                  </span>
                ))}
              </span>
            </article>

            <article className={styles.governance}>
              <p>Governance layer</p>
              <div className={styles.govCard}>
                <span className={styles.iconWellTeal}>
                  <img src="/security/icons/shield.svg" alt="" />
                </span>
                <span>
                  <strong>Permission check</strong>
                  <em>Is this connection allowed in this workspace?</em>
                </span>
              </div>
              <div className={styles.govCard}>
                <span className={styles.policyRow}>
                  <span className={styles.iconWellTeal}>
                    <img src="/security/icons/policy.svg" alt="" />
                  </span>
                  <span>
                    <strong>Policy decision</strong>
                    <em>The layer decides what the agent may do</em>
                  </span>
                </span>
                <span className={styles.pills}>
                  <span className={styles.allow}>Allow</span>
                  <span className={styles.escalate}>Escalate</span>
                  <span className={styles.block}>Block</span>
                </span>
              </div>
            </article>

            <article className={styles.toolCard}>
              <span className={styles.policyRow}>
                <span className={styles.iconWellGreen}>
                  <img src="/security/icons/play.svg" alt="" />
                </span>
                <span>
                  <strong>Tool action</strong>
                  <em>Runs only within the granted scope</em>
                </span>
              </span>
              <span className={styles.actionRow}>
                {actions.map((action) => (
                  <span key={action}>{action}</span>
                ))}
                <span className={styles.more} aria-hidden="true">
                  <img src="/security/icons/more.svg" alt="" />
                </span>
              </span>
            </article>

            <article className={styles.logCard}>
              <span className={styles.iconWell}>
                <img src="/security/icons/history.svg" alt="" />
              </span>
              <span>
                <strong>Logged outcome</strong>
                <em>Who called what, when, and why</em>
              </span>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.disclosure} id="report" aria-labelledby="disclosure-heading">
        <div className={styles.folder}>
          <p className={styles.folderTab}>Security & Governance</p>
          <div className={styles.folderBody}>
            <div className={styles.folderCopy}>
              <h2 id="disclosure-heading">
                Found a security issue?
                <br />
                Tell us before anyone else finds out.
              </h2>
              <p>
                We take reports from independent researchers seriously and
                won&apos;t pursue legal action against good-faith testing.
              </p>
              <a className={styles.lightButton} href="#report">
                Report a vulnerability
              </a>
            </div>
            <img className={styles.folderLock} src="/security/disclosure-lock.png" alt="" />
          </div>
        </div>
      </section>

      <SiteClose
        current="Security"
        packHref="#procurement"
        procurementId="procurement"
      />
    </main>
  );
}
