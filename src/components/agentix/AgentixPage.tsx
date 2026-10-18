import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import base from "../industries/industry.module.css";
import styles from "./agentix.module.css";
import { faqs } from "../shared/faqs";
import { Faq } from "../shared/Faq";
import { AgentFlows, CallFlow, CountUp, HeroCall, LiveOps, PlatformStack, ProviderOrbit } from "./AgentixVisuals";

/* Facts on this page come from the product's own site, actualize.pro (see docs/content-brief.md, section 8). */

const results = [
  { value: 30, label: "More calls resolved first time" },
  { value: 37, label: "Lower operational cost" },
  { value: 43, label: "Higher customer satisfaction" },
];

const layers = [
  {
    key: "voice",
    title: "A full voice stack",
    body: "Speech-to-text, text-to-speech and intent in one pipeline, built on Faseeh, our Arabic speech models. Arabic speech streams back in under 150 milliseconds.",
  },
  {
    key: "channels",
    title: "Every channel, one agent",
    body: "Voice calls, WhatsApp, web chat, app, email and SMS share the same knowledge base and history, so a customer never starts again.",
  },
  {
    key: "telephony",
    title: "GCC telephony",
    body: "UAE, Saudi and Qatar numbers over SIP and WebRTC, compatible with PABX, Cisco and Avaya systems.",
  },
  {
    key: "workflows",
    title: "Drag-and-drop workflows",
    body: "A visual builder turns a conversation into completed work: bookings, updates, payments and follow-ups.",
  },
];

const agents = [
  {
    name: "Receptionist",
    body: "Handles enquiries, answers common questions, shares business details and schedules callbacks.",
    channel: "Voice · WhatsApp",
    steps: ["Answer the enquiry", "Share business details", "Answer common questions", "Schedule a callback"],
  },
  {
    name: "Booking confirmation",
    body: "Follows up with customers to confirm availability, so fewer appointments are missed.",
    channel: "Outbound voice",
    steps: ["Call the customer", "Confirm availability", "Update the booking", "Send the confirmation"],
  },
  {
    name: "Sales agent",
    body: "Engages leads and schedules the follow-up.",
    channel: "Voice · Web chat",
    steps: ["Engage the lead", "Answer product questions", "Schedule the follow-up"],
  },
  {
    name: "Order and payment follow-up",
    body: "Tracks order status and keeps customers updated on payments and refunds.",
    channel: "WhatsApp · SMS",
    steps: ["Look up the order", "Update on payment or refund", "Hand off to a person if needed"],
  },
];

const uses = [
  "Customer support",
  "Appointment booking",
  "Concierge",
  "Logistics",
  "Collections",
  "Surveys and feedback",
  "Lead qualification",
  "Billing support",
];

const facts = [
  { label: "Languages", value: "Arabic dialects, English, Hindi and French, including mixed Arabic and English." },
  { label: "Dialects", value: "Emirati, Saudi, Kuwaiti, Qatari and Bahraini, with Khaleeji, Najdi and Hijazi voices." },
  { label: "Speed", value: "Arabic speech streams back in under 150 milliseconds." },
  { label: "Live operations", value: "A dashboard shows every conversation, with sentiment, intent and handoff to a person." },
  { label: "Deployment", value: "Cloud hosted in the GCC, a private VPC, or on your own premises." },
  { label: "Set-up", value: "Standard onboarding takes less than two days; custom integrations take longer." },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className={base.eyebrow}>
      <span className={base.tag} aria-hidden="true" />
      {children}
    </p>
  );
}

