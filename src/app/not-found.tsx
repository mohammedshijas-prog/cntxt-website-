import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.copy}>
        <p className={styles.kicker}>404</p>
        <h1>
          <span>This page</span>
          <span>does not exist.</span>
        </h1>
        <p className={styles.lead}>The link may be old, or the page may have moved.</p>
        <Link className={styles.home} href="/">
          Back to the home page
        </Link>
      </div>
    </main>
  );
}
