import styles from "./challengeArt.module.css";

/* One visual per challenge, drawn from the facts in the copy beside it. */
export function ChallengeArt({ index }: { index: number }) {
  return (
    <div className={styles.stage} key={index} aria-hidden="true">
      {index === 0 ? <Messy /> : null}
      {index === 1 ? <Arabic /> : null}
      {index === 2 ? <Region /> : null}
      {index === 3 ? <Quality /> : null}
    </div>
  );
}

/* Scattered files fall into labelled, verified rows. */
function Messy() {
  const files = ["scan_0412.pdf", "call_17.wav", "IMG_2291.jpg", "records.xlsx", "clip_08.mp4"];
  const rows = [
    { name: "Documents", tag: "Fields extracted" },
    { name: "Audio", tag: "Transcribed" },
    { name: "Images", tag: "Boxes and masks" },
    { name: "Video", tag: "Actions labelled" },
  ];
  return (
    <div className={styles.messy}>
      <div className={styles.pile}>
        {files.map((file, i) => (
          <span key={file} style={{ "--i": i } as React.CSSProperties}>
            {file}
          </span>
        ))}
      </div>
      <span className={styles.arrow}>→</span>
      <ul className={styles.rows}>
        {rows.map((row, i) => (
          <li key={row.name} style={{ "--i": i } as React.CSSProperties}>
            <b>{row.name}</b>
            <em>{row.tag}</em>
            <i>✓</i>
          </li>
        ))}
      </ul>
      <span className={styles.badge}>98% labelling accuracy</span>
    </div>
  );
}

/* One sentence, many dialects. */
function Arabic() {
  const dialects = ["Emirati", "Saudi", "Kuwaiti", "Qatari", "Bahraini", "Khaleeji", "Najdi", "Hijazi"];
  return (
    <div className={styles.arabic}>
      <div className={styles.wave}>
        {Array.from({ length: 36 }, (_, i) => (
          <i key={i} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>
      <p dir="rtl" lang="ar" className={styles.phrase}>
        هلا، كيف أقدر أساعدك اليوم؟
      </p>
      <div className={styles.dialects}>
        {dialects.map((name, i) => (
          <span key={name} style={{ "--i": i } as React.CSSProperties}>
            {name}
          </span>
        ))}
        <span className={styles.more}>+ more · 25+ dialects</span>
      </div>
      <span className={styles.badge}>Munsit · #1 on the Open Universal Arabic ASR Leaderboard</span>
    </div>
  );
}

/* The data stays put; the model comes to it. */
function Region() {
  return (
    <div className={styles.region}>
      <div className={styles.map}>
        <span className={styles.ring} />
        <span className={`${styles.ring} ${styles.ring2}`} />
        <span className={styles.pin}>Your data stays in region</span>
      </div>
      <div className={styles.deploy}>
        {["On-premises", "Hybrid", "Cloud"].map((name, i) => (
          <span key={name} style={{ "--i": i } as React.CSSProperties}>
            {name}
          </span>
        ))}
      </div>
      <div className={styles.certs}>
        <img loading="lazy" decoding="async" src="/brand/certs/soc2.svg" alt="" width={48} height={48} />
        <img loading="lazy" decoding="async" src="/brand/certs/iso-27001.svg" alt="" width={48} height={48} />
        <img loading="lazy" decoding="async" src="/brand/certs/gdpr.svg" alt="" width={48} height={48} />
        <img loading="lazy" decoding="async" src="/brand/certs/hipaa.svg" alt="" width={48} height={48} />
      </div>
    </div>
  );
}

/* An evaluation checklist that fills in. */
function Quality() {
  const checks = ["Reliability", "Bias", "Compliance", "Retrieval quality"];
  return (
    <div className={styles.quality}>
      <div className={styles.card}>
        <div className={styles.cardHead}>
          <b>Model evaluation</b>
          <span>Reviewed by domain experts</span>
        </div>
        <ul>
          {checks.map((name, i) => (
            <li key={name} style={{ "--i": i } as React.CSSProperties}>
              {name}
              <span className={styles.meter}>
                <i />
              </span>
              <em>Tested</em>
            </li>
          ))}
        </ul>
      </div>
      <span className={styles.badge}>RAGMeter · open source on PyPI</span>
    </div>
  );
}
