import Link from "next/link";
import styles from "../security/security.module.css";

const footerColumns = [
  { title: "Products", links: ["AI Lab", "Agentix", "Munsit", "KLKT"] },
  { title: "Industries", links: ["Financial services", "Public sector", "Healthcare", "Real estate", "Insurance"] },
  { title: "Solutions", links: ["Enterprise", "Data services", "Physical AI data", "Data Hub"] },
  { title: "Company", links: ["About", "Careers", "Security", "Contact us"] },
  { title: "Resources", links: ["Blog", "Documentation", "Partners"] },
];

const legalLinks = ["Terms of use", "Privacy policy", "Cookie policy", "KLKT terms", "KLKT privacy"];

const hrefs: Record<string, string> = {
  "Financial services": "/industries/financial-services",
  "Public sector": "/industries/public-sector",
  "Real estate": "/industries/real-estate",
  Insurance: "/industries/insurance",
  Terms: "/terms-conditions",
  Privacy: "/privacy-policy",
  "Terms of use": "/terms-conditions",
  "Privacy policy": "/privacy-policy",
  "Cookie policy": "/cookie-policy",
  // The KLKT app store listings point to these two URLs; keep them linked.
  "KLKT terms": "/klkt-terms-conditions",
  "KLKT privacy": "/klkt-privacy-policy",
  "AI Lab": "/products",
  Agentix: "/agentix",
  Munsit: "https://munsit.com",
  KLKT: "https://klkt.app",
  Enterprise: "/solutions",
  Healthcare: "/healthcare",
  Logistics: "/solutions",
  Finance: "/solutions",
  "Public Sector": "/solutions",
  Robotics: "/physical-ai",
  About: "/about",
  Careers: "/careers",
  Security: "/security",
  Blog: "/blog",
  "Contact us": "/contact",
  Events: "/blog",
  Documentation: "/documentation",
  Partners: "/partners",
  "Data Hub": "/data-hub",
  "Data services": "/data-services",
  "Data labelling": "/data-services",
  "Physical AI data": "/physical-ai",
  "Arabic speech AI": "https://munsit.com",
  "Enterprise agents": "/solutions",
};

function hrefFor(label: string) {
  return hrefs[label] ?? `#${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

/** Page ids used by the pages, mapped to the footer link they highlight. */
const currentLink: Record<string, string> = {
  Contact: "Contact us",
  Partnerships: "Partners",
  "Browse datasets": "Data Hub",
  Enterprises: "Enterprise",
  "Build AI": "AI Lab",
};

export function SiteClose({
  current,
  packHref,
  procurementId,
  hideBand = false,
}: {
  current?:
    | "Contact"
    | "Security"
    | "Partnerships"
    | "Documentation"
    | "Careers"
    | "Blog"
    | "About"
    | "Browse datasets"
    | "Data services"
    | "Healthcare"
    | "Enterprises"
    | "Build AI";
  packHref?: string;
  procurementId?: string;
  hideBand?: boolean;
}) {
  return (
    <>
      {hideBand ? null : (
      <section
        className={styles.procurement}
        id={procurementId}
        aria-labelledby="procurement-heading"
      >
        <div className={styles.mapEdge} aria-hidden="true">
          <img loading="lazy" decoding="async" src="/security/map-left.webp" alt="" />
        </div>
        <div className={styles.procurementCopy}>
          <h2 id="procurement-heading">
            Need documentation for
            <br />
            procurement?
          </h2>
          <p>
            Our certifications and policies are published in the trust centre,
            and the team can share the security documentation procurement needs.
          </p>
          <a className={styles.packButton} href={packHref ?? "https://cntxt.trust.site"}>
            <i />
            See our security documentation
          </a>
        </div>
        <div className={styles.mapEdge} aria-hidden="true">
          <img loading="lazy" decoding="async" src="/security/map-right.webp" alt="" />
        </div>
      </section>
      )}

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.brand}>
            <div>
              <Link href="/" aria-label="CNTXT AI">
                <img loading="lazy" decoding="async" src="/security/logo.svg" alt="" />
              </Link>
              <p className={styles.tagline}>Arabic-first, on-prem AI, verified where the work happens.</p>
            </div>
            <div className={styles.social}>
              <a href="https://www.linkedin.com/company/cntxtai" aria-label="LinkedIn">
                <img loading="lazy" decoding="async" src="/security/linkedin.svg" alt="" />
              </a>
            </div>
          </div>
          <nav className={styles.footerNav} aria-label="Footer">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2>{column.title}</h2>
                <ul>
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href={hrefFor(link)}
                        aria-current={link === (current && (currentLink[current] ?? current)) ? "page" : undefined}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className={styles.legal}>
          <ul>
            {legalLinks.map((link) => (
              <li key={link}>
                <a href={hrefFor(link)}>
                    {link}
                  </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  );
}
