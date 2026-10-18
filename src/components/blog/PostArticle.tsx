import { marked } from "marked";
import type { Post } from "@/lib/supabase/server";
import { CtaBand } from "../shared/CtaBand";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import styles from "./blog.module.css";

/** A post written in the portal. The body is markdown written by allowlisted admins. */
export function PostArticle({ post }: { post: Post }) {
  const html = marked.parse(post.body, { async: false }) as string;
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <main className={styles.page}>
      <SiteNav />
      <article className={styles.article}>
        <div>
          <p className={styles.articleKicker}>{post.category.toLowerCase()}</p>
          <h1>{post.title}</h1>
          <p className={styles.byline}>
            {post.author}
            {date ? ` · ${date}` : ""}
          </p>
          {post.cover_url ? (
            <div className={styles.heroImage}>
              <img src={post.cover_url} alt="" />
            </div>
          ) : null}
          <div className={styles.body} dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </article>
      <CtaBand
        id="post-cta"
        title="Put the research to work."
        body="Tell us what you are building, and we will show where the data and models come in."
        primary={{ label: "Book a demo", href: "/contact" }}
      />
      <SiteClose current="Blog" hideBand />
    </main>
  );
}
