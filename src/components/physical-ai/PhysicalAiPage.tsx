import { AnnotationMock, IconChip, IsoFloor, KitArt } from "../shared/graphics";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import styles from "./physicalAi.module.css";
import { faqs } from "../shared/faqs";
import { Faq } from "../shared/Faq";
import { BackgroundVideo } from "../shared/VideoToggle";
import { EgoGrid, FeatureTabs, HeatGrid, LayerGlyph } from "./FeatureTabs";
import { FactoryWalkthrough } from "./FactoryWalkthrough";

/** Frames from our first-person footage, each with the action it shows. */
const clips = [
  { src: "/art/ego-aisle-reach.webp", label: "Reach into the rack" },
  { src: "/art/ego-shelf-pick.webp", label: "Pick a carton" },
  { src: "/art/ego-shelf-place.webp", label: "Place on the shelf" },
  { src: "/art/ego-trolley.webp", label: "Push the trolley" },
  { src: "/art/ego-vials.webp", label: "Sort the vials" },
  { src: "/art/ego-control-panel.webp", label: "Operate the panel" },
];

/** Verified figures only (docs/content-brief.md). */
const stats = [
  { label: "Frames", note: "Annotated in six months for one robotics lab", value: "1.8M" },
  { label: "Hours reviewed", note: "Every recorded hour checked by a person", value: "100%" },
  { label: "Labelling accuracy", note: "With human-in-the-loop quality checks", value: "98%" },
  { label: "Consent languages", note: "Arabic, English, Filipino and Urdu", value: "4" },
];

const useCases = [
  {
    title: "Robotics training",
    body: "Vision data for humanoid robots in restaurant and kitchen work: 1.8 million frames in six months.",
    href: "#case-heading",
    image: "/art/ego-shelf-pick.webp",
  },
  {
    title: "Warehouse and logistics",
    body: "Picking, packing and shelf stocking, recorded first-person and labelled step by step.",
    href: "/data-hub?category=Video",
    image: "/art/ego-aisle-reach.webp",
  },
  {
    title: "Healthcare support",
    body: "Hospital portering and support work, captured with consent for robots that assist on the ward.",
    href: "/healthcare",
    image: "/art/ego-trolley.webp",
  },
];

const environments = [
  { place: "Warehouses", roles: "Picking, packing and shelf stocking" },
  { place: "Kitchens", roles: "Line cooking and kitchen portering" },
  { place: "Hotels", roles: "Housekeeping, laundry and cleaning" },
  { place: "Hospitals", roles: "Portering and support work" },
];

const kit = [
  {
    kind: "phone",
    title: "Phone and head strap",
    body: "Recording starts from the KLKT app on a recent phone, such as an iPhone 11, Pixel 6 or Galaxy S21 and newer.",
  },
  {
    kind: "head",
    title: "Head camera",
    body: "A head-mounted camera captures the first-person view of each task, leaving both hands free.",
  },
  {
    kind: "wrist",
    title: "Roboband wrist cameras",
    body: "Wristbands on the left and right hand record close-up views of grasping and handling.",
  },
] as const;

const reasons = [
  {
    icon: "loop",
    title: "One company, end to end",
    body: "We capture the data, verify it, train models on it and deploy AI, so the people labelling know what the data is for.",
  },
  {
    icon: "check",
    title: "Human review on every hour",
    body: "Acceptance is decided by a person, and labelling is checked with a human in the loop.",
  },
  {
    icon: "consent",
    title: "Consent in four languages",
    body: "Workers read and agree to the terms in Arabic, English, Filipino or Urdu.",
  },
  {
    icon: "pay",
    title: "Fair pay for contributors",
    body: "People are paid in US dollars for every accepted hour, with no fees to join, work or cash out.",
  },
  {
    icon: "globe",
    title: "In-region when you need it",
    body: "Data can be hosted and processed in region to meet data-residency requirements.",
  },
  {
    icon: "lock",
    title: "Security and compliance",
    body: "SOC 2 Type II and ISO 27001, with GDPR and HIPAA listed in our trust centre.",
  },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className={styles.eyebrow}>
      <span className={styles.tag} aria-hidden="true" />
      {children}
    </p>
  );
}

