import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: "/contact" },
  description: "Talk to CNTXT AI about data services, physical AI data, Arabic voice AI, AI evaluation or custom AI solutions.",
};

export default function Contact() {
  return (
    <div>
      <ContactPage />
    </div>
  );
}
