"use client";

import { FormEvent, useState } from "react";
import styles from "./contact.module.css";

const helpOptions = ["Sales", "Partnerships", "Data needs", "Security", "Other"];

const empty = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  help: "",
  message: "",
};

export function ContactForm() {
  const [values, setValues] = useState(empty);
  const [submittedEmail, setSubmittedEmail] = useState("");

  function update(field: keyof typeof empty, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setSubmittedEmail(values.email);
  }

  if (submittedEmail) {
    return (
      <div className={styles.formCard} role="status">
        <div className={styles.success}>
          <h2>Thanks. We’ll be in touch.</h2>
          <p>We received your note and will reply at {submittedEmail}.</p>
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
    <form className={styles.formCard} onSubmit={onSubmit} noValidate={false}>
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
              name="lastName"
              autoComplete="family-name"
              placeholder="Last Name *"
              aria-label="Last Name"
              required
              value={values.lastName}
              onChange={(event) => update("lastName", event.target.value)}
            />
          </div>
          <input
            className={styles.field}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Business Email *"
            aria-label="Business Email"
            required
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
          />
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
          <label className={styles.selectField}>
            <select
              name="help"
              required
              value={values.help}
              aria-label="What can we help with?"
              onChange={(event) => update("help", event.target.value)}
            >
              <option value="" disabled>
                What can we help with?*
              </option>
              {helpOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <img src="/contact/caret.svg" alt="" />
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
            <img src="/contact/arrow.svg" alt="" />
          </button>
          <p className={styles.legalNote}>
            By continuing, you accept that your data will be processed in
            accordance with{" "}
            <a href="#privacy-policy">CNTXT Privacy Policy</a>.
          </p>
        </div>
      </div>
    </form>
  );
}

