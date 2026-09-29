import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import styles from "./evaluate.module.css";

const dek =
  "Independent evaluation for teams shipping language models — benchmarks, human review, and adversarial testing that catches what your own test suite doesn't.";

const cards = [
  {
    image: "/solutions/panel-build.png",
    title: "Model & data isolation",
    body: "Your data and models are fully isolated from other customers. No cross-contamination, no shared infrastructure risks.",
  },
  {
    image: "/solutions/panel-guard.png",
    title: "Annotator vetting & NDAs",
    body: "Every annotator undergoes thorough vetting and signs strict NDAs before accessing any data, ensuring confidentiality",
  },
  {
    image: "/solutions/panel-eval.png",
    title: "Incident response",
    body: "A dedicated incident response team is ready around the clock, with clear protocols to detect, contain, and resolve security",
  },
];

const apps = [
  { src: "/security/icons/gmail.svg", name: "Gmail" },
  { src: "/security/icons/slack.svg", name: "Slack" },
  { src: "/security/icons/sheets.svg", name: "Sheets" },
  { src: "/security/icons/drive.svg", name: "Drive" },
  { src: "/security/icons/notion.svg", name: "Notion" },
  { src: "/security/icons/teams.svg", name: "Teams" },
];

const actions = ["Read", "Write", "Send", "Copy", "Move", "Generate"];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className={styles.eyebrow}>
      <span className={styles.tag} aria-hidden="true" />
      {children}
    </p>
  );
}

export function EvaluatePage() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero} aria-labelledby="evaluate-heading">
        <div className={styles.heroCopy}>
          <Eyebrow>Solutions</Eyebrow>
          <h1 id="evaluate-heading">
            Know how your AI performs in the real world before your users do.
          </h1>
          <p>{dek}</p>
          <a className={styles.cta} href="/contact">
            Request an evaluation
            <span>
              <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <img className={styles.heroArt} src="/evaluate/hero.png" alt="" />
      </section>

      <section className={styles.audience} aria-labelledby="developers-heading">
        <div className={styles.audienceIntro}>
          <Eyebrow>Audience switch</Eyebrow>
          <h2 id="developers-heading">For model developers</h2>
          <p>{dek}</p>
        </div>
        <ul className={styles.cards}>
          {cards.map((card) => (
            <li key={card.title}>
              <img src={card.image} alt="" />
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.enterprises} aria-labelledby="enterprises-heading">
        <div className={styles.audienceIntro}>
          <Eyebrow>Audience switch</Eyebrow>
          <h2 id="enterprises-heading">For enterprises</h2>
          <p>{dek}</p>
        </div>
        <div className={styles.ramp}>
          <a href="/contact">
            <img src="/evaluate/ramp-coding.png" alt="" />
            <h3>Let Ramp handle the coding.</h3>
            <p>
              Every field and line item coded instantly—correct on the first pass 9 out
              of 10 times, and it gets better as you teach it.
            </p>
            <span>
              Learn about Ramp Intelligence
              <img src="/evaluate/arrow.svg" alt="" width={16} height={16} />
            </span>
          </a>
          <a href="/contact">
            <img src="/evaluate/ramp-close.png" alt="" />
            <h3>Real-time close.</h3>
            <p>
              Ramp auto-syncs routine, in-policy spend to your ERP so close runs
              continuously and month-end doesn&apos;t pile up.
            </p>
            <span>
              Learn what Ramp auto-syncs
              <img src="/evaluate/arrow.svg" alt="" width={16} height={16} />
            </span>
          </a>
        </div>
        <div className={styles.erp} id="erp-sync">
          <div>
            <h3>
              Syncs to your ERP in real-time
              <br />
              across every field and entity.
            </h3>
            <p>
              Ramp supports 30+ ERPs and complex setups —multi-entity, multi-currency,
              custom fields, and custom dimensions—so you can scale without manual work
              or messy reconciliations.
            </p>
          </div>
          <img src="/solutions/panel-guard.png" alt="" />
        </div>
      </section>

      <section className={styles.infrastructure} aria-labelledby="infrastructure-heading">
        <div className={styles.infraIntro}>
          <Eyebrow>Infrastructure</Eyebrow>
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

      <section className={styles.band} aria-labelledby="evaluate-cta">
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-left.svg" alt="" />
        </div>
        <div>
          <h2 id="evaluate-cta">
            Evaluate your
            <br />
            model or vendor
          </h2>
          <p>
            Get our SOC 2 report, pen test summary, and architecture overview in one
            package — usually within one business day.
          </p>
          <a href="/contact">
            Request an evaluation
            <span>
              <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-right.svg" alt="" />
        </div>
      </section>

      <SiteClose current="Evaluate AI" hideBand />
    </main>
  );
}