export function AgentixPage() {
  const contact = `/contact?${new URLSearchParams({ topic: "Custom AI solutions", about: "Agentix" })}`;

  return (
    <main className={base.page}>
      <SiteNav current="products" />

      <section className={`${base.hero} ${styles.hero}`} aria-labelledby="agentix-heading">
        <div className={base.heroCopy}>
          <p className={base.heroEyebrow}>Agentix · Arabic voice and chat agents</p>
          <h1 id="agentix-heading">Arabic voice and chat agents that finish the job.</h1>
          <p>
            Customers call, message and wait. Agentix answers in their dialect, decides what they
            need and completes the task: a booking, an update, a payment follow-up.
          </p>
          <div className={styles.heroActions}>
            <a className={base.primary} href={contact}>
              Book a demo
              <img src="/home/caret.svg" alt="" width={24} height={24} />
            </a>
            <a className={styles.ghost} href="#platform">
              See how it works
            </a>
          </div>
        </div>
        <HeroCall />
      </section>

      <section className={styles.results} aria-labelledby="results-heading">
        <h2 id="results-heading" className={styles.resultsTitle}>
          Results published for Agentix deployments
        </h2>
        <dl>
          {results.map((result) => (
            <div key={result.label}>
              <dt>
                <CountUp value={result.value} />
              </dt>
              <dd>{result.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="flow-heading">
        <Eyebrow>How it works</Eyebrow>
        <h2 id="flow-heading">From a call to finished work, in five steps.</h2>
        <CallFlow />
      </section>

      <section className={styles.section} id="platform" aria-labelledby="platform-heading">
        <Eyebrow>The platform</Eyebrow>
        <h2 id="platform-heading">One platform for the whole conversation.</h2>
        <p className={styles.dek}>
          Four layers that most teams stitch together from separate vendors, in one product built
          for Arabic.
        </p>
        <PlatformStack layers={layers} />
      </section>

      <section className={styles.section} aria-labelledby="agents-heading">
        <Eyebrow>Ready-made agents</Eyebrow>
        <h2 id="agents-heading">Start from an agent that already knows the job.</h2>
        <AgentFlows agents={agents} />
        <ul className={styles.uses} aria-label="Common uses">
          {uses.map((use) => (
            <li key={use}>{use}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="ops-heading">
        <Eyebrow>Live operations</Eyebrow>
        <h2 id="ops-heading">Every conversation, visible as it happens.</h2>
        <p className={styles.dek}>
          A dashboard shows each conversation with its channel, intent and sentiment, and when it was
          handed to a person.
        </p>
        <div className={styles.opsWrap}>
          <LiveOps />
        </div>
      </section>

      <section className={styles.telephony} aria-labelledby="telephony-heading">
        <div>
          <p className={base.studyEyebrow}>Telephony and regions</p>
          <h2 id="telephony-heading">Plugs into the phone system you already run.</h2>
          <p>
            Agentix connects to your SIP provider or PABX and places and answers calls on local
            numbers.
          </p>
          <img className={styles.flags} src="/brand/agentix/mena-flags.png" alt="UAE, Saudi Arabia and Qatar" width={172} height={46} />
        </div>
        <ProviderOrbit />
      </section>


      <section className={styles.facts} aria-labelledby="facts-heading">
        <Eyebrow>The details</Eyebrow>
        <h2 id="facts-heading">Built for the Gulf, in the UAE.</h2>
        <dl>
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.source}>
          Agentix and Faseeh were built by Actualize, which CNTXT acquired in June 2026. Figures
          are those published for the platform.
        </p>
      </section>

      <Faq items={faqs.agentix} topic="Custom AI solutions" />

      <section className={base.more} aria-labelledby="related-heading">
        <h2 id="related-heading">Related</h2>
        <ul>
          <li>
            <a href="https://munsit.com">
              Munsit, Arabic voice AI <span aria-hidden="true">→</span>
            </a>
          </li>
          <li>
            <a href="/products">
              The full stack <span aria-hidden="true">→</span>
            </a>
          </li>
          <li>
            <a href="/security">
              Security <span aria-hidden="true">→</span>
            </a>
          </li>
        </ul>
      </section>

      <section className={base.band} aria-labelledby="agentix-cta">
        <h2 id="agentix-cta">Put an Arabic-speaking agent on your line.</h2>
        <p>Tell us which calls and chats you want handled, and on which systems.</p>
        <a className={base.primary} href={contact}>
          Book a demo
          <img src="/home/caret.svg" alt="" width={24} height={24} />
        </a>
      </section>

      <SiteClose current="Build AI" hideBand />
    </main>
  );
}
