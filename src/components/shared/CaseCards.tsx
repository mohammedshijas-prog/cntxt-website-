import styles from "./caseCards.module.css";

export type CaseCard = {
  image: string;
  index: string;
  label: string;
  /** Use "\n" to break the title over two lines. */
  title: string;
  body: string;
};

/** Numbered image cards used for "Capabilities" / "Use cases" sections. */
export function CaseCards({ cases }: { cases: CaseCard[] }) {
  return (
    <ul className={styles.list}>
      {cases.map((item) => (
        <li key={item.index} className={styles.item}>
          <div className={styles.shot}>
            <img loading="lazy" decoding="async" src={item.image} alt="" />
            <img loading="lazy" decoding="async" className={styles.grain} src="/healthcare/grain.svg" alt="" width={140} height={140} />
            <p className={styles.label}>
              <span>{item.index}</span>
              {item.label}
            </p>
          </div>
          <div className={styles.copy}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
