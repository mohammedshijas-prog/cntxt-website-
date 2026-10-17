import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import styles from "./evaluate.module.css";
import { AuditMock, TerminalMock } from "../shared/graphics";
import { faqs } from "../shared/faqs";
import { Faq } from "../shared/Faq";
import { ProofBar } from "../shared/ProofBar";

const dek =
  "TestAI tests, evaluates and audits AI systems for bias, reliability and compliance before deployment, with human review by domain experts and native Arabic speakers.";

const developersDek =
  "Test your model before it breaks in production. Domain experts and native Arabic reviewers judge its outputs, and you see where it fails before release.";

const enterprisesDek =
  "Buying a model or an AI product? We audit it for bias, reliability and compliance on the work you need it to do, before you put it in front of your users.";

const cards = [
  {
    image: "/art/audit.svg",
    title: "Bias, reliability and compliance",
    body: "TestAI tests, evaluates and audits your AI system for bias, reliability and compliance before it is deployed.",
  },
  {
    image: "/art/experts.svg",
    title: "Domain expert evaluators",
    body: "Human evaluators with expertise in biology, medicine, finance and coding review model outputs, alongside bilingual reviewers.",
  },
  {
    image: "/art/dialects.svg",
    title: "Native Arabic review",
    body: "Native Arabic reviewers across 25+ dialects check how your model handles the Arabic that people speak and write.",
  },
];

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
          <a className={styles.cta} href="/contact?topic=AI%20evaluation">
            Request an evaluation
            <span>
              <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <img
          className={styles.heroArt}
          src="/brand/product/testai.webp"
          alt="TestAI, CNTXT's platform for monitoring and testing voice and chat agents"
          style={{
            objectPosition: "left top",
            border: "1px solid rgba(15, 12, 11, 0.08)",
            borderRadius: 18,
            boxShadow: "0 30px 60px rgba(76, 46, 170, 0.18)",
          }}
        />
      </section>

      <ProofBar />

      <section className={styles.audience} aria-labelledby="developers-heading">
        <div className={styles.audienceIntro}>
          <Eyebrow>Before release</Eyebrow>
          <h2 id="developers-heading">For model developers</h2>
          <p>{developersDek}</p>
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
          <Eyebrow>Before purchase</Eyebrow>
          <h2 id="enterprises-heading">For enterprises</h2>
          <p>{enterprisesDek}</p>
        </div>
        <div className={styles.ramp}>
          <a href="/contact?topic=AI%20evaluation">
            <AuditMock />
            <h3>Audit a model before you deploy it.</h3>
            <p>
              TestAI audits the AI system you plan to buy for bias, reliability and
              compliance, with domain experts reviewing its outputs.
            </p>
            <span>
              Request an audit
              <img src="/evaluate/arrow.svg" alt="" width={16} height={16} />
            </span>
          </a>
          <a href="https://pypi.org/project/rag-meter/">
            <TerminalMock />
            <h3>Measure your RAG system.</h3>
            <p>
              RAGMeter is our open-source RAG evaluation toolkit. Install it from
              PyPI as rag-meter and run it on your own retrieval pipeline.
            </p>
            <span>
              Get RAGMeter on PyPI
              <img src="/evaluate/arrow.svg" alt="" width={16} height={16} />
            </span>
          </a>
        </div>
        <div className={styles.erp} id="erp-sync">
          <div>
            <h3>
              Evaluation data stays in-region
              <br />
              under certified security controls.
            </h3>
            <p>
              Hosting and processing stay in-region, and we deploy on-premises, hybrid
              or in the cloud. CNTXT AI holds SOC 2 Type II and ISO 27001 with GDPR
              and HIPAA listed in our trust centre. The controls are published in our trust centre.
            </p>
          </div>
          <img src="/art/deploy.svg" alt="" />
        </div>
      </section>


      <Faq items={faqs.evaluate} topic="AI evaluation" />

      <section className={styles.band} aria-labelledby="evaluate-cta">
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-left.webp" alt="" />
        </div>
        <div>
          <h2 id="evaluate-cta">
            Evaluate your
            <br />
            model or vendor
          </h2>
          <p>
            Tell us what you are building or buying. We will scope the tests and
            the reviewers that fit it.
          </p>
          <a href="/contact?topic=AI%20evaluation">
            Request an evaluation
            <span>
              <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-right.webp" alt="" />
        </div>
      </section>

      <SiteClose current="Evaluate AI" hideBand />
    </main>
  );
}
