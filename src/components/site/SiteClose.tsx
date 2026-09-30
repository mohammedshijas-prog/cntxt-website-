import Link from "next/link";
import styles from "../security/security.module.css";

const footerColumns = [
  { title: "Products", links: ["AI Lab", "Agentix", "Munsit", "KLKT"] },
  {
    title: "Solutions",
    links: ["Enterprise", "Healthcare", "Logistics", "Finance", "Public Sector", "Robotics"],
  },
  { title: "Company", links: ["About", "Careers", "Security", "Terms", "Privacy"] },
  {
    title: "Resources",
    links: ["Blog", "Contact us", "Events", "Documentation", "Data partnerships"],
  },
  {
    title: "Guides",
    links: ["Data labelling", "Physical AI data", "Arabic speech AI", "Enterprise agents"],
  },
];

const legalLinks = ["Terms of use", "Privacy policy", "Cookie preferences"];

const hrefs: Record<string, string> = {
  "AI Lab": "/products",
  Agentix: "/products",
  Munsit: "/products",
  KLKT: "/klkt",
  Enterprise: "/solutions",
  Healthcare: "/healthcare",
  Logistics: "/solutions",
  Finance: "/solutions",
  "Public Sector": "/solutions",
  Robotics: "/solutions",
  About: "/about",
  Careers: "/careers",
  Security: "/security",
  Blog: "/blog",
  "Contact us": "/contact",
  Events: "/blog",
  Documentation: "/documentation",
  "Data partnerships": "/partners",
  "Data labelling": "/data-hub",
  "Physical AI data": "/products",
  "Arabic speech AI": "/products",
  "Enterprise agents": "/solutions",
};

function hrefFor(label: string) {
  return hrefs[label] ?? `#${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

/** Page ids used by the pages, mapped to the footer link they highlight. */
const currentLink: Record<string, string> = {
  Contact: "Contact us",
  Partnerships: "Data partnerships",
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
    | "Healthcare"
    | "Enterprises"
    | "Evaluate AI"
    | "Build AI"
    | "KLKT";
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
          <img src="/security/map-left.svg" alt="" />
        </div>
        <div className={styles.procurementCopy}>
          <h2 id="procurement-heading">
            Need documentation for
            <br />
            procurement?
          </h2>
          <p>
            Get our SOC 2 report, pen test summary, and architecture overview
            in one package — usually within one business day.
          </p>
          <a className={styles.packButton} href={packHref ?? "#procurement"}>
            <i />
            Request our security pack
          </a>
        </div>
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-right.svg" alt="" />
        </div>
      </section>
      )}

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.brand}>
            <div>
              <Link href="/" aria-label="CNTXT AI">
                <img src="/security/logo.svg" alt="" />
              </Link>
              <p className={styles.tagline}>Arabic-first, on-prem AI, verified where the work happens.</p>
            </div>
            <div className={styles.social}>
              <a href="https://www.linkedin.com" aria-label="LinkedIn">
                <img src="/security/linkedin.svg" alt="" />
              </a>
              <a href="https://x.com" aria-label="X">
                <img src="/security/x.svg" alt="" />
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
          <p>© 2026 CNTXT AI. All rights reserved.</p>
          <ul>
            {legalLinks.map((link) => (
              <li key={link}>
                {link === "Cookie preferences" ? (
                  <button type="button">{link}</button>
                ) : (
                  <a id={hrefFor(link).slice(1)} href={hrefFor(link)}>
                    {link}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  );
}
