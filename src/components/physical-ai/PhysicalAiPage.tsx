import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import styles from "./physicalAi.module.css";
import { faqs } from "../shared/faqs";
import { Faq } from "../shared/Faq";
import { PhysicalWorld } from "./FactoryWalkthrough";
import { PhysicalAccordion } from "../home/PhysicalAccordion";
import { CtaBand } from "../shared/CtaBand";
import { WhyBento } from "./WhyBento";


export function PhysicalAiPage() {
  return (
    <main className={styles.page} data-world>
      <SiteNav />

      <PhysicalWorld />

      <div id="use-cases">
        <PhysicalAccordion
          title="Explore by vertical"
          body="The robots this data is for. Open one to see the work it learns from, the labels it needs and our data samples."
          button={false}
        />
      </div>

      <WhyBento />

      <Faq items={faqs.physicalAi} topic="Physical AI data" />

      <CtaBand
        id="physical-cta"
        title="Have a problem that needs real AI, not demos?"
        body="Tell us what your robot needs to learn. We will scope the environments, tasks and labels with you."
        primary={{ label: "Book a demo", href: "/contact?topic=Physical%20AI%20data" }}
        secondary={{ label: "Speak to an expert", href: "/contact?topic=Physical%20AI%20data&about=Expert%20session" }}
      />

      <SiteClose hideBand />
    </main>
  );
}
