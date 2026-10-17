import styles from "./proofBar.module.css";

/** Verified facts only; sources are listed in docs/content-brief.md. */
const facts = [
  { value: "250+", label: "Enterprise and government organisations served" },
  { value: "#1", label: "Munsit on the Hugging Face Open Universal Arabic ASR Leaderboard" },
  { value: "SOC 2 · ISO 27001", label: "Certified, with controls published in our trust centre" },
  { value: "$60M", label: "Series A co-led by AI71 and BlueFive Capital" },
];

/** A strip of proof placed directly under a page's hero. */
export function ProofBar({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <section className={`${styles.bar} ${tone === "dark" ? styles.dark : ""}`} aria-label="CNTXT AI in numbers">
      <ul>
        {facts.map((fact) => (
          <li key={fact.value}>
            <strong>{fact.value}</strong>
            <span>{fact.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
