import styles from "./logoWall.module.css";

export type Partner = {
  name: string;
  /** File in /public/brand/partners. */
  logo: string;
  /** What the relationship is, shown as a small caption under the mark. */
  role: "Investor" | "Technology" | "Research" | "Ecosystem";
  /** Rendered width in px; marks differ too much in shape to share one size. */
  width: number;
};

export const partners: Partner[] = [
  { name: "AI71", logo: "ai71.svg", role: "Investor", width: 104 },
  { name: "BlueFive Capital", logo: "bluefive-capital.svg", role: "Investor", width: 168 },
  { name: "NVIDIA", logo: "nvidia.svg", role: "Technology", width: 150 },
  { name: "Oracle", logo: "oracle.svg", role: "Technology", width: 150 },
  { name: "AWS", logo: "aws.svg", role: "Technology", width: 76 },
  { name: "Technology Innovation Institute", logo: "tii.svg", role: "Research", width: 168 },
  { name: "Middlesex University Dubai", logo: "middlesex-university-dubai.svg", role: "Research", width: 150 },
  { name: "Beam", logo: "beam.svg", role: "Ecosystem", width: 132 },
];

/**
 * Partner and investor marks on an ink panel. Every mark is shown in one
 * colour so no brand outweighs another; the caption says what each one is.
 */
export function LogoWall({ items = partners, headingId, title }: { items?: Partner[]; headingId: string; title: string }) {
  return (
    <section className={styles.wall} aria-labelledby={headingId}>
      <header>
        <h2 id={headingId}>{title}</h2>
        <p>{items.length} organisations we build, research and grow with.</p>
      </header>
      <ul>
        {items.map((item) => (
          <li key={item.name}>
            <span className={styles.mark}>
              <img src={`/brand/partners/${item.logo}`} alt={item.name} style={{ width: item.width }} />
            </span>
            <span className={styles.role}>{item.role}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
