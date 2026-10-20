"use client";

import { useMemo, useState } from "react";
import { SiteClose } from "../site/SiteClose";
import { PageHero } from "../shared/PageHero";
import { CtaBand } from "../shared/CtaBand";
import { SiteNav } from "../site/SiteNav";
import styles from "./careers.module.css";
import { faqs } from "../shared/faqs";
import { Faq } from "../shared/Faq";


const culture = [
  {
    src: "/careers/culture-1.webp",
    title: "Culture is delivery.",
    body: "We judge work by what reaches the people who use it.",
  },
  {
    src: "/careers/culture-2.webp",
    title: "Built for real problems.",
    body: "We start from real workplaces, not lab demos.",
  },
  {
    src: "/careers/culture-3.webp",
    title: "Work hard. Play bold.",
    body: "Say what you think, try the bold option, own the result.",
  },
  {
    src: "/careers/culture-4.webp",
    title: "Room to grow.",
    body: "Mentorship, real projects and certifications, remote or on site.",
  },
];



/** A role as the careers board shows it; the list comes from the portal (Supabase). */
export type RoleCard = { slug: string; title: string; department: string; location: string; terms: string };

const benefits = [
  {
    number: "01",
    title: "Mentorship",
    image: "/about/team.webp",
    body: "You work alongside people who have done the job before and who make time to show you how.",
  },
  {
    number: "02",
    title: "Hands-on projects",
    image: "/brand/product/label-video.webp",
    body: "You work on live projects from the start: data collection, annotation, model evaluation and custom AI builds.",
  },
  {
    number: "03",
    title: "Professional certifications",
    image: "/security/practice-a.webp",
    body: "We support professional certifications that are relevant to your role.",
  },
  {
    number: "04",
    title: "Remote and on-site options",
    image: "/industries/government.jpg",
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

export function CareersPage({ roles }: { roles: RoleCard[] }) {
  const [location, setLocation] = useState("all");
  const [department, setDepartment] = useState("all");
  const [openBenefit, setOpenBenefit] = useState(0);

  const locations = useMemo(
    () => [...new Set(roles.map((role) => role.location))],
    [roles],
  );
  const departments = useMemo(
    () => [...new Set(roles.map((role) => role.department))],
    [roles],
  );
  const visible = roles.filter(
    (role) =>
      (location === "all" || role.location === location) &&
      (department === "all" || role.department === department),
  );

  return (
    <main className={styles.page}>
      <SiteNav />

      <PageHero
        id="careers-heading"
        kicker="Careers"
        title={["Build AI on real data,", "with people who do the real work."]}
        lead="CNTXT captures and verifies data from real work, trains models on it and deploys AI on-premise. We are hiring evaluators, coding experts, annotators and data collectors."
        actions={[
          { label: "See open roles", href: "#openings", primary: true },
          { label: "How we work", href: "#culture-heading" },
        ]}
        art={
          <img
            className={styles.heroWall}
            src="/careers/culture-wall.webp"
            alt="Two CNTXT colleagues talking in front of the “Culture is Delivery” wall"
          />
        }
      />

      <section className={styles.culture} aria-labelledby="culture-heading">
        <Eyebrow>Culture</Eyebrow>
        <h2 id="culture-heading">
          How we <span>work</span>
        </h2>
        <ul data-rail>
          {culture.map((item) => (
            <li key={item.src} data-tilt>
              <img loading="lazy" decoding="async" src={item.src} alt="" />
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
              <li className={styles.empty}>{roles.length ? "No open roles match these filters." : "No open roles right now. Check back soon."}</li>
            ) : (
              visible.map((role) => (
                <li key={role.slug}>
                  <div>
                    <h3>{role.title}</h3>
                    <p>
                      {role.location} · {role.terms}
                    </p>
                  </div>
                  <a className={styles.apply} href={`/careers/${role.slug}`} aria-label={`Apply for ${role.title}`}>
                    Apply for role
                  </a>
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
            {/* Each benefit has its own photo; it swaps with the open item. */}
            <img
              key={benefits[Math.max(openBenefit, 0)].image}
              loading="lazy"
              decoding="async"
              src={benefits[Math.max(openBenefit, 0)].image}
              alt=""
            />
            <span>{benefits[Math.max(openBenefit, 0)].number}</span>
          </div>
        </div>
      </section>

      <Faq items={faqs.careers} title="Questions candidates ask" />

      <CtaBand
        id="careers-cta"
        title="Do the real work with us."
        body="Evaluators, coding experts, annotators and data collectors, remote and on-site."
        primary={{ label: "See open roles", href: "#openings" }}
      />

      <SiteClose current="Careers" hideBand />
    </main>
  );
}
