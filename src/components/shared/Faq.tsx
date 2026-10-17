import type { FaqItem } from "./faqs";
import styles from "./faq.module.css";

/**
 * Buyer questions with sourced answers. Native <details> keeps it accessible
 * without script; the JSON-LD lets search engines show the answers.
 */
export function Faq({
  items,
  title = "Questions buyers ask",
  topic,
}: {
  items: FaqItem[];
  title?: string;
  /** Contact-form topic for the "ask us" link. */
  topic?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  const contact = topic ? `/contact?${new URLSearchParams({ topic })}` : "/contact";

  return (
    <section className={`${styles.faq} faq-section`} aria-labelledby="faq-heading">
      <div className={styles.intro}>
        <p className={styles.kicker}>FAQ</p>
        <h2 id="faq-heading">{title}</h2>
        <p>
          Something we have not answered? <a href={contact}>Ask the team</a>.
        </p>
      </div>
      <div className={styles.list}>
        {items.map((item) => (
          <details key={item.q}>
            <summary>
              {item.q}
              <span aria-hidden="true" />
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </section>
  );
}
