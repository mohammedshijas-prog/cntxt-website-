"use client";

import { useMemo, useState } from "react";
import { SiteClose } from "../site/SiteClose";
import { SiteNav } from "../site/SiteNav";
import styles from "./careers.module.css";

const culture =
  "It holds what the organisation actually knows, not only the part that was once typed into a structured field. Documents, correspondence, calls, records, decisions, and the reasoning behind those decisions.";

const photos = [
  { src: "/careers/hero-1.jpg", width: 161, height: 163 },
  { src: "/careers/hero-2.jpg", width: 308, height: 311 },
  { src: "/careers/hero-4.jpg", width: 308, height: 311 },
  { src: "/careers/hero-5.jpg", width: 161, height: 163 },
];

const roles = Array.from({ length: 10 }, (_, index) => ({
  id: `role-${index + 1}`,
  title: "Account Executive, Commercial Install Base",
  location: "Hybrid - Austin, New York City, San Francisco",
  department: "Commercial",
}));

const benefits = [
  {
    number: "01",
    title: "Health & wellbeing",
    body: "Full medical, dental and vision cover for you and your family, plus a monthly wellbeing allowance for the gym, therapy or whatever keeps you well.",
  },
  {
    number: "02",
    title: "Flexible, hybrid work",
    body: "Work from our offices or from home, on hours that fit your life. Teams agree on a few shared days each week and plan the rest themselves.",
  },
  {
    number: "03",
    title: "Learning budget",
    body: "An annual budget for courses, conferences and books, and dedicated time each quarter to learn something new and share it with the team.",
  },
  {
    number: "04",
    title: "Equity & time off",
    body: "Everyone owns a share of what we build. Take generous paid leave, public holidays and a full week off between the new year holidays.",
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
  const [applied, setApplied] = useState<string | null>(null);
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
          Build AI that matters, with people
          <br />
          who’ve <span>seen the real world.</span>
        </h1>
        <p>
          Dive into CNTXT’s full library of case studies, whitepapers, videos, and insights
          — organized for clarity, built to help you solve real challenges faster.
        </p>
        <div className={styles.photos}>
          <img src={photos[0].src} alt="" width={photos[0].width} height={photos[0].height} />
          <img src={photos[1].src} alt="" width={photos[1].width} height={photos[1].height} />
          <div className={styles.centerPhoto}>
            <img src="/careers/hero-3a.jpg" alt="" />
            <img src="/careers/hero-3b.png" alt="CNTXT team working together" />
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
          {["/careers/culture-1.png", "/careers/culture-2.png", "/careers/culture-3.png", "/careers/culture-4.png"].map(
            (src) => (
              <li key={src}>
                <img src={src} alt="" />
                <p>
                  <strong>Complete</strong> {culture}
                </p>
              </li>
            ),
          )}
        </ul>
      </section>

      <section className={styles.openings} id="openings" aria-labelledby="openings-heading">
        <h2 id="openings-heading">
          Open Positions at <span>CNTXT</span>
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
                    <p>{role.location}</p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={applied === role.id}
                    onClick={() => setApplied(role.id)}
                  >
                    {applied === role.id ? "Applied" : "Apply for role"}
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
          Three things have to be in place before a question{" "}
          <span>can be answered properly.</span>
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
            <img src="/careers/benefit.jpg" alt="" />
            <span>{benefits[Math.max(openBenefit, 0)].number}</span>
          </div>
        </div>
      </section>

      <SiteClose current="Careers" packHref="/security#procurement" />
    </main>
  );
}