export function PhysicalAiPage() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero} aria-labelledby="physical-heading">
        <BackgroundVideo src="/home/hero-video.mp4" poster="/hero-bg.webp" />
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}>Physical AI data engine</p>
          <h1 id="physical-heading">Real work, recorded as training data for robots.</h1>
          <p>
            First-person video of everyday jobs, recorded with consent, checked by people and
            labelled for robotics teams.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primary} href="/contact?topic=Physical%20AI%20data">
              Book a demo
              <img src="/home/caret.svg" alt="" width={24} height={24} />
            </a>
            <a className={styles.secondary} href="#use-cases">
              Explore use cases
            </a>
          </div>
        </div>
      </section>


      <section className={styles.features} aria-labelledby="features-heading">
        <Eyebrow>Key features</Eyebrow>
        <h2 id="features-heading">
          How CNTXT builds the data engine <span>for embodied AI.</span>
        </h2>
        <FeatureTabs
          label="layers"
          items={[
            {
              title: "Capture layer",
              body: "Real work recorded hands-free on a phone head strap, a head camera or Roboband wrist cameras, with every worker's consent.",
              icon: <LayerGlyph tone="green" />,
              visual: <EgoGrid clips={clips} />,
            },
            {
              title: "Annotation layer",
              body: "Accepted clips are broken into the actions a robot has to learn, with hands and objects marked up. LiDAR, bounding boxes and segmentation masks too.",
              icon: <LayerGlyph tone="violet" />,
              visual: <AnnotationMock />,
            },
            {
              title: "Evaluation layer",
              body: "A person reviews every recorded hour before it is accepted, and labelling is checked with a human in the loop at 98% accuracy.",
              icon: <LayerGlyph tone="ink" />,
              visual: <HeatGrid title="Review coverage by task and environment (illustrative)" />,
            },
          ]}
        />
        <dl className={styles.stats}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>{stat.note}</dd>
              <dd className={styles.statValue}>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.split} aria-labelledby="environments-heading">
        <div className={styles.splitCopy}>
          <Eyebrow>Environments</Eyebrow>
          <h2 id="environments-heading">Robots learn from the places people actually work.</h2>
          <p>
            Lab demonstrations cover a few tidy tasks. Real floors are cluttered, busy and
            different every day, and that is the data robots are missing.
          </p>
          <ul className={styles.places}>
            {environments.map((item) => (
              <li key={item.place}>
                <strong>{item.place}</strong>
                <span>{item.roles}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.splitArt}>
          <IsoFloor />
        </div>
      </section>

      <section className={styles.kit} aria-labelledby="kit-heading">
        <Eyebrow>Capture kit</Eyebrow>
        <h2 id="kit-heading">Recorded from the worker&apos;s point of view.</h2>
        <p className={styles.dek}>Three ways to record a shift without getting in its way.</p>
        <ul>
          {kit.map((item) => (
            <li key={item.title}>
              <KitArt kind={item.kind} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.klkt} aria-labelledby="klkt-heading">
        <div className={styles.klktPhone}>
          <img src="/art/klkt-phone.webp" alt="The KLKT app on a phone: record from your point of view with your phone and connected cameras" />
        </div>
        <div className={styles.klktCopy}>
          <Eyebrow>Captured with KLKT</Eyebrow>
          <h2 id="klkt-heading">A capture network in people&apos;s pockets.</h2>
          <p>
            KLKT is our mobile app. People record their everyday work hands-free and are paid in US
            dollars for every accepted hour, with no fees to join, work or cash out.
          </p>
          <ul className={styles.klktFacts}>
            <li>
              <strong>Paid per accepted hour</strong>
              <span>In US dollars, reviewed by a person first</span>
            </li>
            <li>
              <strong>Consent in 4 languages</strong>
              <span>Arabic, English, Filipino and Urdu</span>
            </li>
            <li>
              <strong>Recent phones</strong>
              <span>iPhone 11, Pixel 6, Galaxy S21 or newer</span>
            </li>
          </ul>
          <a className={styles.klktLink} href="https://klkt.app">
            Explore KLKT <span aria-hidden="true">→</span>
          </a>
        </div>
        <figure className={styles.klktConsole}>
          <img src="/art/klkt-console.webp" alt="The KLKT console: projects, tasks and recordings queued for processing" />
          <figcaption>Every recording lands in one console: projects, tasks and jobs, ready for review and processing.</figcaption>
        </figure>
      </section>

      <FactoryWalkthrough />

      <section className={styles.caseStrip} aria-labelledby="case-heading">
        <p>Published case · Service robotics</p>
        <h2 id="case-heading">
          <strong>1.8 million</strong> precisely annotated frames in six months, for a leading GCC
          robotics lab training vision models for humanoid robots in restaurant and kitchen work.
        </h2>
      </section>

      <section className={styles.useCases} id="use-cases" aria-labelledby="use-cases-heading">
        <Eyebrow>Use cases</Eyebrow>
        <h2 id="use-cases-heading">Data for robots that work where people work.</h2>
        <ul>
          {useCases.map((item) => (
            <li key={item.title}>
              <a href={item.href}>
                <img src={item.image} alt="" />
                <strong>
                  {item.title} <span aria-hidden="true">→</span>
                </strong>
                <span>{item.body}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.reasons} aria-labelledby="reasons-heading">
        <h2 id="reasons-heading">Why teams work with CNTXT.</h2>
        <ul>
          {reasons.map((item) => (
            <li key={item.title}>
              <IconChip name={item.icon} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <Faq items={faqs.physicalAi} topic="Physical AI data" />

      <section className={styles.band} aria-labelledby="physical-cta">
        <h2 id="physical-cta">Have a problem that needs real AI, not demos?</h2>
        <p>Tell us what your robot needs to learn. We will scope the environments, tasks and labels with you.</p>
        <div className={styles.bandActions}>
          <a className={styles.primary} href="/contact?topic=Physical%20AI%20data">
            Book a demo
            <img src="/home/caret.svg" alt="" width={24} height={24} />
          </a>
          <a className={styles.outline} href="/contact?topic=Physical%20AI%20data&about=Expert%20session">
            Speak to an expert
          </a>
        </div>
      </section>

      <SiteClose hideBand />
    </main>
  );
}
