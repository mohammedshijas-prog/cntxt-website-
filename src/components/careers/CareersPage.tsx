"use client";

import { useMemo, useState } from "react";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import styles from "./careers.module.css";
import { faqs } from "../shared/faqs";
import { Faq } from "../shared/Faq";

const applyHref = "https://www.cntxt.tech/career";

const culture = [
  {
    src: "/careers/culture-1.webp",
    title: "Culture is delivery.",
    body: "We judge our work by what reaches the people who use it: data that has been checked, models that have been tested, systems that run.",
  },
  {
    src: "/careers/culture-2.webp",
    title: "Built for real problems.",
    body: "The work starts from real workplaces and real organisations. We capture data from the job as it is done and build on that.",
  },
  {
    src: "/careers/culture-3.webp",
    title: "Work hard. Play bold.",
    body: "We take the work seriously and each other less so. Say what you think, try the bold option, and own the result.",
  },
  {
    src: "/careers/culture-4.webp",
    title: "Room to grow.",
    body: "Mentorship, hands-on projects and professional certifications are part of the job, whether you work remotely or on site.",
  },
];

const photos = [
  { src: "/about/team.webp", width: 161, height: 163 },
  { src: "/security/practice-a.png", width: 308, height: 311 },
  { src: "/industries/hospitality.jpg", width: 308, height: 311 },
  { src: "/industries/government.jpg", width: 161, height: 163 },
];

const remote = { location: "Remote", terms: "Hourly contract" };

const roles = [
  { id: "eval-biology", title: "AI evaluator, Biology", department: "AI evaluation", ...remote },
  { id: "eval-medical", title: "AI evaluator, Medical", department: "AI evaluation", ...remote },
  { id: "eval-financial", title: "AI evaluator, Financial", department: "AI evaluation", ...remote },
  { id: "coding-cpp", title: "Coding expert, C++", department: "Coding", ...remote },
  { id: "coding-python", title: "Coding expert, Python", department: "Coding", ...remote },
  {
    id: "annotator-es-en",
    title: "Bilingual annotator, Spanish/English",
    department: "Data annotation",
    ...remote,
  },
  {
    id: "annotator-de-en",
    title: "Bilingual annotator, German/English",
    department: "Data annotation",
    ...remote,
  },
  {
    id: "robotics-data",
    title: "Robotics data collector",
    department: "Robotics data collection",
    location: "Multiple countries",
    terms: "Details on the application page",
  },
];

const benefits = [
  {
    number: "01",
    title: "Mentorship",
    body: "You work alongside people who have done the job before and who make time to show you how.",
  },
  {
    number: "02",
    title: "Hands-on projects",
    body: "You work on live projects from the start: data collection, annotation, model evaluation and custom AI builds.",
  },
  {
    number: "03",
    title: "Professional certifications",
    body: "We support professional certifications that are relevant to your role.",
  },
  {
    number: "04",
    title: "Remote and on-site options",
    body: "Some roles are fully remote and some are on site. Each listing says which.",
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

function Filter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.filter}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {value === "all" ? label : value}
        <img
          src="/careers/chevron.svg"
          alt=""
          width={16}
          height={16}
          data-open={open || undefined}
        />
      </button>
      {open ? (
        <ul>
          <li>
            <button
              type="button"
              onClick={() => {
                onChange("all");
                setOpen(false);
              }}
            >
              All
            </button>
          </li>
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function CareersPage() {
  const [location, setLocation] = useState("all");
  const [department, setDepartment] = useState("all");
  const [openBenefit, setOpenBenefit] = useState(0);

  const locations = useMemo(
    () => [...new Set(roles.map((role) => role.location))],
    [],
  );
  const departments = useMemo(
    () => [...new Set(roles.map((role) => role.department))],
    [],
  );
  const visible = roles.filter(
    (role) =>
      (location === "all" || role.location === location) &&
      (department === "all" || role.department === department),
  );

  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero} aria-labelledby="careers-heading">
        <Eyebrow>Our team</Eyebrow>
        <h1 id="careers-heading">
          Build AI on real data, with people
          <br />
          who <span>do the real work.</span>
        </h1>
        <p>
          CNTXT captures and verifies data from real work, trains models on it and deploys
          AI on-premise. We are hiring evaluators, coding experts, annotators and data collectors.
        </p>
        <div className={styles.photos}>
          <img src={photos[0].src} alt="" width={photos[0].width} height={photos[0].height} />
          <img src={photos[1].src} alt="" width={photos[1].width} height={photos[1].height} />
          <div className={styles.centerPhoto}>
            <img src="/about/texture.webp" alt="" />
            <img src="/careers/hero-3b.webp" alt="CNTXT team working together" />
          </div>
          <img src={photos[2].src} alt="" width={photos[2].width} height={photos[2].height} />
          <img src={photos[3].src} alt="" width={photos[3].width} height={photos[3].height} />
        </div>
      </section>

      <section className={styles.culture} aria-labelledby="culture-heading">
        <Eyebrow>Culture</Eyebrow>
        <h2 id="culture-heading">
          How we <span>work</span>
        </h2>
        <ul>
          {culture.map((item) => (
            <li key={item.src}>
              <img src={item.src} alt="" />
              <p>
                <strong>{item.title}</strong> {item.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.openings} id="openings" aria-labelledby="openings-heading">
        <h2 id="openings-heading">
          Open positions at <span>CNTXT</span>
        </h2>
        <div className={styles.board}>
          <div className={styles.filters}>
            <Filter label="Location" value={location} options={locations} onChange={setLocation} />
            <Filter
              label="Department"
              value={department}
              options={departments}
              onChange={setDepartment}
            />
          </div>
          <ul className={styles.roles}>
            {visible.length === 0 ? (
              <li className={styles.empty}>No open roles match these filters.</li>
            ) : (
              visible.map((role) => (
                <li key={role.id}>
                  <div>
                    <h3>{role.title}</h3>
                    <p>
                      {role.location} · {role.terms}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Apply for ${role.title} on cntxt.tech (opens in a new tab)`}
                    onClick={() => window.open(applyHref, "_blank", "noopener,noreferrer")}
                  >
                    Apply for role
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <section className={styles.benefits} aria-labelledby="benefits-heading">
        <Eyebrow>Benefits</Eyebrow>
        <h2 id="benefits-heading">
          What you can expect{" "}
          <span>when you work with us.</span>
        </h2>
        <div className={styles.benefitGrid}>
          <div>
            {benefits.map((item, index) => {
              const open = openBenefit === index;
              return (
                <div key={item.number} className={styles.benefitItem} data-open={open || undefined}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenBenefit(open ? -1 : index)}
                  >
                    <span>{item.number}</span>
                    {item.title}
                  </button>
                  {open && item.body ? <p>{item.body}</p> : null}
                </div>
              );
            })}
          </div>
          <div className={styles.benefitPhoto}>
            <img src="/partners/hero.webp" alt="" />
            <span>{benefits[Math.max(openBenefit, 0)].number}</span>
          </div>
        </div>
      </section>

      <Faq items={faqs.careers} title="Questions candidates ask" />

      <SiteClose current="Careers" packHref="/security#procurement" />
    </main>
  );
}
