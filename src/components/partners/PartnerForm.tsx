"use client";

import { FormEvent, useState } from "react";
import styles from "./partner.module.css";

const partnershipTypes = [
  "Technology & cloud",
  "Commercial & delivery",
  "Data",
  "Research",
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
    // No form backend yet: hand the message to the visitor's own email app.
    const body = Object.entries(values)
      .filter(([, value]) => value)
      .map(([field, value]) => `${field}: ${value}`)
      .join("\n");
    window.location.href = `mailto:sales@cntxt.tech?subject=${encodeURIComponent("Partnership enquiry from the CNTXT website")}&body=${encodeURIComponent(body)}`;
    setSubmittedEmail(values.email);
  }

  if (submittedEmail) {
    return (
      <div className={styles.formCard} role="status">
        <div className={styles.success}>
          <h2>One more step.</h2>
          <p>
            Your email app should have opened with your message addressed to sales@cntxt.tech.
            Send it from there and we will reply at {submittedEmail}.
          </p>
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
              placeholder="First name *"
              aria-label="First name"
              required
              value={values.firstName}
              onChange={(event) => update("firstName", event.target.value)}
            />
            <input
              className={styles.field}
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Work email *"
              aria-label="Work email"
              required
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
            />
          </div>
          <input
            className={styles.field}
            name="company"
            autoComplete="organization"
            placeholder="Company name *"
            aria-label="Company name"
            required
            value={values.company}
            onChange={(event) => update("company", event.target.value)}
          />
          <input
            className={styles.field}
            name="website"
            autoComplete="url"
            inputMode="url"
            placeholder="Company website *"
            aria-label="Company website"
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
                Partnership type *
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
            placeholder="Tell us about the partnership you have in mind"
            aria-label="Tell us about the partnership you have in mind"
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
            accordance with <a href="https://www.cntxt.tech/privacy-policy">CNTXT Privacy Policy</a>.
          </p>
        </div>
      </div>
    </form>
  );
}
