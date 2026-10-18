import { Hero } from "../Hero";
import { BlogRail } from "./BlogRail";
import { CustomerSpotlights } from "./CustomerSpotlights";
import { LogoMarquee, SecurityBand } from "./HomeSections";
import { PhysicalAccordion } from "./PhysicalAccordion";
import { ChapterRail } from "./ChapterRail";
import { PipelineBand } from "./PipelineBand";
import { IndustriesSection } from "../shared/IndustriesSection";
import { StackStory } from "./StackStory";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { ResultsBand } from "../shared/ResultsBand";
import styles from "./home.module.css";

function Eyebrow({ children }: { children: string }) {
  return (
    <p className={styles.eyebrow}>
      <span className={styles.tag} aria-hidden="true" />
      {children}
    </p>
  );
}

export function HomePage() {
  return (
    <main className={styles.page}>
      <SiteNav pinAfterHero />
      <ChapterRail />
      <Hero />

      <LogoMarquee />

      <StackStory
        stages={[
          {
            label: "Real work",
            title: "Data from the places AI has never seen.",
            body: "We record real jobs on warehouse floors, in kitchens, hotels and hospitals, with every worker's consent, through our KLKT app.",
            stat: (
              <>
                Consent in <strong>4 languages</strong>: Arabic, English, Filipino and Urdu.
              </>
            ),
            cta: { label: "Explore Physical AI", href: "/physical-ai" },
          },
          {
            label: "Verified data",
            title: "Checked by people, hour by hour.",
            body: "Text, speech, vision and robotics data, reviewed by a person before it is accepted and labelled with human-in-the-loop checks.",
            stat: (
              <>
                <strong>98%</strong> labelling accuracy.
              </>
            ),
            cta: { label: "Explore the Data Hub", href: "/data-hub" },
          },
          {
            label: "Models",
            title: "Models trained on real work.",
            body: "Munsit, our Arabic speech model, is trained from 30,000+ hours across 25+ dialects, on a patented architecture.",
            stat: (
              <>
                <strong>#1</strong> on the Hugging Face Open Universal Arabic ASR Leaderboard.
              </>
            ),
            cta: { label: "Explore Munsit", href: "https://munsit.com" },
          },
          {
            label: "Agents",
            title: "Agents that finish the job.",
            body: "Agentix runs Arabic voice and chat agents with workflow automation and GCC telephony, in the cloud or on your own premises.",
            stat: (
              <>
                <strong>20+</strong> enterprise deployments.
              </>
            ),
            cta: { label: "Explore Agentix", href: "/agentix" },
          },
        ]}
      />

      <PipelineBand />

      <PhysicalAccordion />

      <IndustriesSection />

      <CustomerSpotlights eyebrow={<Eyebrow>Customer spotlights</Eyebrow>} />

      <ResultsBand />

      <SecurityBand />

      <BlogRail
        eyebrow={<Eyebrow>Latest</Eyebrow>}
        title={
          <>
            From the floor to the real world.{" "}
            <br />
            The latest from CNTXT.
          </>
        }
      />

      <section className={styles.band} aria-labelledby="ready-heading">
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-left.webp" alt="" />
        </div>
        <div>
          <h2 id="ready-heading">Your site. Your data. Your AI.</h2>
          <p>Book a demo and see how CNTXT builds real-world AI for your organisation.</p>
          <a href="/contact">
            Book a demo
            <span>
              <img src="/healthcare/caret.svg" alt="" width={23} height={23} />
            </span>
          </a>
        </div>
        <div className={styles.mapEdge} aria-hidden="true">
          <img src="/security/map-right.webp" alt="" />
        </div>
      </section>
      <SiteClose hideBand />
    </main>
  );
}
