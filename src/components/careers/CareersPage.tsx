"use client";

import { useMemo, useState } from "react";
import { SiteClose } from "../site/SiteClose";
import { PageHero } from "../shared/PageHero";
import { CtaBand } from "../shared/CtaBand";
import { SiteNav } from "../site/SiteNav";
import { nearView } from "../three/nearView";
import { CareerDots } from "./CareerDots";
import { PhysicalAccordion, type Segment } from "../home/PhysicalAccordion";
import styles from "./careers.module.css";
import { faqs } from "../shared/faqs";
import { Faq } from "../shared/Faq";


/* How we work, as the site's tall line-art cards (the "Built for physical AI" pattern). */
const culture: Segment[] = [
  {
    name: "Culture is delivery",
    body: "We judge work by what reaches the people who use it.",
    art: "/art/lines/culture-1.webp",
    href: "/about",
    cta: "About CNTXT",
    tone: "lilac",
  },
  {
    name: "Built for real problems",
    body: "We start from real workplaces, not lab demos.",
    art: "/art/lines/culture-2.webp",
    href: "/solutions",
    cta: "See what we build",
    tone: "mist",
  },
  {
    name: "Work hard. Play bold.",
    body: "Say what you think, try the bold option, own the result.",
    art: "/art/lines/culture-3.webp",
    href: "#openings",
    cta: "See open roles",
    tone: "violet",
  },
  {
    name: "Room to grow",
    body: "Mentorship, real projects and certifications, remote or on site.",
    art: "/art/lines/culture-4.webp",
    href: "#benefits-heading",
    cta: "See the benefits",
    tone: "pearl",
  },
];



const BenefitScene = nearView(() => import("../three/BenefitScene"));

/** A role as the careers board shows it; the list comes from the portal (Supabase). */
export type RoleCard = { slug: string; title: string; department: string; location: string; terms: string; summary?: string; featured?: boolean };

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

/** Group "Abu Dhabi, UAE" and "Dubai, UAE" under "UAE", and so on, for the location filter. */
function placesOf(location: string) {
  if (/remote/i.test(location)) return ["Remote"];
  if (/multiple countries/i.test(location)) return ["Multiple countries"];
  return location
    .split("·")
    .map((part) => part.split(",").pop()?.trim() ?? "")
    .map((place) => (/^(CA|NY|TX|United States)$/.test(place) ? "United States" : place))
    .filter(Boolean);
}

const FIRST_PAGE = 12;

export function CareersPage({ roles }: { roles: RoleCard[] }) {
  const [location, setLocation] = useState("all");
  const [department, setDepartment] = useState("all");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [openBenefit, setOpenBenefit] = useState(0);

  const locations = useMemo(() => [...new Set(roles.flatMap((role) => placesOf(role.location)))].sort(), [roles]);
  const departments = useMemo(() => [...new Set(roles.map((role) => role.department).filter(Boolean))].sort(), [roles]);
  const visible = roles.filter(
    (role) =>
      (location === "all" || placesOf(role.location).includes(location)) &&
      (department === "all" || role.department === department) &&
      `${role.title} ${role.department} ${role.location}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const filtering = location !== "all" || department !== "all" || query.trim() !== "";
  const shown = filtering || showAll ? visible : visible.slice(0, FIRST_PAGE);
  const featured = roles.filter((role) => role.featured).slice(0, 6);

  return (
    <main className={styles.page}>
      <SiteNav />

      <PageHero
        id="careers-heading"
        kicker="Careers"
        title={["Build AI on real data,", "with people who do the real work."]}
        lead="CNTXT captures and verifies data from real work, trains models on it and deploys AI on-premise. We are hiring across engineering, product, marketing, AI evaluation, annotation and data collection."
        actions={[
          { label: "See open roles", href: "#openings", primary: true },
          { label: "How we work", href: "#culture-heading" },
        ]}
        art={
          <div className={styles.heroDots} role="img" aria-label="A team of people, a rising staircase and a briefcase, drawn in purple dots">
            <CareerDots className={styles.heroField} />
          </div>
        }
      />

      <div className={styles.cultureCards}>
        <PhysicalAccordion
          items={culture}
          headingId="culture-heading"
          title="How we work"
          body="What working at CNTXT is like."
          button={false}
        />
      </div>

      <section className={styles.openings} id="openings" aria-labelledby="openings-heading">
        <h2 id="openings-heading">
          Open positions at <span>CNTXT</span>
        </h2>
        {featured.length > 0 && !filtering ? (
          <div className={styles.featured} aria-labelledby="featured-heading">
            <h3 id="featured-heading" className={styles.featuredHeading}>
              Featured positions
            </h3>
            <ul className={styles.featuredGrid}>
              {featured.map((role) => (
                <li key={role.slug}>
                  <a href={`/careers/${role.slug}`} className={styles.featuredCard}>
                    <span className={styles.featuredTag}>{role.department || "CNTXT"}</span>
                    <strong>{role.title}</strong>
                    {role.summary ? <span className={styles.featuredSummary}>{role.summary}</span> : null}
                    <span className={styles.featuredMeta}>
                      {[role.location, role.terms].filter(Boolean).join(" · ")}
                      <span aria-hidden="true" className={styles.featuredArrow}>
                        →
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className={styles.featuredAll}>All open roles</p>
          </div>
        ) : null}
        <div className={styles.board}>
          <div className={styles.filters}>
            <label className={styles.search}>
              <span className={styles.srOnly}>Search roles</span>
              <input type="search" placeholder="Search roles" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <Filter label="Location" value={location} options={locations} onChange={setLocation} />
            <Filter
              label="Department"
              value={department}
              options={departments}
              onChange={setDepartment}
            />
          </div>
          <ul className={styles.roles}>
            <li className={styles.count} aria-live="polite">
              {visible.length} open {visible.length === 1 ? "role" : "roles"}
              {filtering ? " match" : ""}
            </li>
            {visible.length === 0 ? (
              <li className={styles.empty}>{roles.length ? "No open roles match these filters." : "No open roles right now. Check back soon."}</li>
            ) : (
              shown.map((role) => (
                <li key={role.slug}>
                  <div>
                    <h3>{role.title}</h3>
                    <p>
                      {[role.department, role.location, role.terms].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <a className={styles.apply} href={`/careers/${role.slug}`} aria-label={`Apply for ${role.title}`}>
                    Apply for role
                  </a>
                </li>
              ))
            )}
            {shown.length < visible.length ? (
              <li className={styles.more}>
                <button type="button" onClick={() => setShowAll(true)}>
                  Show all {visible.length} roles
                </button>
              </li>
            ) : null}
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
            {/* One small 3D world; the camera moves to the open benefit's corner. */}
            <BenefitScene className={styles.benefitScene} active={Math.max(openBenefit, 0)} />
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
