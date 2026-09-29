"use client";

import { FormEvent, useState } from "react";
import styles from "./partner.module.css";

const partnershipTypes = [
  "Technology & cloud",
  "Solution / integration",
  "Data & annotation",
  "Research & academic",
];

const empty = {
  firstName: "",
  email: "",
  company: "",
  website: "",
  type: "",
  message: "",
};

export function PartnerForm() {
  const [values, setValues] = useState(empty);
  const [submittedEmail, setSubmittedEmail] = useState("");

  function update(field: keyof typeof empty, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const website = form.elements.namedItem("website");
    if (website instanceof HTMLInputElement) {
      const trimmed = website.value.trim();
      const withProtocol = /^https?:\/\//i.test(trimmed)
        ? trimmed
        : `https://${trimmed}`;
      try {
        const url = new URL(withProtocol);
        website.setCustomValidity(url.hostname.includes(".") ? "" : "Enter a company website.");
      } catch {
        website.setCustomValidity("Enter a company website.");
      }
    }
    if (!form.reportValidity()) return;
    setSubmittedEmail(values.email);
  }

  if (submittedEmail) {
    return (
      <div className={styles.formCard} role="status">
        <div className={styles.success}>
          <h2>Thanks. We’ll be in touch.</h2>
          <p>We received your partnership note and will reply at {submittedEmail}.</p>
          <button
            type="button"
            className={styles.again}
            onClick={() => {
              setSubmittedEmail("");
              setValues(empty);
            }}
          >
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.formCard} onSubmit={onSubmit}>
      <div className={styles.formBody}>
        <div className={styles.fields}>
          <div className={styles.nameRow}>
            <input
              className={styles.field}
              name="firstName"
              autoComplete="given-name"
              placeholder="First Name *"
              aria-label="First Name"
              required
              value={values.firstName}
              onChange={(event) => update("firstName", event.target.value)}
            />
            <input
              className={styles.field}
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Your Email *"
              aria-label="Your Email"
              required
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
            />
          </div>
          <input
            className={styles.field}
            name="company"
            autoComplete="organization"
            placeholder="Company Name *"
            aria-label="Company Name"
            required
            value={values.company}
            onChange={(event) => update("company", event.target.value)}
          />
          <input
            className={styles.field}
            name="website"
            autoComplete="url"
            inputMode="url"
            placeholder="Company Website *"
            aria-label="Company Website"
            required
            value={values.website}
            onChange={(event) => {
              event.currentTarget.setCustomValidity("");
              update("website", event.target.value);
            }}
          />
          <label className={styles.selectField}>
            <select
              name="type"
              required
              value={values.type}
              aria-label="Partnership type"
              onChange={(event) => update("type", event.target.value)}
            >
              <option value="" disabled>
                Partnership type?*
              </option>
              {partnershipTypes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <img src="/contact/caret.svg" alt="" width={22} height={22} />
          </label>
          <textarea
            className={styles.textarea}
            name="message"
            placeholder="Tell us about the opportunity"
            aria-label="Tell us about the opportunity"
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
          />
        </div>
        <div className={styles.submitBlock}>
          <button className={styles.submit} type="submit">
            Submit
            <img src="/contact/arrow.svg" alt="" width={16} height={16} />
          </button>
          <p className={styles.legalNote}>
            By continuing, you accept that your data will be processed in
            accordance with <a href="#privacy-policy">CNTXT Privacy Policy</a>.
          </p>
        </div>
      </div>
    </form>
  );
}
