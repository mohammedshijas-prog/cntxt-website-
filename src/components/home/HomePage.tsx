"use client";

import { useState } from "react";
import { Hero } from "../Hero";
import { BlogRail } from "./BlogRail";
import { IndustriesSection } from "../shared/IndustriesSection";
import { LogoZoom } from "./LogoZoom";
import { ScrollStory } from "./ScrollStory";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import styles from "./home.module.css";

const logos = [
  { src: "/healthcare/logo-zenzap.png", name: "ZenZap", width: 64, height: 20 },
  { src: "/healthcare/logo-sparkle.png", name: "sparkle", width: 72, height: 20 },
  { src: "/healthcare/logo-craftgram.png", name: "Craftgram", width: 98, height: 20 },
  { src: "/healthcare/logo-pulse.png", name: "Pulse", width: 77, height: 20 },
  { src: "/healthcare/logo-pulse.png", name: "Pulse", width: 77, height: 20 },
  { src: "/healthcare/logo-pulse.png", name: "Pulse", width: 77, height: 20 },
];

const dek =
  "why real data, real people and real deployment context are non-negotiable for AI that has to work outside the lab.";

const munsit =
  "The #1 ranked Arabic ASR model worldwide. Munsit delivers industry-leading Arabic Speech-to-Text and Text-to-Speech, powering real-time transcription, voice interaction, and content creation across the Arab world.";

function Eyebrow({ children }: { children: string }) {
  return (
    <p className={styles.eyebrow}>
      <span className={styles.tag} aria-hidden="true" />
      {children}
    </p>
  );
}

function Explore({ href, children }: { href: string; children: string }) {
  return (
    <a className={styles.pill} href={href}>
      {children}
      <img src="/home/caret.svg" alt="" width={24} height={24} />
    </a>
  );
}

export function HomePage() {
  const [logo, setLogo] = useState(0);

  return (
    <main className={styles.page}>
      <SiteNav pinAfterHero />
      <Hero />

      <ScrollStory
        steps={[
          { title: "Real-world AI has no shortcuts.", body: dek },
          {
            title: "More applications that actually work.",
            body: dek,
            cta: <Explore href="/data-hub">Explore data services</Explore>,
          },
          {
            title: "Data powering AI that real humans use.",
            body: dek,
            cta: <Explore href="/data-hub">Explore data services</Explore>,
          },
          {
            title: "Real-world AI is lacking context.",
            body: dek,
            center: true,
          },
        ]}
      />

      <LogoZoom />

      <IndustriesSection />

      <section className={styles.customers} aria-labelledby="customers-heading">
        <Eyebrow>Customers & results</Eyebrow>
        <h2 id="customers-heading">
          Stale context. Lost work.
          <br />
          Governance rebuilt every time.
        </h2>
        <div className={styles.logoBar} role="tablist" aria-label="Customers">
          {logos.map((item, index) => (
            <button
              key={`${item.name}-${index}`}
              type="button"
              role="tab"
              aria-selected={logo === index}
              aria-label={item.name}
              onClick={() => setLogo(index)}
            >
              <img src={item.src} alt="" width={item.width} height={item.height} />
            </button>
          ))}
        </div>
        <div className={styles.result}>
          <div className={styles.brand}>
            <img className={styles.brandBg} src="/healthcare/brand-bg.png" alt="" />
            <img className={styles.brandMark} src="/healthcare/brand-mark.svg" alt="" width={138} height={138} />
            <img className={styles.brandWord} src="/healthcare/brand-word.svg" alt="Craftgram" width={312} height={66} />
          </div>
          <div className={styles.metric}>
            <p>The orchestration layer simplifies complex workflows and makes easier to manage.</p>
            <div>
              <strong>85%</strong>
              <span>Reduction in manual work</span>
            </div>
          </div>
          <figure>
            <img src="/healthcare/portrait.png" alt="" width={144} height={144} />
            <blockquote>
              AgentLab brings much-needed structure to AI automation workflows. The orchestration layer makes complex systems easier to understand, manage efficiently, and scale without breaking.”
            </blockquote>
            <figcaption>
              <strong>Colton Pond</strong>
              <span>Head of Partnership</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.standards} aria-labelledby="standards-heading">
        <Eyebrow>Standards</Eyebrow>
        <h2 id="standards-heading">The basis we work on</h2>
        <ul>
          <li>
            <img src="/solutions/panel-build.png" alt="" />
            <h3>Model & data isolation</h3>
            <p>Your data and models are fully isolated from other customers. No cross-contamination, no shared infrastructure risks.</p>
          </li>
          <li>
            <img src="/solutions/panel-guard.png" alt="" />
            <h3>Annotator vetting & NDAs</h3>
            <p>Every annotator undergoes thorough vetting and signs strict NDAs before accessing any data, ensuring confidentiality</p>
          </li>
          <li>
            <img src="/solutions/panel-eval.png" alt="" />
            <h3>Incident response</h3>
            <p>A dedicated incident response team is ready around the clock, with clear protocols to detect, contain, and resolve security</p>
          </li>
        </ul>
      </section>

      <BlogRail eyebrow={<Eyebrow>Blogs</Eyebrow>} />

      <section className={styles.engine} aria-labelledby="engine-heading">
        <Eyebrow>Our engine</Eyebrow>
        <h2 id="engine-heading">Our engine</h2>
        <article>
          <div>
            <img src="/home/munsit.svg" alt="Munsit" width={174} height={42} />
            <p>{munsit}</p>
            <a href="/contact">
              Explore Munsit
              <span>
                <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
              </span>
            </a>
          </div>
          <div className={styles.visual}>
            <img src="/home/munsit-ui.png" alt="" />
            <span className={styles.overlay}>
              <img src="/home/munsit-shot.png" alt="" />
            </span>
          </div>
        </article>
        <article className={styles.flip}>
          <img src="/home/klkt-ui.png" alt="" />
          <div>
            <p className={styles.klkt}>
              <img src="/home/klkt-mark.svg" alt="" width={41.306} height={36.8189} />
              <img src="/home/klkt-word.svg" alt="KLKT" width={152.89} height={38.0077} />
            </p>
            <p>{munsit}</p>
            <a href="/klkt">
              Explore Munsit
              <span>
                <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
              </span>
            </a>
          </div>
        </article>
        <article>
          <div>
            <h3>Agentix</h3>
            <p>{munsit}</p>
            <a href="/contact">
              Explore Munsit
              <span>
                <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
              </span>
            </a>
          </div>
          <img src="/home/agentix-ui.png" alt="" />
        </article>
        <article className={styles.flip}>
          <img src="/home/lab-ui.png" alt="" />
          <div>
            <h3 className={styles.lab}>AI Lab</h3>
            <p>
              The #1 ranked Arabic ASR model worldwide. Munsit delivers industry-leading Arabic Speech-to-Text and Text-to-Speech, powering real-time transcriptio
            </p>
            <a href="/contact">
              Explore Munsit
              <span>
                <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
              </span>
            </a>
          </div>
        </article>
      </section>

      <section className={styles.band} aria-labelledby="ready-heading">
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-left.svg" alt="" />
        </div>
        <div>
          <h2 id="ready-heading">Ready to build?</h2>
          <p>One line of supporting copy.</p>
          <a href="/contact">
            Get started
            <span>
              <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-right.svg" alt="" />
        </div>
      </section>
      <SiteClose hideBand />
    </main>
  );
}
