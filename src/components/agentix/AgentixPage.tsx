import { CtaBand } from "../shared/CtaBand";
import { IconChip } from "../shared/graphics";
import { PageHero } from "../shared/PageHero";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import styles from "./agentix.module.css";

/* Facts from actualize.pro, the product's own site (docs/content-brief.md, section 8). */
const results = [
  { value: "30%", label: "More calls resolved first time" },
  { value: "37%", label: "Lower operational cost" },
  { value: "43%", label: "Higher customer satisfaction" },
];

/* Where teams use it, and the ready-made agent or feature that covers each. */
const uses = [
  { icon: "consent", title: "Customer support", by: "Receptionist agent", body: "Answers enquiries and common questions, and hands off to a person with the full history." },
  { icon: "check", title: "Appointment booking", by: "Booking confirmation agent", body: "Calls customers to confirm availability, so fewer appointments are missed." },
  { icon: "globe", title: "Concierge", by: "Receptionist agent", body: "Shares business details and schedules callbacks, in the caller's dialect." },
  { icon: "loop", title: "Lead qualification", by: "Sales agent", body: "Engages new leads, answers product questions and books the follow-up." },
  { icon: "pay", title: "Billing support", by: "Order and payment follow-up", body: "Keeps customers updated on payments and refunds over WhatsApp and SMS." },
  { icon: "lock", title: "Collections", by: "Order and payment follow-up", body: "Follows up on payments, and passes the hard cases to a person." },
  { icon: "floor", title: "Logistics", by: "Order and payment follow-up", body: "Looks up order status and keeps customers updated." },
  { icon: "text", title: "Surveys and feedback", by: "Workflow builder", body: "A drag-and-drop flow turns each call into a completed survey." },
] as const;

/** Agentix in three parts: the idea, where teams use it, and the next step. */
export function AgentixPage() {
  const contact = `/contact?${new URLSearchParams({ topic: "Custom AI solutions", about: "Agentix" })}`;

  return (
    <main className={styles.page}>
      <SiteNav current="products" />

      <PageHero
        id="agentix-heading"
        kicker="Agentix · Arabic voice and chat agents"
        title={["Arabic agents", "that finish the job."]}
        lead="Customers call, message and wait. Agentix answers in their dialect across voice, WhatsApp, web chat, app, email and SMS, decides what they need and completes the task, on GCC phone lines."
        actions={[
          { label: "Book a demo", href: contact, primary: true },
          { label: "Visit actualize.pro", href: "https://www.actualize.pro/" },
        ]}
        art={
          <div className={styles.art}>
            <img loading="lazy" decoding="async" src="/art/agentix-ops.svg" alt="Agentix live operations: every conversation with its channel, intent and sentiment" />
            <dl className={styles.results}>
              {results.map((result) => (
                <div key={result.label}>
                  <dt>{result.value}</dt>
                  <dd>{result.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
      />

      <section className={styles.uses} aria-labelledby="uses-heading">
        <header className={styles.head}>
          <p className={styles.kicker}>Where teams use it</p>
          <h2 id="uses-heading">One platform, ready for the calls that keep coming.</h2>
          <p className={styles.dek}>
            Start from a ready-made agent, adjust its flow, and put it on your line. Standard onboarding takes under two
            days.
          </p>
        </header>
        <ul className={styles.grid}>
          {uses.map((use) => (
            <li key={use.title} data-tilt>
              <IconChip name={use.icon} />
              <h3>{use.title}</h3>
              <p>{use.body}</p>
              <span className={styles.by}>{use.by}</span>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand
        id="agentix-cta"
        title="Put an Arabic-speaking agent on your line."
        body="Tell us which calls and chats you want handled, and on which systems. Agentix and Faseeh were built by Actualize, now part of CNTXT."
        primary={{ label: "Book a demo", href: contact }}
        secondary={{ label: "Visit actualize.pro", href: "https://www.actualize.pro/" }}
      />

      <SiteClose current="Build AI" hideBand />
    </main>
  );
}
