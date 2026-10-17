import { IconChip } from "../shared/graphics";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import base from "../industries/industry.module.css";
import styles from "./agentix.module.css";
import { faqs } from "../shared/faqs";
import { Faq } from "../shared/Faq";
import { ProofBar } from "../shared/ProofBar";

/* Facts on this page come from the product's own site, actualize.pro (see docs/content-brief.md, section 8). */

const results = [
  { value: "30%", label: "More calls resolved first time" },
  { value: "37%", label: "Lower operational cost" },
  { value: "43%", label: "Higher customer satisfaction" },
];

const capabilities = [
  {
    icon: "camera",
    title: "A full voice stack",
    body: "Speech-to-text, text-to-speech and intent in one pipeline, built on Faseeh, our Arabic speech models.",
  },
  {
    icon: "consent",
    title: "Every channel, one agent",
    body: "Voice calls, WhatsApp, web chat, app, email and SMS share the same knowledge base and history.",
  },
  {
    icon: "globe",
    title: "GCC telephony",
    body: "UAE, Saudi and Qatar numbers over SIP and WebRTC, compatible with PABX, Cisco and Avaya systems.",
  },
  {
    icon: "loop",
    title: "Drag-and-drop workflows",
    body: "A visual builder turns a conversation into completed work: bookings, updates, payments and follow-ups.",
  },
] as const;

const agents = [
  { name: "Receptionist", body: "Handles enquiries, answers common questions, shares business details and schedules callbacks." },
  { name: "Booking confirmation", body: "Follows up with customers to confirm availability, so fewer appointments are missed." },
  { name: "Sales agent", body: "Engages leads and schedules the follow-up." },
  { name: "Order and payment follow-up", body: "Tracks order status and keeps customers updated on payments and refunds." },
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

      <section className={base.hero} aria-labelledby="agentix-heading">
        <div className={base.heroCopy}>
          <p className={base.heroEyebrow}>Agentix · Conversational AI platform</p>
          <h1 id="agentix-heading">Arabic voice and chat agents that finish the job.</h1>
          <p>
            Agentix runs voice, chat and workflow automation on one platform, with native Arabic
            speech and GCC telephony. Agents answer, decide and complete the task: a booking, an
            update, a payment follow-up.
          </p>
          <a className={base.primary} href={contact}>
            Book a demo
            <img src="/home/caret.svg" alt="" width={24} height={24} />
          </a>
        </div>
        <dl className={base.results}>
          {results.map((result) => (
            <div key={result.label}>
              <dt>{result.value}</dt>
              <dd>{result.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.screen} aria-label="The Agentix dashboard">
        <img src="/art/agentix-ops.svg" alt="Agentix live operations: conversations across voice, WhatsApp, web chat and SMS, with sentiment, intent and hand-off to a person" />
      </section>

      <ProofBar />

      <section className={base.solutions} aria-labelledby="capabilities-heading">
        <Eyebrow>What it does</Eyebrow>
        <h2 id="capabilities-heading">One platform for the whole conversation.</h2>
        <ul>
          {capabilities.map((item) => (
            <li key={item.title}>
              <IconChip name={item.icon} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={base.problems} aria-labelledby="agents-heading">
        <div>
          <Eyebrow>Ready-made agents</Eyebrow>
          <h2 id="agents-heading">Start from an agent that already knows the job.</h2>
          <ul className={styles.uses} aria-label="Common uses">
            {uses.map((use) => (
              <li key={use}>{use}</li>
            ))}
          </ul>
        </div>
        <ol>
          {agents.map((agent, index) => (
            <li key={agent.name}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div className={styles.agent}>
                <strong>{agent.name}</strong>
                {agent.body}
              </div>
            </li>
          ))}
        </ol>
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
        <img
          className={styles.providers}
          src="/brand/agentix/sip-providers.webp"
          alt="SIP providers Agentix connects to, including Maqsam, 3CX, Telnyx, Twilio and Yeastar"
        />
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
