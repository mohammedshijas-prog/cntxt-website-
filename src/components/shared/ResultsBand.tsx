import styles from "./resultsBand.module.css";

/** Published outcomes; each links to the page that tells the full case. */
const results = [
  { value: "83%", label: "Less processing time", context: "Judicial claims for a financial jurisdiction", href: "/industries/financial-services" },
  { value: "1.8M", label: "Annotated frames in six months", context: "Vision data for a GCC humanoid robotics lab", href: "/physical-ai" },
  { value: "30", label: "Sub-entities unified on-premises", context: "Data platform for a military entity", href: "/industries/public-sector" },
  { value: "1M+", label: "Minutes of Arabic speech processed", context: "Munsit, for 250+ organisations", href: "https://munsit.com", cta: "Explore Munsit" },
];

export function ResultsBand() {
  return (
    <section className={styles.band} aria-labelledby="results-heading">
      <header>
        <p>Published results</p>
        <h2 id="results-heading">What the work has already done.</h2>
      </header>
      <ul>
        {results.map((result) => (
          <li key={result.label}>
            <a href={result.href}>
              <strong>{result.value}</strong>
              <span className={styles.label}>{result.label}</span>
              <span className={styles.context}>{result.context}</span>
              <span className={styles.more}>
                {"cta" in result ? result.cta : "Read case study"} <span aria-hidden="true">→</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
