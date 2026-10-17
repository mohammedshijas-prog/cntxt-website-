"use client";

import { useState } from "react";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { cards, categories, featured, type Category } from "./posts";
import styles from "./blog.module.css";
import { CtaBand } from "../shared/CtaBand";

export function BlogIndex() {
  const [category, setCategory] = useState<Category>("All");
  const showFeatured = category === "All" || featured.chip === category;
  const visible = cards.filter((card) => category === "All" || card.chip === category);

  return (
    <main className={styles.page}>
      <SiteNav />
      <section className={styles.index} aria-labelledby="blog-heading">
        <p className={styles.eyebrow}>
          <span className={styles.tag} aria-hidden="true" />
          Blogs
        </p>
        <h1 id="blog-heading">
          From the <span>CNTXT</span> team
        </h1>
        <p className={styles.dek}>
          Research notes and practical guides on Arabic AI, training data, evaluation and
          putting AI to work in regulated industries.
        </p>

        <div className={styles.chips} role="tablist" aria-label="Categories">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {showFeatured ? (
          <a className={styles.feature} href={`/blog/${featured.slug}`}>
            <img src={featured.image} alt="" />
            <div>
              <p className={styles.kicker}>{featured.kicker}</p>
              <h2>
                {featured.title[0]}
                <br />
                {featured.title[1]}
              </h2>
              <p>{featured.blurb}</p>
              <footer>
                <span>{featured.meta}</span>
                <img src="/blog/arrow.svg" alt="" width={25} height={25} />
              </footer>
            </div>
          </a>
        ) : null}

        {visible.length === 0 ? (
          <p className={styles.empty}>No posts in this category.</p>
        ) : (
          <ul className={styles.grid}>
            {visible.map((card) => (
              <li key={card.id}>
                <a href={card.href} target="_blank" rel="noopener noreferrer">
                  <div className={styles.cover}>
                    <img src="/art/cover-13.svg" alt="" />
                    <img src={card.image} alt="" />
                  </div>
                  <p className={styles.kicker}>{card.kicker}</p>
                  <h2>{card.title}</h2>
                  <p>{card.blurb}</p>
                  <footer>
                    <span>{card.meta}</span>
                    <img src="/blog/arrow.svg" alt="" width={25} height={25} />
                  </footer>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
      <CtaBand
        id="blog-cta"
        title="Put the research to work."
        body="Arabic voice AI, physical-AI data and evaluation, deployed where your data has to stay."
        secondary={{ label: "Explore the stack", href: "/products" }}
      />

      <SiteClose current="Blog" hideBand />
    </main>
  );
}
