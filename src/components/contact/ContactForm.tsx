"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import styles from "./contact.module.css";

const helpOptions = [
  "Data services",
  "Physical AI data",
  "Arabic voice AI (Munsit)",
  "AI evaluation",
  "Custom AI solutions",
  "Partnerships",
  "Security",
  "Other",
];

const empty = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  help: "",
  message: "",
};

export function ContactForm() {
  // Links such as /contact?topic=AI%20evaluation&about=Model%20audit arrive with
  // the topic chosen and the first line of the message written.
  const params = useSearchParams();
  const [values, setValues] = useState(() => {
    const topic = params.get("topic") ?? "";
    const about = params.get("about") ?? "";
    return {
      ...empty,
      help: helpOptions.includes(topic) ? topic : "",
      message: about ? `I would like to ask about: ${about}.` : "",
    };
  });
  const [submittedEmail, setSubmittedEmail] = useState("");


  function update(field: keyof typeof empty, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    // No form backend yet: hand the message to the visitor's own email app.
    const body = Object.entries(values)
      .filter(([, value]) => value)
      .map(([field, value]) => `${field}: ${value}`)
      .join("\n");
    window.location.href = `mailto:sales@cntxt.tech?subject=${encodeURIComponent("Enquiry from the CNTXT website")}&body=${encodeURIComponent(body)}`;
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
    <form className={styles.formCard} onSubmit={onSubmit} noValidate={false}>
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
              name="lastName"
              autoComplete="family-name"
              placeholder="Last name *"
              aria-label="Last name"
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
            placeholder="Work email *"
            aria-label="Work email"
            required
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
          />
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
          <label className={styles.selectField}>
            <select
              name="help"
              required
              value={values.help}
              aria-label="What can we help with?"
              onChange={(event) => update("help", event.target.value)}
            >
              <option value="" disabled>
                What can we help with? *
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
            placeholder="Tell us what you need"
            aria-label="Tell us what you need"
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
            <a href="https://www.cntxt.tech/privacy-policy">CNTXT Privacy Policy</a>.
          </p>
        </div>
      </div>
    </form>
  );
}

