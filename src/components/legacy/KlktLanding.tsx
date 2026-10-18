import Link from "next/link";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import styles from "./klktLanding.module.css";

/*
 * cntxt.tech/ai-klkt, carried over from the current site. KLKT ads point here,
 * so the copy and the Adjust links (one ad group per button) are kept exactly.
 * Keep this page until the new KLKT page is live on klkt.app.
 */
const adjust = (adgroup: string) => `https://app.adjust.com/2415t5fd?campaign=landing&adgroup=${adgroup}`;

const promises = [
  "Clear instructions for every task",
  "Accepted work is paid in US dollars, by PayPal or a payment method available in your country.",
  "Money, never points or gift cards",
  "Free to join, no fees, ever",
];

const steps = [
  { title: "Download KLKT", body: "Free on the App Store and Google Play." },
  { title: "Pick your task", body: "Read the instructions and see what is open in your country before you start." },
  { title: "Submit from your phone", body: "Track every submission and your earnings live in the app." },
  { title: "Get Paid", body: "Accepted work is paid in US dollars, by PayPal or a payment method available in your country." },
];

const tasks = [
  {
    title: "Photograph Handwritten Arabic Documents",
    body: "Photograph handwritten Arabic pages, at least 50 words each. Paid per accepted page. No experience needed.",
    image: "/legacy/klkt/task-handwriting.webp",
    href: adjust("task-handwriting"),
  },
  {
    title: "Record Everyday Activities",
    body: "Record everyday tasks at home from your point of view, with your phone on a head strap. Paid per accepted hour. Needs iPhone 11, Pixel 6, Galaxy S21 or newer.",
    image: "/legacy/klkt/task-video.webp",
    href: adjust("task-video"),
  },
];

const reasons = [
  {
    title: "Backed by a registered company in the UAE",
    body: "KLKT is operated by CNTXT AI, a data and AI company based in Abu Dhabi. Your work goes into AI projects that are reviewed and paid.",
  },
  {
    title: "Clear by design",
    body: "Every task explains what to do and how it is paid. Your task status and earnings are visible in the app. You are paid for every accepted submission.",
  },
  {
    title: "Money, not points",
    body: "Accepted work is paid in US dollars, by PayPal or a payment method available in your country. No points, no vouchers, no minimum-balance games.",
  },
  {
    title: "Nothing to pay, ever",
    body: "Joining, tasks, and cashout are all free. We never ask you for a fee, a deposit, or a payment of any kind.",
  },
];

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "Is KLKT safe? How do I know this isn't a scam?",
    a: (
      <>
        Fair question, this category is full of fake earn-money apps. Here is how to verify us: KLKT is operated by CNTXT AI, a
        registered Data and AI company headquartered in the UAE (CNTXT-FZCO). You can look us up at <Link href="/">cntxt.tech</Link> or
        on LinkedIn. We will never ask you for money, a deposit, or a fee of any kind. If anyone claiming to be KLKT asks you to pay
        anything, it is not us.
      </>
    ),
  },
  { q: "Is KLKT free to use?", a: "Yes. Joining and completing tasks are completely free. We will never ask you for a fee, a deposit, or a payment of any kind." },
  {
    q: "What kind of tasks will I do?",
    a: "Simple tasks you can do from your phone, like photographing handwritten Arabic documents or recording short videos of everyday activities. Each task shows its instructions and whether it is open in your country before you start. New tasks are added regularly.",
  },
  {
    q: "How much can I earn?",
    a: "Each task is paid per accepted page or per accepted hour, and the amount depends on the project. Earnings depend on how many tasks you complete and how many are accepted. KLKT is extra income in your spare time, not a full salary, and we will never promise otherwise.",
  },
  {
    q: "When and how do I get paid?",
    a: "You are paid in US dollars for every accepted submission, by PayPal or a payment method available in your country. Add your payout details in the app and track your submissions and earnings there.",
  },
  {
    q: "Why do submissions get rejected?",
    a: "Submissions are reviewed before payment. The most common reasons for rejection: blurry or dark photos, text cut off at the edges, screenshots or printed-only documents instead of handwriting, content that does not follow the task instructions, or duplicates. Read the instructions in each task before you start, and you will be fine.",
  },
  {
    q: "Which countries can join?",
    a: "KLKT is available in the countries listed on the App Store and Google Play. Anyone 18 or older there can create a free account. Which tasks are open depends on the project and your country, and the app shows what is available where you are.",
  },
  {
    q: "What about my privacy?",
    a: (
      <>
        Your submissions are used to train AI models by CNTXT AI and its partners. We never process your content to identify you.
        Never include personal information in your submissions, such as ID cards, medical records, or other people&apos;s details.
        Full details are in the <Link href="/klkt-privacy-policy">KLKT Privacy Policy</Link> and the{" "}
        <Link href="/klkt-terms-conditions">KLKT Terms and Conditions</Link>, linked at the bottom of this page.
      </>
    ),
  },
];

