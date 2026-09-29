import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { PartnerForm } from "./PartnerForm";
import { WaysToPartner } from "./WaysToPartner";
import styles from "./partner.module.css";

const logos = [
  { src: "/partners/logo-a.png", name: "Lovable" },
  { src: "/partners/logo-b.png", name: "PolyAI" },
  { src: "/partners/logo-a.png", name: "Lovable" },
  { src: "/partners/logo-b.png", name: "PolyAI" },
  { src: "/partners/logo-a.png", name: "Lovable" },
  { src: "/partners/logo-a.png", name: "Lovable" },
  { src: "/partners/logo-b.png", name: "PolyAI" },
  { src: "/partners/logo-a.png", name: "Lovable" },
  { src: "/partners/logo-b.png", name: "PolyAI" },
  { src: "/partners/logo-a.png", name: "Lovable" },
];

const withoutCntxt = [
  { label: "Reading", text: "Static snapshot. Goes stale." },
  { label: "Writes Back", text: "Findings vanish when the session ends." },
  {
    label: "Governed",
    text: "Each project builds its own access. Nobody can answer who saw what.",
  },
];

const withCntxt = [
  { label: "Reading", text: "Live. Updates as work happens." },
  {
    label: "Writes Back",
    text: "One agent’s output becomes the next one’s input.",
  },
  {
    label: "Governed",
    text: "One system. Permissions, audit and ownership built in.",
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

export function PartnerPage() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero} aria-labelledby="partner-heading">
        <div className={styles.heroCopy}>
          <div>
            <Eyebrow>Partnerships</Eyebrow>
            <h1 id="partner-heading">Partner with cntxt.</h1>
            <p>
              Who we partner with and why — integrators, data partners, cloud
              & hardware, research.
            </p>
          </div>
          <a className={styles.cta} href="#apply">
            Become a partner
            <span>
              <img src="/partners/caret-right.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <img className={styles.heroArt} src="/partners/hero.png" alt="" />
      </section>

      <WaysToPartner />

      <section className={styles.logos} aria-labelledby="logos-heading">
        <h2 id="logos-heading">Partners & investors</h2>
        <ul>
          {logos.map((logo, index) => (
            <li key={`${logo.name}-${index}`}>
              <img src={logo.src} alt={logo.name} />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.compare}>
        <article>
          <Eyebrow>What you get</Eyebrow>
          <h2>
            Stale context. Lost work.
            <br />
            Governance rebuilt every time.
          </h2>
          <div className={styles.mutedPanel}>
            <ul>
              {withoutCntxt.map((item) => (
                <li key={item.label}>
                  <img src="/partners/mark-x.svg" alt="" width={10.5} height={10.5} />
                  <span>
                    <small>{item.label}</small>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </article>
        <article>
          <Eyebrow>What we look for</Eyebrow>
          <h2>
            Stale context. Lost work.
            <br />
            Governance rebuilt every time.
          </h2>
          <div className={styles.colorPanel}>
            <ul>
              {withCntxt.map((item) => (
                <li key={item.label}>
                  <img src="/partners/mark-check.svg" alt="" width={11} height={9} />
                  <span>
                    <small>{item.label}</small>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <section className={styles.apply} id="apply" aria-labelledby="apply-heading">
        <article className={styles.applyIntro}>
          <div>
            <h2 id="apply-heading">Partner with us</h2>
            <p>Tell us about your project, data needs or partnership idea.</p>
          </div>
          <div className={styles.email}>
            <h3>Partnerships</h3>
            <a href="mailto:partnerships@cntxt.tech">partnerships@cntxt.tech</a>
          </div>
          <div className={styles.people}>
            <img src="/partners/people.png" alt="" />
          </div>
        </article>
        <PartnerForm />
      </section>

      <section className={styles.band} aria-labelledby="band-heading">
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-left.svg" alt="" />
        </div>
        <div className={styles.bandCopy}>
          <h2 id="band-heading">Partner With us</h2>
          <p>
            Get our SOC 2 report, pen test summary, and architecture overview
            in one package — usually within one business day.
          </p>
          <a className={styles.bandButton} href="#apply">
            Become a partner
            <span>
              <img src="/partners/caret-right.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-right.svg" alt="" />
        </div>
      </section>

      <SiteClose current="Partnerships" hideBand />
    </main>
  );
}
