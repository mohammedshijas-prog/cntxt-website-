import styles from "./ctaBand.module.css";

/** Closing call to action: one primary button, one optional secondary link. */
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
      <h2 id={id}>{title}</h2>
      <p>{body}</p>
      <div className={styles.actions}>
        <a className={styles.primary} href={primary.href}>
          {primary.label}
          <img src="/home/caret.svg" alt="" width={24} height={24} />
        </a>
        {secondary ? (
          <a className={styles.secondary} href={secondary.href}>
            {secondary.label}
          </a>
        ) : null}
      </div>
    </section>
  );
}
