import styles from "./ctaBand.module.css";

/** The site's one closing band: brand purple between two dotted map edges. */
export function CtaBand({
  id,
  title,
  body,
  primary = { label: "Book a demo", href: "/contact" },
  secondary,
}: {
  id: string;
  title: string;
  body: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className={styles.band} aria-labelledby={id}>
      <div className={styles.mapEdge} aria-hidden="true">
        <img loading="lazy" decoding="async" src="/security/map-left.webp" alt="" />
      </div>
      <div className={styles.copy}>
        <h2 id={id}>{title}</h2>
        <p>{body}</p>
        <div className={styles.actions}>
          <a className={styles.primary} href={primary.href}>
            {primary.label}
            <span aria-hidden="true">→</span>
          </a>
          {secondary ? (
            <a className={styles.secondary} href={secondary.href}>
              {secondary.label}
            </a>
          ) : null}
        </div>
      </div>
      <div className={styles.mapEdge} aria-hidden="true">
        <img loading="lazy" decoding="async" src="/security/map-right.webp" alt="" />
      </div>
    </section>
  );
}