function StoreButtons() {
  return (
    <div className={styles.stores}>
      <a className={styles.store} href={adjust("hero-android")}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path fill="currentColor" d="M3.6 2.3 13.4 12l-9.8 9.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1Zm11 8.5 2.6-2.6 3.3 1.9c.9.5.9 1.4 0 1.9l-3.3 1.9-2.6-2.6Zm-1.2 1.2 2.6 2.6-11 6.3 8.4-8.9Zm0-2.4L5 3.4l11 6.3-2.6 2.6Z" />
        </svg>
        <span>
          <small>Download on the</small>Google Play
        </span>
      </a>
      <a className={styles.store} href={adjust("hero-ios")}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path fill="currentColor" d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.8 1.2 1.8 2.6 3.1 2.5 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.6-1-2.6-4.2ZM13.9 4.9c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4Z" />
        </svg>
        <span>
          <small>Download on the</small>App Store
        </span>
      </a>
    </div>
  );
}

export function KlktLanding() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero} aria-labelledby="klkt-heading">
        <div className={styles.heroCopy}>
          <h1 id="klkt-heading">Get paid for everyday tasks, from your phone</h1>
          <p>
            Pick a task, do it on your phone, get paid for what is accepted. KLKT is built by CNTXT AI, a company based in Abu Dhabi.
            Free to join, always.
          </p>
          <StoreButtons />
        </div>
        <img className={styles.heroArt} src="/legacy/klkt/hero-phones.webp" alt="The KLKT app on two phones" width={623} height={729} />
        <ul className={styles.promises}>
          {promises.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className={styles.steps} aria-labelledby="steps-heading">
        <div>
          <p className={styles.kicker}>How It Works</p>
          <h2 id="steps-heading">From download to payment in four steps</h2>
        </div>
        <ol>
          {steps.map((step, index) => (
            <li key={step.title}>
              <span>{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.tasks} aria-labelledby="tasks-heading">
        <p className={styles.kicker}>Tasks Open Now</p>
        <h2 id="tasks-heading">Choose what fits you</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task.title}>
              <div className={styles.taskImage}>
                <img src={task.image} alt="" />
                <span>{task.title}</span>
              </div>
              <p>{task.body}</p>
              <a className={styles.primary} href={task.href}>
                Start This Task <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.more}>
          New tasks are added regularly.
          <br />
          Download the app to see everything open in your country.
        </p>
      </section>

      <section className={styles.reasons} aria-labelledby="reasons-heading">
        <p className={styles.kicker}>Why contributors choose KLKT</p>
        <h2 id="reasons-heading">Built for you to earn with confidence</h2>
        <ul>
          {reasons.map((reason) => (
            <li key={reason.title}>
              <h3>{reason.title}</h3>
              <p>{reason.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.faq} aria-labelledby="klkt-faq">
        <h2 id="klkt-faq">FAQ</h2>
        <div>
          {faqs.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.final} aria-labelledby="final-heading">
        <div>
          <h2 id="final-heading">
            Your first task
            <br />
            is waiting
          </h2>
          <p>Download KLKT, pick a task open in your country, and get paid for accepted work.</p>
          <a className={styles.primary} href={adjust("footer-cta")}>
            Start This Task <span aria-hidden="true">→</span>
          </a>
          <ul>
            <li>By CNTXT AI, Abu Dhabi</li>
            <li>Paid in US dollars</li>
            <li>Free to join</li>
          </ul>
        </div>
        <img src="/legacy/klkt/cta-phones.webp" alt="" />
      </section>

      <SiteClose hideBand />
    </main>
  );
}
