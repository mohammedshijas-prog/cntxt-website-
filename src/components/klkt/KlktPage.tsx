import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { CaseCards, type CaseCard } from "../shared/CaseCards";
import styles from "./klkt.module.css";

const cases: CaseCard[] = [
  {
    image: "/healthcare/case-1.png",
    index: "01",
    label: "The data warehouse.",
    title: "Solved the numbers.\nNot the knowledge.",
    body: "It made structured data queryable. Most of what your company knows was never in a table.",
  },
  {
    image: "/healthcare/case-2.png",
    index: "02",
    label: "A license for everyone.",
    title: "An assistant for everyone.\nA memory for no one.",
    body: "The right first move. It gave every person an assistant and the company no shared memory.",
  },
  {
    image: "/healthcare/case-3.png",
    index: "03",
    label: "A knowledge graph.",
    title: "Built once.\nTrue on the day it shipped.",
    body: "It reads from a snapshot and never writes back, so it is out of date until someone rebuilds it.",
  },
];

const engines = [
  { name: "Munsit", label: "labelMunsit" },
  { name: "Agentix", label: "labelAgentix" },
  { name: "Data services", label: "labelData" },
];

const lorem =
  "Lorem Ipsum\u00a0is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset ";

function Eyebrow({ children }: { children: string }) {
  return (
    <p className={styles.eyebrow}>
      <span className={styles.tag} aria-hidden="true" />
      {children}
    </p>
  );
}

export function KlktPage() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero} aria-labelledby="klkt-heading">
        <div className={styles.heroCopy}>
          <h1 id="klkt-heading">
            <span>KLKT</span>
            {" – Turn any workflow into an AI app."}
          </h1>
          <p>
            Klkt is a visual builder for internal tools — assemble forms, prompts, and logic into a working app in an afternoon. Built for ops and product teams who need something running{" "}
          </p>
          <a className={styles.cta} href="/contact">
            Get started
            <span>
              <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <div className={styles.heroArt}>
          <img src="/klkt/hero.png" alt="KLKT on a phone held in front of the wordmark" />
        </div>
      </section>

      <section className={styles.tour} aria-labelledby="tour-heading">
        <div className={styles.tourIntro}>
          <Eyebrow>product tour</Eyebrow>
          <h2 id="tour-heading">Assemble screens without a spec doc</h2>
          <p>
            Independent evaluation for teams shipping language models — benchmarks, human review, and adversarial testing that catches what your own test suite doesn&apos;t.
          </p>
        </div>
        <article className={styles.feature}>
          <div>
            <h3>Syncs to your ERP in real-time across every field and entity.</h3>
            <p>
              Ramp supports 30+ ERPs and complex setups —multi-entity, multi-currency, custom fields, and custom dimensions—so you can scale without manual work or messy reconciliations.
            </p>
          </div>
          <div className={styles.featureShot}>
            <img src="/solutions/panel-guard.png" alt="" />
          </div>
        </article>
        <div className={styles.split}>
          {["one", "two", "three"].map((key) => (
            <article key={key}>
              <h3>
                An assistant for everyone.
                <br />
                A memory for no one.
              </h3>
              <p>The right first move. It gave every person an assistant and the company no shared memory.</p>
              <img src="/products/policy.png" alt="" />
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cases} aria-labelledby="features-heading">
        <Eyebrow>Use cases</Eyebrow>
        <h2 id="features-heading">Features</h2>
        <CaseCards cases={cases} />
      </section>

      <section className={styles.engine} aria-labelledby="engine-heading">
        <div className={styles.engineIntro}>
          <Eyebrow>Audience switch</Eyebrow>
          <h2 id="engine-heading">Built on the cntxt engine</h2>
          <p>
            Independent evaluation for teams shipping language models — benchmarks, human review, and adversarial testing that catches what your own test suite doesn&apos;t.
          </p>
        </div>
        <div className={styles.productList}>
          {engines.map((item) => (
            <article className={styles.product} key={item.name}>
              <img
                className={styles.wash}
                src="/solutions/wash-build.svg"
                alt=""
                width={1567}
                height={562}
              />
              <p className={`${styles.productLabel} ${styles[item.label]}`}>{item.name}</p>
              <div className={styles.productCopy}>
                <h3>
                  Stale context. Lost work.
                  <br />
                  Governance rebuilt every time.
                </h3>
                <p>{lorem}</p>
              </div>
              <div className={styles.panel}>
                <img src="/solutions/panel-build.png" alt="" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.band} aria-labelledby="try-heading">
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-left.svg" alt="" />
        </div>
        <div>
          <h2 id="try-heading">Try Klkt</h2>
          <p>One line of supporting copy.</p>
          <a href="/contact">
            Get started
            <span>
              <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-right.svg" alt="" />
        </div>
      </section>
      <SiteClose current="KLKT" hideBand />
    </main>
  );
}
