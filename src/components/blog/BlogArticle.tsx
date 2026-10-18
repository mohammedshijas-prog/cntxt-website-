"use client";

import { useState } from "react";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { article, readNext } from "./posts";
import styles from "./blog.module.css";

export function BlogArticle() {
  const [topic, setTopic] = useState(article.topics[0]);

  return (
    <main className={styles.page}>
      <SiteNav />

      <article className={styles.article}>
        <div>
          <p className={styles.articleKicker}>{article.kicker}</p>
          <h1>{`${article.title[0]} ${article.title[1]}`}</h1>
          <p className={styles.byline}>{article.meta}</p>
          <div className={styles.heroImage}>
            <img src="/blog/hero-under.webp" alt="" />
            <img src="/art/cover-1.svg" alt="" />
          </div>
          <div className={styles.body}>
            {article.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
          <img className={styles.midImage} src="/blog/article-mid.jpg" alt="" />
          <h2>{article.subhead}</h2>
          <div className={styles.body}>
            {article.more.map((paragraph) => (
              <p key={`next-${paragraph.slice(0, 24)}`}>{paragraph}</p>
            ))}
          </div>
        </div>
        <aside className={styles.topics} aria-label="Related topics">
          <p>Explore</p>
          <h2>Related topics</h2>
          <ul>
            {article.topics.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  aria-current={topic === item ? "true" : undefined}
                  onClick={() => setTopic(item)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </article>

      <section className={styles.next} aria-labelledby="read-next">
        <h2 id="read-next">Read next</h2>
        <ul>
          {readNext.map((item) => (
            <li key={item.href}>
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                <span className={styles.nextPhoto}>
                  <img src="/blog/next-base.webp" alt="" />
                  <img src={item.under} alt="" />
                  <img src={item.image} alt="" />
                </span>
                <strong>{item.title}</strong>
                <span>
                  <em>{item.category}</em>
                  <em>Insight hub</em>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <SiteClose current="Blog" hideBand />
    </main>
  );
}
