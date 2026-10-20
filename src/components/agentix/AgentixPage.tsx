import { Faq } from "../shared/Faq";
import { faqs } from "../shared/faqs";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import { AgentixHero } from "./AgentixHero";
import { GetStarted, Integrations, Offering, Outcomes, UseCases } from "./AgentixSections";
import styles from "./agentix.module.css";

/* Facts from actualize.pro, the product's own site (docs/content-brief.md, section 8). */
const results = [
  { value: "30%", label: "More calls resolved first time" },
  { value: "37%", label: "Lower operational cost" },
  { value: "43%", label: "Higher customer satisfaction" },
];

/**
 * Agentix, after the 11x and ElevenLabs agent pages: a dark hero, use cases as
 * a card deck, outcomes, the platform in depth, integrations, ways to start
 * and the questions buyers ask.
 */
export function AgentixPage() {
  const contact = `/contact?${new URLSearchParams({ topic: "Custom AI solutions", about: "Agentix" })}`;

  return (
    <main className={styles.page}>
      <SiteNav current="products" />
      <AgentixHero contact={contact} results={results} />
      <UseCases />
      <Outcomes />
      <Offering />
      <Integrations contact={contact} />
      <GetStarted contact={contact} />
      <Faq items={faqs.agentix} topic="Custom AI solutions" />
      <SiteClose current="Build AI" hideBand />
    </main>
  );
}
