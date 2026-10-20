import Link from "next/link";
import { renderMarkdown } from "@/lib/markdown";
import type { Role } from "@/lib/supabase/server";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { ApplyForm } from "./ApplyForm";
import styles from "./role.module.css";

/** One open role: what it is on the left, the application on the right. */
export function RolePage({ role }: { role: Role }) {
  const html = role.description.trim() ? renderMarkdown(role.description) : "";

  return (
    <main className={styles.page}>
      <SiteNav />
      <div className={styles.layout}>
        <article className={styles.role}>
          <Link className={styles.back} href="/careers#openings">
            <span aria-hidden="true">←</span> All open roles
          </Link>
          <p className={styles.kicker}>{role.department}</p>
          <h1>{role.title}</h1>
          <ul className={styles.meta}>
            <li>{role.location}</li>
            {role.terms ? <li>{role.terms}</li> : null}
          </ul>
          {role.summary ? <p className={styles.summary}>{role.summary}</p> : null}
          {html ? <div className={styles.body} dangerouslySetInnerHTML={{ __html: html }} /> : null}
          <div className={styles.steps}>
            <h2>What happens next</h2>
            <ol>
              <li>
                <strong>We review your application.</strong> A person on the team reads every one.
              </li>
              <li>
                <strong>We get in touch.</strong> If your background fits, we email you about the next step.
              </li>
              <li>
                <strong>You start on real work.</strong> Each listing says whether it is remote or on site.
              </li>
            </ol>
          </div>
        </article>
        <aside className={styles.formCol} aria-label={`Apply for ${role.title}`}>
          <ApplyForm roleSlug={role.slug} roleTitle={role.title} />
        </aside>
      </div>
      <SiteClose current="Careers" hideBand />
    </main>
  );
}
