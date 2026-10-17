import { IndustryOrbit } from "./IndustryOrbit";
import styles from "./industries.module.css";

/** "Industries we work in" section with the floating, linked industry tiles. */
export function IndustriesSection() {
  return (
    <section className={styles.industries} aria-labelledby="industries-heading">
      <IndustryOrbit />
      <div className={styles.industryCopy}>
        <p>Industries we work in</p>
        <h2 id="industries-heading">
          Real work.
          <br />
          Real <span>industries.</span>
        </h2>
        <a href="/contact">
          Speak to an expert
          <img src="/home/caret.svg" alt="" width={24} height={24} />
        </a>
      </div>
    </section>
  );
}
