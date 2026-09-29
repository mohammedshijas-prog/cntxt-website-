import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact | CNTXT AI",
  description: "Tell us about your project, data needs or partnership idea.",
};

export default function Contact() {
  return (
    <div>
      <ContactPage />
    </div>
  );
}
