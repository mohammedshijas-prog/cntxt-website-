import { readFileSync } from "node:fs";
import path from "node:path";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import styles from "./legal.module.css";

/**
 * A legal document carried over verbatim from cntxt.tech. The text lives in
 * src/content/legacy/*.html exactly as published; only the styling is ours.
 * App store listings link to these URLs, so they must not move.
 */
export function LegalPage({ title, file, kicker = "Legal" }: { title: string; file: string; kicker?: string }) {
  // The page title is the only h1; headings inside the legacy text step down a level.
  const html = readFileSync(path.join(process.cwd(), "src/content/legacy", file), "utf8").replace(/<(\/?)h1\b/gi, "<$1h2");
  return (
    <main className={styles.page}>
      <SiteNav />
      <header className={styles.head}>
        <p className={styles.kicker}>{kicker}</p>
        <h1>{title}</h1>
      </header>
      <article className={styles.doc} dangerouslySetInnerHTML={{ __html: html }} />
      <SiteClose hideBand />
    </main>
  );
}
