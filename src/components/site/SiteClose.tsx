import styles from "../security/security.module.css";

const footerColumns = [
  {
    title: "Products",
    links: [
      "Build AI",
      "Physical AI",
      "Data Engine",
      "AI Lab",
      "For Governments",
      "Munsit",
      "KLKT",
      "Agntix",
      "Evaluate AI",
    ],
  },
  {
    title: "Solutions",
    links: [
      "Enterprises",
      "Healthcare",
      "Logistics",
      "Government",
      "Finance",
      "Energy",
      "Retail",
    ],
  },
  {
    title: "Data Hub",
    links: ["Browse datasets", "Request a dataset"],
  },
  {
    title: "Resources",
    links: ["Blog", "Events", "Documentation", "Partnerships"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact", "Security"],
  },
];

const legalLinks = [
  "Privacy policy",
  "Terms and conditions",
  "Terms of use",
  "Cookie policy",
  "Code of conduct",
  "Cookie settings",
];

function hrefFor(label: string) {
  if (label === "Security") return "/security";
  if (label === "Contact") return "/contact";
  if (label === "Partnerships") return "/partners";
  if (label === "Documentation") return "/documentation";
  if (label === "Careers") return "/careers";
  if (label === "Blog") return "/blog";
  if (label === "About") return "/about";
  if (label === "Browse datasets" || label === "Request a dataset") return "/data-hub";
  if (label === "Healthcare") return "/healthcare";
  if (label === "Enterprises") return "/solutions";
  if (label === "Evaluate AI") return "/evaluate-ai";
  if (label === "Build AI") return "/products";
  if (label === "KLKT") return "/klkt";
  return `#${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

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
            <a href="/" aria-label="CNTXT AI">
              <img src="/security/logo.svg" alt="" />
            </a>
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
                        aria-current={link === current ? "page" : undefined}
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
          <p>©2026 CNTXT. ALL RIGHTS RESERVED.</p>
          <ul>
            {legalLinks.map((link) => (
              <li key={link}>
                {link === "Cookie settings" ? (
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
